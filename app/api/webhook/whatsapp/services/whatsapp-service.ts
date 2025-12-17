import { db } from "@/lib/db";
import { integration, message, botSetting } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrCreateContact } from "@/lib/contacts";
import { WhatsAppWebhookPayload, WhatsAppStatusUpdate } from "./types";
import { NextRequest, NextResponse } from "next/server";
import { AIModel } from "@/lib/ai/ai-model";

export class WhatsAppService {
  async verifyWebhook(searchParams: URLSearchParams): Promise<NextResponse> {
    const mode = searchParams.get("hub.mode");
    const verifyToken = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log(`[Webhook Verification] Mode: ${mode}, Token: ${verifyToken}`);

    if (mode === "subscribe") {
        let isValid = false;
        
        // 1. Check against global secret (fallback)
        const globalSecret = process.env.WHATSAPP_VERIFY_TOKEN;
        if (globalSecret && verifyToken === globalSecret) {
            console.log("[Webhook Verification] Verified using global secret / env var");
            isValid = true;
        }
        
        // 2. Check DB across all integrations
        if (!isValid) {
            const integrations = await db
                .select()
                .from(integration)
                .where(eq(integration.serviceId, "whatsapp"));
            
            console.log(`[Webhook Verification] Checking against ${integrations.length} WhatsApp integrations...`);
            
            for (const integ of integrations) {
                try {
                    const creds = typeof integ.credentials === 'string' 
                        ? JSON.parse(integ.credentials) 
                        : integ.credentials;
                    
                    if (creds?.verifyToken === verifyToken) {
                        console.log(`[Webhook Verification] ✅ Match found for user: ${integ.userId}`);
                        isValid = true;
                        break;
                    }
                } catch (e) {
                    console.error(`[Webhook Verification] ❌ Error parsing credentials for user ${integ.userId}`, e);
                    continue;
                }
            }
        }

      if (isValid && challenge) {
        console.log("[Webhook Verification] SUCCESS");
        return new NextResponse(challenge, { status: 200 });
      } else {
        console.log("[Webhook Verification] FAILED: No matching token found");
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    return new NextResponse("Bad Request", { status: 400 });
  }

  async processWebhook(req: NextRequest): Promise<NextResponse> {
    try {
        const body: WhatsAppWebhookPayload = await req.json();
        
        if (body.object !== "whatsapp_business_account") {
             return new NextResponse("Not Found", { status: 404 });
        }

        // Process simplified for better await handling
        // Iterate through entries and changes
        if (body.entry) {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    const value = change.value;

                    // Handle Messages
                    if (value.messages && value.messages.length > 0) {
                        await this.handleMessages(value);
                    }
                    
                    // Handle Status Updates
                    if (value.statuses && value.statuses.length > 0) {
                        await this.handleStatuses(value.statuses);
                    }
                }
            }
        }
        
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Webhook POST error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  private async handleMessages(value: WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']) {
       if (!value.metadata || !value.messages) return;

       const phoneNumberId = value.metadata.phone_number_id;
       const msg = value.messages[0]; 
       const from = msg.from;
       const msgType = msg.type;
       
       let msgBody = "";
       // Use Record<string, unknown> instead of any for metadata
       let metadata: Record<string, unknown> = {
           wa_id: msg.id,
           wa_type: msgType,
           timestamp: msg.timestamp
       };

       // Extract Content based on Type
       switch (msgType) {
           case 'text':
               msgBody = msg.text?.body || "";
               break;
           case 'image':
               msgBody = msg.image?.caption || "[Image]";
               metadata.media = msg.image;
               break;
           case 'video':
               msgBody = msg.video?.caption || "[Video]";
               metadata.media = msg.video;
               break;
           case 'audio':
               msgBody = "[Audio]";
               metadata.media = msg.audio;
               break;
           case 'document':
               msgBody = msg.document?.caption || msg.document?.filename || "[Document]";
               metadata.media = msg.document;
               break;
           case 'sticker':
               msgBody = "[Sticker]";
               metadata.media = msg.sticker;
               break;
           case 'location':
               msgBody = "[Location]";
               metadata.location = msg.location;
               break;
           case 'contacts':
               msgBody = "[Contact]";
               metadata.contacts = msg.contacts;
               break;
           case 'interactive':
               const interactive = msg.interactive;
               if (interactive?.type === 'button_reply') {
                   msgBody = interactive.button_reply?.title || "[Button Reply]";
                   metadata.interactive = interactive;
               } else if (interactive?.type === 'list_reply') {
                    msgBody = interactive.list_reply?.title || "[List Reply]";
                    metadata.interactive = interactive;
               } else {
                   msgBody = "[Interactive]";
                   metadata.interactive = interactive;
               }
               break;
           case 'reaction':
               msgBody = `[Reaction: ${msg.reaction?.emoji}]`;
               metadata.reaction = msg.reaction;
               break;
           default:
               msgBody = `[${msgType}]`;
               metadata.raw = msg;
       }

       // 1. Find Integration
       const targetIntegration = await this.findIntegrationByPhoneNumberId(phoneNumberId);
       
       if (!targetIntegration) {
           console.log(`No integration found for phone_number_id: ${phoneNumberId}`);
           return;
       }

       const userId = targetIntegration.userId;

       // 2. Find or Create Contact
       const profileName = value.contacts?.[0]?.profile?.name || from;
       const contactMetadata = {
           wa_profile_name: value.contacts?.[0]?.profile?.name,
           source: "whatsapp_webhook"
       };

       const contactRecord = await getOrCreateContact({
           userId,
           phone: from,
           name: profileName,
           metadata: contactMetadata
       });

       // 3. Save Message
       await db.insert(message).values({
           userId,
           contactId: contactRecord.id,
           direction: "inbound",
           content: msgBody,
           status: "delivered", 
           metadata: JSON.stringify(metadata),
           sentAt: new Date(parseInt(msg.timestamp) * 1000), 
       }); // Removed returning() as we don't strictly need the object back here

       console.log(`Message saved for user ${userId} from ${from} (Type: ${msgType})`);
       
       // 4. Trigger Bot
       await this.triggerBot(userId, contactRecord.id, msgBody);
  }

  private async handleStatuses(statuses: WhatsAppStatusUpdate[]) {
      const statusUpdate = statuses[0];
      if (!statusUpdate) return;
      
      const waMessageId = statusUpdate.id;
      const newStatus = statusUpdate.status;
      
      console.log(`Message Status Update: ID ${waMessageId} -> ${newStatus}`);
      
      // Update logic would go here
  }

  private async triggerBot(userId: string, contactId: string, userMessage: string) {
      try {
          // Check if bot is active for this user
          const settings = await db.query.botSetting.findFirst({
              where: eq(botSetting.userId, userId)
          });

          if (settings && !settings.isActive) {
              console.log(`[Bot] Bot is disabled for user ${userId}.`);
              return;
          }

          const systemPrompt = settings?.systemPrompt || "You are a helpful assistant for ReplyX. Respond concisely.";

          const apiKey = process.env.OPENROUTER_API_KEY;
          
          if (!apiKey) {
              console.log("[Bot] No OPENROUTER_API_KEY set, skipping bot response.");
              return;
          }

          const ai = new AIModel({
              apiKey: apiKey,
              provider: 'openrouter',
              model: 'z-ai/glm-4.5-air:free',
              debug: true
          });

          ai.setSystemPrompt(systemPrompt);

          console.log(`[Bot] Sending message to AI: ${userMessage.substring(0, 50)}...`);
          const response = await ai.addUserMessage(userMessage).send();
          
          const aiReply = response.content;
          console.log(`[Bot] Generated response: ${aiReply.substring(0, 50)}...`);

          // Save AI response
          const metadata = {
              generated_by: 'ai_bot',
              model: response.model,
              usage: response.usage
          };

          await db.insert(message).values({
              userId,
              contactId,
              direction: "outbound",
              content: aiReply,
              status: "sent",
              metadata: JSON.stringify(metadata),
              sentAt: new Date(),
          });
          
      } catch (error) {
          console.error("[Bot] Error generating AI response:", error);
      }
  }

  private async findIntegrationByPhoneNumberId(phoneNumberId: string) {
        // Optimized to select only credentials field first if possible, but Drizzle select() gets all by default unless specified.
        // We still have to check all because we don't index phone_number_id in DB yet.
        const integrations = await db
            .select()
            .from(integration)
            .where(and(eq(integration.serviceId, "whatsapp"), eq(integration.status, "connected")));
        
        for (const integ of integrations) {
            try {
                // Check if credentials is a string or object (Drizzle sometimes parses JSON automatically if configured, but here it seems manual)
                const creds = typeof integ.credentials === 'string' 
                    ? JSON.parse(integ.credentials) 
                    : integ.credentials;
                
                // Strict check
                if (creds && typeof creds === 'object' && 'phoneNumberId' in creds && creds.phoneNumberId === phoneNumberId) {
                    return integ;
                }
            } catch (e) {
                continue;
            }
        }
        return null;
  }
}
