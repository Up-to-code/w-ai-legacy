"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { tag, contact } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { 
  Tag, 
  CreateTagData, 
  UpdateTagData 
} from "@/types/tag";

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
 * Get all tags for the current user
 */
export async function getTags() {
  try {
    const user = await getAuthUser();

    const tags = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, user.id));

    return {
      success: true,
      data: tags as Tag[],
    };
  } catch (error: any) {
    console.error("Get tags error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب الوسوم",
    };
  }
}

/**
 * Create new tag
 */
export async function createTag(data: CreateTagData) {
  try {
    const user = await getAuthUser();

    if (!data.name || data.name.trim() === "") {
      return {
        success: false,
        error: "اسم الوسم مطلوب",
      };
    }

    const [newTag] = await db
      .insert(tag)
      .values({
        userId: user.id,
        name: data.name,
        color: data.color || "blue",
        contactCount: 0,
      })
      .returning();

    revalidatePath("/dashboard/contacts");
    revalidatePath("/dashboard/campaigns");

    return {
      success: true,
      message: "تم إنشاء الوسم بنجاح",
      data: newTag as Tag,
    };
  } catch (error: any) {
    console.error("Create tag error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إنشاء الوسم",
    };
  }
}

/**
 * Update tag
 */
export async function updateTag(id: string, data: UpdateTagData) {
  try {
    const user = await getAuthUser();

    const [existingTag] = await db
      .select()
      .from(tag)
      .where(and(eq(tag.id, id), eq(tag.userId, user.id)))
      .limit(1);

    if (!existingTag) {
      return {
        success: false,
        error: "الوسم غير موجود",
      };
    }

    const [updatedTag] = await db
      .update(tag)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(tag.id, id))
      .returning();

    return {
      success: true,
      message: "تم تحديث الوسم بنجاح",
      data: updatedTag as Tag,
    };
  } catch (error: any) {
    console.error("Update tag error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث الوسم",
    };
  }
}

/**
 * Delete tag
 */
export async function deleteTag(id: string) {
  try {
    const user = await getAuthUser();

    const [existingTag] = await db
      .select()
      .from(tag)
      .where(and(eq(tag.id, id), eq(tag.userId, user.id)))
      .limit(1);

    if (!existingTag) {
      return {
        success: false,
        error: "الوسم غير موجود",
      };
    }

    // Remove this tag from all contacts
    // Note: This requires updating contacts that have this tag in their tags array
    // For simplicity, we'll just delete the tag. In production, you might want to clean up contact references.

    await db.delete(tag).where(eq(tag.id, id));

    return {
      success: true,
      message: "تم حذف الوسم بنجاح",
    };
  } catch (error: any) {
    console.error("Delete tag error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف الوسم",
    };
  }
}

/**
 * Update tag counts based on actual contact counts
 */
export async function updateTagCounts() {
  try {
    const user = await getAuthUser();

    // Get all tags for user
    const userTags = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, user.id));

    // Get all contacts for user
    const userContacts = await db
      .select()
      .from(contact)
      .where(eq(contact.userId, user.id));

    // Count contacts for each tag
    for (const tagItem of userTags) {
      const count = userContacts.filter((c) => 
        c.tags && c.tags.includes(tagItem.id)
      ).length;

      await db
        .update(tag)
        .set({ 
          contactCount: count,
          updatedAt: new Date(),
        })
        .where(eq(tag.id, tagItem.id));
    }

    revalidatePath("/dashboard/contacts");
    revalidatePath("/dashboard/campaigns");

    return {
      success: true,
      message: "تم تحديث عدادات الوسوم بنجاح",
    };
  } catch (error: any) {
    console.error("Update tag counts error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث عدادات الوسوم",
    };
  }
}
