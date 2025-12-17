"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { botSetting, knowledgeSource } from "@/lib/db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import type { 
  BotSetting,
  UpdateBotSettingData,
  KnowledgeSource,
  CreateKnowledgeSourceData,
  UpdateKnowledgeSourceData,
  KnowledgeSourceListParams,
  BotTestRequest,
  BotTestResponse
} from "@/types/bot";

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
 * Get bot settings for the current user
 */
export async function getBotSettings() {
  try {
    const user = await getAuthUser();

    const [settings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.userId, user.id))
      .limit(1);

    // If no settings exist, create default ones
    if (!settings) {
      const [newSettings] = await db
        .insert(botSetting)
        .values({
          userId: user.id,
          name: "المساعد الذكي",
          tone: "friendly",
          systemPrompt: "أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية.",
          isActive: true,
        })
        .returning();

      return {
        success: true,
        data: newSettings as BotSetting,
      };
    }

    return {
      success: true,
      data: settings as BotSetting,
    };
  } catch (error: any) {
    console.error("Get bot settings error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب إعدادات البوت",
    };
  }
}

/**
 * Update bot settings
 */
export async function updateBotSettings(data: UpdateBotSettingData) {
  try {
    const user = await getAuthUser();

    // Get or create settings
    const [existingSettings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.userId, user.id))
      .limit(1);

    if (!existingSettings) {
      // Create new settings
      const [newSettings] = await db
        .insert(botSetting)
        .values({
          userId: user.id,
          ...data,
        })
        .returning();

      return {
        success: true,
        message: "تم إنشاء إعدادات البوت بنجاح",
        data: newSettings as BotSetting,
      };
    }

    // Update existing settings
    const [updatedSettings] = await db
      .update(botSetting)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(botSetting.userId, user.id))
      .returning();

    return {
      success: true,
      message: "تم تحديث إعدادات البوت بنجاح",
      data: updatedSettings as BotSetting,
    };
  } catch (error: any) {
    console.error("Update bot settings error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث إعدادات البوت",
    };
  }
}

/**
 * Reset bot settings to defaults
 */
export async function resetBotSettings() {
  try {
    const user = await getAuthUser();

    const [resetSettings] = await db
      .update(botSetting)
      .set({
        name: "المساعد الذكي",
        tone: "friendly",
        systemPrompt: "أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية.",
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(botSetting.userId, user.id))
      .returning();

    return {
      success: true,
      message: "تم إعادة تعيين الإعدادات بنجاح",
      data: (resetSettings || {}) as BotSetting,
    };
  } catch (error: any) {
    console.error("Reset bot settings error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إعادة تعيين الإعدادات",
    };
  }
}

/**
 * Test bot with a sample message
 */
export async function testBotResponse(request: BotTestRequest) {
  try {
    const user = await getAuthUser();
    const startTime = Date.now();

    // Get bot settings
    const [settings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.userId, user.id))
      .limit(1);

    // TODO: Implement actual AI response using OpenAI or other LLM
    // For now, return a mock response
    const mockResponse = "هذا رد تجريبي من البوت. في الإصدار النهائي، سيتم استخدام الذكاء الاصطناعي للرد.";
    
    const took = Date.now() - startTime;

    const response: BotTestResponse = {
      response: mockResponse,
      took,
    };

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Test bot response error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء اختبار البوت",
    };
  }
}

/**
 * Get list of knowledge sources
 */
export async function getKnowledgeSources(params: KnowledgeSourceListParams = {}) {
  try {
    const user = await getAuthUser();
    
    const {
      page = 1,
      limit = 10,
      type,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereConditions = [eq(knowledgeSource.userId, user.id)];

    if (type) {
      whereConditions.push(eq(knowledgeSource.type, type));
    }

    if (search) {
      whereConditions.push(ilike(knowledgeSource.name, `%${search}%`));
    }

    const whereCombined = and(...whereConditions);

    // Build order by clause
    const orderByColumn = sortBy === "createdAt" ? knowledgeSource.createdAt :
                          sortBy === "sizeBytes" ? knowledgeSource.sizeBytes :
                          knowledgeSource.name;
    
    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(knowledgeSource)
      .where(whereCombined);

    // Get sources
    const sources = await db
      .select()
      .from(knowledgeSource)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: sources as KnowledgeSource[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error: any) {
    console.error("Get knowledge sources error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب مصادر المعرفة",
    };
  }
}

/**
 * Get single knowledge source
 */
export async function getKnowledgeSource(id: string) {
  try {
    const user = await getAuthUser();

    const [source] = await db
      .select()
      .from(knowledgeSource)
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, user.id)))
      .limit(1);

    if (!source) {
      return {
        success: false,
        error: "مصدر المعرفة غير موجود",
      };
    }

    return {
      success: true,
      data: source as KnowledgeSource,
    };
  } catch (error: any) {
    console.error("Get knowledge source error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب مصدر المعرفة",
    };
  }
}

/**
 * Create new knowledge source
 */
export async function createKnowledgeSource(data: CreateKnowledgeSourceData) {
  try {
    const user = await getAuthUser();

    if (!data.name || data.name.trim() === "") {
      return {
        success: false,
        error: "اسم مصدر المعرفة مطلوب",
      };
    }

    const [newSource] = await db
      .insert(knowledgeSource)
      .values({
        userId: user.id,
        type: data.type,
        name: data.name,
        content: data.content || null,
        fileUrl: data.fileUrl || null,
        metadata: data.metadata || null,
        sizeBytes: data.sizeBytes || null,
      })
      .returning();

    return {
      success: true,
      message: "تم إضافة مصدر المعرفة بنجاح",
      data: newSource as KnowledgeSource,
    };
  } catch (error: any) {
    console.error("Create knowledge source error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء إضافة مصدر المعرفة",
    };
  }
}

/**
 * Update knowledge source
 */
export async function updateKnowledgeSource(id: string, data: UpdateKnowledgeSourceData) {
  try {
    const user = await getAuthUser();

    const [existingSource] = await db
      .select()
      .from(knowledgeSource)
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, user.id)))
      .limit(1);

    if (!existingSource) {
      return {
        success: false,
        error: "مصدر المعرفة غير موجود",
      };
    }

    const [updatedSource] = await db
      .update(knowledgeSource)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(knowledgeSource.id, id))
      .returning();

    return {
      success: true,
      message: "تم تحديث مصدر المعرفة بنجاح",
      data: updatedSource as KnowledgeSource,
    };
  } catch (error: any) {
    console.error("Update knowledge source error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث مصدر المعرفة",
    };
  }
}

/**
 * Delete knowledge source
 */
export async function deleteKnowledgeSource(id: string) {
  try {
    const user = await getAuthUser();

    const [existingSource] = await db
      .select()
      .from(knowledgeSource)
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, user.id)))
      .limit(1);

    if (!existingSource) {
      return {
        success: false,
        error: "مصدر المعرفة غير موجود",
      };
    }

    await db.delete(knowledgeSource).where(eq(knowledgeSource.id, id));

    return {
      success: true,
      message: "تم حذف مصدر المعرفة بنجاح",
    };
  } catch (error: any) {
    console.error("Delete knowledge source error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حذف مصدر المعرفة",
    };
  }
}
