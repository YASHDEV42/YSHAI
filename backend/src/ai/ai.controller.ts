import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateCaptionDto } from './dto/generate-caption.dto';
import { GenerateHashtagsDto } from './dto/generate-hashtags.dto';
import { GenerateAltTextDto } from './dto/generate-alt-text.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('caption')
  @ApiOperation({ summary: 'Generate social media caption' })
  async generateCaption(@Body() dto: GenerateCaptionDto) {
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
  async generateHashtags(@Body() dto: GenerateHashtagsDto) {
    return {
      hashtags: await this.aiService.generateHashtags(dto.text, dto.count),
    };
  }

  @Post('alt-text')
  @ApiOperation({ summary: 'Generate alternative text for image' })
  async generateAltText(@Body() dto: GenerateAltTextDto) {
    return {
      altText: await this.aiService.generateAltText(dto.imageUrl, dto.context),
    };
  }
}
