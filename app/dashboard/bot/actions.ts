"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { botService } from "./services/bot-service";
import type {
  UpdateBotSettingData,
  CreateKnowledgeSourceData,
  UpdateKnowledgeSourceData,
  KnowledgeSourceListParams,
  BotTestRequest,
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
    const settings = await botService.getSettings(user.id);
    return { success: true, data: settings };
  } catch (error: any) {
    console.error("Get bot settings error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء جلب إعدادات البوت" };
  }
}

/**
 * Update bot settings
 */
export async function updateBotSettings(data: UpdateBotSettingData) {
  try {
    const user = await getAuthUser();
    const settings = await botService.updateSettings(user.id, data);
    return { success: true, message: "تم تحديث إعدادات البوت بنجاح", data: settings };
  } catch (error: any) {
    console.error("Update bot settings error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء تحديث إعدادات البوت" };
  }
}

/**
 * Reset bot settings to defaults
 */
export async function resetBotSettings() {
  try {
    const user = await getAuthUser();
    const settings = await botService.resetSettings(user.id);
    return { success: true, message: "تم إعادة تعيين الإعدادات بنجاح", data: settings };
  } catch (error: any) {
    console.error("Reset bot settings error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء إعادة تعيين الإعدادات" };
  }
}

/**
 * Test bot with a sample message
 */
export async function testBotResponse(request: BotTestRequest) {
  try {
    const user = await getAuthUser();
    const response = await botService.testResponse(user.id, request);
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Test bot response error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء اختبار البوت" };
  }
}

/**
 * Get prompt history for a bot
 */
export async function getPromptHistory() {
  try {
    const user = await getAuthUser();
    const history = await botService.getPromptHistory(user.id);
    return { success: true, data: history };
  } catch (error: any) {
    console.error("Get prompt history error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء جلب سجل التعديلات" };
  }
}

/**
 * Get list of knowledge sources
 */
export async function getKnowledgeSources(params: KnowledgeSourceListParams = {}) {
  try {
    const user = await getAuthUser();
    const result = await botService.getKnowledgeSources(user.id, params);
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Get knowledge sources error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء جلب مصادر المعرفة" };
  }
}

/**
 * Get single knowledge source
 */
export async function getKnowledgeSource(id: string) {
  try {
    const user = await getAuthUser();
    const source = await botService.getKnowledgeSource(user.id, id);
    if (!source) return { success: false, error: "مصدر المعرفة غير موجود" };
    return { success: true, data: source };
  } catch (error: any) {
    console.error("Get knowledge source error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء جلب مصدر المعرفة" };
  }
}

/**
 * Create new knowledge source
 */
export async function createKnowledgeSource(data: CreateKnowledgeSourceData) {
  try {
    const user = await getAuthUser();
    if (!data.name || data.name.trim() === "") return { success: false, error: "اسم مصدر المعرفة مطلوب" };
    const source = await botService.createKnowledgeSource(user.id, data);
    return { success: true, message: "تم إضافة مصدر المعرفة بنجاح", data: source };
  } catch (error: any) {
    console.error("Create knowledge source error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء إضافة مصدر المعرفة" };
  }
}

/**
 * Update knowledge source
 */
export async function updateKnowledgeSource(id: string, data: UpdateKnowledgeSourceData) {
  try {
    const user = await getAuthUser();
    const source = await botService.updateKnowledgeSource(user.id, id, data);
    if (!source) return { success: false, error: "مصدر المعرفة غير موجود" };
    return { success: true, message: "تم تحديث مصدر المعرفة بنجاح", data: source };
  } catch (error: any) {
    console.error("Update knowledge source error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء تحديث مصدر المعرفة" };
  }
}

/**
 * Delete knowledge source
 */
export async function deleteKnowledgeSource(id: string) {
  try {
    const user = await getAuthUser();
    const success = await botService.deleteKnowledgeSource(user.id, id);
    if (!success) return { success: false, error: "مصدر المعرفة غير موجود" };
    return { success: true, message: "تم حذف مصدر المعرفة بنجاح" };
  } catch (error: any) {
    console.error("Delete knowledge source error:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حذف مصدر المعرفة" };
  }
}

/**
 * Improves the bot's system prompt using AI
 */
export async function improveBotPrompt(currentPrompt: string, context?: { name?: string, tone?: string, metadata?: string }) {
  try {
    const user = await getAuthUser();
    const improvedPrompt = await botService.improvePrompt(user.id, currentPrompt, context);
    return { success: true, data: improvedPrompt };
  } catch (error: any) {
    console.error("Improve prompt error:", error);
    return { success: false, error: error.message || "Failed to improve prompt" };
  }
}
