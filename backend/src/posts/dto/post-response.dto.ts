import { ApiProperty } from '@nestjs/swagger';

export class PostTargetSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['x', 'instagram', 'linkedin', 'tiktok'] })
  provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @ApiProperty({
    enum: ['pending', 'scheduled', 'processing', 'success', 'failed'],
  })
  status: 'pending' | 'scheduled' | 'processing' | 'success' | 'failed';

  @ApiProperty({ required: false, nullable: true })
  externalPostId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  externalUrl?: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastError?: string | null;
}

export class MediaSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ enum: ['image', 'video'] })
  type: 'image' | 'video';
}

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  contentAr: string;

  @ApiProperty({ required: false, nullable: true })
  contentEn?: string | null;

  @ApiProperty({
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
  })
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty({ required: false, nullable: true })
  publishedAt?: string | null;

  @ApiProperty()
  createdAt: string; // ISO date-time string

  @ApiProperty()
  updatedAt: string; // ISO date-time string

  @ApiProperty({ required: false, nullable: true })
  scheduledAt?: string | null; // ISO date-time string

  @ApiProperty()
  authorId: number;

  @ApiProperty({ required: false, nullable: true })
  teamId?: number | null;

  @ApiProperty({ required: false, nullable: true })
  campaignId?: number | null;

  @ApiProperty({ required: false, nullable: true })
  templateId?: number | null;

  @ApiProperty({ type: [PostTargetSummaryDto], required: false })
  targets?: PostTargetSummaryDto[];

  @ApiProperty({ type: [MediaSummaryDto], required: false })
  media?: MediaSummaryDto[];
}

export class PostStatusResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
  })
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';

  @ApiProperty({ required: false, nullable: true })
  scheduledAt?: string | null; // ISO date-time string

  @ApiProperty({ required: false, nullable: true })
  publishedAt?: string | null;
}
