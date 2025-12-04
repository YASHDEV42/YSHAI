"use server";

import {
  getAnalytics,
  getPlatformPerformance,
  getTopPosts,
} from "@/lib/analytics-helper";

export async function getAIAdvisorContext(platformId: number) {
  try {
    // Fetch analytics data for AI context
    const [analyticsResult, platformResult, topPostsResult] = await Promise.all(
      [
        getAnalytics({ timeRange: "30d" }),
        getPlatformPerformance({ timeRange: "30d" }),
        getTopPosts({ limit: 5, timeRange: "30d" }),
      ],
    );

    return {
      analytics: analyticsResult.success ? analyticsResult.data : null,
      platformData: platformResult.success ? platformResult.data : null,
      topPosts: topPostsResult.success ? topPostsResult.data : null,
    };
  } catch (error) {
    console.error("[v0] Failed to fetch AI advisor context:", error);
    return {
      analytics: null,
      platformData: null,
      topPosts: null,
    };
  }
}
