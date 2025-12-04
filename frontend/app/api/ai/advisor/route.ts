import { convertToModelMessages, streamText, UIMessage } from "ai";
import type { NextRequest } from "next/server";

type AdvisorRequestBody = {
  messages: UIMessage[];
  accountData?: {
    platform?: string;
    username?: string;
    followersCount?: number;
  };
  // High-level analytics overview (e.g. getAnalytics / getDetailedAnalytics)
  analyticsData?: any;
  // Platform performance (getPlatformPerformance)
  platformData?: any[];
  // Top posts (getTopPosts or getContentPerformance)
  topPosts?: any[];
  // Audience insights (getAudienceInsights)
  audienceInsights?: any;
  // Platform health scores (getPlatformHealthScores)
  healthScores?: any[];
  // AI recommendations (getContentRecommendations)
  recommendations?: any[];
  // Posting optimization (getPostingOptimization)
  postingOptimization?: any[];
  locale?: string;
};

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
    }: AdvisorRequestBody = await request.json();

    // Log once for debugging
    console.log("AI advisor request:", {
      hasMessages: !!messages?.length,
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

    const contextParts: string[] = [];

    // -----------------------------------------------------------------------
    // Account basics
    // -----------------------------------------------------------------------
    if (accountData) {
      contextParts.push(
        `Account:`,
        `- Platform: ${accountData.platform ?? "N/A"}`,
        `- Username: @${accountData.username ?? "unknown"}`,
        `- Followers: ${accountData.followersCount ?? "N/A"}`,
      );
    }

    // -----------------------------------------------------------------------
    // High-level analytics overview
    // -----------------------------------------------------------------------
    if (analyticsData) {
      contextParts.push(
        ``,
        `Analytics Overview:`,
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

      // If you are passing detailed analytics, surface a few more key metrics
      if (typeof analyticsData.impressions === "number") {
        contextParts.push(
          `- Impressions: ${analyticsData.impressions}`,
          `- Click-through rate: ${analyticsData.clickThroughRate ?? 0}%`,
          `- Virality score: ${analyticsData.virality ?? 0}`,
        );
      }
    }

    // -----------------------------------------------------------------------
    // Platform performance
    // -----------------------------------------------------------------------
    if (platformData && platformData.length > 0) {
      contextParts.push(``, `Platform Performance:`);

      for (const p of platformData) {
        contextParts.push(
          `- ${p.platform}: ${p.posts ?? 0} posts, ${p.engagement ?? 0} engagement, ` +
            `${p.growth > 0 ? "+" : ""}${p.growth ?? 0}% growth, ` +
            `reach: ${p.reach ?? p.impressions ?? 0}, engagement rate: ${
              p.engagementRate ?? 0
            }%`,
        );
      }
    }

    // -----------------------------------------------------------------------
    // Top posts
    // -----------------------------------------------------------------------
    if (topPosts && topPosts.length > 0) {
      contextParts.push(``, `Top Performing Posts:`);

      topPosts.slice(0, 10).forEach((post: any, idx: number) => {
        const snippet = (post.content ?? "").substring(0, 80);
        const engagement =
          post.engagement ??
          (post.likes ?? 0) +
            (post.comments ?? 0) +
            (post.shares ?? 0) +
            (post.saves ?? 0);

        contextParts.push(
          `${idx + 1}. "${snippet}..." - ${engagement} engagements, ` +
            `platform: ${post.platform ?? "N/A"}, ` +
            `reach: ${post.reach ?? post.impressions ?? 0}, ` +
            `engagement rate: ${post.engagementRate ?? 0}%`,
        );
      });
    }

    // -----------------------------------------------------------------------
    // Audience insights
    // -----------------------------------------------------------------------
    if (audienceInsights) {
      contextParts.push(``, `Audience Insights:`);

      contextParts.push(
        `- Total Followers: ${audienceInsights.totalFollowers ?? 0}`,
        `- Total Reach (period): ${audienceInsights.totalReach ?? 0}`,
      );

      const topLocations = audienceInsights.demographics?.topLocations ?? [];
      if (topLocations.length > 0) {
        const locSummary = topLocations
          .slice(0, 3)
          .map(
            (l: any) =>
              `${l.country}${l.city ? " / " + l.city : ""} (${l.percentage ?? 0}%)`,
          )
          .join(", ");
        contextParts.push(`- Top locations: ${locSummary}`);
      }

      const activeHours = audienceInsights.activeHours ?? [];
      if (activeHours.length > 0) {
        contextParts.push(
          `- Active hours sample: ${activeHours
            .slice(0, 3)
            .map(
              (h: any) =>
                `Day ${h.dayOfWeek}, Hour ${h.hour} (engagement rate ${
                  h.engagementRate ?? 0
                }%)`,
            )
            .join("; ")}`,
        );
      }
    }

    // -----------------------------------------------------------------------
    // Platform health scores
    // -----------------------------------------------------------------------
    if (healthScores && healthScores.length > 0) {
      contextParts.push(``, `Platform Health Scores:`);

      healthScores.forEach((h: any) => {
        contextParts.push(
          `- ${h.platform}: overall ${h.overallScore ?? 0}/100, ` +
            `content quality ${h.metrics?.contentQuality ?? 0}/100, ` +
            `engagement health ${h.metrics?.engagementHealth ?? 0}/100, ` +
            `growth momentum ${h.metrics?.growthMomentum ?? 0}/100`,
        );
      });
    }

    // -----------------------------------------------------------------------
    // AI content recommendations
    // -----------------------------------------------------------------------
    if (recommendations && recommendations.length > 0) {
      contextParts.push(``, `Existing AI Recommendations:`);

      recommendations.slice(0, 5).forEach((r: any, idx: number) => {
        contextParts.push(
          `${idx + 1}. [${r.priority ?? "medium"}] ${r.title} — expected engagement +${
            r.expectedImpact?.engagementIncrease ?? 0
          }%`,
        );
      });
    }

    // -----------------------------------------------------------------------
    // Posting optimization
    // -----------------------------------------------------------------------
    if (postingOptimization && postingOptimization.length > 0) {
      contextParts.push(``, `Posting Optimization:`);

      postingOptimization.forEach((o: any) => {
        const bestSlot = o.bestPostingTimes?.[0];
        contextParts.push(
          `- ${o.platform}: recommended ${o.optimalFrequency?.weekly ?? 0} posts/week, ` +
            (bestSlot
              ? `best time example: day ${bestSlot.dayOfWeek}, hour ${bestSlot.hour} (${bestSlot.timezone})`
              : "best time data not available"),
        );
      });
    }

    // -----------------------------------------------------------------------
    // Decide whether this is a "new / low data" account
    // -----------------------------------------------------------------------
    const hasMeaningfulData = Boolean(
      (analyticsData && (analyticsData.totalReach ?? 0) > 0) ||
        (platformData && platformData.some((p: any) => (p.posts ?? 0) > 0)) ||
        (topPosts && topPosts.length > 0),
    );

    const userDataStatus = hasMeaningfulData
      ? "EXISTING_ACCOUNT_WITH_DATA"
      : "NEW_OR_LOW_DATA_ACCOUNT";

    const systemPrompt = `You are an expert social media marketing advisor and data analyst.
You help users optimize their social media strategy based on the provided analytics context.

UserDataStatus: ${userDataStatus}

Current User Data:
${contextParts.length > 0 ? contextParts.join("\n") : "No historical analytics available."}

Your role:
- Provide actionable, concrete insights based on the analytics data above.
- Suggest optimal posting times and content strategies.
- Identify trends in engagement and performance.
- Recommend improvements for underperforming content.
- Suggest content ideas based on top-performing posts (when available).
- Analyze audience behavior and engagement patterns.
- Provide platform-specific advice (Twitter/X, Instagram, LinkedIn, TikTok).
- Keep responses concise, practical, and data-driven.
${
  locale === "ar"
    ? "- If the user writes in Arabic, respond in Arabic with the same friendly tone."
    : ""
}

Very important behavior rules:
- NEVER ask the user to provide analytics numbers (reach, impressions, followers, etc.). Assume all available metrics are already in the context above.
- If UserDataStatus is NEW_OR_LOW_DATA_ACCOUNT or the metrics look like 0 / very small / missing:
  - Do NOT ask for more data.
  - Treat the user as someone just starting out or with little activity.
  - Give a simple 30-day action plan to grow their accounts.
  - Provide 3–5 practical tips tailored to their platforms (or generic if platform is unknown).
- If there is meaningful data:
  - Use the numbers explicitly (e.g. "your engagement rate is 3.4%").
  - Highlight both strengths and weaknesses.
  - Prioritize 2–3 high-impact recommendations per reply.
- Do not answer with questions; your job is to proactively advise and guide.
- Speak like a friendly, confident social media strategist who understands analytics and business impact.`;

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
