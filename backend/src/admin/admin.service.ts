import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { AuditLog } from 'src/entities/audit-log.entity';

@Injectable()
export class AdminService {
  constructor(private readonly em: EntityManager) {}

  async listUsers(): Promise<User[]> {
    return this.em.find(User, {}, { orderBy: { createdAt: 'DESC' } });
  }

  async banUser(userId: number): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new NotFoundException('User not found');
    user.deletedAt = new Date();
    await this.em.flush();
    return { message: 'User banned' };
  }

  async assignRole(
    userId: number,
    role: 'user' | 'admin',
  ): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.em.flush();
    return { message: 'Role updated' };
  }

  async auditLogs(): Promise<AuditLog[]> {
    return this.em.find(
      AuditLog,
      {},
      {
        orderBy: { createdAt: 'DESC' },
        limit: 200,
      },
    );
  }
}
