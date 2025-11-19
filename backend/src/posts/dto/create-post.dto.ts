import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  MinLength,
  IsString,
} from 'class-validator';

enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  PENDING_APPROVAL = 'pending_approval',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Arabic content of the post',
    example: 'هذا محتوى المنشور باللغة العربية',
    type: String,
  })
  @IsString()
  @MinLength(1)
  contentAr?: string;

  @ApiProperty({
    description: 'English content of the post (optional)',
    example: 'This is the post content in English',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  contentEn?: string;

  @ApiProperty({
    description: 'Scheduled date and time for the post (ISO format)',
    example: '2025-04-05T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({
    description: 'Status of the post',
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
    default: 'draft',
    required: false,
    type: String,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    description: 'Whether the post is part of a recurring schedule',
    default: false,
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({
    description: 'ID of the author (User)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  authorId: number;

  @ApiProperty({
    description: 'ID of the team (optional)',
    example: 5,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({
    description:
      'IDs of the social accounts to post to (optional, multi-target)',
    example: [12, 15],
    required: false,
    type: [Number],
  })
  @IsOptional()
  socialAccountIds?: number[];
  @ApiProperty({
    description: 'List of tag IDs (optional)',
    example: [1, 3, 7],
    required: false,
    type: [Number],
  })
  @IsOptional()
  tagIds?: number[];
  @ApiProperty({
    description: 'ID of the associated campaign (optional)',
    example: 7,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @ApiProperty({
    description: 'ID of the template used (optional)',
    example: 3,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  templateId?: number;
}
