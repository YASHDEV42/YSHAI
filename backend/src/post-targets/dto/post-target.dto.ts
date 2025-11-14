import { ApiProperty } from '@nestjs/swagger';

export class PostTargetResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  postId!: number;

  @ApiProperty()
  socialAccountId!: number;

  @ApiProperty({ enum: ['x', 'instagram', 'linkedin', 'tiktok'] })
  provider!: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @ApiProperty({
    enum: ['pending', 'scheduled', 'processing', 'success', 'failed'],
  })
  status!: 'pending' | 'scheduled' | 'processing' | 'success' | 'failed';

  @ApiProperty()
  attempt!: number;

  @ApiProperty({ required: false, nullable: true })
  lastError!: string | null;

  @ApiProperty({ required: false, nullable: true })
  externalPostId!: string | null;

  @ApiProperty({ required: false, nullable: true })
  externalUrl!: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  scheduledAt!: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  publishedAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}
