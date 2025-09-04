import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GenerateCaptionDto {
  @ApiProperty({ description: 'Prompt text for caption generation' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'Tone of the caption', required: false })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiProperty({ description: 'Number of captions to generate', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  count = 1;
}
