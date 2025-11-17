"use server";

import { apiRequest, ApiResult } from "./api-requester";

export interface IAnalytics {
  totalEngagement: number;
  totalReach: number;
  newFollowers: number;
  avgEngagementRate: number;
  engagementChange: number;
  reachChange: number;
  followersChange: number;
  engagementRateChange: number;
}

export interface IEngagementData {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

export interface IPlatformPerformance {
  platform: string;
  posts: number;
  engagement: number;
  growth: number;
}

export interface IDashboardStats {
  scheduledPosts: number;
  publishedThisWeek: number;
  connectedAccounts: number;
  avgEngagement: number;
  scheduledChange: number;
  publishedChange: number;
  accountsChange: number;
  engagementChange: number;
}

export async function getDashboardStats(): Promise<ApiResult<IDashboardStats>> {
  return apiRequest<IDashboardStats>({
    method: "GET",
    path: "/analytics/dashboard-stats",
    cache: {
      tags: ["dashboard-stats"],
      revalidate: 300, // Cache for 5 minutes
    },
  });
}

export async function getAnalytics(params?: {
  timeRange?: "7d" | "30d" | "90d" | "1y";
  platform?: string;
}): Promise<ApiResult<IAnalytics>> {
  return apiRequest<IAnalytics>({
    method: "GET",
    path: "/analytics",
    query: params,
    cache: {
      tags: ["analytics"],
      revalidate: 300,
    },
  });
}

export async function getEngagementData(params?: {
  timeRange?: "7d" | "30d" | "90d" | "1y";
}): Promise<ApiResult<IEngagementData[]>> {
  return apiRequest<IEngagementData[]>({
    method: "GET",
    path: "/analytics/engagement",
    query: params,
    cache: {
      tags: ["analytics-engagement"],
      revalidate: 300,
    },
  });
}

export async function getPlatformPerformance(params?: {
  timeRange?: "7d" | "30d" | "90d" | "1y";
}): Promise<ApiResult<IPlatformPerformance[]>> {
  return apiRequest<IPlatformPerformance[]>({
    method: "GET",
    path: "/analytics/platforms",
    query: params,
    cache: {
      tags: ["analytics-platforms"],
      revalidate: 300,
    },
  });
}

export async function getTopPosts(params?: {
  limit?: number;
  timeRange?: "7d" | "30d" | "90d" | "1y";
}): Promise<ApiResult<any[]>> {
  return apiRequest<any[]>({
    method: "GET",
    path: "/analytics/top-posts",
    query: params,
    cache: {
      tags: ["analytics-top-posts"],
      revalidate: 300,
    },
  });
}
