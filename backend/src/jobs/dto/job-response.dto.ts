import { ApiProperty } from '@nestjs/swagger';

export class JobResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty({ required: false, nullable: true })
  targetId?: number | null;

  @ApiProperty({ enum: ['x', 'instagram', 'linkedin', 'tiktok'] })
  provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @ApiProperty({ enum: ['pending', 'processing', 'success', 'failed'] })
  status: 'pending' | 'processing' | 'success' | 'failed';

  @ApiProperty({ required: false, nullable: true })
  lastError?: string | null;

  @ApiProperty()
  attempt: number;

  @ApiProperty({ type: String, format: 'date-time' })
  scheduledAt: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  executedAt?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;
}

export class PaginatedJobsDto {
  @ApiProperty({ type: [JobResponseDto] })
  data: JobResponseDto[];

  @ApiProperty()
  meta: { total: number; page: number; limit: number; pages: number };
}
