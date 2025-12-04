// app/.../ai-advisor-context.ts
"use server";

import {
  getAnalytics,
  getPlatformPerformance,
  getTopPosts,
  getAudienceInsights,
  getPlatformHealthScores,
  getContentRecommendations,
  getPostingOptimization,
} from "@/lib/analytics-helper";

export async function getAIAdvisorContextForAccount(account: {
  id: number;
  provider: string; // "instagram", "tiktok", etc.
}) {
  const platform = account.provider;

  try {
    const [
      analyticsResult,
      platformResult,
      topPostsResult,
      audienceResult,
      healthResult,
      recommendationsResult,
      optimizationResult,
    ] = await Promise.all([
      getAnalytics({ timeRange: "30d", platform }),
      getPlatformPerformance({ timeRange: "30d" }), // if backend supports per-account, we can filter later
      getTopPosts({
        limit: 5,
        timeRange: "30d" /* platform if API supports */,
      }),
      getAudienceInsights({ timeRange: "30d", platform }),
      getPlatformHealthScores({
        timeRange: "30d",
        platforms: [platform],
      }),
      getContentRecommendations({ platform, limit: 5 }),
      getPostingOptimization({ platform }),
    ]);

    return {
      analytics: analyticsResult.success ? analyticsResult.data : null,
      platformData: platformResult.success ? platformResult.data : null,
      topPosts: topPostsResult.success ? topPostsResult.data : null,
      audienceInsights: audienceResult.success ? audienceResult.data : null,
      healthScores: healthResult.success ? healthResult.data : null,
      recommendations: recommendationsResult.success
        ? recommendationsResult.data
        : null,
      postingOptimization: optimizationResult.success
        ? optimizationResult.data
        : null,
    };
  } catch (error) {
    console.error("[v0] Failed to fetch AI advisor context:", error);
    return {
      analytics: null,
      platformData: null,
      topPosts: null,
      audienceInsights: null,
      healthScores: null,
      recommendations: null,
      postingOptimization: null,
    };
  }
}
