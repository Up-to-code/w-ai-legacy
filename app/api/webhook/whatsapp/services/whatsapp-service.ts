import { db } from "@/lib/db";
import { buildBotSystemPrompt } from "@/lib/ai/bot-utils";
import { integration, message, botSetting, campaign, contact, knowledgeSource } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { getOrCreateContact } from "@/lib/contacts";
import { WhatsAppWebhookPayload, WhatsAppStatusUpdate } from "./types";
import { NextRequest, NextResponse } from "next/server";
import { AIModel } from "@/lib/ai/ai-model";
import { sendMessage, markMessageAsRead } from "@/lib/whatsapp";

export class WhatsAppService {
  private static _instance: WhatsAppService;

  public static get instance(): WhatsAppService {
    if (!this._instance) {
      this._instance = new WhatsAppService();
    }
    return this._instance;
  }
  /**
   * Handle Webhook Verification (GET)
   * Supports both global and user-specific verification
   */
  public async verifyWebhook(req: NextRequest, userId?: string) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const verifyToken = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log(`[Webhook Verification] Mode: ${mode}, Token: ${verifyToken}, UserId Context: ${userId || 'None'}`);

    if (mode === "subscribe") {
        // 1. Check against platform-wide verify token
        const globalSecret = process.env.WHATSAPP_VERIFY_TOKEN;
        if (globalSecret && verifyToken === globalSecret) {
            console.log("[Webhook Verification] Verified using platform-wide secret");
            if (challenge) {
                return new NextResponse(challenge, { 
                    status: 200,
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
        }
        
        // 2. Prioritized check: If userId is in path, check their specific token first
        if (userId) {
            const [integ] = await db
                .select()
                .from(integration)
                .where(and(eq(integration.serviceId, "whatsapp"), eq(integration.userId, userId)))
                .limit(1);
            
            if (integ) {
                try {
                    const creds = typeof integ.credentials === 'string' 
                        ? JSON.parse(integ.credentials) 
                        : integ.credentials;
                    
                    if (creds?.verifyToken === verifyToken) {
                        console.log(`[Webhook Verification] ✅ Match found for specific user: ${userId}`);
                        if (challenge) {
                            return new NextResponse(challenge, { 
                                status: 200,
                                headers: { 'Content-Type': 'text/plain' }
                            });
                        }
                    }
                } catch (e) {}
            }
        }

        // 3. Fallback: Check DB for any user-specific tokens (Legacy/Global URL support)
        console.log(`[Webhook Verification] Falling back to global lookup...`);
        const integrations = await db
            .select()
            .from(integration)
            .where(eq(integration.serviceId, "whatsapp"));
        
        for (const integ of integrations) {
            try {
                const creds = typeof integ.credentials === 'string' 
                    ? JSON.parse(integ.credentials) 
                    : integ.credentials;
                
                if (creds?.verifyToken === verifyToken) {
                    console.log(`[Webhook Verification] ✅ Global match found for user: ${integ.userId}`);
                    if (challenge) {
                        return new NextResponse(challenge, { 
                            status: 200,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    }
                }
            } catch (e) {
                continue;
            }
        }

        console.log("[Webhook Verification] FAILED: No matching token found");
        return new NextResponse("Forbidden", { status: 403 });
    }

    return new NextResponse("Bad Request", { status: 400 });
  }

  /**
   * Handle Webhook Payload (POST)
   */
  public async handle(req: NextRequest, userId?: string) {
    try {
      const payload: WhatsAppWebhookPayload = await req.json();
      console.log(`[Webhook Payload] Handling event for userId context: ${userId || 'Any'}`);

      return await this.processPayload(payload, userId);
    } catch (error) {
      console.error("[WhatsApp Webhook Error]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  /**
   * Process the webhook payload entries and changes
   */
  private async processPayload(payload: WhatsAppWebhookPayload, userId?: string) {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          const value = change.value;
          const phoneNumberId = value.metadata.phone_number_id;

          const integ = await this.findIntegration(phoneNumberId, userId);
          if (!integ) {
            console.warn(`[Webhook] No active integration for ${phoneNumberId}${userId ? ` and user ${userId}` : ''}`);
            continue;
          }

          if (value.statuses) {
            await this.handleStatuses(value.statuses, integ);
          }

          if (value.messages) {
            // Handle multiple messages if present
            for (const msg of value.messages) {
               await this.handleMessageEvent(msg, value, integ);
            }
          }
        }
      }

      return NextResponse.json({ success: true });
  }

  private async findIntegration(phoneNumberId: string, userId?: string) {
        try {
            // 1. If we have a userId, look them up directly first (Fastest O(1))
            if (userId) {
                const [integ] = await db
                    .select()
                    .from(integration)
                    .where(
                        and(
                            eq(integration.userId, userId),
                            eq(integration.serviceId, "whatsapp"),
                            eq(integration.status, "connected"),
                            sql`${integration.credentials}::jsonb->>'phoneNumberId' = ${phoneNumberId}`
                        )
                    )
                    .limit(1);
                
                if (integ) return integ;
            }

            // 2. Global fallback (If userId is missing or if URL-userId doesn't match PhoneID for some reason)
            const integrations = await db
                .select()
                .from(integration)
                .where(
                    and(
                        eq(integration.serviceId, "whatsapp"),
                        eq(integration.status, "connected"),
                        sql`${integration.credentials}::jsonb->>'phoneNumberId' = ${phoneNumberId}`
                    )
                )
                .limit(1);
            
            return integrations[0] || null;
        } catch (error) {
            console.error(`[findIntegration] Error querying for ${phoneNumberId}:`, error);
            return null;
        }
  }

  /**
   * Main handler for specific message events
   */
  private async handleMessageEvent(msg: any, value: any, targetIntegration: typeof integration.$inferSelect) {
       const userId = targetIntegration.userId;
       const from = msg.from;
       
       // 1. Data Extraction & Formatting
       const { msgBody, metadata } = this.parseMessageContent(msg);

       // 2. Find or Create Contact
       const profileName = value.contacts?.[0]?.profile?.name || from;
       const contactRecord = await getOrCreateContact({
           userId,
           phone: from,
           name: profileName,
           metadata: {
               wa_profile_name: value.contacts?.[0]?.profile?.name,
               source: "whatsapp_webhook"
           }
       });

       // 3. Save Message to DB
       await db.insert(message).values({
           userId,
           contactId: contactRecord.id,
           direction: "inbound",
           content: msgBody,
           status: "delivered", 
           metadata: JSON.stringify(metadata),
           sentAt: new Date(parseInt(msg.timestamp) * 1000), 
       });

       console.log(`[Webhook] ${msg.type} from ${from} saved for user ${userId}`);
       
       // 4. Handle based on category (Message vs Action)
       if (['interactive', 'reaction'].includes(msg.type)) {
           await this.handleCustomerAction(msg, contactRecord, targetIntegration);
       } else {
           await this.handleCustomerMessage(msg, contactRecord, targetIntegration);
       }

       // 5. Common: Mark as Read
       try {
           const creds = typeof targetIntegration.credentials === 'string' ? JSON.parse(targetIntegration.credentials) : targetIntegration.credentials;
           if (creds) await markMessageAsRead(msg.id, creds);
       } catch (e) {
           console.error("[Webhook] MarkAsRead Error:", e);
       }
  }

  /**
   * Handle standard messages (text, media)
   */
  private async handleCustomerMessage(msg: any, contact: any, integ: typeof integration.$inferSelect) {
       const { msgBody } = this.parseMessageContent(msg);
       // Trigger auto-reply bot
       await this.triggerBot(integ.userId, contact.id, msgBody);
  }

  /**
   * Handle interactive actions (buttons, list selections, reactions)
   */
  private async handleCustomerAction(msg: any, contact: any, integ: typeof integration.$inferSelect) {
       const { msgBody } = this.parseMessageContent(msg);
       console.log(`[Action] Customer ${contact.phone} performed ${msg.type}: ${msgBody}`);
       
       // Example: Special handling for common button actions
       if (msgBody.toLowerCase().includes('unsubscribe') || msgBody.toLowerCase().includes('stop')) {
           console.log(`[Action] Customer requested unsubscription: ${contact.phone}`);
           // You could add logic here to tag the contact as 'unsubscribed'
           // await db.update(contact).set({ tags: sql`array_append(tags, 'unsubscribed')` }).where(eq(contact.id, contact.id));
       }

       if (msgBody.toLowerCase().includes('help') || msgBody.toLowerCase().includes('support')) {
           console.log(`[Action] Customer requested support: ${contact.phone}`);
       }

       // We still run the bot for actions but with explicit context
       // this helps the AI understand it was a button click or interaction
       await this.triggerBot(integ.userId, contact.id, `[CUSTOMER_ACTION]: ${msgBody}`);
  }

  /**
   * Utility to extract text and details from various WhatsApp message types
   */
  private parseMessageContent(msg: any) {
       const msgType = msg.type;
       let msgBody = "";
       let metadata: Record<string, unknown> = {
            wa_id: msg.id,
            wa_type: msgType,
            timestamp: msg.timestamp
       };

       switch (msgType) {
           case 'text':
               msgBody = msg.text?.body || "";
               break;
           case 'image':
           case 'video':
           case 'document':
               msgBody = msg[msgType]?.caption || `[${msgType}]`;
               metadata.media = msg[msgType];
               break;
           case 'audio':
           case 'sticker':
               msgBody = `[${msgType}]`;
               metadata.media = msg[msgType];
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
               } else if (interactive?.type === 'list_reply') {
                    msgBody = interactive.list_reply?.title || "[List Reply]";
               } else {
                   msgBody = "[Interactive]";
               }
               metadata.interactive = interactive;
               break;
           case 'reaction':
               msgBody = `[Reaction: ${msg.reaction?.emoji}]`;
               metadata.reaction = msg.reaction;
               break;
           default:
               msgBody = `[${msgType}]`;
               metadata.raw = msg;
       }

       return { msgBody, metadata };
  }

  private async handleStatuses(statuses: WhatsAppStatusUpdate[], targetIntegration: typeof integration.$inferSelect) {
      for (const statusUpdate of statuses) {
          const waMessageId = statusUpdate.id;
          const newStatus = statusUpdate.status;
          
          console.log(`[Webhook] Message Status Update: wa_id ${waMessageId} -> ${newStatus}`);
          
          try {
              // 1. Find the message by its WhatsApp ID stored in metadata
              // Since metadata is a text column containing JSON, we search for the ID
              const messages = await db
                  .select()
                  .from(message)
                  .where(sql`${message.metadata}::jsonb->>'wa_id' = ${waMessageId}`)
                  .limit(1);

              const msgRecord = messages[0];
              if (!msgRecord) {
                  console.log(`[Webhook] No local message found with wa_id: ${waMessageId}`);
                  continue;
              }

              // 2. Update the message status
              await db
                  .update(message)
                  .set({
                      status: newStatus,
                      readAt: newStatus === 'read' ? new Date() : msgRecord.readAt,
                  })
                  .where(eq(message.id, msgRecord.id));

              // 3. If it's part of a campaign, update campaign stats
              if (msgRecord.campaignId) {
                  const [camp] = await db
                      .select()
                      .from(campaign)
                      .where(eq(campaign.id, msgRecord.campaignId))
                      .limit(1);

                  if (camp) {
                      const updateData: any = {};
                      
                        if (newStatus === 'delivered' && msgRecord.status !== 'delivered' && msgRecord.status !== 'read') {
                            const currentDelivered = camp.deliveredCount || 0;
                            updateData.deliveredCount = currentDelivered + 1;
                        } else if (newStatus === 'read' && msgRecord.status !== 'read') {
                            const currentRead = camp.readCount || 0;
                            updateData.readCount = currentRead + 1;
                          
                            // If it was just 'sent', it's also 'delivered' now
                            if (msgRecord.status === 'sent') {
                                const currentDelivered = camp.deliveredCount || 0;
                                updateData.deliveredCount = currentDelivered + 1;
                            }
                      }

                      if (Object.keys(updateData).length > 0) {
                          await db
                              .update(campaign)
                              .set(updateData)
                              .where(eq(campaign.id, camp.id));
                          
                          console.log(`[Webhook] Updated campaign ${camp.id} stats:`, updateData);
                      }
                  }
              }
          } catch (err) {
              console.error(`[Webhook] Error processing status update for ${waMessageId}:`, err);
          }
      }
  }

  private async triggerBot(userId: string, contactId: string, userMessage: string) {
        try {
            // 1. Get Bot Settings
            let settings = await db.query.botSetting.findFirst({
                where: eq(botSetting.userId, userId)
            });
            
            // Auto-initialize settings if missing
            if (!settings) {
                console.log(`[Bot] Initializing default settings for user ${userId}`);
                const [newSettings] = await db.insert(botSetting).values({
                    userId: userId,
                    isActive: true, // Enable by default
                    tone: "friendly",
                    name: "المساعد الذكي"
                }).returning();
                settings = newSettings;
            }

            if (!settings.isActive) {
                console.log(`[Bot] Bot is disabled for user ${userId}.`);
                return;
            }

            // 2. Fetch Knowledge Sources
            const sources = await db.query.knowledgeSource.findMany({
                where: eq(knowledgeSource.userId, userId)
            });

            const knowledgeItems = sources.map(s => ({
                name: s.name,
                type: s.type,
                content: s.content || s.fileUrl
            }));

            // 3. Build Unified System Prompt
            const finalSystemPrompt = buildBotSystemPrompt(
                settings.systemPrompt,
                settings.tone,
                knowledgeItems
            );

            console.log(`[Bot] Found active settings. Tone: ${settings.tone}, Knowledge: ${sources.length} items`);

            // 4. Resolve Contact Info
            const [contactData] = await db
                .select()
                .from(contact)
                .where(eq(contact.id, contactId))
                .limit(1);

            const contactName = contactData?.name || "Customer";
            const apiKey = settings.aiApiKey || process.env.OPENROUTER_API_KEY;
            
            if (!apiKey) {
                console.log("[Bot] No AI API Key found, skipping.");
                return;
            }

            // 5. Initialize AI Model
            const ai = new AIModel({
                apiKey: apiKey,
                provider: (settings.aiProvider as any) || 'openrouter',
                model: settings.aiModel || 'z-ai/glm-4.5-air:free',
                debug: true
            });

            ai.setSystemPrompt(finalSystemPrompt);
            
            // 6. Fetch Conversation History (10 messages)
            const history = await db
                .select()
                .from(message)
                .where(and(eq(message.contactId, contactId), eq(message.userId, userId)))
                .orderBy(desc(message.createdAt))
                .limit(10);
            
            history.reverse().forEach(msg => {
                if (msg.direction === 'inbound') {
                    ai.addUserMessage(msg.content);
                } else {
                    ai.addAssistantMessage(msg.content);
                }
            });

            // Add the current incoming message
            ai.addUserMessage(`Name: ${contactName}\nMessage: ${userMessage}`);

            const response = await ai.send();
          
          const aiReply = response.content;
          console.log(`[Bot] Generated response: ${aiReply.substring(0, 50)}...`);

          // 1. Get Integration for credentials
          const [integ] = await db
              .select()
              .from(integration)
              .where(and(eq(integration.userId, userId), eq(integration.serviceId, "whatsapp"), eq(integration.status, "connected")))
              .limit(1);

          if (!integ || !integ.credentials) {
              console.log(`[Bot] No active WhatsApp integration for user ${userId}. integ: ${!!integ}, credentials: ${!!integ?.credentials}`);
              return;
          }
          console.log(`[Bot] Found connected integration for user ${userId}.`);

          const creds = typeof integ.credentials === 'string' ? JSON.parse(integ.credentials) : integ.credentials;

          // 2. Find contact phone
          const [contactRecord] = await db
              .select()
              .from(contact)
              .where(eq(contact.id, contactId))
              .limit(1);

          if (!contactRecord || !contactRecord.phone) {
              console.log(`[Bot] Could not find contact phone for ID ${contactId}. contactRecord: ${!!contactRecord}, phone: ${contactRecord?.phone}`);
              return;
          }
          console.log(`[Bot] Sending response to phone: ${contactRecord.phone}`);

          // 3. Send via WhatsApp
          const result = await sendMessage(contactRecord.phone, aiReply, creds);

          // 4. Save AI response to DB
          const metadata = {
              generated_by: 'ai_bot',
              model: response.model,
              usage: response.usage,
              wa_id: result.messageId,
              contact_name: contactName
          };

          await db.insert(message).values({
              userId,
              contactId,
              direction: "outbound",
              content: aiReply,
              status: result.success ? "sent" : "failed",
              metadata: JSON.stringify(metadata),
              sentAt: new Date(),
          });
          
          console.log(`[Bot] Process complete for ${contactRecord.phone}. Success: ${result.success}${result.error ? `, Error: ${result.error}` : ''}`);
      } catch (error) {
          console.error("[Bot] Error generating AI response:", error);
      }
  }
}
