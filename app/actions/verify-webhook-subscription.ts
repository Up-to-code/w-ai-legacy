"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface VerificationResult {
  success: boolean;
  verified?: boolean;
  error?: string;
  details?: any;
}

/**
 * Verifies that the webhook is properly configured with Meta
 * by checking the subscribed_apps endpoint
 */
export async function verifyWebhookSubscription(
serviceId: string = "whatsapp", accessToken: string): Promise<VerificationResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "غير مصرح. يرجى تسجيل الدخول." };
    }

    const user = session.user;

    // Fetch integration credentials
    const [integrationRecord] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .limit(1);

    if (!integrationRecord) {
      return {
        success: false,
        error: "لم يتم العثور على التكامل. يرجى حفظ البيانات أولاً.",
      };
    }

    const credentials =
      typeof integrationRecord.credentials === "string"
        ? JSON.parse(integrationRecord.credentials)
        : integrationRecord.credentials;

    const { accessToken, phoneNumberId, businessAccountId } = credentials;
    
    // Fallback: If businessAccountId is not saved, we can't check subscription status properly 
    // without first fetching it from the phone number endpoint, but for now we will require it.
    // Ideally we should have saved it during connection.

    // If we only have phoneNumberId, we might try to fetch the WABA ID first?
    // GET /v21.0/{phone-number-id}?fields=id,name,platform_type
    // Unfortunately, it doesn't directly give the WABA ID easily without other permissions.
    // However, usually the user saves it in the form.

    const targetId = businessAccountId || phoneNumberId; // Fallback to phone ID if WABA missing (though likely to fail as seen)
    
    if (!accessToken || !targetId) {
      return { success: false, error: "بيانات الاعتماد غير مكتملة (مطلوب Business Account ID)." };
    }

    // Call Meta Graph API to check subscribed apps
    // CORRECT ENDPOINT: /{waba_id}/subscribed_apps
    const graphApiUrl = `https://graph.facebook.com/v21.0/${targetId}/subscribed_apps`;
    
    const response = await fetch(graphApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Meta API Error:", errorData);
      
      return {
        success: false,
        error: `فشل الاتصال بخوادم Meta: ${response.status}. تأكد من صحة Access Token.`,
        details: errorData,
      };
    }

    const data = await response.json();
    console.log("[Webhook Subscription] Meta Response:", JSON.stringify(data, null, 2));
    
    // Check if webhook is subscribed to messages field
    const subscribedFields = data.data?.[0]?.subscribed_fields || [];
    const hasMessagesSubscription = subscribedFields.includes("messages");

    if (!hasMessagesSubscription) {
        console.log("[Webhook Subscription] 'messages' field missing. Attempting to auto-subscribe...");
        
        // Attempt to auto-subscribe
        const subscribeUrl = `https://graph.facebook.com/v21.0/${targetId}/subscribed_apps`;
        const subscribeResponse = await fetch(subscribeUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subscribed_fields: ["messages", "message_template_status_update"]
            })
        });

        if (!subscribeResponse.ok) {
             const subError = await subscribeResponse.json().catch(() => ({}));
             console.error("[Webhook Subscription] Auto-subscribe failed:", subError);
             return {
                success: true,
                verified: false,
                error: "لم نتمكن من تفعيل الاشتراك تلقائياً. تأكد من أن الرمز يملك صلاحيات 'whatsapp_business_management'.",
                details: { subscribedFields, subError },
              };
        }

        console.log("[Webhook Subscription] Auto-subscribe successful!");
        return {
            success: true,
            verified: true,
            details: { subscribedFields: ["messages", "message_template_status_update", "auto_fixed"] },
        };
    }

    // Success! Webhook is properly configured
    return {
      success: true,
      verified: true,
      details: { subscribedFields },
    };
  } catch (error: any) {
    console.error("Webhook verification error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء التحقق من الويب هوك.",
    };
  }
}
