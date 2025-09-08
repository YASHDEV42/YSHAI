import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Header,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { PostInsightsDto } from './dto/post-insights.dto';
import { AccountInsightsDto } from './dto/account-insights.dto';
import { CampaignInsightsDto } from './dto/campaign-insights.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('posts/:postId')
  @ApiOperation({ summary: 'Post Insights' })
  @ApiParam({ name: 'postId', type: Number })
  @ApiResponse({ status: 200, type: PostInsightsDto })
  getPostInsights(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostInsightsDto> {
    return this.analytics.getPostInsights(postId);
  }

  @Get('accounts/:accountId')
  @ApiOperation({ summary: 'Account Insights' })
  @ApiParam({ name: 'accountId', type: Number })
  @ApiResponse({ status: 200, type: AccountInsightsDto })
  getAccountInsights(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.analytics.getAccountInsights(accountId);
  }

  @Get('campaigns/:campaignId')
  @ApiOperation({ summary: 'Campaign Insights' })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({ status: 200, type: CampaignInsightsDto })
  getCampaignInsights(@Param('campaignId', ParseIntPipe) campaignId: number) {
    return this.analytics.getCampaignInsights(campaignId);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export report as CSV' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="analytics.csv"')
  exportCsv(): Promise<string> {
    return this.analytics.exportCsv();
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export report as PDF' })
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="analytics.pdf"')
  exportPdf(): Promise<Buffer> {
    return this.analytics.exportPdf();
  }
}
