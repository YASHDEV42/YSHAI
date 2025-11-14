import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { AIUsageLog } from 'src/entities/ai-usage-log.entity';
import { User } from 'src/entities/user.entity';
import { AiUsageSummaryDto } from './dto/ai-usage-summary.dto';
import {
  AiUsageBreakdownDto,
  AiUsageByModelDto,
} from './dto/ai-usage-breakdown.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model: GenerativeModel;

  constructor(private readonly em: EntityManager) {
    const apiKey = process.env.GEMINI_API_KEY || ' ';
    //if (!apiKey) {
    // throw new Error('GEMINI_API_KEY is not set');
    //}

    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    });
  }

  async generateCaption(
    userId: number,
    prompt: string,
    tone?: string,
    count = 1,
  ): Promise<string> {
    const tonePrompt = tone ? `بأسلوب ${tone}` : 'بأسلوب ودود وجذاب';
    const numPrompt = count > 1 ? `${count} نصوص` : 'نص واحد';

    const content = `
أنت مساعد تسويقي متخصص في كتابة نصوص عربية جذابة لوسائل التواصل.
اكتب ${numPrompt} لهذا المنتج: "${prompt}"
الوصف يجب أن يكون قصيرًا (أقل من 100 كلمة)، ${tonePrompt}، ومناسب للجمهور الخليجي.
اكتب فقط النصوص دون أي تفسيرات إضافية.
    `.trim();

    const result = await this.callGemini(content);

    const inputTokens = this.estimateTokens(content);
    const outputTokens = this.estimateTokens(result);

    await this.logUsage({
      userId,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      inputTokens,
      outputTokens,
      costUsd: 0,
      metadata: { feature: 'caption', estimated: true },
    });

    return result;
  }

  async generateHashtags(
    userId: number,
    text: string,
    count = 5,
  ): Promise<string> {
    const content = `
قم بإنشاء ${count} وسم (hashtag) باللغة العربية مناسبة لهذا النص:
"${text}"
اكتبها بدون رمز #، وافصل بينها بمسافة.
لا تكتب أي شيء غير الهاشتاقات.
    `.trim();

    const raw = await this.callGemini(content);

    const inputTokens = this.estimateTokens(content);
    const outputTokens = this.estimateTokens(raw);

    await this.logUsage({
      userId,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      inputTokens,
      outputTokens,
      costUsd: 0,
      metadata: { feature: 'hashtags', estimated: true },
    });

    return raw
      .split(/\s+/)
      .map((tag) => `#${tag.trim()}`)
      .filter(Boolean)
      .join(' ');
  }

  async generateAltText(
    userId: number,
    imageUrl: string,
    context?: string,
  ): Promise<string> {
    const content = `
اكتب وصفًا بديلاً (alt text) بالعربية لهذه الصورة:
${imageUrl}
${context ? `السياق: ${context}` : ''}
الوصف يجب أن يكون دقيقًا، قصيرًا (أقل من 125 حرفًا)، ويصف المحتوى المرئي فقط.
    `.trim();

    const result = await this.callGemini(content);

    const inputTokens = this.estimateTokens(content);
    const outputTokens = this.estimateTokens(result);

    await this.logUsage({
      userId,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      inputTokens,
      outputTokens,
      costUsd: 0,
      metadata: { feature: 'alt-text', estimated: true },
    });

    return result;
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);

      const text = result.response.text();

      return text?.trim() || 'تعذر توليد النص.';
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Gemini API call failed: ${error.message}`,
        error.stack,
      );
      return 'تعذر توليد النص. يرجى المحاولة لاحقًا.';
    }
  }

  private estimateTokens(text: string | undefined | null): number {
    if (!text) {
      return 0;
    }
    // Rough heuristic: ~4 chars per token on average
    const chars = text.length;
    return Math.max(1, Math.round(chars / 4));
  }

  private async logUsage(params: {
    userId: number | null;
    model: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const log = new AIUsageLog();
    if (params.userId !== null) {
      log.user = this.em.getReference(User, params.userId);
    }
    log.modelUsed = params.model;
    log.inputTokens = params.inputTokens;
    log.outputTokens = params.outputTokens;
    log.costUsd = params.costUsd;
    log.metadata = params.metadata ?? {};

    await this.em.persistAndFlush(log);
  }

  async getUsageForUser(
    userId: number,
    from?: Date,
    to?: Date,
  ): Promise<{ summary: AiUsageSummaryDto; breakdown: AiUsageBreakdownDto }> {
    const where: Record<string, any> = { user: userId };
    if (from || to) {
      const createdAt: Record<string, Date> = {};
      if (from) {
        createdAt.$gte = from;
      }
      if (to) {
        createdAt.$lte = to;
      }
      where.createdAt = createdAt;
    }

    const logs = await this.em.find(AIUsageLog, where);

    let inputTokens = 0;
    let outputTokens = 0;
    let costUsd = 0;
    const byModelMap = new Map<string, AiUsageByModelDto>();

    for (const l of logs) {
      inputTokens += l.inputTokens;
      outputTokens += l.outputTokens;
      costUsd += l.costUsd;

      const key = l.modelUsed;
      let entry = byModelMap.get(key);
      if (!entry) {
        entry = {
          model: key,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          costUsd: 0,
        };
        byModelMap.set(key, entry);
      }
      entry.inputTokens += l.inputTokens;
      entry.outputTokens += l.outputTokens;
      entry.totalTokens = entry.inputTokens + entry.outputTokens;
      entry.costUsd += l.costUsd;
    }

    const summary: AiUsageSummaryDto = {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUsd,
    };

    const breakdown: AiUsageBreakdownDto = {
      byModel: Array.from(byModelMap.values()),
    };

    return { summary, breakdown };
  }
}
