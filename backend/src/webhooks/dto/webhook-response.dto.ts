import { ApiProperty } from '@nestjs/swagger';

export class WebhookSubscriptionResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @ApiProperty({
    enum: [
      'post.published',
      'post.failed',
      'account.disconnected',
      'post.moderation.completed',
    ], // FIXED: restrict to Swagger CreateWebhookDto.event values
  })
  event:
    | 'post.published'
    | 'post.failed'
    | 'account.disconnected'
    | 'post.moderation.completed'; // FIXED: sync WebhookSubscriptionResponseDto.event with Swagger
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  createdAt: string; // ISO date-time string

  @ApiProperty()
  updatedAt: string; // ISO date-time string
}

export class WebhookDeliveryAttemptResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @ApiProperty({
    enum: [
      'post.published',
      'post.failed',
      'account.disconnected',
      'post.moderation.completed',
    ],
  })
  event:
    | 'post.published'
    | 'post.failed'
    | 'account.disconnected'
    | 'post.moderation.completed';
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
  createdAt: string;

  @ApiProperty({ description: 'When this delivery attempt actually ran' })
  attemptedAt: string;

  @ApiProperty({
    description: 'Hash of the webhook payload for integrity/debugging',
  })
  payloadHash: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Truncated response body from the receiver, if logged',
  })
  responseBody?: string | null;
}

export class PaginatedDeliveryAttemptsDto {
  @ApiProperty({ type: [WebhookDeliveryAttemptResponseDto] })
  data: WebhookDeliveryAttemptResponseDto[];
  @ApiProperty()
  meta: { total: number; page: number; limit: number; pages: number };
}
