import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Post } from 'src/entities/post.entity';
import { PostAnalytics } from 'src/entities/post-analytics.entity';
import { PostInsightsDto } from './dto/post-insights.dto';
import { MetaInsightsService } from 'src/meta/meta-insights.service';
import { SocialAccount } from 'src/entities/social-account.entity';
import { PostTarget } from 'src/entities/post-target.entity';
import { AccountToken } from 'src/entities/account-token.entity';

type TimeRange = '7d' | '30d' | '90d' | '1y';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly em: EntityManager,
    private readonly meta: MetaInsightsService,
  ) {}

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private getRangeStart(timeRange?: TimeRange): Date | undefined {
    if (!timeRange) return undefined;

    const now = new Date();
    const start = new Date(now);

    switch (timeRange) {
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
      case '90d':
        start.setDate(now.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return start;
  }

  private getWeekStart(): Date {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start;
  }

  private clampScore(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(100, value));
  }

  private createAnalyticsQb() {
    // central place for PostAnalytics QB setup
    return this.em.createQueryBuilder(PostAnalytics, 'a');
  }

  private applyAnalyticsFilters(qb: any, start?: Date, platform?: string) {
    if (start) {
      qb.andWhere({ fetchedAt: { $gte: start } });
    }
    if (platform) {
      qb.andWhere({ provider: platform });
    }
  }

  private csvEscape(value: string | number | Date): string {
    let raw: string;
    if (value instanceof Date) {
      raw = value.toISOString();
    } else {
      raw = String(value ?? '');
    }

    // mitigate CSV injection in Excel-like tools
    if (/^[=+\-@]/.test(raw)) {
      raw = "'" + raw;
    }

    const escaped = raw.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD + BASIC OVERVIEW
  // ---------------------------------------------------------------------------

  async getDashboardStats() {
    const weekStart = this.getWeekStart();

    const [scheduledPosts, publishedThisWeek, connectedAccounts] =
      await Promise.all([
        this.em.count(Post, {
          status: 'scheduled',
          deletedAt: null,
        }),
        this.em.count(Post, {
          status: 'published',
          deletedAt: null,
          publishedAt: { $gte: weekStart },
        }),
        this.em.count(SocialAccount, {
          active: true,
        }),
      ]);

    const aggRows = await this.createAnalyticsQb()
      .select([
        'coalesce(sum(a.likes + a.comments + a.shares), 0) as engagement',
      ])
      .execute<{ engagement: string | number }[]>('all');

    const totalEngagement = Number(aggRows[0]?.engagement ?? 0);

    return {
      scheduledPosts,
      publishedThisWeek,
      connectedAccounts,
      avgEngagement: totalEngagement,
      // no historical comparison implemented yet
      scheduledChange: 0,
      publishedChange: 0,
      accountsChange: 0,
      engagementChange: 0,
    };
  }

  async getAnalytics(params?: { timeRange?: TimeRange; platform?: string }) {
    const { timeRange, platform } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb().select([
      'coalesce(sum(a.impressions), 0) as totalReach',
      'coalesce(sum(a.clicks), 0) as totalClicks',
      'coalesce(sum(a.likes + a.comments + a.shares), 0) as totalEngagement',
    ]);

    this.applyAnalyticsFilters(qb, start, platform);

    const rows = await qb.execute<
      {
        totalReach: string | number;
        totalClicks: string | number;
        totalEngagement: string | number;
      }[]
    >('all');

    const row = rows[0] ?? {
      totalReach: 0,
      totalClicks: 0,
      totalEngagement: 0,
    };

    const totalReach = Number(row.totalReach ?? 0);
    const totalEngagement = Number(row.totalEngagement ?? 0);

    const avgEngagementRate =
      totalReach === 0 ? 0 : (totalEngagement / totalReach) * 100;

    return {
      totalEngagement,
      totalReach,
      newFollowers: 0,
      avgEngagementRate,
      engagementChange: 0,
      reachChange: 0,
      followersChange: 0,
      engagementRateChange: 0,
    };
  }

  async getEngagementData(params?: { timeRange?: TimeRange }) {
    const { timeRange } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb().select([
      // FIX: use property name fetchedAt
      'a.fetchedAt as fetchedAt',
      'a.likes',
      'a.comments',
      'a.shares',
      'a.clicks',
      'a.impressions',
    ]);

    this.applyAnalyticsFilters(qb, start);

    const rows = await qb.execute<
      {
        fetchedAt: Date;
        likes: number;
        comments: number;
        shares: number;
        clicks: number;
        impressions: number;
      }[]
    >('all');

    return rows.map((r) => ({
      date: r.fetchedAt.toISOString(),
      likes: r.likes ?? 0,
      comments: r.comments ?? 0,
      shares: r.shares ?? 0,
      views: r.impressions ?? 0,
      clicks: r.clicks ?? 0,
    }));
  }
  async getPlatformPerformance(params?: { timeRange?: TimeRange }) {
    const { timeRange } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb()
      .select([
        'a.provider as platform',
        // FIX: use property "post" (ManyToOne) not raw post_id
        'count(distinct a.post) as posts',
        'coalesce(sum(a.likes + a.comments + a.shares), 0) as engagement',
        'coalesce(sum(a.impressions), 0) as impressions',
      ])
      .groupBy('a.provider');

    this.applyAnalyticsFilters(qb, start);

    const rows = await qb.execute<
      {
        platform: string;
        posts: string | number;
        engagement: string | number;
        impressions: string | number;
      }[]
    >('all');

    return rows.map((r) => {
      const impressions = Number(r.impressions ?? 0);
      const engagement = Number(r.engagement ?? 0);

      return {
        platform: r.platform,
        posts: Number(r.posts ?? 0),
        engagement,
        growth: 0,
        reach: impressions,
        impressions,
        engagementRate:
          impressions === 0 ? 0 : (engagement / impressions) * 100,
      };
    });
  }
  async getTopPosts(params?: { limit?: number; timeRange?: TimeRange }) {
    const { limit = 10, timeRange } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb()
      .select([
        // FIX: use property "post" instead of post_id
        'a.post as postId',
        'a.provider as platform',
        'a.likes',
        'a.comments',
        'a.shares',
        'a.impressions',
        'a.clicks',
        // FIX: use fetchedAt property
        'a.fetchedAt as fetchedAt',
        'p.content_en as contentEn',
        'p.content_ar as contentAr',
        'p.published_at as publishedAt',
      ])
      .leftJoin('a.post', 'p')
      .orderBy({ 'a.likes + a.comments + a.shares': 'DESC' })
      .limit(limit);

    if (start) {
      // FIX: use property name instead of raw 'a.fetched_at'
      qb.andWhere({ fetchedAt: { $gte: start } });
    }

    const rows = await qb.execute<
      {
        postId: number;
        platform: string;
        likes: number;
        comments: number;
        shares: number;
        impressions: number;
        clicks: number;
        fetchedAt: Date;
        contentEn?: string;
        contentAr?: string;
        publishedAt?: Date;
      }[]
    >('all');

    return rows.map((r) => {
      const impressions = r.impressions ?? 0;
      const engagement = (r.likes ?? 0) + (r.comments ?? 0) + (r.shares ?? 0);
      const engagementRate =
        impressions === 0 ? 0 : (engagement / impressions) * 100;

      const content = r.contentEn || r.contentAr || '';
      const effectiveDate = r.publishedAt ?? r.fetchedAt;

      return {
        postId: String(r.postId),
        platform: r.platform,
        content,
        mediaType: 'image' as const,
        publishedAt: effectiveDate.toISOString(),
        likes: r.likes ?? 0,
        comments: r.comments ?? 0,
        shares: r.shares ?? 0,
        saves: 0,
        views: impressions,
        reach: impressions,
        impressions,
        engagementRate,
        viralityScore:
          impressions === 0
            ? 0
            : this.clampScore((r.shares / impressions) * 100),
        sentimentScore: undefined,
        performanceVsAvg: 0,
        hashtags: [],
        mentions: [],
        bestPerformingHashtag: undefined,
        postingTime: {
          hour: effectiveDate.getUTCHours(),
          dayOfWeek: effectiveDate.getUTCDay(),
          timezone: 'UTC',
        },
      };
    });
  }

  // ---------------------------------------------------------------------------
  // ADVANCED ANALYTICS (DATA-DRIVEN ONLY)
  // ---------------------------------------------------------------------------

  async getDetailedAnalytics(params?: {
    timeRange?: TimeRange;
    platform?: string;
  }) {
    const { timeRange, platform } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb().select([
      'coalesce(sum(a.impressions), 0) as impressions',
      'coalesce(sum(a.clicks), 0) as clicks',
      'coalesce(sum(a.likes), 0) as likes',
      'coalesce(sum(a.comments), 0) as comments',
      'coalesce(sum(a.shares), 0) as shares',
    ]);

    this.applyAnalyticsFilters(qb, start, platform);

    const rows = await qb.execute<
      {
        impressions: string | number;
        clicks: string | number;
        likes: string | number;
        comments: string | number;
        shares: string | number;
      }[]
    >('all');

    const row = rows[0] ?? {
      impressions: 0,
      clicks: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    const impressions = Number(row.impressions ?? 0);
    const clicks = Number(row.clicks ?? 0);
    const likes = Number(row.likes ?? 0);
    const comments = Number(row.comments ?? 0);
    const shares = Number(row.shares ?? 0);

    const totalEngagement = likes + comments + shares;
    const avgEngagementRate =
      impressions === 0 ? 0 : (totalEngagement / impressions) * 100;

    return {
      totalEngagement,
      totalReach: impressions,
      newFollowers: 0,
      avgEngagementRate,
      engagementChange: 0,
      reachChange: 0,
      followersChange: 0,
      engagementRateChange: 0,
      impressions,
      profileVisits: 0,
      websiteClicks: 0,
      emailClicks: 0,
      textMessageClicks: 0,
      totalSaves: 0,
      totalShares: shares,
      videoViews: 0,
      storyViews: 0,
      impressionsChange: 0,
      profileVisitsChange: 0,
      savesChange: 0,
      videoViewsChange: 0,
      virality:
        impressions === 0 ? 0 : this.clampScore((shares / impressions) * 100),
      saveRate: 0,
      clickThroughRate:
        impressions === 0 ? 0 : this.clampScore((clicks / impressions) * 100),
    };
  }

  async getAudienceInsights(params?: {
    timeRange?: TimeRange;
    platform?: string;
  }) {
    const overview = await this.getDetailedAnalytics(params);

    const followersRows = await this.em.find(SocialAccount, {
      active: true,
    });

    const totalFollowers = followersRows.reduce(
      (sum, acc) => sum + (acc.followersCount ?? 0),
      0,
    );

    return {
      totalFollowers,
      totalReach: overview.totalReach,
      demographics: {
        ageGroups: [],
        genderSplit: {
          male: 0,
          female: 0,
          other: 0,
        },
        topLocations: [],
        languages: [],
      },
      activeHours: [],
      followerGrowth: [],
      avgSessionDuration: 0,
      bounceRate: 0,
      repeatVisitorRate: 0,
    };
  }

  async getContentPerformance(params?: {
    timeRange?: TimeRange;
    platform?: string;
    sortBy?: 'engagement' | 'reach' | 'viralityScore' | 'date';
    limit?: number;
  }) {
    const {
      timeRange,
      platform,
      sortBy = 'engagement',
      limit = 50,
    } = params ?? {};
    const start = this.getRangeStart(timeRange);

    const qb = this.createAnalyticsQb()
      .select([
        // FIX: use property "post"
        'a.post as postId',
        'a.provider as platform',
        'a.likes',
        'a.comments',
        'a.shares',
        'a.impressions',
        'a.clicks',
        // FIX: use fetchedAt property
        'a.fetchedAt as fetchedAt',
        'p.content_en as contentEn',
        'p.content_ar as contentAr',
        'p.published_at as publishedAt',
      ])
      .leftJoin('a.post', 'p')
      .limit(limit);

    if (start) {
      // FIX: property form
      qb.andWhere({ fetchedAt: { $gte: start } });
    }
    if (platform) {
      qb.andWhere({ provider: platform });
    }

    switch (sortBy) {
      case 'reach':
        qb.orderBy({ impressions: 'DESC' });
        break;
      case 'date':
        qb.orderBy({ fetchedAt: 'DESC' });
        break;
      case 'viralityScore':
        qb.orderBy({ shares: 'DESC' });
        break;
      case 'engagement':
      default:
        qb.orderBy({ 'a.likes + a.comments + a.shares': 'DESC' });
        break;
    }

    const rows = await qb.execute<
      {
        postId: number;
        platform: string;
        likes: number;
        comments: number;
        shares: number;
        impressions: number;
        clicks: number;
        fetchedAt: Date;
        contentEn?: string;
        contentAr?: string;
        publishedAt?: Date;
      }[]
    >('all');

    const engagements = rows.map(
      (r) => (r.likes ?? 0) + (r.comments ?? 0) + (r.shares ?? 0),
    );
    const avgEngagement =
      engagements.length === 0
        ? 0
        : engagements.reduce((a, b) => a + b, 0) / engagements.length;

    return rows.map((r, index) => {
      const impressions = r.impressions ?? 0;
      const engagement = engagements[index];
      const engagementRate =
        impressions === 0 ? 0 : (engagement / impressions) * 100;

      const content = r.contentEn || r.contentAr || '';
      const effectiveDate = r.publishedAt ?? r.fetchedAt;

      const viralityScore =
        impressions === 0 ? 0 : this.clampScore((r.shares / impressions) * 100);

      const performanceVsAvg =
        avgEngagement === 0
          ? 0
          : ((engagement - avgEngagement) / avgEngagement) * 100;

      return {
        postId: String(r.postId),
        platform: r.platform,
        content,
        mediaType: 'image' as const,
        publishedAt: effectiveDate.toISOString(),
        likes: r.likes ?? 0,
        comments: r.comments ?? 0,
        shares: r.shares ?? 0,
        saves: 0,
        views: impressions,
        reach: impressions,
        impressions,
        engagementRate,
        viralityScore,
        sentimentScore: undefined,
        performanceVsAvg,
        hashtags: [],
        mentions: [],
        bestPerformingHashtag: undefined,
        postingTime: {
          hour: effectiveDate.getUTCHours(),
          dayOfWeek: effectiveDate.getUTCDay(),
          timezone: 'UTC',
        },
      };
    });
  }

  async getPlatformHealthScores(params?: {
    timeRange?: TimeRange;
    platforms?: string[];
  }) {
    const performance = await this.getPlatformPerformance({
      timeRange: params?.timeRange,
    });

    if (performance.length === 0) {
      return [];
    }

    const engagementRates = performance.map((p) => p.engagementRate || 0);
    const maxRate = Math.max(...engagementRates, 0);
    const avgRate =
      engagementRates.length === 0
        ? 0
        : engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length;

    return performance.map((p) => {
      const rate = p.engagementRate || 0;
      const overallScore =
        maxRate === 0 ? 0 : this.clampScore((rate / maxRate) * 100);

      const metricScore = overallScore;

      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (rate > avgRate) {
        strengths.push('Engagement rate above overall average');
      } else if (rate < avgRate && rate > 0) {
        weaknesses.push('Engagement rate below overall average');
      }

      return {
        platform: p.platform,
        overallScore,
        metrics: {
          contentQuality: metricScore,
          engagementHealth: metricScore,
          growthMomentum: 0,
          audienceRelevance: 0,
          postingConsistency: 0,
        },
        strengths,
        weaknesses,
        recommendations: [],
        benchmarkComparison: [
          {
            metric: 'engagementRate',
            yourValue: rate,
            industryAvg: avgRate,
            topPerformers: maxRate,
          },
        ],
      };
    });
  }

  async getContentRecommendations(params?: {
    platform?: string;
    limit?: number;
    priority?: 'high' | 'medium' | 'low';
  }) {
    const { platform, limit = 5, priority } = params ?? {};

    const posts = await this.getContentPerformance({
      timeRange: '30d',
      platform,
      sortBy: 'engagement',
      limit: 50,
    });

    if (posts.length === 0) {
      return [];
    }

    // derive timing recommendation from real engagement
    const slotMap = new Map<
      string,
      {
        totalEngagement: number;
        count: number;
        hour: number;
        dayOfWeek: number;
      }
    >();

    for (const p of posts) {
      const key = `${p.postingTime.dayOfWeek}-${p.postingTime.hour}`;
      const engagement =
        (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0) + (p.saves ?? 0);
      const slot = slotMap.get(key) ?? {
        totalEngagement: 0,
        count: 0,
        hour: p.postingTime.hour,
        dayOfWeek: p.postingTime.dayOfWeek,
      };
      slot.totalEngagement += engagement;
      slot.count += 1;
      slotMap.set(key, slot);
    }

    const slots = Array.from(slotMap.values());
    slots.sort(
      (a, b) =>
        b.totalEngagement / (b.count || 1) - a.totalEngagement / (a.count || 1),
    );

    const topSlot = slots[0];

    const recs: {
      recommendationId: string;
      type: 'topic' | 'format' | 'timing' | 'hashtag' | 'collaboration';
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
      priority: 'high' | 'medium' | 'low';
    }[] = [];

    if (topSlot) {
      const topPostsIds = posts
        .filter(
          (p) =>
            p.postingTime.dayOfWeek === topSlot.dayOfWeek &&
            p.postingTime.hour === topSlot.hour,
        )
        .slice(0, 5)
        .map((p) => p.postId);

      recs.push({
        recommendationId: 'timing-1',
        type: 'timing',
        title: 'Post more at your best-performing time',
        description:
          'This time window shows the highest engagement based on your recent posts.',
        reasoning: 'Computed from engagement per posting hour/day.',
        expectedImpact: {
          engagementIncrease: 10,
          reachIncrease: 8,
          confidenceScore: 70,
        },
        platforms: platform
          ? [platform]
          : Array.from(new Set(posts.map((p) => p.platform))),
        suggestedTiming: {
          dayOfWeek: topSlot.dayOfWeek,
          hour: topSlot.hour,
        },
        relatedTopics: [],
        examplePosts: topPostsIds,
        priority: priority ?? 'high',
      });
    }

    const lengths = posts.map((p) => p.content.length);
    const avgLength =
      lengths.length === 0
        ? 0
        : lengths.reduce((a, b) => a + b, 0) / lengths.length;

    recs.push({
      recommendationId: 'caption-1',
      type: 'topic',
      title: 'Keep captions around your average length',
      description:
        'Your recent posts cluster around a certain caption length; staying close can help maintain consistency.',
      reasoning: 'Based on average caption length of recent posts.',
      expectedImpact: {
        engagementIncrease: 5,
        reachIncrease: 3,
        confidenceScore: 60,
      },
      platforms: platform
        ? [platform]
        : Array.from(new Set(posts.map((p) => p.platform))),
      relatedTopics: [],
      examplePosts: posts.slice(0, 5).map((p) => p.postId),
      priority: priority ?? 'medium',
    });

    return recs.slice(0, limit);
  }

  async getPostingOptimization(params?: { platform?: string }) {
    const { platform } = params ?? {};

    const posts = await this.getContentPerformance({
      timeRange: '30d',
      platform,
      limit: 200,
    });

    if (posts.length === 0) {
      return [];
    }

    const daysSet = new Set(posts.map((p) => p.publishedAt.split('T')[0]));
    const daysCount = daysSet.size || 1;

    const daily = posts.length / daysCount;
    const weekly = daily * 7;

    const slotMap = new Map<
      string,
      {
        totalEngagement: number;
        count: number;
        hour: number;
        dayOfWeek: number;
      }
    >();

    for (const p of posts) {
      const key = `${p.postingTime.dayOfWeek}-${p.postingTime.hour}`;
      const engagement =
        (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0) + (p.saves ?? 0);
      const slot = slotMap.get(key) ?? {
        totalEngagement: 0,
        count: 0,
        hour: p.postingTime.hour,
        dayOfWeek: p.postingTime.dayOfWeek,
      };
      slot.totalEngagement += engagement;
      slot.count += 1;
      slotMap.set(key, slot);
    }

    const slots = Array.from(slotMap.values());
    slots.sort(
      (a, b) =>
        b.totalEngagement / (b.count || 1) - a.totalEngagement / (a.count || 1),
    );

    const bestSlots = slots.slice(0, 3).map((s) => ({
      dayOfWeek: s.dayOfWeek,
      hour: s.hour,
      timezone: 'UTC',
      expectedEngagement: s.totalEngagement / (s.count || 1),
      confidenceLevel: Math.min(100, (s.count / posts.length) * 100),
    }));

    return [
      {
        platform:
          platform ??
          Array.from(new Set(posts.map((p) => p.platform)))[0] ??
          'unknown',
        optimalFrequency: {
          daily,
          weekly,
        },
        bestPostingTimes: bestSlots,
        contentMix: [
          {
            type: 'image',
            recommendedPercentage: 100,
            currentPercentage: 100,
          },
        ],
        hashtagStrategy: {
          optimalCount: 0,
          mixSize: {
            large: 0,
            medium: 0,
            niche: 0,
          },
          topPerformingHashtags: [],
        },
        captionOptimization: {
          optimalLength:
            posts.length === 0
              ? 0
              : Math.round(
                  posts.reduce((sum, p) => sum + p.content.length, 0) /
                    posts.length,
                ),
          shouldUseEmojis: true,
          shouldAskQuestions: true,
          shouldUseCTA: true,
        },
      },
    ];
  }

  async getAnalyticsSummary(params?: {
    timeRange?: TimeRange;
    includePredictions?: boolean;
  }) {
    const { timeRange, includePredictions } = params ?? {};
    const start = this.getRangeStart(timeRange);
    const now = new Date();

    const [overview, platforms, topContent, audienceInsights, healthScores] =
      await Promise.all([
        this.getDetailedAnalytics({ timeRange }),
        this.getPlatformPerformance({ timeRange }),
        this.getTopPosts({ timeRange, limit: 10 }),
        this.getAudienceInsights({ timeRange }),
        this.getPlatformHealthScores({ timeRange }),
      ]);

    return {
      period: {
        start: start?.toISOString() ?? '',
        end: now.toISOString(),
        label: timeRange ?? '30d',
      },
      overview,
      platforms,
      topContent,
      audienceInsights,
      healthScores,
      achievements: [],
      keyInsights: [],
      // no ML predictions yet → honest empty array
      predictions: includePredictions ? [] : [],
    };
  }

  async getAIAdvisorContext(params?: {
    timeRange?: TimeRange;
    platform?: string;
    includeCompetitors?: boolean;
  }) {
    const { timeRange, platform } = params ?? {};

    const [
      analytics,
      platformPerformance,
      topPosts,
      audienceInsights,
      healthScores,
      recommendations,
      postingOptimization,
    ] = await Promise.all([
      this.getDetailedAnalytics({ timeRange, platform }),
      this.getPlatformPerformance({ timeRange }),
      this.getContentPerformance({ timeRange, platform, limit: 20 }),
      this.getAudienceInsights({ timeRange, platform }),
      this.getPlatformHealthScores({ timeRange }),
      this.getContentRecommendations({ platform }),
      this.getPostingOptimization({ platform }),
    ]);

    const now = new Date();

    return {
      analytics,
      platformPerformance,
      topPosts,
      audienceInsights,
      healthScores,
      recommendations,
      postingOptimization,
      // trend & competitor analytics removed (no mock data)
      trends: [],
      competitors: [],
      timeRange: timeRange ?? '30d',
      lastUpdated: now.toISOString(),
      accountId: '', // fill when you add account-scoped analytics
      platforms: platformPerformance.map((p) => p.platform),
    };
  }

  // ---------------------------------------------------------------------------
  // EXISTING METHODS (KEPT, WITH N+1 FIX IN syncInstagramInsights)
  // ---------------------------------------------------------------------------

  async syncInstagramInsights(): Promise<void> {
    const targets = await this.em.find(
      PostTarget,
      { externalPostId: { $ne: null }, status: 'success' },
      { populate: ['socialAccount'] },
    );

    if (!targets.length) return;

    const accountEntities = targets
      .map((t) => t.socialAccount as SocialAccount)
      .filter(Boolean);

    const uniqueAccountsMap = new Map<number, SocialAccount>();
    for (const acc of accountEntities) {
      if (!uniqueAccountsMap.has(acc.id)) {
        uniqueAccountsMap.set(acc.id, acc);
      }
    }
    const uniqueAccounts = Array.from(uniqueAccountsMap.values());

    const tokens = await this.em.find(AccountToken, {
      tokenType: 'access',
      revoked: false,
      account: { $in: uniqueAccounts },
    });

    const tokenByAccountId = new Map<number, AccountToken>();
    for (const token of tokens) {
      const acc = token.account as SocialAccount;
      if (!tokenByAccountId.has(acc.id)) {
        tokenByAccountId.set(acc.id, token);
      }
    }

    for (const target of targets) {
      const account = target.socialAccount as SocialAccount;
      const token = tokenByAccountId.get(account.id);
      if (!token) continue;

      const insights = (await this.meta.getPostInsights(
        target.externalPostId!,
        token.tokenEncrypted,
      )) as Array<{
        name: string;
        values?: Array<{ value: number }>;
      }>;
      if (!insights) continue;

      const analytics = this.em.create(PostAnalytics, {
        post: target.post,
        socialAccount: account,
        provider: account.provider,
        impressions:
          insights.find((m) => m.name === 'impressions')?.values?.[0]?.value ??
          0,
        likes:
          insights.find((m) => m.name === 'likes')?.values?.[0]?.value ?? 0,
        comments:
          insights.find((m) => m.name === 'comments')?.values?.[0]?.value ?? 0,
        shares:
          insights.find((m) => m.name === 'shares')?.values?.[0]?.value ?? 0,
        clicks:
          insights.find((m) => m.name === 'reach')?.values?.[0]?.value ?? 0,
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.em.persist(analytics);
    }

    await this.em.flush();
  }

  async getPostInsights(postId: number): Promise<PostInsightsDto> {
    const post = await this.em.findOneOrFail(Post, { id: postId });
    const agg = await this.em.find(
      PostAnalytics,
      { post },
      {
        orderBy: { fetchedAt: 'DESC' },
        limit: 1,
        populate: ['socialAccount'],
      },
    );
    const latest = agg[0];
    return {
      postId,
      impressions: latest?.impressions ?? 0,
      clicks: latest?.clicks ?? 0,
      likes: latest?.likes ?? 0,
      comments: latest?.comments ?? 0,
      shares: latest?.shares ?? 0,
      provider: latest?.provider ?? 'x',
      socialAccountId: latest?.socialAccount?.id ?? null,
      fetchedAt: (latest?.fetchedAt ?? new Date(0)).toISOString(),
    };
  }

  async getAccountInsights(accountId: number) {
    type AccountAggRow = {
      total_posts: string | number;
      total_impressions: string | number;
      total_clicks: string | number;
      total_engagements: string | number;
    };

    const qb = this.em
      .createQueryBuilder(Post, 'p')
      .select([
        'count(p.id) as total_posts',
        'coalesce(sum(a.impressions),0) as total_impressions',
        'coalesce(sum(a.clicks),0) as total_clicks',
        'coalesce(sum(a.likes + a.comments + a.shares),0) as total_engagements',
      ])
      .leftJoin('p.analytics', 'a')
      .where({ socialAccount: accountId });

    const rows = await qb.execute<AccountAggRow[]>('all');
    const row: AccountAggRow = (rows && rows[0]) ?? {
      total_posts: 0,
      total_impressions: 0,
      total_clicks: 0,
      total_engagements: 0,
    };
    return {
      accountId,
      totalPosts: Number(row?.total_posts ?? 0),
      totalImpressions: Number(row?.total_impressions ?? 0),
      totalClicks: Number(row?.total_clicks ?? 0),
      totalEngagements: Number(row?.total_engagements ?? 0),
    };
  }

  async getCampaignInsights(campaignId: number) {
    type CampaignAggRow = {
      posts: string | number;
      impressions: string | number;
      clicks: string | number;
      engagements: string | number;
    };

    const qb = this.em
      .createQueryBuilder(Post, 'p')
      .select([
        'count(p.id) as posts',
        'coalesce(sum(a.impressions),0) as impressions',
        'coalesce(sum(a.clicks),0) as clicks',
        'coalesce(sum(a.likes + a.comments + a.shares),0) as engagements',
      ])
      .leftJoin('p.analytics', 'a')
      .where({ campaign: campaignId });

    const rows = await qb.execute<CampaignAggRow[]>('all');
    const row: CampaignAggRow = (rows && rows[0]) ?? {
      posts: 0,
      impressions: 0,
      clicks: 0,
      engagements: 0,
    };
    return {
      campaignId,
      posts: Number(row?.posts ?? 0),
      impressions: Number(row?.impressions ?? 0),
      clicks: Number(row?.clicks ?? 0),
      engagements: Number(row?.engagements ?? 0),
    };
  }

  async exportCsv(): Promise<string> {
    type CsvRow = {
      postId: number;
      impressions: number;
      clicks: number;
      likes: number;
      comments: number;
      shares: number;
      fetchedAt: string | Date;
    };

    const rows = await this.createAnalyticsQb()
      .select([
        // FIX: property "post" and "fetchedAt"
        'a.post as postId',
        'a.impressions',
        'a.clicks',
        'a.likes',
        'a.comments',
        'a.shares',
        'a.fetchedAt as fetchedAt',
      ])
      .execute<CsvRow[]>('all');

    const header = 'postId,impressions,clicks,likes,comments,shares,fetchedAt';

    const lines = (rows ?? []).map((r: CsvRow) =>
      [
        this.csvEscape(r.postId),
        this.csvEscape(r.impressions),
        this.csvEscape(r.clicks),
        this.csvEscape(r.likes),
        this.csvEscape(r.comments),
        this.csvEscape(r.shares),
        this.csvEscape(
          r.fetchedAt instanceof Date ? r.fetchedAt : new Date(r.fetchedAt),
        ),
      ].join(','),
    );

    return [header, ...lines].join('\n');
  }

  async exportPdf(): Promise<Buffer> {
    const text = 'Analytics Report';
    const buf = Buffer.from(text, 'utf8');
    await Promise.resolve();
    return buf;
  }
}
