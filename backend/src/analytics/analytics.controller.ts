import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Header,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { PostInsightsDto } from './dto/post-insights.dto';
import { AccountInsightsDto } from './dto/account-insights.dto';
import { CampaignInsightsDto } from './dto/campaign-insights.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';

type TimeRange = '7d' | '30d' | '90d' | '1y';

@ApiStandardErrors()
@ApiTags('Analytics')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  // Dashboard stats
  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Dashboard stats overview' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  getDashboardStats() {
    return this.analytics.getDashboardStats();
  }

  // Core analytics overview
  @Get()
  @ApiOperation({ summary: 'Analytics overview' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platform', required: false })
  @ApiResponse({ status: 200, description: 'Overall analytics' })
  getAnalytics(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platform') platform?: string,
  ) {
    return this.analytics.getAnalytics({ timeRange, platform });
  }

  // Engagement time series
  @Get('engagement')
  @ApiOperation({ summary: 'Engagement over time' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiResponse({ status: 200, description: 'Engagement time series' })
  getEngagementData(@Query('timeRange') timeRange?: TimeRange) {
    return this.analytics.getEngagementData({ timeRange });
  }

  // Platform performance
  @Get('platforms')
  @ApiOperation({ summary: 'Platform performance' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiResponse({ status: 200, description: 'Platform performance metrics' })
  getPlatformPerformance(@Query('timeRange') timeRange?: TimeRange) {
    return this.analytics.getPlatformPerformance({ timeRange });
  }

  // Top posts
  @Get('top-posts')
  @ApiOperation({ summary: 'Top-performing posts' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiResponse({ status: 200, description: 'Top posts list' })
  getTopPosts(
    @Query('limit') limit?: number,
    @Query('timeRange') timeRange?: TimeRange,
  ) {
    return this.analytics.getTopPosts({ limit, timeRange });
  }

  // Detailed analytics
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed analytics with advanced metrics' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platform', required: false })
  @ApiResponse({ status: 200, description: 'Detailed analytics' })
  getDetailedAnalytics(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platform') platform?: string,
  ) {
    return this.analytics.getDetailedAnalytics({ timeRange, platform });
  }

  // Audience insights
  @Get('audience')
  @ApiOperation({ summary: 'Audience insights and demographics' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platform', required: false })
  @ApiResponse({ status: 200, description: 'Audience insights' })
  getAudienceInsights(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platform') platform?: string,
  ) {
    return this.analytics.getAudienceInsights({ timeRange, platform });
  }

  // Content performance
  @Get('content-performance')
  @ApiOperation({ summary: 'Content performance details' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['engagement', 'reach', 'viralityScore', 'date'],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Content performance list' })
  getContentPerformance(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platform') platform?: string,
    @Query('sortBy')
    sortBy?: 'engagement' | 'reach' | 'viralityScore' | 'date',
    @Query('limit') limit?: number,
  ) {
    return this.analytics.getContentPerformance({
      timeRange,
      platform,
      sortBy,
      limit,
    });
  }

  // Platform health scores
  @Get('health-scores')
  @ApiOperation({ summary: 'Platform health scores' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platforms', required: false, isArray: true, type: String })
  @ApiResponse({ status: 200, description: 'Health scores per platform' })
  getPlatformHealthScores(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platforms') platforms?: string[] | string,
  ) {
    const platformsArray = Array.isArray(platforms)
      ? platforms
      : platforms
        ? [platforms]
        : undefined;

    return this.analytics.getPlatformHealthScores({
      timeRange,
      platforms: platformsArray,
    });
  }

  // Content recommendations
  @Get('recommendations')
  @ApiOperation({ summary: 'AI-powered content recommendations' })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['high', 'medium', 'low'],
  })
  @ApiResponse({ status: 200, description: 'Content recommendations' })
  getContentRecommendations(
    @Query('platform') platform?: string,
    @Query('limit') limit?: number,
    @Query('priority') priority?: 'high' | 'medium' | 'low',
  ) {
    return this.analytics.getContentRecommendations({
      platform,
      limit,
      priority,
    });
  }

  // Posting optimization
  @Get('posting-optimization')
  @ApiOperation({ summary: 'Optimal posting schedule and mix' })
  @ApiQuery({ name: 'platform', required: false })
  @ApiResponse({ status: 200, description: 'Posting optimization data' })
  getPostingOptimization(@Query('platform') platform?: string) {
    return this.analytics.getPostingOptimization({ platform });
  }

  // Analytics summary
  @Get('summary')
  @ApiOperation({ summary: 'Comprehensive analytics summary' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'includePredictions', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Full analytics summary' })
  getAnalyticsSummary(
    @Query('timeRange') timeRange?: TimeRange,
    // note: service currently always returns empty predictions
    @Query('includePredictions') includePredictions?: boolean,
  ) {
    return this.analytics.getAnalyticsSummary({
      timeRange,
      includePredictions,
    });
  }

  // AI advisor context
  @Get('ai-context')
  @ApiOperation({ summary: 'AI advisor context payload' })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiQuery({ name: 'platform', required: false })
  @ApiResponse({ status: 200, description: 'AI advisor context' })
  getAIAdvisorContext(
    @Query('timeRange') timeRange?: TimeRange,
    @Query('platform') platform?: string,
  ) {
    return this.analytics.getAIAdvisorContext({
      timeRange,
      platform,
    });
  }

  // Existing endpoints

  @Get('posts/:postId')
  @ApiOperation({ summary: 'Post insights' })
  @ApiParam({ name: 'postId', type: Number })
  @ApiResponse({ status: 200, type: PostInsightsDto })
  getPostInsights(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostInsightsDto> {
    return this.analytics.getPostInsights(postId);
  }

  @Get('accounts/:accountId')
  @ApiOperation({ summary: 'Account insights' })
  @ApiParam({ name: 'accountId', type: Number })
  @ApiResponse({ status: 200, type: AccountInsightsDto })
  getAccountInsights(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<AccountInsightsDto> {
    return this.analytics.getAccountInsights(accountId);
  }

  @Get('campaigns/:campaignId')
  @ApiOperation({ summary: 'Campaign insights' })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({ status: 200, type: CampaignInsightsDto })
  getCampaignInsights(
    @Param('campaignId', ParseIntPipe) campaignId: number,
  ): Promise<CampaignInsightsDto> {
    return this.analytics.getCampaignInsights(campaignId);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export analytics as CSV' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="analytics.csv"')
  @ApiResponse({ status: 200, schema: { type: 'string', format: 'binary' } })
  exportCsv(): Promise<string> {
    return this.analytics.exportCsv();
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export analytics as PDF' })
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="analytics.pdf"')
  @ApiResponse({ status: 200, schema: { type: 'string', format: 'binary' } })
  exportPdf(): Promise<Buffer> {
    return this.analytics.exportPdf();
  }

  @Get('sync/meta')
  @ApiOperation({ summary: 'Sync Meta insights (Instagram/Facebook)' })
  @ApiResponse({ status: 200, description: 'Insights updated' })
  async syncMeta(): Promise<{ message: string }> {
    await this.analytics.syncInstagramInsights();
    return { message: 'Meta insights synced successfully' };
  }
}
