import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
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
import { Notification } from 'src/entities/notification.entity';
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
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<NotificationResponseDto[]> {
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 50));
    const parsedOffset = Math.max(0, Number(offset) || 0);

    const items = await this.notifications.list(req.user.id, {
      limit: parsedLimit,
      offset: parsedOffset,
    });
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

  @Delete(':notificationId')
  @ApiOperation({ summary: 'Soft-delete a notification' })
  @ApiParam({ name: 'notificationId', type: Number })
  @ApiResponse({ status: 200, type: MessageDto })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async deleteOne(
    @Req() req: { user: { id: number } },
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<MessageDto> {
    return this.notifications.delete(req.user.id, notificationId);
  }

  @Delete()
  @ApiOperation({ summary: 'Soft-delete all notifications for current user' })
  @ApiResponse({ status: 200, type: MessageDto })
  async deleteAll(@Req() req: { user: { id: number } }): Promise<MessageDto> {
    return this.notifications.deleteAll(req.user.id);
  }

  private toDto(n: Notification): NotificationResponseDto {
    let data: NotificationResponseDto['data'] = null;
    if (n.data) {
      switch (n.type) {
        case 'post.published': {
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
        case 'post.failed': {
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
        case 'analytics.updated': {
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
        case 'subscription.ending': {
          if (typeof n.data.postId === 'number') {
            data = { postId: n.data.postId } as ApprovedPayloadDto;
          }
          break;
        }
        default:
          data = null;
      }
    }
    const title = { value: n.title };
    const message = { value: n.message };
    return {
      id: n.id,
      type: n.type,
      title,
      message,
      data,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
      readAt: n.readAt ? n.readAt.toISOString() : null,
      link: n.link ?? null,
    };
  }
}
