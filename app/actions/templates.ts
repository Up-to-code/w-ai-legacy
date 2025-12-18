"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { template, integration } from "@/lib/db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import { type WhatsAppCredentials, fetchWhatsAppTemplates } from "@/lib/whatsapp";
import type { 
  Template, 
  CreateTemplateData, 
  UpdateTemplateData, 
  TemplateListParams 
} from "@/types/template";

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
 * Get list of templates with pagination and filtering
 */
export async function getTemplates(params: TemplateListParams = {}) {
  try {
    const user = await getAuthUser();
    
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereConditions = [eq(template.userId, user.id)];

    if (search) {
      whereConditions.push(ilike(template.name, `%${search}%`));
    }

    if (category) {
      whereConditions.push(eq(template.category, category));
    }

    const whereCombined = and(...whereConditions);

    // Build order by clause
    const orderByColumn = sortBy === "createdAt" ? template.createdAt :
                          sortBy === "usageCount" ? template.usageCount :
                          template.name;
    
    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(template)
      .where(whereCombined);

    // Get templates
    const templates = await db
      .select()
      .from(template)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: templates as Template[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error: any) {
    console.error("Get templates error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب القوالب",
    };
  }
}

/**
 * Get single template by ID
 */
export async function getTemplate(id: string) {
  try {
    const user = await getAuthUser();

    const [templateData] = await db
      .select()
      .from(template)
      .where(and(eq(template.id, id), eq(template.userId, user.id)))
      .limit(1);

    if (!templateData) {
      return {
        success: false,
        error: "القالب غير موجود",
      };
    }

    return {
      success: true,
      data: templateData as Template,
    };
  } catch (error: any) {
    console.error("Get template error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب القالب",
    };
  }
}

/**
 * Create new template
 */
export async function createTemplate(data: CreateTemplateData) {
  try {
    const user = await getAuthUser();

    if (!data.name || data.name.trim() === "") {
      return {
        success: false,
        error: "اسم القالب مطلوب",
      };
    }

    if (!data.content || data.content.trim() === "") {
      return {
        success: false,
        error: "محتوى القالب مطلوب",
      };
    }

    const [newTemplate] = await db
      .insert(template)
      .values({
        userId: user.id,
        name: data.name,
        content: data.content,
        category: data.category || "general",
        language: data.language || "ar",
        usageCount: 0,
      })
      .returning();

    return {
      success: true,
      message: "تم إنشاء القالب بنجاح",
      data: newTemplate as Template,
    };
  } catch (error: any) {
    console.error("Create template error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إنشاء القالب",
    };
  }
}

/**
 * Update template
 */
export async function updateTemplate(id: string, data: UpdateTemplateData) {
  try {
    const user = await getAuthUser();

    const [existingTemplate] = await db
      .select()
      .from(template)
      .where(and(eq(template.id, id), eq(template.userId, user.id)))
      .limit(1);

    if (!existingTemplate) {
      return {
        success: false,
        error: "القالب غير موجود",
      };
    }

    const [updatedTemplate] = await db
      .update(template)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(template.id, id))
      .returning();

    return {
      success: true,
      message: "تم تحديث القالب بنجاح",
      data: updatedTemplate as Template,
    };
  } catch (error: any) {
    console.error("Update template error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث القالب",
    };
  }
}

/**
 * Delete template
 */
export async function deleteTemplate(id: string) {
  try {
    const user = await getAuthUser();

    const [existingTemplate] = await db
      .select()
      .from(template)
      .where(and(eq(template.id, id), eq(template.userId, user.id)))
      .limit(1);

    if (!existingTemplate) {
      return {
        success: false,
        error: "القالب غير موجود",
      };
    }

    await db.delete(template).where(eq(template.id, id));

    return {
      success: true,
      message: "تم حذف القالب بنجاح",
    };
  } catch (error: any) {
    console.error("Delete template error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف القالب",
    };
  }
}

/**
 * Duplicate template
 */
