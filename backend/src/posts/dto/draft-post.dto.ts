import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class DraftPostDto {
  @ApiProperty({ description: 'Arabic content', type: String })
  @IsString()
  @MinLength(1)
  contentAr!: string;

  @ApiProperty({
    description: 'English content',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  contentEn?: string;

  @ApiProperty({
    description: 'When you plan to publish this draft',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  scheduleAt!: string;

  @ApiProperty({ description: 'Author ID', type: Number })
  @IsNumber()
  authorId!: number;

  @ApiProperty({ description: 'Team ID', required: false, type: Number })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({
    description: 'Social account ID',
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  socialAccountId?: number;

  @ApiProperty({ description: 'Campaign ID', required: false, type: Number })
  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @ApiProperty({ description: 'Template ID', required: false, type: Number })
  @IsNumber()
  @IsOptional()
  templateId?: number;
}
