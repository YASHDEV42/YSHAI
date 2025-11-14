import { ApiProperty } from '@nestjs/swagger';

export class ModerationResultResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['openai', 'meta', 'tiktok', 'internal'] })
  provider: 'openai' | 'meta' | 'tiktok' | 'internal';

  @ApiProperty({ enum: ['allowed', 'flagged', 'blocked'] })
  verdict: 'allowed' | 'flagged' | 'blocked';

  @ApiProperty({ type: Object, required: false, nullable: true })
  details?: Record<string, unknown> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;
  @ApiProperty({ required: false, nullable: true })
  postId?: number | null;

  @ApiProperty({ required: false, nullable: true })
  generationId?: number | null;
}
