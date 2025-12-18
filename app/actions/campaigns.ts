"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { campaign, message, integration, contact } from "@/lib/db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import type { 
  Campaign, 
  CreateCampaignData, 
  UpdateCampaignData, 
  CampaignListParams,
  CampaignStatus
} from "@/types/campaign";

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

/**
 * Get list of campaigns with stats
 */
export async function getCampaigns(params: CampaignListParams = {}) {
  try {
    const user = await getAuthUser();
    
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [eq(campaign.userId, user.id)];

    if (search) {
      whereConditions.push(ilike(campaign.name, `%${search}%`));
    }

    if (status) {
      whereConditions.push(eq(campaign.status, status));
    }

    const whereCombined = and(...whereConditions);

    // Build order by
    const orderByColumn = sortBy === "createdAt" ? campaign.createdAt :
                          sortBy === "scheduledAt" ? campaign.scheduledAt :
                          sortBy === "sentAt" ? campaign.sentAt :
                          campaign.name;
    
    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // Get count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaign)
      .where(whereCombined);

    // Get campaigns
    const campaigns = await db
      .select()
      .from(campaign)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
      
    // Transform campaigns to include stats structure
    const campaignsWithStats = campaigns.map(camp => ({
      ...camp,
      stats: {
        totalSent: 0,
        totalDelivered: parseInt(camp.deliveredCount || "0"),
        totalRead: parseInt(camp.readCount || "0"),
        totalFailed: 0,
        deliveryRate: 0,
        readRate: 0,
        // Helper properties for UI
        delivered: parseInt(camp.deliveredCount || "0"),
        read: parseInt(camp.readCount || "0"),
        total: parseInt(camp.targetAudienceCount || "0")
      }
    }));

    return {
      success: true,
      data: campaignsWithStats as Campaign[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error: any) {
    console.error("Get campaigns error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب الحملات",
    };
  }
}

/**
 * Get single campaign
 */
export async function getCampaign(id: string) {
  try {
    const user = await getAuthUser();

    const [campaignData] = await db
      .select()
      .from(campaign)
      .where(and(eq(campaign.id, id), eq(campaign.userId, user.id)))
      .limit(1);

    if (!campaignData) {
      return {
        success: false,
        error: "الحملة غير موجودة",
      };
    }

    return {
      success: true,
      data: campaignData as Campaign,
    };
  } catch (error: any) {
    console.error("Get campaign error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب تفاصيل الحملة",
    };
  }
}

/**
 * Create campaign
 */
export async function createCampaign(data: CreateCampaignData) {
  try {
    const user = await getAuthUser();

    if (!data.name?.trim()) {
      return { success: false, error: "اسم الحملة مطلوب" };
    }

    const [newCampaign] = await db
      .insert(campaign)
      .values({
        userId: user.id,
        name: data.name,
        status: data.status || "draft",
        audienceType: data.audienceType || "all",
        includedTags: data.includedTags || [],
        contactLimit: data.contactLimit ? String(data.contactLimit) : null,
        recentDays: data.recentDays ? String(data.recentDays) : null,
        targetAudienceCount: data.targetAudienceCount || "0",
        messageType: data.messageType || "text",
        messageContent: data.messageContent || "",
        templateId: data.templateId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      })
      .returning();

    // If sendNow flag is set, immediately trigger send
    if (data.sendNow) {
      const sendResult = await sendCampaign(newCampaign.id);
      return {
        success: true,
        message: sendResult.success ? sendResult.message : "تم إنشاء الحملة وجاري الإرسال",
        data: newCampaign as Campaign,
      };
    }

    return {
      success: true,
      message: "تم إنشاء الحملة بنجاح",
      data: newCampaign as Campaign,
    };
  } catch (error: any) {
    console.error("Create campaign error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إنشاء الحملة",
    };
  }
}

/**
 * Update campaign
 */
export async function updateCampaign(id: string, data: UpdateCampaignData) {
  try {
    const user = await getAuthUser();

    // Check ownership
    const [existingCampaign] = await db
      .select()
      .from(campaign)
      .where(and(eq(campaign.id, id), eq(campaign.userId, user.id)))
      .limit(1);

    if (!existingCampaign) {
      return { success: false, error: "الحملة غير موجودة" };
    }

    // Only allow updating if not already completed or making critical changes while active
    if (existingCampaign.status === "completed" && data.status !== "completed") {
      return { success: false, error: "لا يمكن تعديل حملة مكتملة" };
    }

    const [updatedCampaign] = await db
      .update(campaign)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(campaign.id, id))
      .returning();

    return {
      success: true,
      message: "تم تحديث الحملة بنجاح",
      data: updatedCampaign as Campaign,
    };
  } catch (error: any) {
    console.error("Update campaign error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث الحملة",
    };
  }
}

/**
 * Delete campaign
 */
export async function deleteCampaign(id: string) {
  try {
    const user = await getAuthUser();

    const [existingCampaign] = await db
      .select()
      .from(campaign)
      .where(and(eq(campaign.id, id), eq(campaign.userId, user.id)))
      .limit(1);

    if (!existingCampaign) {
      return { success: false, error: "الحملة غير موجودة" };
    }

    await db.delete(campaign).where(eq(campaign.id, id));

    return {
      success: true,
      message: "تم حذف الحملة بنجاح",
    };
  } catch (error: any) {
    console.error("Delete campaign error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف الحملة",
    };
  }
}

/**
 * Send campaign (Stub for future implementation)
 * This would trigger a background job to send messages
 */
export async function sendCampaign(id: string) {
  try {
    const user = await getAuthUser();
    
    // 1. Fetch Campaign
    const [existingCampaign] = await db
      .select()
      .from(campaign)
      .where(and(eq(campaign.id, id), eq(campaign.userId, user.id)))
      .limit(1);

    if (!existingCampaign) {
      return { success: false, error: "الحملة غير موجودة" };
    }

    if (existingCampaign.status === "active" || existingCampaign.status === "sending") {
        return { success: false, error: "الحملة قيد الإرسال بالفعل" };
    }

    // 2. Fetch WhatsApp Integration
    const [waIntegration] = await db
        .select()
        .from(integration) // Use the imported schema object 'integration'
        .where(and(
            eq(integration.userId, user.id),
            eq(integration.serviceId, "whatsapp"),
            eq(integration.status, "connected")
        ))
        .limit(1);

    if (!waIntegration || !waIntegration.credentials) {
        return { success: false, error: "لم يتم العثور على ربط واتساب متصل. يرجى ربط حسابك أولاً." };
    }

    let credentials: any;
    try {
        credentials = typeof waIntegration.credentials === 'string' 
            ? JSON.parse(waIntegration.credentials)
            : waIntegration.credentials;
    } catch (e) {
        return { success: false, error: "بيانات اعتماد واتساب غير صالحة" };
    }

    // 3. Fetch Contacts based on audience type
    let contacts: any[] = [];
    const allUserContacts = await db.select().from(contact).where(eq(contact.userId, user.id));
    
    switch (existingCampaign.audienceType) {
      case "all":
        contacts = allUserContacts;
        break;
        
      case "tags":
        if (existingCampaign.includedTags && existingCampaign.includedTags.length > 0) {
          contacts = allUserContacts.filter(c => 
            c.tags && c.tags.some((t: string) => existingCampaign.includedTags?.includes(t))
          );
        }
        break;
        
      case "count":
        // Send to first N contacts
        const limit = parseInt(existingCampaign.contactLimit || "0") || allUserContacts.length;
        contacts = allUserContacts.slice(0, limit);
        break;
        
      case "recent":
        // Contacts created in last X days
        const days = parseInt(existingCampaign.recentDays || "7") || 7;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        contacts = allUserContacts.filter(c => new Date(c.createdAt) >= cutoffDate);
        break;
        
      default:
        contacts = allUserContacts;
    }

    if (contacts.length === 0) {
        return { success: false, error: "لا يوجد جهات اتصال مستهدفة لإرسال الحملة" };
    }

    // 4. Update Status to Sending
    await updateCampaign(id, { status: "sending", sentAt: new Date() });

    // 5. Send Loop (This should ideally be a background job)
    // For MVP we will do it inline but handle errors gracefully per contact
    let sentCount = 0;
    
    // Import helper dynamically or stick to top-level if possible. 
    // Since we are inside the same file context, we need to ensure imports are available.
    // We need to add imports to the top of the file: contact, integration, sendMessage
    // See separate Step for import updates.
    
    // Assuming imports are fixed, here is the logic:
    const { sendMessage } = await import("@/lib/whatsapp"); // Dynamic import to avoid circular dep issues if any, or just convenience
    
    for (const contactRecord of contacts) {
        if (!contactRecord.phone) continue;

        // Replace Variables
        let body = existingCampaign.messageContent || "";
        body = body.replace(/{{name}}/g, contactRecord.name || "");
        body = body.replace(/{{phone}}/g, contactRecord.phone || "");
        body = body.replace(/{{email}}/g, contactRecord.email || "");
        
        // Send
        const result = await sendMessage(contactRecord.phone, body, credentials);
        
        if (result.success) {
            sentCount++;
            
            // Log Message to DB
            await db.insert(message).values({
                userId: user.id,
                contactId: contactRecord.id, // schema 'contact' is imported
                campaignId: id,
                direction: "outbound",
                content: body,
                status: "sent",
                metadata: JSON.stringify({ wa_id: result.messageId }),
                sentAt: new Date(),
            });
        } else {
             // Log failure? For now we just skip/count failures.
             console.error(`Failed to send to ${contactRecord.phone}: ${result.error}`);
        }
    }

    // 6. Update Campaign Status to Completed (or Active)
    // Updates count from the loop. In real app, webhook would update "delivered" count.
    // For now we assume sent = delivered for immediate feedback, though technically incorrect.
    // We'll leave deliveredCount as is (webhook updates it) or increment specific sent stats if we had them.
    // The current schema has deliveredCount. Let's not fake it too much. We rely on webhooks for delivered/read.
    // Just update status.
    
    await updateCampaign(id, { 
        status: "active", // Active means sent and tracking
        // deliveredCount: sentCount.toString() // Optional: update initial count? No, wait for delivery receipts.
    });

    return {
      success: true,
      message: `تم بدء إرسال الحملة إلى ${sentCount} مستلم`,
    };
  } catch (error: any) {
    console.error("Send campaign error:", error);
    // Don't fail completely if possible, but if main logic crashes:
    await updateCampaign(id, { status: "failed" });
    return { success: false, error: error.message };
  }
}
