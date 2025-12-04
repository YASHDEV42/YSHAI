import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt, platform, language, tone } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response("Prompt is required", { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(platform, language, tone);

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: `Generate social media content based on this request: ${prompt}`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI generation error:", error);
    return new Response("Failed to generate content", { status: 500 });
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
