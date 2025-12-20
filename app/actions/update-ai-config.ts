'use server';

import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { WhatsAppAIConfig } from "@/app/dashboard/integrations/whatsapp/types";

export async function updateAIConfig(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Fetch current integration
        const [existingIntegration] = await db
            .select()
            .from(integration)
            .where(eq(integration.userId, userId))
            .limit(1);

        if (!existingIntegration) {
            return { success: false, error: "Integration not found" };
        }

        // Parse existing credentials
        let credentials: any = {};
        try {
            credentials = existingIntegration.credentials ? JSON.parse(existingIntegration.credentials) : {};
        } catch (e) {
            console.error("[updateAIConfig] Failed to parse credentials:", e);
            credentials = {};
        }

        // Update AI config - preserve other settings, only change enabled
        const currentAIConfig: WhatsAppAIConfig = credentials.aiAutoResponse || {
            enabled: true,
            responseDelay: 2,
            businessHoursOnly: false,
            businessHours: {
                start: "09:00",
                end: "18:00",
                timezone: "Africa/Cairo",
                days: [1, 2, 3, 4, 5]
            },
            fallbackMessage: "شكراً لتواصلك! سنرد عليك في أقرب وقت."
        };

        currentAIConfig.enabled = enabled;

        // Update credentials with new AI config
        credentials.aiAutoResponse = currentAIConfig;

        // Save back to database
        await db
            .update(integration)
            .set({
                credentials: JSON.stringify(credentials),
                updatedAt: new Date()
            })
            .where(eq(integration.userId, userId));

        return { success: true };

    } catch (error) {
        console.error("[updateAIConfig] Error:", error);
        return { success: false, error: "Failed to update AI config" };
    }
}
