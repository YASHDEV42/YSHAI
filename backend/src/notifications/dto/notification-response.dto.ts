import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

// Named schema for the arbitrary JSON payload attached to a notification.
// Intentionally left open-ended for different notification kinds.
export class NotificationResponseDtoPayload {}

// Named schema for a link value which can be a string or null.
export class NotificationResponseDtoLink {}

// Message/title in different locales. We model this as a flexible
// key/value JSON object to match the Notification entity's
// Record<string, string> structure.
export class NotificationMessageDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { en: 'Post published', ar: 'تم نشر المنشور' },
  })
  value!: Record<string, string>;
}

// Specific payload DTOs per notification kind to provide strong typing
export class PostScheduledPayloadDto {
  @ApiProperty({ description: 'Associated post id' })
  postId: number;

  @ApiProperty({
    description: 'Target platform name (e.g., twitter, instagram)',
  })
  platform: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Scheduled publish time',
  })
  scheduledAt: string;
}

export class PublishFailedPayloadDto {
  @ApiProperty({ description: 'Associated post id' })
  postId: number;

  @ApiProperty({ description: 'Human-readable error message' })
  error: string;
}

export class AiReadyPayloadDto {
  @ApiProperty({ description: 'Associated post id' })
  postId: number;

  @ApiProperty({
    description: 'Which AI artifact is ready',
    enum: ['caption', 'hashtags', 'alt_text'],
  })
  artifact: 'caption' | 'hashtags' | 'alt_text';
}

export class ApprovedPayloadDto {
  @ApiProperty({ description: 'Associated post id' })
  postId: number;
}

@ApiExtraModels(
  NotificationMessageDto,
  NotificationResponseDtoPayload,
  NotificationResponseDtoLink,
  PostScheduledPayloadDto,
  PublishFailedPayloadDto,
  AiReadyPayloadDto,
  ApprovedPayloadDto,
)
export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: [
      'post.published',
      'post.failed',
      'analytics.updated',
      'account.disconnected',
      'subscription.ending',
      'system',
    ],
  })
  type:
    | 'post.published'
    | 'post.failed'
    | 'analytics.updated'
    | 'account.disconnected'
    | 'subscription.ending'
    | 'system';

  @ApiProperty({ type: NotificationMessageDto })
  title: NotificationMessageDto;

  @ApiProperty({ type: NotificationMessageDto })
  message: NotificationMessageDto;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Type-specific payload for the notification',
    oneOf: [
      { $ref: getSchemaPath(PostScheduledPayloadDto) },
      { $ref: getSchemaPath(PublishFailedPayloadDto) },
      { $ref: getSchemaPath(AiReadyPayloadDto) },
      { $ref: getSchemaPath(ApprovedPayloadDto) },
    ],
  })
  data?:
    | PostScheduledPayloadDto
    | PublishFailedPayloadDto
    | AiReadyPayloadDto
    | ApprovedPayloadDto
    | null;

  @ApiProperty()
  read: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    nullable: true,
  })
  readAt?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Optional URL for deep-linking to the related resource',
    type: String,
    format: 'uri',
  })
  link?: string | null;
}
