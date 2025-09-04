import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    });
  }

  async generateCaption(
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

    return this.callGemini(content);
  }

  async generateHashtags(text: string, count = 5): Promise<string> {
    const content = `
قم بإنشاء ${count} وسم (hashtag) باللغة العربية مناسبة لهذا النص:
"${text}"
اكتبها بدون رمز #، وافصل بينها بمسافة.
لا تكتب أي شيء غير الهاشتاقات.
    `.trim();

    const raw = await this.callGemini(content);
    return raw
      .split(/\s+/)
      .map((tag) => `#${tag.trim()}`)
      .filter(Boolean)
      .join(' ');
  }

  async generateAltText(imageUrl: string, context?: string): Promise<string> {
    const content = `
اكتب وصفًا بديلاً (alt text) بالعربية لهذه الصورة:
${imageUrl}
${context ? `السياق: ${context}` : ''}
الوصف يجب أن يكون دقيقًا، قصيرًا (أقل من 125 حرفًا)، ويصف المحتوى المرئي فقط.
    `.trim();

    return this.callGemini(content);
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
}
