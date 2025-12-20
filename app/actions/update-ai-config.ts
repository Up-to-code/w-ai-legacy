'use server';

import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { WhatsAppAIConfig } from "@/app/dashboard/integrations/whatsapp/types";

interface UpdateAIConfigResult {
  success: boolean;
  error?: string;
  data?: WhatsAppAIConfig;
}

interface IntegrationCredentials {
  accessToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  verifyToken?: string;
  aiAutoResponse?: WhatsAppAIConfig;
}

const DEFAULT_AI_CONFIG: WhatsAppAIConfig = {
  enabled: true,
  responseDelay: 2,
  businessHoursOnly: false,
  businessHours: {
    start: "09:00",
    end: "18:00",
    timezone: "Africa/Cairo",
    days: [1, 2, 3, 4, 5] // Mon-Fri
  },
  fallbackMessage: "شكراً لتواصلك! سنرد عليك في أقرب وقت."
};

/**
 * Update AI Auto-Response configuration for WhatsApp integration
 * Supports updating either just the enabled flag or the entire config
 */
export async function updateAIConfig(
  configOrEnabled: WhatsAppAIConfig | boolean
): Promise<UpdateAIConfigResult> {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized - Please log in" };
    }

    const userId = session.user.id;

    // Fetch current integration with WhatsApp service type filter
    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, userId),
          eq(integration.serviceId, "whatsapp")
        )
      )
      .limit(1);

    if (!existingIntegration) {
      return { 
        success: false, 
        error: "WhatsApp integration not found - Please connect first" 
      };
    }

    // Parse existing credentials with error handling
    let credentials: IntegrationCredentials = {};
    try {
      credentials = existingIntegration.credentials 
        ? JSON.parse(existingIntegration.credentials) 
        : {};
    } catch (parseError) {
      console.error("[updateAIConfig] Failed to parse credentials:", parseError);
      return { 
        success: false, 
        error: "Invalid credentials format - Please reconnect integration" 
      };
    }

    // Determine new AI config based on input type
    let newAIConfig: WhatsAppAIConfig;
    
    if (typeof configOrEnabled === 'boolean') {
      // Update only enabled flag, preserve other settings
      const currentConfig = credentials.aiAutoResponse || DEFAULT_AI_CONFIG;
      newAIConfig = {
        ...currentConfig,
        enabled: configOrEnabled
      };
    } else {
      // Update entire config object
      newAIConfig = {
        ...DEFAULT_AI_CONFIG,
        ...configOrEnabled
      };
    }

    // Update credentials
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
          eq(integration.serviceId, "whatsapp")
        )
      );

    console.log(`[updateAIConfig] Successfully updated AI config for user ${userId}:`, {
      enabled: newAIConfig.enabled,
      responseDelay: newAIConfig.responseDelay,
      businessHoursOnly: newAIConfig.businessHoursOnly
    });

    return { 
      success: true, 
      data: newAIConfig 
    };

  } catch (error) {
    console.error("[updateAIConfig] Unexpected error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update AI configuration" 
    };
  }
}
