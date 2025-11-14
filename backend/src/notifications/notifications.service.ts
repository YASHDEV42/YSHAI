import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly em: EntityManager) {}

  async list(
    userId: number,
    options?: { limit?: number; offset?: number },
  ): Promise<Notification[]> {
    const { limit = 50, offset = 0 } = options ?? {};

    return this.em.find(
      Notification,
      { user: { id: userId }, deletedAt: null },
      {
        orderBy: { createdAt: 'DESC' },
        limit,
        offset,
      },
    );
  }

  async markRead(
    userId: number,
    notificationId: number,
  ): Promise<{ message: string }> {
    const notif = await this.em.findOne(
      Notification,
      { id: notificationId, deletedAt: null },
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
      deletedAt: null,
    });
    return { count } as const;
  }

  async markAllRead(userId: number): Promise<{ message: string }> {
    const notifs = await this.em.find(Notification, {
      user: { id: userId },
      read: false,
      deletedAt: null,
    });
    notifs.forEach((n) => (n.read = true));
    await this.em.flush();
    return { message: 'All notifications marked as read' } as const;
  }

  async delete(
    userId: number,
    notificationId: number,
  ): Promise<{ message: string }> {
    const notif = await this.em.findOne(
      Notification,
      { id: notificationId, deletedAt: null },
      { populate: ['user'] },
    );
    if (!notif || notif.user.id !== userId) {
      throw new NotFoundException('Notification not found');
    }
    notif.deletedAt = new Date();
    await this.em.flush();
    return { message: 'Notification deleted' } as const;
  }

  async deleteAll(userId: number): Promise<{ message: string }> {
    const notifs = await this.em.find(Notification, {
      user: { id: userId },
      deletedAt: null,
    });
    notifs.forEach((n) => {
      n.deletedAt = new Date();
    });
    await this.em.flush();
    return { message: 'All notifications deleted' } as const;
  }
}
