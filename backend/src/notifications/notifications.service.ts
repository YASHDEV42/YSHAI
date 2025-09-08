import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly em: EntityManager) {}

  async list(userId: number): Promise<Notification[]> {
    return this.em.find(
      Notification,
      { user: { id: userId } },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  async markRead(
    userId: number,
    notificationId: number,
  ): Promise<{ message: string }> {
    const notif = await this.em.findOne(
      Notification,
      { id: notificationId },
      { populate: ['user'] },
    );
    if (!notif || notif.user.id !== userId) {
      throw new NotFoundException('Notification not found');
    }
    notif.read = true;
    await this.em.flush();
    return { message: 'Notification marked as read' } as const;
  }

  async unreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.em.count(Notification, {
      user: { id: userId },
      read: false,
    });
    return { count } as const;
  }

  async markAllRead(userId: number): Promise<{ message: string }> {
    const notifs = await this.em.find(Notification, {
      user: { id: userId },
      read: false,
    });
    notifs.forEach((n) => (n.read = true));
    await this.em.flush();
    return { message: 'All notifications marked as read' } as const;
  }
}
