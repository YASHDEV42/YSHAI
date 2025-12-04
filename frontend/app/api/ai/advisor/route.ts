import { convertToModelMessages, streamText, UIMessage } from "ai";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      messages,
      accountData,
      analyticsData,
      platformData,
      topPosts,
      locale = "en",
    }: {
      messages: UIMessage[];
      accountData?: any;
      analyticsData?: any;
      platformData?: any;
      topPosts?: any;
      locale?: string;
    } = await request.json();
    // Build context from analytics data
    console.log("Received AI advisor request with data:", {
      messages,
      accountData,
      analyticsData,
      platformData,
      topPosts,
      locale,
    });
    const contextParts = [];

    if (accountData) {
      contextParts.push(
        `Platform: ${accountData.platform}`,
        `Username: @${accountData.username}`,
        `Followers: ${accountData.followersCount || "N/A"}`,
      );
    }

    if (analyticsData) {
      contextParts.push(
        `Analytics Overview:`,
        `- Total Engagement: ${analyticsData.totalEngagement}`,
        `- Total Reach: ${analyticsData.totalReach}`,
        `- New Followers: ${analyticsData.newFollowers}`,
        `- Avg Engagement Rate: ${analyticsData.avgEngagementRate}%`,
        `- Engagement Change: ${analyticsData.engagementChange > 0 ? "+" : ""}${analyticsData.engagementChange}%`,
        `- Reach Change: ${analyticsData.reachChange > 0 ? "+" : ""}${analyticsData.reachChange}%`,
        `- Followers Change: ${analyticsData.followersChange > 0 ? "+" : ""}${analyticsData.followersChange}%`,
      );
    }

    if (platformData && platformData.length > 0) {
      contextParts.push(
        `\nPlatform Performance:`,
        ...platformData.map(
          (p: any) =>
            `- ${p.platform}: ${p.posts} posts, ${p.engagement} engagement, ${p.growth > 0 ? "+" : ""}${p.growth}% growth`,
        ),
      );
    }

    if (topPosts && topPosts.length > 0) {
      contextParts.push(
        `\nTop Performing Posts:`,
        ...topPosts.map(
          (post: any, idx: number) =>
            `${idx + 1}. "${post.content?.substring(0, 50)}..." - ${post.engagement} engagements`,
        ),
      );
    }

    const systemPrompt = `You are an expert social media marketing advisor and data analyst. You help users optimize their social media strategy based on their analytics data.

Current User Data:
${contextParts.join("\n")}

Your role:
- Provide actionable insights based on the analytics data
- Suggest optimal posting times and content strategies
- Identify trends in engagement and performance
- Recommend improvements for underperforming content
- Suggest content ideas based on top-performing posts
- Analyze audience behavior and engagement patterns
- Provide platform-specific advice (Twitter/X, Instagram, LinkedIn, TikTok)
- Keep responses concise, practical, and data-driven
${locale === "ar" ? "- Respond in Arabic when the user writes in Arabic" : ""}

Guidelines:
- Use specific numbers from the analytics data when giving advice
- Compare performance across different platforms when relevant
- Highlight both positive trends and areas for improvement
- Provide 2-3 actionable recommendations per response
- Be encouraging and constructive in your feedback`;

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
    });
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("AI Advisor error:", error);

    if (error?.message?.includes("401") || error?.message?.includes("auth")) {
      return new Response(
        JSON.stringify({
          error:
            "AI Gateway authentication required. Please add your AI_GATEWAY_API_KEY in the environment variables.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to generate AI response. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
