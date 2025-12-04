"use server";

import { generateText } from "ai";

export type AIContentResult = {
  success: boolean;
  content?: string;
  hashtags?: string;
  error?: string;
};

export async function generateAIContent(
  prompt: string,
  platform?: string,
  language?: string,
  tone?: string,
): Promise<AIContentResult> {
  try {
    if (!prompt || prompt.trim().length === 0) {
      return {
        success: false,
        error: "Prompt is required",
      };
    }

    const systemPrompt = buildSystemPrompt(platform, language, tone);

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: `Generate social media content based on this request: ${prompt}`,
    });

    // Parse the response
    const contentMatch = text.match(/Content:\s*(.+?)(?=\nHashtags:|$)/);
    const hashtagsMatch = text.match(/Hashtags:\s*(.+?)$/);

    const content = contentMatch ? contentMatch[1].trim() : text;
    const hashtags = hashtagsMatch ? hashtagsMatch[1].trim() : "";

    return {
      success: true,
      content,
      hashtags,
    };
  } catch (error) {
    console.error("[v0] AI generation error:", error);
    return {
      success: false,
      error: "Failed to generate content. Please try again.",
    };
  }
}

function buildSystemPrompt(
  platform?: string,
  language?: string,
  tone?: string,
): string {
  let systemPrompt = `You are an expert social media content creator. Generate engaging, authentic content that resonates with audiences.`;

  if (language === "ar") {
    systemPrompt += `\n\nIMPORTANT: Generate content in Arabic language only. Use natural, conversational Arabic that feels authentic.`;
  } else {
    systemPrompt += `\n\nGenerate content in English.`;
  }

  if (tone) {
    systemPrompt += `\n\nTone: ${tone}`;
  }

  if (platform) {
    const platformGuidelines: Record<string, string> = {
      twitter:
        "Keep it concise and impactful (280 characters max). Use 1-2 relevant hashtags.",
      instagram:
        "Create engaging captions with emojis. Include 5-10 relevant hashtags at the end.",
      facebook:
        "Write conversational, community-focused content. Can be longer and more detailed.",
      linkedin:
        "Professional tone, value-driven content. Focus on insights and expertise.",
      tiktok:
        "Fun, trendy, and attention-grabbing. Use popular hashtags and challenges.",
    };

    const guideline = platformGuidelines[platform.toLowerCase()];
    if (guideline) {
      systemPrompt += `\n\nPlatform-specific guidelines for ${platform}: ${guideline}`;
    }
  }

  systemPrompt += `\n\nFormat your response as:
Content: [The main post content]
Hashtags: [Suggested hashtags separated by spaces]

Keep it natural and engaging.`;

  return systemPrompt;
}
