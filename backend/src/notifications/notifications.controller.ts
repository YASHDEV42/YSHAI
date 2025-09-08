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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { Notification } from 'src/entities/notification.entity';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  async list(@Req() req: { user: { id: number } }): Promise<Notification[]> {
    return this.notifications.list(req.user.id);
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'notificationId', type: Number })
  async markRead(
    @Req() req: { user: { id: number } },
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<{ message: string }> {
    return this.notifications.markRead(req.user.id, notificationId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async unreadCount(
    @Req() req: { user: { id: number } },
  ): Promise<{ count: number }> {
    return this.notifications.unreadCount(req.user.id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    return this.notifications.markAllRead(req.user.id);
  }
}
