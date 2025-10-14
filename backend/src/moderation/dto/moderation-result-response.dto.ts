import { ApiProperty } from '@nestjs/swagger';

export class ModerationResultResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['gemini', 'custom'] })
  provider: 'gemini' | 'custom';

  @ApiProperty({ enum: ['allowed', 'flagged', 'blocked'] })
  verdict: 'allowed' | 'flagged' | 'blocked';

  @ApiProperty({ type: Object, required: false, nullable: true })
  details?: Record<string, unknown> | null;

  @ApiProperty()
  checkedAt: Date;

  @ApiProperty()
  postId: number;
}
