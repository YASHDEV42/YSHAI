import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ['post_scheduled', 'publish_failed', 'ai_ready', 'approved'],
  })
  type: 'post_scheduled' | 'publish_failed' | 'ai_ready' | 'approved';

  @ApiProperty({ type: Object })
  payload: Record<string, any>;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  link?: string | null;
}
