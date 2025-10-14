import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  contentAr: string;

  @ApiProperty({ required: false })
  contentEn?: string;

  @ApiProperty({
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
  })
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty({ required: false, nullable: true })
  publishedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  scheduleAt: Date;
}

export class PostStatusResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ['draft', 'scheduled', 'published', 'failed', 'pending_approval'],
  })
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';

  @ApiProperty()
  scheduledAt: Date;

  @ApiProperty({ required: false, nullable: true })
  publishedAt?: Date | null;
}
