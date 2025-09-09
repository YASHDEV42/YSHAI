import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  PENDING_APPROVAL = 'pending_approval',
}
export class UpdatePostDto {
  @ApiProperty({
    description: 'Arabic content',
    example: 'محتوى محدث',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  contentAr?: string;

  @ApiProperty({
    description: 'English content',
    example: 'Updated content',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  contentEn?: string;

  @ApiProperty({
    description: 'Scheduled date/time',
    example: '2025-04-06T14:30:00Z',
    format: 'date-time',
    required: false,
    type: String,
  })
  @IsDateString()
  @IsOptional()
  scheduleAt?: string;

  @ApiProperty({
    description: 'Status',
    enum: PostStatus,
    required: false,
    type: String,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    description: 'Is recurring?',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({
    description: 'Team ID',
    example: 5,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({
    description: 'Social account IDs (multi-target)',
    example: [12, 15],
    required: false,
    type: [Number],
  })
  @IsOptional()
  socialAccountIds?: number[];

  @ApiProperty({
    description: 'Campaign ID',
    example: 7,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @ApiProperty({
    description: 'Template ID',
    example: 3,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  templateId?: number;
}
