"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { message, contact } from "@/lib/db/schema";
import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import type { 
  Message, 
  CreateMessageData, 
  MessageListParams,
  Conversation 
} from "@/types/message";

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
 * Get list of messages with pagination and filtering
 */
export async function getMessages(params: MessageListParams = {}) {
  try {
    const user = await getAuthUser();
    
    const {
      page = 1,
      limit = 50,
      contactId,
      campaignId,
      direction,
      status,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereConditions = [eq(message.userId, user.id)];

    if (contactId) {
      whereConditions.push(eq(message.contactId, contactId));
    }

    if (campaignId) {
      whereConditions.push(eq(message.campaignId, campaignId));
    }

    if (direction) {
      whereConditions.push(eq(message.direction, direction));
    }

    if (status) {
      whereConditions.push(eq(message.status, status));
    }

    if (startDate) {
      whereConditions.push(gte(message.createdAt, startDate));
    }

    if (endDate) {
      whereConditions.push(lte(message.createdAt, endDate));
    }

    const whereCombined = and(...whereConditions);

    // Build order by clause
    const orderByColumn = sortBy === "sentAt" ? message.sentAt :
                          sortBy === "readAt" ? message.readAt :
                          message.createdAt;
    
    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(whereCombined);

    // Get messages
    const messages = await db
      .select()
      .from(message)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: messages as Message[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error: any) {
    console.error("Get messages error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب الرسائل",
    };
  }
}

/**
 * Get single message by ID
 */
export async function getMessage(id: string) {
  try {
    const user = await getAuthUser();

    const [messageData] = await db
      .select()
      .from(message)
      .where(and(eq(message.id, id), eq(message.userId, user.id)))
      .limit(1);

    if (!messageData) {
      return {
        success: false,
        error: "الرسالة غير موجودة",
      };
    }

    return {
      success: true,
      data: messageData as Message,
    };
  } catch (error: any) {
    console.error("Get message error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب الرسالة",
    };
  }
}

/**
 * Send a message to a contact
 */
export async function sendMessage(contactId: string, content: string) {
  try {
    const user = await getAuthUser();

    if (!content || content.trim() === "") {
      return {
        success: false,
        error: "محتوى الرسالة مطلوب",
      };
    }

    // Verify contact exists and belongs to user
    const [contactData] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, contactId), eq(contact.userId, user.id)))
      .limit(1);

    if (!contactData) {
      return {
        success: false,
        error: "جهة الاتصال غير موجودة",
      };
    }

    const [newMessage] = await db
      .insert(message)
      .values({
        userId: user.id,
        contactId,
        direction: "outbound",
        content,
        status: "sent",
        sentAt: new Date(),
      })
      .returning();

    // Update contact's last activity
    await db
      .update(contact)
      .set({ lastActivityAt: new Date() })
      .where(eq(contact.id, contactId));

    return {
      success: true,
      message: "تم إرسال الرسالة بنجاح",
      data: newMessage as Message,
    };
  } catch (error: any) {
    console.error("Send message error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إرسال الرسالة",
    };
  }
}

/**
 * Get conversation history with a contact
 */
export async function getConversation(contactId: string) {
  try {
    const user = await getAuthUser();

    // Verify contact exists and belongs to user
    const [contactData] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, contactId), eq(contact.userId, user.id)))
      .limit(1);

    if (!contactData) {
      return {
        success: false,
        error: "جهة الاتصال غير موجودة",
      };
    }

    // Get all messages for this contact
    const messages = await db
      .select()
      .from(message)
      .where(and(eq(message.contactId, contactId), eq(message.userId, user.id)))
      .orderBy(asc(message.createdAt));

    // Count unread messages (inbound messages not yet read)
    const [{ unreadCount }] = await db
      .select({ unreadCount: sql<number>`count(*)` })
      .from(message)
      .where(
        and(
          eq(message.contactId, contactId),
          eq(message.userId, user.id),
          eq(message.direction, "inbound"),
          eq(message.status, "delivered")
        )
      );

    const conversation: Conversation = {
      contactId,
      contactName: contactData.name,
      messages: messages as Message[],
      lastMessageAt: messages.length > 0 ? messages[messages.length - 1].createdAt : new Date(),
      unreadCount: Number(unreadCount),
    };

    return {
      success: true,
      data: conversation,
    };
  } catch (error: any) {
    console.error("Get conversation error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب المحادثة",
    };
  }
}

/**
 * Mark message as read
 */
export async function markAsRead(id: string) {
  try {
    const user = await getAuthUser();

    const [existingMessage] = await db
      .select()
      .from(message)
      .where(and(eq(message.id, id), eq(message.userId, user.id)))
      .limit(1);

    if (!existingMessage) {
      return {
        success: false,
        error: "الرسالة غير موجودة",
      };
    }

    const [updatedMessage] = await db
      .update(message)
      .set({
        status: "read",
        readAt: new Date(),
      })
      .where(eq(message.id, id))
      .returning();

    return {
      success: true,
      data: updatedMessage as Message,
    };
  } catch (error: any) {
    console.error("Mark as read error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث حالة الرسالة",
    };
  }
}

/**
 * Delete message
 */
export async function deleteMessage(id: string) {
  try {
    const user = await getAuthUser();

    const [existingMessage] = await db
      .select()
      .from(message)
      .where(and(eq(message.id, id), eq(message.userId, user.id)))
      .limit(1);

    if (!existingMessage) {
      return {
        success: false,
        error: "الرسالة غير موجودة",
      };
    }

    await db.delete(message).where(eq(message.id, id));

    return {
      success: true,
      message: "تم حذف الرسالة بنجاح",
    };
  } catch (error: any) {
    console.error("Delete message error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف الرسالة",
    };
  }
}
