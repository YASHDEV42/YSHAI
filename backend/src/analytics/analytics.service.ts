import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Post } from 'src/entities/post.entity';
import { PostAnalytics } from 'src/entities/post-analytics.entity';
import { PostInsightsDto } from './dto/post-insights.dto';
import { MetaInsightsService } from 'src/meta/meta-insights.service';
import { SocialAccount } from 'src/entities/social-account.entity';
import { PostTarget } from 'src/entities/post-target.entity';
import { AccountToken } from 'src/entities/account-token.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly em: EntityManager,
    private readonly meta: MetaInsightsService,
  ) {}
  async syncInstagramInsights(): Promise<void> {
    const targets = await this.em.find(
      PostTarget,
      { externalPostId: { $ne: null }, status: 'success' },
      { populate: ['socialAccount'] },
    );

    for (const target of targets) {
      const account = target.socialAccount as SocialAccount;
      const token = await this.em.findOne(AccountToken, {
        account,
        tokenType: 'access',
        revoked: false,
      });
      if (!token) continue;

      const insights = (await this.meta.getPostInsights(
        target.externalPostId!,
        token.tokenEncrypted,
      )) as Array<{
        name: string;
        values?: Array<{ value: number }>;
      }>;
      if (!insights) continue;

      // Parse and store insights
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
      { orderBy: { fetchedAt: 'DESC' }, limit: 1, populate: ['socialAccount'] },
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

    const rows = await this.em
      .createQueryBuilder(PostAnalytics, 'a')
      .select([
        'a.post_id as postId',
        'a.impressions',
        'a.clicks',
        'a.likes',
        'a.comments',
        'a.shares',
        'a.fetched_at as fetchedAt',
      ])
      .execute<CsvRow[]>('all');
    const header = 'postId,impressions,clicks,likes,comments,shares,fetchedAt';
    const lines = (rows ?? []).map((r: CsvRow) =>
      [
        r.postId,
        r.impressions,
        r.clicks,
        r.likes,
        r.comments,
        r.shares,
        new Date(r.fetchedAt).toISOString(),
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
