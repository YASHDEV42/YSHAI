"use server";

import { apiRequest, type ApiResult } from "./api-requester";

// Basic shared types
export type TimeRange = "7d" | "30d" | "90d" | "1y";

// Core analytics types
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
  saves?: number;
  clicks?: number;
}

export interface IPlatformPerformance {
  platform: string;
  posts: number;
  engagement: number;
  growth: number;
  reach?: number;
  impressions?: number;
  engagementRate?: number;
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

// Detailed analytics
export interface IDetailedAnalytics extends IAnalytics {
  impressions: number;
  profileVisits: number;
  websiteClicks: number;
  emailClicks: number;
  textMessageClicks: number;
  totalSaves: number;
  totalShares: number;
  videoViews: number;
  storyViews: number;
  impressionsChange: number;
  profileVisitsChange: number;
  savesChange: number;
  videoViewsChange: number;
  virality: number;
  saveRate: number;
  clickThroughRate: number;
}

// Audience insights
export interface IAudienceInsights {
  totalFollowers: number;
  totalReach: number;
  demographics: {
    ageGroups: {
      range: string;
      percentage: number;
    }[];
    genderSplit: {
      male: number;
      female: number;
      other: number;
    };
    topLocations: {
      country: string;
      city?: string;
      percentage: number;
    }[];
    languages: {
      code: string;
      percentage: number;
    }[];
  };
  activeHours: {
    hour: number;
    dayOfWeek: number;
    engagementRate: number;
  }[];
  followerGrowth: {
    date: string;
    followers: number;
    gained: number;
    lost: number;
    netGrowth: number;
  }[];
  avgSessionDuration: number;
  bounceRate: number;
  repeatVisitorRate: number;
}

// Content performance
export interface IContentPerformance {
  postId: string;
  platform: string;
  content: string;
  mediaType: "image" | "video" | "carousel" | "text" | "story" | "reel";
  publishedAt: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  viralityScore: number;
  sentimentScore?: number;
  performanceVsAvg: number;
  hashtags?: string[];
  mentions?: string[];
  bestPerformingHashtag?: string;
  postingTime: {
    hour: number;
    dayOfWeek: number;
    timezone: string;
  };
}

// Competitor analysis
export interface ICompetitorAnalysis {
  competitorId: string;
  name: string;
  platform: string;
  followers: number;
  followersChange: number;
  avgEngagement: number;
  avgEngagementRate: number;
  postingFrequency: number;
  bestPostingTimes: {
    hour: number;
    dayOfWeek: number;
  }[];
  topContentTypes: {
    type: string;
    percentage: number;
  }[];
  comparisonToYou: {
    followersDiff: number;
    engagementDiff: number;
    reachDiff: number;
  };
}

// Trend analysis
export interface ITrendAnalysis {
  trendId: string;
  keyword: string;
  hashtag?: string;
  volume: number;
  volumeChange: number;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  peakTimes: {
    timestamp: string;
    volume: number;
  }[];
  relatedKeywords: string[];
  topPosts: string[];
  relevanceToYou: number;
  opportunityScore: number;
}

// Platform health score
export interface IPlatformHealthScore {
  platform: string;
  overallScore: number;
  metrics: {
    contentQuality: number;
    engagementHealth: number;
    growthMomentum: number;
    audienceRelevance: number;
    postingConsistency: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  benchmarkComparison: {
    metric: string;
    yourValue: number;
    industryAvg: number;
    topPerformers: number;
  }[];
}

// Content recommendation
export interface IContentRecommendation {
  recommendationId: string;
  type: "topic" | "format" | "timing" | "hashtag" | "collaboration";
  title: string;
  description: string;
  reasoning: string;
  expectedImpact: {
    engagementIncrease: number;
    reachIncrease: number;
    confidenceScore: number;
  };
  platforms: string[];
  suggestedTiming?: {
    dayOfWeek: number;
    hour: number;
  };
  relatedTopics?: string[];
  examplePosts?: string[];
  priority: "high" | "medium" | "low";
}

// Posting optimization
export interface IPostingOptimization {
  platform: string;
  optimalFrequency: {
    daily: number;
    weekly: number;
  };
  bestPostingTimes: {
    dayOfWeek: number;
    hour: number;
    timezone: string;
    expectedEngagement: number;
    confidenceLevel: number;
  }[];
  contentMix: {
    type: string;
    recommendedPercentage: number;
    currentPercentage: number;
  }[];
  hashtagStrategy: {
    optimalCount: number;
    mixSize: {
      large: number;
      medium: number;
      niche: number;
    };
    topPerformingHashtags: {
      hashtag: string;
      avgEngagement: number;
    }[];
  };
  captionOptimization: {
    optimalLength: number;
    shouldUseEmojis: boolean;
    shouldAskQuestions: boolean;
    shouldUseCTA: boolean;
  };
}

// Summary analytics
export interface IAnalyticsSummary {
  period: {
    start: string;
    end: string;
    label: string;
  };
  overview: IDetailedAnalytics;
  platforms: IPlatformPerformance[];
  topContent: IContentPerformance[];
  audienceInsights: IAudienceInsights;
  healthScores: IPlatformHealthScore[];
  achievements: {
    type:
      | "follower_milestone"
      | "engagement_record"
      | "viral_post"
      | "growth_streak";
    title: string;
    description: string;
    achievedAt: string;
    value?: number;
  }[];
  keyInsights: {
    type: "success" | "warning" | "opportunity" | "info";
    title: string;
    description: string;
    actionable: boolean;
  }[];
  predictions: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    timeframe: string;
    confidence: number;
  }[];
}

// AI advisor context
export interface IAIAdvisorContext {
  analytics: IDetailedAnalytics;
  platformPerformance: IPlatformPerformance[];
  topPosts: IContentPerformance[];
  audienceInsights: IAudienceInsights;
  healthScores: IPlatformHealthScore[];
  recommendations: IContentRecommendation[];
  postingOptimization: IPostingOptimization[];
  trends: ITrendAnalysis[];
  competitors?: ICompetitorAnalysis[];
  timeRange: string;
  lastUpdated: string;
  accountId: string;
  platforms: string[];
}

// Dashboard stats
export async function getDashboardStats(): Promise<ApiResult<IDashboardStats>> {
  return apiRequest<IDashboardStats>({
    method: "GET",
    path: "/analytics/dashboard-stats",
    cache: {
      tags: ["dashboard-stats"],
      revalidate: 300,
    },
  });
}

// Basic analytics
export async function getAnalytics(params?: {
  timeRange?: TimeRange;
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
  timeRange?: TimeRange;
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
  timeRange?: TimeRange;
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
  timeRange?: TimeRange;
}): Promise<ApiResult<IContentPerformance[]>> {
  return apiRequest<IContentPerformance[]>({
    method: "GET",
    path: "/analytics/top-posts",
    query: params,
    cache: {
      tags: ["analytics-top-posts"],
      revalidate: 300,
    },
  });
}

// Advanced analytics
export async function getDetailedAnalytics(params?: {
  timeRange?: TimeRange;
  platform?: string;
}): Promise<ApiResult<IDetailedAnalytics>> {
  return apiRequest<IDetailedAnalytics>({
    method: "GET",
    path: "/analytics/detailed",
    query: params,
    cache: {
      tags: ["analytics-detailed"],
      revalidate: 300,
    },
  });
}

export async function getAudienceInsights(params?: {
  timeRange?: TimeRange;
  platform?: string;
}): Promise<ApiResult<IAudienceInsights>> {
  return apiRequest<IAudienceInsights>({
    method: "GET",
    path: "/analytics/audience",
    query: params,
    cache: {
      tags: ["analytics-audience"],
      revalidate: 600,
    },
  });
}

export async function getContentPerformance(params?: {
  timeRange?: TimeRange;
  platform?: string;
  sortBy?: "engagement" | "reach" | "viralityScore" | "date";
  limit?: number;
}): Promise<ApiResult<IContentPerformance[]>> {
  return apiRequest<IContentPerformance[]>({
    method: "GET",
    path: "/analytics/content-performance",
    query: params,
    cache: {
      tags: ["analytics-content"],
      revalidate: 300,
    },
  });
}

export async function getPlatformHealthScores(params?: {
  timeRange?: TimeRange;
  platforms?: string[];
}): Promise<ApiResult<IPlatformHealthScore[]>> {
  return apiRequest<IPlatformHealthScore[]>({
    method: "GET",
    path: "/analytics/health-scores",
    query: params,
    cache: {
      tags: ["analytics-health"],
      revalidate: 900,
    },
  });
}

export async function getContentRecommendations(params?: {
  platform?: string;
  limit?: number;
  priority?: "high" | "medium" | "low";
}): Promise<ApiResult<IContentRecommendation[]>> {
  return apiRequest<IContentRecommendation[]>({
    method: "GET",
    path: "/analytics/recommendations",
    query: params,
    cache: {
      tags: ["analytics-recommendations"],
      revalidate: 1800,
    },
  });
}

export async function getPostingOptimization(params?: {
  platform?: string;
}): Promise<ApiResult<IPostingOptimization[]>> {
  return apiRequest<IPostingOptimization[]>({
    method: "GET",
    path: "/analytics/posting-optimization",
    query: params,
    cache: {
      tags: ["analytics-optimization"],
      revalidate: 3600,
    },
  });
}

export async function getTrendAnalysis(params?: {
  platform?: string;
  limit?: number;
  minRelevance?: number;
}): Promise<ApiResult<ITrendAnalysis[]>> {
  return apiRequest<ITrendAnalysis[]>({
    method: "GET",
    path: "/analytics/trends",
    query: params,
    cache: {
      tags: ["analytics-trends"],
      revalidate: 1800,
    },
  });
}

export async function getCompetitorAnalysis(params?: {
  platform?: string;
  limit?: number;
}): Promise<ApiResult<ICompetitorAnalysis[]>> {
  return apiRequest<ICompetitorAnalysis[]>({
    method: "GET",
    path: "/analytics/competitors",
    query: params,
    cache: {
      tags: ["analytics-competitors"],
      revalidate: 3600,
    },
  });
}

export async function getAnalyticsSummary(params?: {
  timeRange?: TimeRange;
  includePredictions?: boolean;
}): Promise<ApiResult<IAnalyticsSummary>> {
  return apiRequest<IAnalyticsSummary>({
    method: "GET",
    path: "/analytics/summary",
    query: params,
    cache: {
      tags: ["analytics-summary"],
      revalidate: 300,
    },
  });
}

export async function getAIAdvisorContext(params?: {
  timeRange?: TimeRange;
  platform?: string;
  includeCompetitors?: boolean;
}): Promise<ApiResult<IAIAdvisorContext>> {
  return apiRequest<IAIAdvisorContext>({
    method: "GET",
    path: "/analytics/ai-context",
    query: params,
    cache: {
      tags: ["analytics-ai-context"],
      revalidate: 300,
    },
  });
}
