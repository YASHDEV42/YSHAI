import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { ModerateTextDto } from './dto/moderate-text.dto';
import { ModerateImageDto } from './dto/moderate-image.dto';
import { ModerateVideoDto } from './dto/moderate-video.dto';
import { ModerationResultResponseDto } from './dto/moderation-result-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Moderation')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('text')
  @ApiOperation({ summary: 'Moderate Arabic text' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResultResponseDto,
  })
  @ApiBody({ type: ModerateTextDto })
  async moderateText(
    @Body() dto: ModerateTextDto,
  ): Promise<ModerationResultResponseDto> {
    const r = await this.moderationService.moderateText(dto);
    return {
      id: r.id,
      provider: r.provider,
      verdict: r.verdict,
      details: r.details ?? null,
      createdAt: r.createdAt.toISOString(),
      postId: r.post?.id ?? null,
    };
  }

  @Post('image')
  @ApiOperation({ summary: 'Moderate an image by URL' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResultResponseDto,
  })
  @ApiBody({ type: ModerateImageDto })
  async moderateImage(
    @Body() dto: ModerateImageDto,
  ): Promise<ModerationResultResponseDto> {
    const r = await this.moderationService.moderateImage(dto);
    return {
      id: r.id,
      provider: r.provider,
      details: r.details ?? null,
      verdict: r.verdict,
      createdAt: r.createdAt.toISOString(),
      postId: r.post?.id ?? null,
    };
  }

  @Post('video')
  @ApiOperation({ summary: 'Moderate a video by URL' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResultResponseDto,
  })
  @ApiBody({ type: ModerateVideoDto })
  async moderateVideo(
    @Body() dto: ModerateVideoDto,
  ): Promise<ModerationResultResponseDto> {
    const r = await this.moderationService.moderateVideo(dto);
    return {
      id: r.id,
      provider: r.provider,
      verdict: r.verdict,
      details: r.details ?? null,
      createdAt: r.createdAt.toISOString(),
      postId: r.post?.id ?? null,
    };
  }

  @Get('reports')
  @ApiOperation({ summary: 'Fetch moderation reports' })
  @ApiResponse({
    status: 200,
    description: 'List of moderation reports',
    type: [ModerationResultResponseDto],
  })
  async getReports(): Promise<ModerationResultResponseDto[]> {
    const list = await this.moderationService.getReports();
    return list.map((r) => ({
      id: r.id,
      provider: r.provider,
      verdict: r.verdict,
      details: r.details ?? null,
      createdAt: r.createdAt.toISOString(),
      postId: r.post?.id ?? null,
    }));
  }
}
