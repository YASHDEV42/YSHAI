import { ApiProperty } from '@nestjs/swagger';

export class WebhookSubscriptionResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @ApiProperty({
    enum: ['post.published', 'post.failed', 'account.disconnected'],
  })
  event: 'post.published' | 'post.failed' | 'account.disconnected';
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  createdAt: Date;
}

export class WebhookDeliveryAttemptResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @ApiProperty({
    enum: ['post.published', 'post.failed', 'account.disconnected'],
  })
  event: 'post.published' | 'post.failed' | 'account.disconnected';
  @ApiProperty()
  attemptNumber: number;
  @ApiProperty({ enum: ['delivered', 'failed'] })
  status: 'delivered' | 'failed';
  @ApiProperty({ required: false, nullable: true })
  responseCode?: number | null;
  @ApiProperty({ required: false, nullable: true })
  errorMessage?: string | null;
  @ApiProperty({ required: false, nullable: true })
  durationMs?: number | null;
  @ApiProperty()
  createdAt: Date;
}

export class PaginatedDeliveryAttemptsDto {
  @ApiProperty({ type: [WebhookDeliveryAttemptResponseDto] })
  data: WebhookDeliveryAttemptResponseDto[];
  @ApiProperty()
  meta: { total: number; page: number; limit: number; pages: number };
}
