"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq, and, ilike, or, desc, asc, sql, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type {
  Contact,
  CreateContactData,
  UpdateContactData,
  ContactListParams,
} from "@/types/contact";

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
 * Get estimated count of contacts based on filters
 */
export async function getContactCount(filters: { tags?: string[], activeOnly?: boolean } = {}) {
  try {
    const user = await getAuthUser();

    // Build where clause
    const whereConditions = [eq(contact.userId, user.id)];

    // Filter by tags (if provided)
    if (filters.tags && filters.tags.length > 0) {
      // Filter contacts that have at least one of the specified tags
      whereConditions.push(
        sql`${contact.tags} && ARRAY[${filters.tags.map(t => `'${t}'`).join(',')}]::text[]`
      );
    }

    // Filter by activity in last 24h
    if (filters.activeOnly) {
      const activeCutoff = new Date();
      activeCutoff.setHours(activeCutoff.getHours() - 24);
      whereConditions.push(gte(contact.lastActivityAt, activeCutoff));
    }

    const whereCombined = and(...whereConditions);

    // Get count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contact)
      .where(whereCombined);

    return {
      success: true,
      count: Number(count),
    };
  } catch (error: any) {
    console.error("Get contact count error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حساب عدد جهات الاتصال",
    };
  }
}

/**
 * Get list of contacts with pagination, search, and filtering
 */
export async function getContacts(params: ContactListParams = {}) {
  try {
    const user = await getAuthUser();

    const {
      page = 1,
      limit = 10,
      search = "",
      tags: filterTags = [],
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereConditions = [eq(contact.userId, user.id)];

    // Search by name, phone, or email
    if (search) {
      whereConditions.push(
        or(
          ilike(contact.name, `%${search}%`),
          ilike(contact.phone, `%${search}%`),
          ilike(contact.email, `%${search}%`)
        )!
      );
    }

    // Filter by tags (if provided)
    if (filterTags.length > 0) {
      // Filter contacts that have at least one of the specified tags
      whereConditions.push(
        sql`${contact.tags} && ARRAY[${filterTags.map(t => `'${t}'`).join(',')}]::text[]`
      );
    }

    const whereCombined = and(...whereConditions);

    // Build order by clause
    const orderByColumn = sortBy === "createdAt" ? contact.createdAt :
                          sortBy === "lastActivityAt" ? contact.lastActivityAt :
                          sortBy === "orderCount" ? contact.orderCount :
                          contact.name;

    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contact)
      .where(whereCombined);

    // Get contacts
    const contacts = await db
      .select()
      .from(contact)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: contacts as Contact[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error: any) {
    console.error("Get contacts error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب جهات الاتصال",
    };
  }
}

/**
 * Get single contact by ID
 */
export async function getContact(id: string) {
  try {
    const user = await getAuthUser();

    const [contactData] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, id), eq(contact.userId, user.id)))
      .limit(1);

    if (!contactData) {
      return {
        success: false,
        error: "جهة الاتصال غير موجودة",
      };
    }

    return {
      success: true,
      data: contactData as Contact,
    };
  } catch (error: any) {
    console.error("Get contact error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب جهة الاتصال",
    };
  }
}

/**
 * Create new contact
 */
export async function createContact(data: CreateContactData) {
  try {
    const user = await getAuthUser();

    // Validate required fields
    if (!data.name || data.name.trim() === "") {
      return {
        success: false,
        error: "اسم جهة الاتصال مطلوب",
      };
    }

    const [newContact] = await db
      .insert(contact)
      .values({
        userId: user.id,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        tags: data.tags || [],
        notes: data.notes || null,
        orderCount: 0,
      })
      .returning();

    return {
      success: true,
      message: "تم إضافة جهة الاتصال بنجاح",
      data: newContact as Contact,
    };
  } catch (error: any) {
    console.error("Create contact error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إضافة جهة الاتصال",
    };
  }
}

/**
 * Update contact
 */
export async function updateContact(id: string, data: UpdateContactData) {
  try {
    const user = await getAuthUser();

    // Check if contact exists and belongs to user
    const [existingContact] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, id), eq(contact.userId, user.id)))
      .limit(1);

    if (!existingContact) {
      return {
        success: false,
        error: "جهة الاتصال غير موجودة",
      };
    }

    const [updatedContact] = await db
      .update(contact)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(contact.id, id))
      .returning();

    return {
      success: true,
      message: "تم تحديث جهة الاتصال بنجاح",
      data: updatedContact as Contact,
    };
  } catch (error: any) {
    console.error("Update contact error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث جهة الاتصال",
    };
  }
}

/**
 * Delete contact
 */
export async function deleteContact(id: string) {
  try {
    const user = await getAuthUser();

    // Check if contact exists and belongs to user
    const [existingContact] = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, id), eq(contact.userId, user.id)))
      .limit(1);

    if (!existingContact) {
      return {
        success: false,
        error: "جهة الاتصال غير موجودة",
      };
    }

    await db.delete(contact).where(eq(contact.id, id));

    return {
      success: true,
      message: "تم حذف جهة الاتصال بنجاح",
    };
  } catch (error: any) {
    console.error("Delete contact error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف جهة الاتصال",
    };
  }
}

/**
 * Bulk import contacts
 */
export async function bulkImportContacts(contacts: CreateContactData[]) {
  try {
    const user = await getAuthUser();

    if (!contacts || contacts.length === 0) {
      return {
        success: false,
        error: "لا توجد جهات اتصال للاستيراد",
      };
    }

    const contactsToInsert = contacts.map((c) => ({
      userId: user.id,
      name: c.name,
      phone: c.phone || null,
      email: c.email || null,
      tags: c.tags || [],
      notes: c.notes || null,
      orderCount: 0,
    }));

    const insertedContacts = await db
      .insert(contact)
      .values(contactsToInsert)
      .returning();

    return {
      success: true,
      message: `تم استيراد ${insertedContacts.length} جهة اتصال بنجاح`,
      data: insertedContacts as Contact[],
    };
  } catch (error: any) {
    console.error("Bulk import contacts error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء استيراد جهات الاتصال",
    };
  }
}

/**
 * Export contacts to CSV format
 */
export async function exportContacts() {
  try {
    const user = await getAuthUser();

    const contacts = await db
      .select()
      .from(contact)
      .where(eq(contact.userId, user.id))
      .orderBy(desc(contact.createdAt));

    // Convert to CSV string
    const headers = ["الاسم", "الهاتف", "البريد الإلكتروني", "عدد الطلبات", "الملاحظات"];
    const csv = [
      headers.join(","),
      ...contacts.map((c) =>
        [c.name, c.phone || "", c.email || "", c.orderCount || "0", c.notes || ""].join(",")
      ),
    ].join("\n");

    return {
      success: true,
      data: csv,
      filename: `contacts_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error: any) {
    console.error("Export contacts error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تصديرجهات الاتصال",
    };
  }
}
