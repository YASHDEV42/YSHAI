import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateCaptionDto } from './dto/generate-caption.dto';
import { GenerateHashtagsDto } from './dto/generate-hashtags.dto';
import { GenerateAltTextDto } from './dto/generate-alt-text.dto';
import { GenerateCaptionResponseDto } from './dto/generate-caption.response.dto';
import { GenerateHashtagsResponseDto } from './dto/generate-hashtags.response.dto';
import { GenerateAltTextResponseDto } from './dto/generate-alt-text.response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AiUsageSummaryDto } from './dto/ai-usage-summary.dto';
import { AiUsageBreakdownDto } from './dto/ai-usage-breakdown.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';

@ApiStandardErrors()
@ApiTags('AI')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('caption')
  @ApiOperation({ summary: 'Generate social media caption' })
  @ApiResponse({ status: 200, type: GenerateCaptionResponseDto })
  async generateCaption(
    @Req() req: { user: { id: number } },
    @Body() dto: GenerateCaptionDto,
  ): Promise<GenerateCaptionResponseDto> {
    return {
      caption: await this.aiService.generateCaption(
        req.user.id,
        dto.prompt,
        dto.tone,
        dto.count,
      ),
    };
  }

  @Post('hashtags')
  @ApiOperation({ summary: 'Generate hashtags for text' })
  @ApiResponse({ status: 200, type: GenerateHashtagsResponseDto })
  async generateHashtags(
    @Req() req: { user: { id: number } },
    @Body() dto: GenerateHashtagsDto,
  ): Promise<GenerateHashtagsResponseDto> {
    return {
      hashtags: await this.aiService.generateHashtags(
        req.user.id,
        dto.text,
        dto.count,
      ),
    };
  }

  @Post('alt-text')
  @ApiOperation({ summary: 'Generate alternative text for image' })
  @ApiResponse({ status: 200, type: GenerateAltTextResponseDto })
  async generateAltText(
    @Req() req: { user: { id: number } },
    @Body() dto: GenerateAltTextDto,
  ): Promise<GenerateAltTextResponseDto> {
    return {
      altText: await this.aiService.generateAltText(
        req.user.id,
        dto.imageUrl,
        dto.context,
      ),
    };
  }

  @Get('usage/me')
  @ApiOperation({ summary: 'Get AI usage for current user' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated AI usage for the authenticated user',
    schema: {
      type: 'object',
      properties: {
        summary: { $ref: '#/components/schemas/AiUsageSummaryDto' },
        breakdown: { $ref: '#/components/schemas/AiUsageBreakdownDto' },
      },
    },
  })
  async getMyUsage(
    @Req() req: { user: { id: number } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<{ summary: AiUsageSummaryDto; breakdown: AiUsageBreakdownDto }> {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.aiService.getUsageForUser(req.user.id, fromDate, toDate);
  }
}
