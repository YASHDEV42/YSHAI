import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    @Body() dto: GenerateCaptionDto,
  ): Promise<GenerateCaptionResponseDto> {
    return {
      caption: await this.aiService.generateCaption(
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
    @Body() dto: GenerateHashtagsDto,
  ): Promise<GenerateHashtagsResponseDto> {
    return {
      hashtags: await this.aiService.generateHashtags(dto.text, dto.count),
    };
  }

  @Post('alt-text')
  @ApiOperation({ summary: 'Generate alternative text for image' })
  @ApiResponse({ status: 200, type: GenerateAltTextResponseDto })
  async generateAltText(
    @Body() dto: GenerateAltTextDto,
  ): Promise<GenerateAltTextResponseDto> {
    return {
      altText: await this.aiService.generateAltText(dto.imageUrl, dto.context),
    };
  }
}
