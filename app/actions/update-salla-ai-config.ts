"use server";

import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { WhatsAppAIConfig } from "@/app/dashboard/integrations/whatsapp/types";

// Reuse the type or define a new one if needed, assuming same structure for now
type SallaAIConfig = WhatsAppAIConfig;

interface UpdateSallaAIResult {
  success: boolean;
  error?: string;
  data?: SallaAIConfig;
}

const DEFAULT_SALLA_AI_CONFIG: SallaAIConfig = {
  enabled: false,
  responseDelay: 2,
  businessHoursOnly: false,
  businessHours: {
    start: "09:00",
    end: "18:00",
    days: [0, 1, 2, 3, 4], // Sun-Thu
    timezone: "Asia/Riyadh"
  },
  fallbackMessage: "نحن خارج ساعات العمل حالياً، سنرد عليك قريباً."
};

export async function updateSallaAIConfig(
  configOrEnabled: SallaAIConfig | boolean
): Promise<UpdateSallaAIResult> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return { success: false, error: "غير مصرح - يرجى تسجيل الدخول" };
    }

    const userId = session.user.id;

    // Fetch current integration with Salla service type filter
    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, userId),
          eq(integration.serviceId, "salla")
        )
      )
      .limit(1);

    if (!existingIntegration) {
      return { success: false, error: "متجر سلة غير متصل" };
    }

    // Parse existing credentials to avoiding losing auth data
    let credentials: any = {};
    try {
      credentials = existingIntegration.credentials 
        ? JSON.parse(existingIntegration.credentials) 
        : {};
    } catch (parseError) {
      console.error("[updateSallaAIConfig] Failed to parse credentials:", parseError);
      return { 
        success: false, 
        error: "بيانات الربط غير صالحة - يرجى إعادة الربط" 
      };
    }

    // Determine new AI config based on input type
    let newAIConfig: SallaAIConfig;
    
    if (typeof configOrEnabled === 'boolean') {
      // Update only enabled flag, preserve other settings
      const currentConfig = credentials.aiAutoResponse || DEFAULT_SALLA_AI_CONFIG;
      newAIConfig = {
        ...currentConfig,
        enabled: configOrEnabled
      };
    } else {
      // Update entire config object
      newAIConfig = {
        ...DEFAULT_SALLA_AI_CONFIG,
        ...configOrEnabled
      };
    }

    // Update credentials with new AI config
    // Note: We are MODIFYING the existing credentials object which contains accessToken/refreshToken
    // gathered from previous steps. We must ensure we don't wipe them.
    credentials.aiAutoResponse = newAIConfig;

    // Save to database with timestamp
    await db
      .update(integration)
      .set({
        credentials: JSON.stringify(credentials),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(integration.userId, userId),
          eq(integration.serviceId, "salla")
        )
      );

    console.log(`[updateSallaAIConfig] Successfully updated AI config for user ${userId}:`, {
      enabled: newAIConfig.enabled
    });

    return { 
      success: true, 
      data: newAIConfig 
    };

  } catch (error) {
    console.error("[updateSallaAIConfig] Unexpected error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "فشل تحديث إعدادات الذكاء الاصطناعي" 
    };
  }
}
