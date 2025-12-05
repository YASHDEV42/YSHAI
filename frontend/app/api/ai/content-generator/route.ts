import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt, mode, content, platform, language, tone } =
      await req.json();

    const systemPrompt = buildSystemPrompt(mode, platform, language, tone);
    const userPrompt = buildUserPrompt(mode, prompt, content);

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[v0] AI content generator error:", error);
    return new Response("Failed to generate content", { status: 500 });
  }
}

function buildSystemPrompt(
  mode: "generate" | "improve" | "hashtags",
  platform?: string,
  language?: string,
  tone?: string,
): string {
  let systemPrompt = `You are an expert social media content creator.`;

  if (mode === "generate") {
    systemPrompt += ` Generate engaging, authentic content that resonates with audiences.`;
  } else if (mode === "improve") {
    systemPrompt += ` Your task is to improve existing social media content. Make it more engaging, clear, and impactful while maintaining the original message.`;
  } else if (mode === "hashtags") {
    systemPrompt += ` Your task is to generate relevant and trending hashtags for social media content. Provide 5-10 hashtags that are specific, searchable, and aligned with the content.`;
  }

  if (language === "ar") {
    systemPrompt += `\n\nIMPORTANT: Generate content in Arabic language only. Use natural, conversational Arabic that feels authentic.`;
  } else {
    systemPrompt += `\n\nGenerate content in English.`;
  }

  if (tone && mode !== "hashtags") {
    systemPrompt += `\n\nTone: ${tone}`;
  }

  if (platform && mode === "generate") {
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

  if (mode === "generate") {
    systemPrompt += `\n\nReturn ONLY the post content with hashtags naturally integrated. Do not include labels like "Content:" or "Hashtags:".`;
  } else if (mode === "improve") {
    systemPrompt += `\n\nReturn ONLY the improved version of the content. Do not include explanations or labels.`;
  } else if (mode === "hashtags") {
    systemPrompt += `\n\nReturn ONLY the hashtags separated by spaces, without numbering or explanations. Example: #marketing #socialmedia #contentcreation`;
  }

  return systemPrompt;
}

function buildUserPrompt(
  mode: "generate" | "improve" | "hashtags",
  prompt: string,
  content?: string,
): string {
  if (mode === "generate") {
    return `Generate social media content based on this request: ${prompt}`;
  } else if (mode === "improve") {
    const instruction = prompt?.trim()
      ? `Improve this content with focus on: ${prompt}\n\nContent to improve:\n${content}`
      : `Improve this content:\n${content}`;
    return instruction;
  } else if (mode === "hashtags") {
    const instruction = prompt?.trim()
      ? `Generate hashtags for this content with theme: ${prompt}\n\nContent:\n${content}`
      : `Generate relevant hashtags for this content:\n${content}`;
    return instruction;
  }

  return prompt;
}
