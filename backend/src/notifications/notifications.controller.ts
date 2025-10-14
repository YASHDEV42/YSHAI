import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import {
  NotificationResponseDto,
  PostScheduledPayloadDto,
  PublishFailedPayloadDto,
  AiReadyPayloadDto,
  ApprovedPayloadDto,
} from './dto/notification-response.dto';
import {
  Notification,
  NotificationType,
} from 'src/entities/notification.entity';
import { MessageDto } from 'src/common/dto/message.dto';
import { CountDto } from 'src/common/dto/count.dto';

@ApiTags('Notifications')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  @ApiOkResponse({ type: [NotificationResponseDto] })
  async list(
    @Req() req: { user: { id: number } },
  ): Promise<NotificationResponseDto[]> {
    const items = await this.notifications.list(req.user.id);
    return items.map((n) => this.toDto(n));
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'notificationId', type: Number })
  @ApiResponse({ status: 200, type: MessageDto })
  async markRead(
    @Req() req: { user: { id: number } },
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<{ message: string }> {
    return this.notifications.markRead(req.user.id, notificationId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, type: CountDto })
  async unreadCount(
    @Req() req: { user: { id: number } },
  ): Promise<{ count: number }> {
    return this.notifications.unreadCount(req.user.id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, type: MessageDto })
  async markAllRead(
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    return this.notifications.markAllRead(req.user.id);
  }

  private toDto(n: Notification): NotificationResponseDto {
    let data: NotificationResponseDto['data'] = null;
    if (n.data) {
      switch (n.type) {
        case NotificationType.POST_SCHEDULED: {
          if (
            typeof n.data.postId === 'number' &&
            typeof n.data.platform === 'string' &&
            typeof n.data.scheduledAt === 'string'
          ) {
            data = {
              postId: n.data.postId,
              platform: n.data.platform,
              scheduledAt: n.data.scheduledAt,
            } as PostScheduledPayloadDto;
          }
          break;
        }
        case NotificationType.PUBLISH_FAILED: {
          if (
            typeof n.data.postId === 'number' &&
            typeof n.data.error === 'string'
          ) {
            data = {
              postId: n.data.postId,
              error: n.data.error,
            } as PublishFailedPayloadDto;
          }
          break;
        }
        case NotificationType.AI_READY: {
          const d = n.data as Record<string, unknown>;
          const artifact = d.artifact;
          if (
            typeof d.postId === 'number' &&
            (artifact === 'caption' ||
              artifact === 'hashtags' ||
              artifact === 'alt_text')
          ) {
            data = {
              postId: d.postId,
              artifact: artifact,
            } as AiReadyPayloadDto;
          }
          break;
        }
        case NotificationType.APPROVED: {
          if (typeof n.data.postId === 'number') {
            data = { postId: n.data.postId } as ApprovedPayloadDto;
          }
          break;
        }
        default:
          data = null;
      }
    }
    const title = n.title;
    const message = n.message;
    return {
      id: n.id,
      type: n.type,
      title,
      message,
      data,
      read: n.read,
      createdAt: n.createdAt,
      link: n.link ?? null,
    };
  }
}
