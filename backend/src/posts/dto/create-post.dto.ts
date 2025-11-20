import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  MinLength,
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
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
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  contentAr?: string;

  @ApiProperty({
    description: 'English content of the post',
    example: 'This is the post content in English',
    required: false,
  })
  @IsString()
  @IsOptional()
  contentEn?: string;

  @ApiProperty({
    description:
      'Scheduled date (ISO8601). Required only when status = scheduled.',
    example: '2025-04-05T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    description: 'Status of the post',
    enum: PostStatus,
    default: PostStatus.DRAFT,
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    description: 'Whether this post is recurring',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({
    description: 'Author ID',
    example: 1,
  })
  @IsNumber()
  authorId!: number;

  @ApiProperty({
    description: 'Team ID (optional)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  teamId?: number;

  @ApiProperty({
    description: 'List of target social account IDs',
    example: [12, 15],
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  socialAccountIds?: number[];

  @ApiProperty({
    description: 'List of tag IDs',
    example: [1, 3, 7],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @ApiProperty({
    description: 'Campaign ID (optional)',
    example: 7,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  campaignId?: number;

  @ApiProperty({
    description: 'Template ID (optional)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  templateId?: number;
}
