import { db } from "@/lib/db";
import { botSetting, knowledgeSource, botPromptHistory } from "@/lib/db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import { AIModel } from "@/lib/ai/ai-model";
import { buildBotSystemPrompt } from "@/lib/ai/bot-utils";
import { jsonToToon, toonToJson } from "../utils/toon";
import type {
  BotSetting as BotSettingType,
  UpdateBotSettingData,
  KnowledgeSource as KnowledgeSourceType,
  CreateKnowledgeSourceData,
  UpdateKnowledgeSourceData,
  KnowledgeSourceListParams,
  BotTestRequest,
  BotTestResponse,
  BotPromptHistory as BotPromptHistoryType
} from "@/types/bot";

export class BotService {
  /**
   * Get bot settings for a user
   */
  async getSettings(userId: string): Promise<BotSettingType> {
    const [settings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.userId, userId))
      .limit(1);

    if (!settings) {
      const [newSettings] = await db
        .insert(botSetting)
        .values({
          userId,
          name: "المساعد الذكي",
          tone: "friendly",
          systemPrompt: jsonToToon({ prompt: "أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية." }),
          isActive: true,
          aiModel: "z-ai/glm-4.5-air:free",
          aiProvider: "openrouter",
        })
        .returning();
      return newSettings as BotSettingType;
    }

    // Decode systemPrompt from TOON back to JSON/Text for UI/Internal use
    if (settings.systemPrompt) {
      const decoded = toonToJson(settings.systemPrompt);
      settings.systemPrompt = (typeof decoded === 'object' && decoded !== null && 'prompt' in decoded) 
        ? decoded.prompt 
        : (typeof decoded === 'string' ? decoded : settings.systemPrompt);
    }

