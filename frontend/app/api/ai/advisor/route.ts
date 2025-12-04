// app/api/ai/advisor/route.ts
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      messages,
      accountData,
      analyticsData,
      platformData,
      topPosts,
      audienceInsights,
      healthScores,
      recommendations,
      postingOptimization,
      locale = "en",
    }: {
      messages: UIMessage[];
      accountData?: any;
      analyticsData?: any;
      platformData?: any[];
      topPosts?: any[];
      audienceInsights?: any;
      healthScores?: any[];
      recommendations?: any[];
      postingOptimization?: any[];
      locale?: string;
    } = await request.json();

    // Defensive guard – useChat should always send messages,
    // but if something goes wrong we avoid crashing.
    const safeMessages = Array.isArray(messages) ? messages : [];

    // Simple telemetry log (optional)
    console.log("AI advisor request:", {
      hasMessages: safeMessages.length > 0,
      hasAccountData: !!accountData,
      hasAnalyticsData: !!analyticsData,
      platformCount: platformData?.length ?? 0,
      topPostsCount: topPosts?.length ?? 0,
      hasAudienceInsights: !!audienceInsights,
      healthScoresCount: healthScores?.length ?? 0,
      recommendationsCount: recommendations?.length ?? 0,
      postingOptimizationCount: postingOptimization?.length ?? 0,
      locale,
    });

    // -----------------------------------------------------------------------
    // Build rich context from analytics
    // -----------------------------------------------------------------------
    const contextParts: string[] = [];

    if (accountData) {
      contextParts.push(
        `Account Info:`,
        `- Platform: ${accountData.platform || "unknown"}`,
        `- Username: @${accountData.username || "unknown"}`,
        `- Followers: ${accountData.followersCount ?? "N/A"}`,
      );
    }

    if (analyticsData) {
      contextParts.push(
        `\nAnalytics Overview:`,
        `- Total Engagement: ${analyticsData.totalEngagement ?? 0}`,
        `- Total Reach: ${analyticsData.totalReach ?? 0}`,
        `- New Followers: ${analyticsData.newFollowers ?? 0}`,
        `- Avg Engagement Rate: ${analyticsData.avgEngagementRate ?? 0}%`,
        `- Engagement Change: ${
          analyticsData.engagementChange > 0 ? "+" : ""
        }${analyticsData.engagementChange ?? 0}%`,
        `- Reach Change: ${
          analyticsData.reachChange > 0 ? "+" : ""
        }${analyticsData.reachChange ?? 0}%`,
        `- Followers Change: ${
          analyticsData.followersChange > 0 ? "+" : ""
        }${analyticsData.followersChange ?? 0}%`,
      );
    }

    if (platformData && platformData.length > 0) {
      contextParts.push(`\nPlatform Performance:`);
      for (const p of platformData) {
        contextParts.push(
          `- ${p.platform}: ${p.posts ?? 0} posts, ${p.engagement ?? 0} total engagement, ${p.growth > 0 ? "+" : ""}${p.growth ?? 0}% growth, reach: ${p.reach ?? p.impressions ?? 0}`,
        );
      }
    }

    if (audienceInsights) {
      contextParts.push(`\nAudience Insights:`);
      contextParts.push(
        `- Total Followers: ${audienceInsights.totalFollowers ?? 0}`,
        `- Total Reach (period): ${audienceInsights.totalReach ?? 0}`,
      );

      if (audienceInsights.demographics) {
        const demo = audienceInsights.demographics;
        if (demo.ageGroups?.length) {
          const topAge = demo.ageGroups
            .slice()
            .sort(
              (a: any, b: any) => (b.percentage ?? 0) - (a.percentage ?? 0),
            )[0];
          if (topAge) {
            contextParts.push(
              `- Top Age Group: ${topAge.range} (${topAge.percentage}%)`,
            );
          }
        }
        if (demo.topLocations?.length) {
          const topLoc = demo.topLocations
            .slice()
            .sort(
              (a: any, b: any) => (b.percentage ?? 0) - (a.percentage ?? 0),
            )[0];
          if (topLoc) {
            contextParts.push(
              `- Top Location: ${topLoc.country}${
                topLoc.city ? `, ${topLoc.city}` : ""
              } (${topLoc.percentage}%)`,
            );
          }
        }
      }
    }

    if (topPosts && topPosts.length > 0) {
      contextParts.push(`\nTop Performing Posts:`);
      for (let i = 0; i < topPosts.length; i++) {
        const post = topPosts[i];
        const likes = post.likes ?? 0;
        const comments = post.comments ?? 0;
        const shares = post.shares ?? 0;
        const saves = post.saves ?? 0;
        const engagement = likes + comments + shares + saves;
        const snippet =
          typeof post.content === "string"
            ? post.content.slice(0, 80).replace(/\s+/g, " ")
            : "";

        contextParts.push(
          `${i + 1}. Platform: ${post.platform || "unknown"}, Engagement: ${
            engagement
          }, Reach: ${post.reach ?? post.impressions ?? 0}, Post: "${snippet}..."`,
        );
      }
    }

    if (healthScores && healthScores.length > 0) {
      contextParts.push(`\nPlatform Health Scores:`);
      for (const s of healthScores) {
        contextParts.push(
          `- ${s.platform}: overall ${s.overallScore}/100 (contentQuality: ${s.metrics?.contentQuality ?? 0}, engagementHealth: ${s.metrics?.engagementHealth ?? 0})`,
        );
      }
    }

    if (recommendations && recommendations.length > 0) {
      contextParts.push(`\nExisting Recommendations Snapshot:`);
      for (let i = 0; i < Math.min(recommendations.length, 5); i++) {
        const r = recommendations[i];
        contextParts.push(
          `${i + 1}. [${r.priority?.toUpperCase?.() ?? "MEDIUM"}] ${
            r.title
          } – expected engagement +${r.expectedImpact?.engagementIncrease ?? 0}%`,
        );
      }
    }

    if (postingOptimization && postingOptimization.length > 0) {
      const opt = postingOptimization[0];
      contextParts.push(`\nPosting Optimization:`);
      contextParts.push(
        `- Platform: ${opt.platform}`,
        `- Recommended frequency: ${opt.optimalFrequency?.daily ?? 0} posts/day (${opt.optimalFrequency?.weekly ?? 0} per week)`,
      );
      if (opt.bestPostingTimes?.length) {
        const best = opt.bestPostingTimes[0];
        contextParts.push(
          `- Example best time: dayOfWeek ${best.dayOfWeek}, hour ${best.hour} (${best.timezone}), expected engagement ${best.expectedEngagement}/100`,
        );
      }
    }

    // -----------------------------------------------------------------------
    // Handle "no analytics yet" scenario
    // -----------------------------------------------------------------------
    const hasAnyAnalytics =
      !!analyticsData ||
      (platformData && platformData.length > 0) ||
      (topPosts && topPosts.length > 0) ||
      !!audienceInsights;

    const newAccountHint = hasAnyAnalytics
      ? ""
      : `
The user appears to be NEW or has LITTLE/NO analytics data yet.
IMPORTANT:
- Do NOT ask the user to provide metrics or extra numbers.
- Assume analytics are not yet available.
- Give beginner-friendly, practical guidance on how to start growing:
  - what to post,
  - how often to post,
  - how to get first followers and engagement,
  - example content ideas for their niche (if they mention it).
- Always sound confident and proactive, like a real advisor who already knows they are starting from zero.
`;

    // -----------------------------------------------------------------------
    // System prompt
    // -----------------------------------------------------------------------
    const systemPrompt = `You are an expert social media marketing advisor and data analyst. 
You help users optimize their social media strategy based on their analytics data and current account status.

Current User Data (if available):
${contextParts.join("\n") || "No analytics data available yet."}

${newAccountHint}

Your role:
- Provide actionable insights based on the available analytics data.
- Suggest optimal posting times, formats, and content strategies.
- Identify trends in engagement and performance when data exists.
- Recommend improvements for underperforming content.
- Suggest content ideas based on top-performing posts when available.
- Analyze audience behavior and engagement patterns if audience data exists.
- Provide platform-specific advice (Twitter/X, Instagram, LinkedIn, TikTok).
- If there is little or no data, focus on high-impact best practices and step-by-step growth plans.
- Never ask the user for raw numbers or extra stats; assume everything you need is already in the context.
${
  locale === "ar"
    ? "- If the user writes in Arabic, respond fully in natural, clear Arabic."
    : ""
}

Guidelines:
- Use specific numbers from the analytics data when you have them.
- Compare performance across platforms when relevant.
- Highlight both strengths and areas for improvement.
- Provide 2–3 clear, practical recommendations per response.
- Be encouraging, confident, and constructive in your feedback.`;

    // -----------------------------------------------------------------------
    // Call model
    // -----------------------------------------------------------------------
    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: convertToModelMessages(safeMessages),
      temperature: 0.7,
    });

    // Standard streaming response for ai-sdk + useChat
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
