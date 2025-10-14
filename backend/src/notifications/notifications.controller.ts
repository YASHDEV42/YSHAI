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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto } from './dto/notification-response.dto';
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
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async list(
    @Req() req: { user: { id: number } },
  ): Promise<NotificationResponseDto[]> {
    const items = await this.notifications.list(req.user.id);
    return items.map((n) => ({
      id: n.id,
      type: n.type,
      payload: n.payload,
      read: n.read,
      createdAt: n.createdAt,
      link: n.link ?? null,
    }));
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
}
