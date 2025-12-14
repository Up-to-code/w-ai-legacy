"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateUserProfile(data: { name: string; phone?: string; jobTitle?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "غير مصرح. يرجى تسجيل الدخول.",
      };
    }

    // Update user in database directly using Drizzle
    // Better Auth's API doesn't support custom fields like phone and jobTitle
    await db
      .update(userTable)
      .set({
        name: data.name,
        phone: data.phone || null,
        jobTitle: data.jobTitle || null,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));

    // Get the updated user data to return
    const updatedUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    return {
      success: true,
      message: "تم تحديث الملف الشخصي بنجاح",
      user: updatedUser[0],
    };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث الملف الشخصي",
    };
  }
}

export async function getUserProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "غير مصرح. يرجى تسجيل الدخول.",
      };
    }

    // Fetch full user data from database including custom fields
    // Better Auth session doesn't include phone and jobTitle
    const userData = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!userData || userData.length === 0) {
      return {
        success: false,
        error: "لم يتم العثور على بيانات المستخدم",
      };
    }

    return {
      success: true,
      user: userData[0],
    };
  } catch (error: any) {
    console.error("Get profile error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب بيانات الملف الشخصي",
    };
  }
}
