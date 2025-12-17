"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface SendTestResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a test WhatsApp message using Meta's Send API
 */
export async function sendTestMessage(
  phoneNumber: string,
  serviceId: string = "whatsapp"
): Promise<SendTestResult> {
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
        error: "لم يتم العثور على التكامل.",
      };
    }

    const credentials =
      typeof integrationRecord.credentials === "string"
        ? JSON.parse(integrationRecord.credentials)
        : integrationRecord.credentials;

    const { accessToken, phoneNumberId } = credentials;

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: "بيانات الاعتماد غير مكتملة." };
    }

    // Validate phone number format (remove any non-digit characters except +)
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
    
    if (!cleanPhone.startsWith("+") || cleanPhone.length < 10) {
      return { 
        success: false, 
        error: "رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ويتضمن رمز الدولة." 
      };
    }

    // Prepare message payload
    // use 'hello_world' template for higher success rate (bypasses 24h window)
    const messagePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "en_US"
        }
      }
    };
    /* 
    // Fallback: Text message (only works within 24h window)
    const textPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "text",
      text: {
        preview_url: false,
        body: "🎉 مرحباً! هذه رسالة تجريبية من ReplyX.\n\nتم ربط حسابك بنجاح وجاهز للاستخدام! ✅"
      }
    };
    */

    // Send message via Meta's Send API
    const sendApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    
    const response = await fetch(sendApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Meta Send API Error:", errorData);
      
      const errorMessage = errorData.error?.message || `فشل الإرسال: ${response.status}`;
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("Send test message error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إرسال الرسالة التجريبية.",
    };
  }
}