export async function duplicateTemplate(id: string) {
  try {
    const user = await getAuthUser();

    const [existingTemplate] = await db
      .select()
      .from(template)
      .where(and(eq(template.id, id), eq(template.userId, user.id)))
      .limit(1);

    if (!existingTemplate) {
      return {
        success: false,
        error: "القالب غير موجود",
      };
    }

    const [duplicatedTemplate] = await db
      .insert(template)
      .values({
        userId: user.id,
        name: `${existingTemplate.name} (نسخة)`,
        content: existingTemplate.content,
        category: existingTemplate.category,
        language: existingTemplate.language,
        usageCount: 0,
      })
      .returning();

    return {
      success: true,
      message: "تم نسخ القالب بنجاح",
      data: duplicatedTemplate as Template,
    };
  } catch (error: any) {
    console.error("Duplicate template error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء نسخ القالب",
    };
  }
}

/**
 * Increment template usage count
 */
export async function incrementUsage(id: string) {
  try {
    const user = await getAuthUser();

    const [existingTemplate] = await db
      .select()
      .from(template)
      .where(and(eq(template.id, id), eq(template.userId, user.id)))
      .limit(1);

    if (!existingTemplate) {
      return {
        success: false,
        error: "القالب غير موجود",
      };
    }

    const currentCount = Number(existingTemplate.usageCount) || 0;
    
    const [updatedTemplate] = await db
      .update(template)
      .set({
        usageCount: currentCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(template.id, id))
      .returning();

    return {
      success: true,
      data: updatedTemplate as Template,
    };
  } catch (error: any) {
    console.error("Increment usage error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث عداد الاستخدام",
    };
  }
}

/**
 * Sync templates from Meta WhatsApp Business API
 */
export async function syncMetaTemplates() {
  try {
    const user = await getAuthUser();

    // 1. Get WhatsApp Integration credentials
    const [waIntegration] = await db
      .select()
      .from(integration)
      .where(and(eq(integration.userId, user.id), eq(integration.serviceId, "whatsapp")))
      .limit(1);

    if (!waIntegration || waIntegration.status !== "connected" || !waIntegration.credentials) {
      return {
        success: false,
        error: "يرجى ربط WhatsApp أولاً وتأكيد الاتصال",
      };
    }

    const credentials = JSON.parse(waIntegration.credentials);
    const waCredentials: WhatsAppCredentials = {
      accessToken: credentials.accessToken,
      phoneNumberId: credentials.phoneNumberId,
      wabaId: credentials.businessAccountId, // We store it as businessAccountId in the UI
    };

    // 2. Fetch templates from Meta
    const metaResult = await fetchWhatsAppTemplates(waCredentials);
    if (!metaResult.success || !metaResult.data) {
      return {
        success: false,
        error: metaResult.error || "فشل جلب القوالب من Meta",
      };
    }

    // 3. Sync with local database
    const metaTemplates = metaResult.data;
    let syncedCount = 0;

    for (const metaTpl of metaTemplates) {
      // Find content - usually in a BODY component
      const bodyComponent = metaTpl.components.find((c: any) => c.type === "BODY");
      const content = bodyComponent?.text || "";

      if (!content) continue; // Skip if no content

      // Check if template already exists by name
      const [existing] = await db
        .select()
        .from(template)
        .where(and(eq(template.userId, user.id), eq(template.name, metaTpl.name)))
        .limit(1);

      if (existing) {
        // Update existing template
        await db
          .update(template)
          .set({
            content,
            category: (metaTpl.category?.toLowerCase() as any) || "general",
            language: metaTpl.language || "ar",
            updatedAt: new Date(),
          })
          .where(eq(template.id, existing.id));
      } else {
        // Create new template
        await db.insert(template).values({
          userId: user.id,
          name: metaTpl.name,
          content,
          category: (metaTpl.category?.toLowerCase() as any) || "general",
          language: metaTpl.language || "ar",
          usageCount: 0,
        });
      }
      syncedCount++;
    }

    return {
      success: true,
      message: `تمت مزامنة ${syncedCount} قالب من Meta بنجاح`,
    };
  } catch (error: any) {
    console.error("Sync Meta templates error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء مزامنة القوالب",
    };
  }
}

