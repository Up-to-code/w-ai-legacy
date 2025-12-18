import { jsonToToon } from "@/app/dashboard/bot/utils/toon";

/**
 * Utility functions for AI Bot logic and token management
 */

export interface KnowledgeItem {
    name: string;
    type: string;
    content: string | null;
}

/**
 * Roughly estimate token count for a given string.
 */
export function estimateTokens(text: string | null | undefined): number {
    if (!text) return 0;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).length;
    
    // Heuristic for Arabic/English mix
    const estimate = Math.ceil((charCount / 3) + (wordCount * 0.5));
    return estimate;
}

/**
 * Formats a knowledge source for the system prompt
 */
export function formatKnowledgeSource(item: KnowledgeItem): string {
    if (!item.content) return "";
    return `--- مصدر المعرفة: ${item.name} (${item.type}) ---\n${item.content}\n`;
}

/**
 * Builds the comprehensive system prompt including knowledge base and tone context
 * Refactored to use Structured JSON for superior context understanding
 */
export function buildBotSystemPrompt(
    basePrompt: string | null | undefined, 
    tone: string | null | undefined,
    knowledge: KnowledgeItem[]
): string {
    let finalPrompt = basePrompt || "أنت مساعد ذكي ومفيد.";
    
    // Add Tone context
    const toneInstructions = {
        formal: "يجب أن يكون أسلوبك رسمياً ومهنياً جداً. استخدم الفصحى والكلمات المهذبة.",
        enthusiastic: "يجب أن يكون أسلوبك حماسياً، ودوداً للغاية، ومشجعاً للعميل.",
        friendly: "يجب أن يكون أسلوبك ودوداً، طبيعياً، ومساعداً بذكاء."
    };

    finalPrompt += `\n\n[إرشادات الأسلوب]:\n${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.friendly}`;

    // Add Structured Knowledge Base
    if (knowledge.length > 0) {
        const structuredKnowledge = knowledge.map(k => ({
            source: k.name,
            type: k.type,
            data: k.content
        }));

        finalPrompt += "\n\n[سجل المعلومات المعرفي - TOON]:\n";
        finalPrompt += "```toon\n";
        finalPrompt += jsonToToon(structuredKnowledge);
        finalPrompt += "\n```\n";
        
        finalPrompt += "\n[تعليمات المعالجة]:\n1. استخدم بيانات TOON أعلاه حصرياً للرد.\n2. إذا لم تجد الإجابة، قل «عذراً، ليس لدي معلومات كافية حالياً، هل يمكنني مساعدتك بطريقة أخرى؟».\n3. أجب بطريقة طبيعية وكأنك تمتلك هذه المعلومات، دون الإشارة للملفات أو سجل TOON.\n4. استهدف الردود الموجزة والمباشرة.";
    }
    
    return finalPrompt;
}

/**
 * Max token limits for standard models
 */
export const MAX_CONTEXT_TOKENS = 4000;
