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

export async function getAIAdvisorContext(platformId: number) {
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
      getAnalytics({ timeRange: "30d" }),
      getPlatformPerformance({ timeRange: "30d" }),
      getTopPosts({ limit: 5, timeRange: "30d" }),
      getAudienceInsights({ timeRange: "30d" }),
      getPlatformHealthScores({ timeRange: "30d" }),
      getContentRecommendations({ limit: 5 }),
      getPostingOptimization(),
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