    return settings as BotSettingType;
  }

  /**
   * Get bot settings by bot UUID (Public API)
   */
  async getSettingsById(botId: string): Promise<BotSettingType | null> {
    const [settings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.id, botId))
      .limit(1);

    if (!settings) return null;

    if (settings.systemPrompt) {
      const decoded = toonToJson(settings.systemPrompt);
      settings.systemPrompt = (typeof decoded === 'object' && decoded !== null && 'prompt' in decoded)
        ? decoded.prompt
        : (typeof decoded === 'string' ? decoded : settings.systemPrompt);
    }

    return settings as BotSettingType;
  }

  /**
   * Update bot settings
   */
  async updateSettings(userId: string, data: UpdateBotSettingData): Promise<BotSettingType> {
    const [existingSettings] = await db
      .select()
      .from(botSetting)
      .where(eq(botSetting.userId, userId))
      .limit(1);

    if (!existingSettings) {
      const [newSettings] = await db
        .insert(botSetting)
        .values({
          userId,
          ...data,
          lastTunedAt: data.systemPrompt ? new Date() : undefined
        })
        .returning();

      if (data.systemPrompt) {
        await db.insert(botPromptHistory).values({
          botSettingId: newSettings.id,
          userId: userId,
          prompt: data.systemPrompt,
          tone: data.tone,
          name: data.name,
          changeSummary: "الإعداد الأولي للبوت"
        });
      }
      return newSettings as BotSettingType;
    }

    const hasPromptChanged = data.systemPrompt && data.systemPrompt !== existingSettings.systemPrompt;
    
    // Prepare data for saving - Force structured TOON for prompt consistency
    const dataToSave = { ...data };
    if (dataToSave.systemPrompt) {
      dataToSave.systemPrompt = jsonToToon({ prompt: data.systemPrompt });
    }

    const [updatedSettings] = await db
      .update(botSetting)
      .set({
        ...dataToSave,
        lastTunedAt: hasPromptChanged ? new Date() : existingSettings.lastTunedAt,
        updatedAt: new Date(),
      })
      .where(eq(botSetting.userId, userId))
      .returning();

    if (hasPromptChanged || (data.tone && data.tone !== existingSettings.tone) || (data.name && data.name !== existingSettings.name)) {
      // Store history as TOON with full context for traceability
      const promptToStore = jsonToToon({
        prompt: data.systemPrompt || existingSettings.systemPrompt || "",
        tone: data.tone || existingSettings.tone || "friendly",
        name: data.name || existingSettings.name || ""
      });

      await db.insert(botPromptHistory).values({
        botSettingId: existingSettings.id,
        userId: userId,
        prompt: promptToStore,
        tone: data.tone || existingSettings.tone || "friendly",
        name: data.name || existingSettings.name || "",
        changeSummary: hasPromptChanged ? "تعديل في تعليمات البوت" : "تعديل في شخصية البوت"
      });
    }

    // Decode before returning to UI
    if (updatedSettings.systemPrompt) {
      const decoded = toonToJson(updatedSettings.systemPrompt);
      updatedSettings.systemPrompt = (typeof decoded === 'object' && decoded !== null && 'prompt' in decoded)
        ? decoded.prompt
        : (typeof decoded === 'string' ? decoded : updatedSettings.systemPrompt);
    }

    return updatedSettings as BotSettingType;
  }

  /**
   * Reset bot settings to defaults
   */
  async resetSettings(userId: string): Promise<BotSettingType> {
    const [resetSettings] = await db
      .update(botSetting)
      .set({
        name: "المساعد الذكي",
        tone: "friendly",
        systemPrompt: jsonToToon({ prompt: "أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية." }),
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(botSetting.userId, userId))
      .returning();

    if (resetSettings.systemPrompt) {
      const decoded = toonToJson(resetSettings.systemPrompt);
      resetSettings.systemPrompt = (typeof decoded === 'object' && decoded !== null && 'prompt' in decoded)
        ? decoded.prompt
        : (typeof decoded === 'string' ? decoded : resetSettings.systemPrompt);
    }

    return resetSettings as BotSettingType;
  }

  /**
   * Test bot response
   */
  async testResponse(userId: string, request: BotTestRequest): Promise<BotTestResponse> {
    const startTime = Date.now();
    const settings = await this.getSettings(userId);

    const sources = await db
      .select({
        name: knowledgeSource.name,
        type: knowledgeSource.type,
        content: knowledgeSource.content,
        fileUrl: knowledgeSource.fileUrl
      })
      .from(knowledgeSource)
      .where(eq(knowledgeSource.userId, userId));

    const knowledgeItems = sources.map(s => ({
      name: s.name,
      type: s.type,
      content: (s.type === 'text' && s.content) ? toonToJson(s.content) : (s.content || s.fileUrl)
    }));

    const systemPrompt = buildBotSystemPrompt(
      settings.systemPrompt,
      settings.tone,
      knowledgeItems
    );

    const apiKey = settings.aiApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("مفتاح API غير متوفر. يرجى إعداده في الإعدادات.");
    }

    const aiModel = new AIModel({
      apiKey: apiKey,
      provider: settings.aiProvider || 'openrouter',
      model: settings.aiModel || 'z-ai/glm-4.5-air:free',
      systemPrompt: systemPrompt,
    });

    if (request.history && request.history.length > 0) {
      request.history.forEach(msg => {
        if (msg.role === 'user') {
          aiModel.addUserMessage(msg.text);
        } else {
          aiModel.addAssistantMessage(msg.text);
        }
      });
    }

    const aiResponse = await aiModel.addUserMessage(request.message).send();
    const took = Date.now() - startTime;

    return {
      response: aiResponse.content,
      took,
    };
  }

  /**
   * Stream bot response (Public API)
   */
  async *streamResponse(botId: string, message: string, history?: { role: 'user' | 'ai'; text: string }[]) {
    const settings = await this.getSettingsById(botId);
    if (!settings || !settings.isActive) {
      throw new Error("البوت غير موجود أو معطل.");
    }

    const sources = await db
      .select({
        name: knowledgeSource.name,
        type: knowledgeSource.type,
        content: knowledgeSource.content,
        fileUrl: knowledgeSource.fileUrl
      })
      .from(knowledgeSource)
      .where(eq(knowledgeSource.userId, settings.userId));

    const knowledgeItems = sources.map(s => ({
      name: s.name,
      type: s.type,
      content: (s.type === 'text' && s.content) ? toonToJson(s.content) : (s.content || s.fileUrl)
    }));

    const systemPrompt = buildBotSystemPrompt(
      settings.systemPrompt,
      settings.tone,
      knowledgeItems
    );

    const apiKey = settings.aiApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("مفتاح API غير متوفر.");
    }

    const aiModel = new AIModel({
      apiKey: apiKey,
      provider: settings.aiProvider || 'openrouter',
      model: settings.aiModel || 'z-ai/glm-4.5-air:free',
      systemPrompt: systemPrompt,
    });

    if (history && history.length > 0) {
      history.forEach(msg => {
        if (msg.role === 'user') {
          aiModel.addUserMessage(msg.text);
        } else {
          aiModel.addAssistantMessage(msg.text);
        }
      });
    }

    aiModel.addUserMessage(message);

    for await (const chunk of aiModel.stream()) {
      yield chunk;
    }
  }

  /**
   * Get prompt history
   */
  async getPromptHistory(userId: string): Promise<BotPromptHistoryType[]> {
    const history = await db
      .select()
      .from(botPromptHistory)
      .where(eq(botPromptHistory.userId, userId))
      .orderBy(desc(botPromptHistory.createdAt))
      .limit(20);

    return history.map(item => {
      const decoded = item.prompt ? toonToJson(item.prompt) : null;
      const promptText = (typeof decoded === 'object' && decoded !== null && 'prompt' in decoded)
        ? decoded.prompt
        : (typeof decoded === 'string' ? decoded : (item.prompt || ""));
      
      return {
        ...item,
        prompt: promptText
      };
    }) as BotPromptHistoryType[];
  }

  /**
   * Knowledge Source Operations
   */
  async getKnowledgeSources(userId: string, params: KnowledgeSourceListParams = {}) {
    const {
      page = 1,
      limit = 10,
      type,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;
    const whereConditions = [eq(knowledgeSource.userId, userId)];

    if (type) whereConditions.push(eq(knowledgeSource.type, type));
    if (search) whereConditions.push(ilike(knowledgeSource.name, `%${search}%`));

    const whereCombined = and(...whereConditions);
    const orderByColumn = sortBy === "createdAt" ? knowledgeSource.createdAt :
                          sortBy === "sizeBytes" ? knowledgeSource.sizeBytes :
                          knowledgeSource.name;
    
    const orderByClause = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(knowledgeSource)
      .where(whereCombined);

    const sources = await db
      .select()
      .from(knowledgeSource)
      .where(whereCombined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const decodedSources = sources.map(source => {
      if (source.type === 'text' && source.content) {
        return { ...source, content: toonToJson(source.content) };
      }
      return source;
    });

    return {
      sources: decodedSources as KnowledgeSourceType[],
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  }

  async getKnowledgeSource(userId: string, id: string): Promise<KnowledgeSourceType | null> {
    const [source] = await db
      .select()
      .from(knowledgeSource)
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, userId)))
      .limit(1);
    return (source as KnowledgeSourceType) || null;
  }

  async createKnowledgeSource(userId: string, data: CreateKnowledgeSourceData): Promise<KnowledgeSourceType> {
    // Encode content to TOON if it's text
    let finalContent = data.content || null;
    if (data.type === 'text' && finalContent) {
      finalContent = jsonToToon(finalContent);
    }

    const [newSource] = await db
      .insert(knowledgeSource)
      .values({
        userId,
        type: data.type,
        name: data.name,
        content: finalContent,
        fileUrl: data.fileUrl || null,
        metadata: data.metadata || null,
        sizeBytes: data.sizeBytes || null,
      })
      .returning();
    
    // Decode before returning
    const returnedSource = { ...newSource };
    if (returnedSource.content && returnedSource.type === 'text') {
      returnedSource.content = toonToJson(returnedSource.content);
    }
    
    return returnedSource as KnowledgeSourceType;
  }

  async updateKnowledgeSource(userId: string, id: string, data: UpdateKnowledgeSourceData): Promise<KnowledgeSourceType | null> {
    const dataToSave = { ...data };
    if (dataToSave.content) {
      // We only encode if it's a text type or we know it's meant to be TOON
      // For now, let's check the existing source type if not provided in data
      let shouldEncode = data.type === 'text';
      if (data.type === undefined) {
        const existing = await this.getKnowledgeSource(userId, id);
        shouldEncode = existing?.type === 'text';
      }

      if (shouldEncode) {
        dataToSave.content = jsonToToon(dataToSave.content);
      }
    }

    const [updatedSource] = await db
      .update(knowledgeSource)
      .set({
        ...dataToSave,
        updatedAt: new Date(),
      })
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, userId)))
      .returning();
    
    if (!updatedSource) return null;

    const returnedSource = { ...updatedSource };
    if (returnedSource.content && returnedSource.type === 'text') {
      returnedSource.content = toonToJson(returnedSource.content);
    }
    
    return returnedSource as KnowledgeSourceType;
  }

  async deleteKnowledgeSource(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(knowledgeSource)
      .where(and(eq(knowledgeSource.id, id), eq(knowledgeSource.userId, userId)))
      .returning();
    return result.length > 0;
  }

  /**
   * AI Prompt Improvement
   */
  async improvePrompt(userId: string, currentPrompt: string, context?: { name?: string, tone?: string, metadata?: string }): Promise<string> {
    const settings = await this.getSettings(userId);
    const ai = new AIModel({
      apiKey: settings?.aiApiKey || process.env.OPENROUTER_API_KEY || "",
      provider: settings?.aiProvider || "openrouter",
      model: settings?.aiModel === "auto" ? "z-ai/glm-4.5-air:free" : settings?.aiModel || "z-ai/glm-4.5-air:free",
    });

    const contextString = context ? `
تم استقاء المعلومات التالية عن البوت:
- الاسم: ${context.name || 'غير محدد'}
- النبرة المطلوبة: ${context.tone || 'ودودة'}
- سياق إضافي: ${context.metadata || 'لا يوجد'}
` : '';

    const completion = await ai
      .setSystemPrompt("أنت خبير في هندسة الأوامر (Prompt Engineering). مهمتك هي تحسين طلبات النظام (System Prompts) لبوتات الدردشة لجعلها أكثر دقة، احترافية، وفعالية. حافظ على اللغة العربية.")
      .addUserMessage(`قم بتحسين هذا المطلب ليكون أكثر وضوحاً وقوة. ${contextString} \n\nالمطلب المراد تحسينه: \n\n${currentPrompt}\n\nأعد المطلب المحسن فقط دون أي مقدمات أو شروحات. استلهم من السياق وادمج نبرة الصوت في التعليمات.`)
      .send({ temperature: 0.5 });

    return completion.content.trim();
  }
}

export const botService = new BotService();
