import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';
import { ModerateTextDto } from './dto/moderate-text.dto';
import { ModerateImageDto } from './dto/moderate-image.dto';
import { ModerateVideoDto } from './dto/moderate-video.dto';
import { ModerationResult } from '../entities/moderation-result.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);
  private readonly model: GenerativeModel | null;

  constructor(private readonly em: EntityManager) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Do not block app startup; allow boot without key (dev/docs). Guard usage in methods.
      this.logger.warn(
        'GEMINI_API_KEY is not set — moderation will run in fallback mode.',
      );
      this.model = null;
    } else {
      const client = new GoogleGenerativeAI(apiKey);
      this.model = client.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      });
    }
  }

  async moderateText({
    text,
    postId,
  }: ModerateTextDto): Promise<ModerationResult> {
    const prompt = `
أنت فلتر محتوى.
قم بتحليل النص وأرجع فقط النتيجة:
- "allowed" = آمن
- "flagged" = يحتاج مراجعة
- "blocked" = غير مسموح
النص: "${text}"
    `.trim();

    let verdict: 'allowed' | 'flagged' | 'blocked' = 'allowed';
    let details: Record<string, any> = {};

    try {
      if (!this.model) {
        throw new Error('Model not configured');
      }
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const normalized = response.text().trim().toLowerCase();

      if (normalized.includes('blocked')) verdict = 'blocked';
      else if (normalized.includes('flagged')) verdict = 'flagged';
      else verdict = 'allowed';

      details = { raw: normalized };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Text moderation failed: ${error.message}`,
        error.stack,
      );
      verdict = 'flagged';
      details = { error: error.message };
    }

    const post = await this.em.findOneOrFail(Post, { id: postId });
    const moderation = this.em.create(ModerationResult, {
      post,
      provider: 'gemini',
      verdict,
      details,
      checkedAt: new Date(),
    });

    await this.em.persistAndFlush(moderation);
    return moderation;
  }

  async moderateImage({ imageUrl, postId }: ModerateImageDto) {
    const post = await this.em.findOneOrFail(Post, { id: postId });
    const moderation = this.em.create(ModerationResult, {
      post,
      provider: 'custom',
      verdict: 'flagged',
      details: { message: 'Image moderation placeholder', imageUrl },
      checkedAt: new Date(),
    });

    await this.em.persistAndFlush(moderation);
    return moderation;
  }

  async moderateVideo({ videoUrl, postId }: ModerateVideoDto) {
    const post = await this.em.findOneOrFail(Post, { id: postId });
    const moderation = this.em.create(ModerationResult, {
      post,
      provider: 'custom',
      verdict: 'flagged',
      details: { message: 'Video moderation placeholder', videoUrl },
      checkedAt: new Date(),
    });

    await this.em.persistAndFlush(moderation);
    return moderation;
  }

  async getReports() {
    return this.em.find(
      ModerationResult,
      {},
      { orderBy: { checkedAt: 'DESC' } },
    );
  }
}
