import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  PENDING_APPROVAL = 'pending_approval',
}

export class RecurringPostDto {
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
    description: 'First scheduled time (ISO)',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  scheduleAt!: string;

  @ApiProperty({
    description: 'Status',
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({ description: 'Force recurring', default: true })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

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
