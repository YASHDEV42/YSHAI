import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { ModerateTextDto } from './dto/moderate-text.dto';
import { ModerateImageDto } from './dto/moderate-image.dto';
import { ModerateVideoDto } from './dto/moderate-video.dto';
import { ModerationResult } from '../entities/moderation-result.entity';

@ApiTags('Moderation')
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('text')
  @ApiOperation({ summary: 'Moderate Arabic text' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResult,
  })
  @ApiBody({ type: ModerateTextDto })
  moderateText(@Body() dto: ModerateTextDto): Promise<ModerationResult> {
    return this.moderationService.moderateText(dto);
  }

  @Post('image')
  @ApiOperation({ summary: 'Moderate an image by URL' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResult,
  })
  @ApiBody({ type: ModerateImageDto })
  moderateImage(@Body() dto: ModerateImageDto): Promise<ModerationResult> {
    return this.moderationService.moderateImage(dto);
  }

  @Post('video')
  @ApiOperation({ summary: 'Moderate a video by URL' })
  @ApiResponse({
    status: 200,
    description: 'Moderation result returned',
    type: ModerationResult,
  })
  @ApiBody({ type: ModerateVideoDto })
  moderateVideo(@Body() dto: ModerateVideoDto): Promise<ModerationResult> {
    return this.moderationService.moderateVideo(dto);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Fetch moderation reports' })
  @ApiResponse({
    status: 200,
    description: 'List of moderation reports',
    type: [ModerationResult],
  })
  getReports(): Promise<ModerationResult[]> {
    return this.moderationService.getReports();
  }
}
