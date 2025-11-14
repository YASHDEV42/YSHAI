import { ApiProperty } from '@nestjs/swagger';

export class PostInsightsDto {
  @ApiProperty()
  postId!: number;

  @ApiProperty()
  impressions!: number;

  @ApiProperty()
  clicks!: number;

  @ApiProperty()
  likes!: number;

  @ApiProperty()
  comments!: number;

  @ApiProperty()
  shares!: number;

  @ApiProperty({ enum: ['x', 'instagram', 'linkedin', 'tiktok'] })
  provider!: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @ApiProperty({ required: false, nullable: true })
  socialAccountId?: number | null;

  @ApiProperty({ type: String, format: 'date-time' })
  fetchedAt!: string;
}
