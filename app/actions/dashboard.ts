"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contact, campaign, message } from "@/lib/db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";

// Helper function to get authenticated user
async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("غير مصرح. يرجى تسجيل الدخول.");
  }

  return session.user;
}

export async function getDashboardStats() {
  try {
    const user = await getAuthUser();
    const userId = user.id;

    // 1. Total Contacts
    const [{ value: totalContacts }] = await db
      .select({ value: count() })
      .from(contact)
      .where(eq(contact.userId, userId));

    // 2. Campaigns Stats
    const campaignsCount = await db
      .select({ 
        status: campaign.status, 
        count: count() 
      })
      .from(campaign)
      .where(eq(campaign.userId, userId))
      .groupBy(campaign.status);

    const activeCampaigns = campaignsCount.find(c => c.status === "active" || c.status === "sending")?.count || 0;
    const completedCampaigns = campaignsCount.find(c => c.status === "completed")?.count || 0;

    // 3. Messages Stats
    const [{ value: totalMessages }] = await db
      .select({ value: count() })
      .from(message)
      .where(eq(message.userId, userId));

    const [{ value: sentMessages }] = await db
      .select({ value: count() })
      .from(message)
      .where(and(eq(message.userId, userId), eq(message.direction, "outbound")));

    // 4. Recent Campaigns
    const recentCampaigns = await db
      .select()
      .from(campaign)
      .where(eq(campaign.userId, userId))
      .orderBy(desc(campaign.createdAt))
      .limit(5);

    // 5. Recent Activity (Last 5 messages)
    const recentMessages = await db
      .select({
        id: message.id,
        content: message.content,
        direction: message.direction,
        status: message.status,
        createdAt: message.createdAt,
        contactName: contact.name,
      })
      .from(message)
      .leftJoin(contact, eq(message.contactId, contact.id))
      .where(eq(message.userId, userId))
      .orderBy(desc(message.createdAt))
      .limit(5);

    return {
      success: true,
      data: {
        counts: {
          contacts: totalContacts,
          activeCampaigns,
          completedCampaigns,
          totalMessages,
          sentMessages,
        },
        recentCampaigns,
        recentMessages,
      },
    };
  } catch (error: any) {
    console.error("Get dashboard stats error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب إحصائيات اللوحة",
    };
  }
}
