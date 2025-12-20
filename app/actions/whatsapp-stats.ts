'use server';

import { db } from "@/lib/db";
import { message } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, sql, desc, gte } from "drizzle-orm";

export interface WhatsAppStats {
    totalMessages: number;
    aiResponses: number;
    successRate: number;
    lastActivity: Date | null;
}

export async function getWhatsAppStats(): Promise<{ success: boolean; data?: WhatsAppStats; error?: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // 1. Total Messages
        const [totalResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(message)
            .where(eq(message.userId, userId));

        // 2. AI Responses (metadata->>'generated_by' = 'ai_bot')
        const [aiResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(message)
            .where(
                and(
                    eq(message.userId, userId),
                    sql`${message.metadata}::jsonb->>'generated_by' = 'ai_bot'`
                )
            );

        // 3. Delivered/Read Messages (Status = 'delivered' or 'read')
        const [successResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(message)
            .where(
                and(
                    eq(message.userId, userId),
                    eq(message.direction, 'outbound'),
                    sql`${message.status} IN ('delivered', 'read')`
                )
            );
            
        // 4. Total Outbound (for percentage)
        const [totalOutboundResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(message)
            .where(
                and(
                    eq(message.userId, userId),
                    eq(message.direction, 'outbound')
                )
            );

        // 5. Last Activity
        const [lastMsg] = await db
            .select({ sentAt: message.sentAt })
            .from(message)
            .where(eq(message.userId, userId))
            .orderBy(desc(message.sentAt))
            .limit(1);

        const totalOutbound = Number(totalOutboundResult?.count) || 0;
        const successCount = Number(successResult?.count) || 0;
        const successRate = totalOutbound > 0 ? Math.round((successCount / totalOutbound) * 100) : 100;

        return {
            success: true,
            data: {
                totalMessages: Number(totalResult?.count) || 0,
                aiResponses: Number(aiResult?.count) || 0,
                successRate: successRate,
                lastActivity: lastMsg?.sentAt || null
            }
        };

    } catch (error) {
        console.error("[getWhatsAppStats] Error:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}
