import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}
  async getProfile(userId: number) {
    const user = await this.em.findOne(User, { id: userId });
    return user;
  }
  async updateProfile(userId: number, updateData: Partial<User>) {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    this.em.assign(user, updateData);
    await this.em.flush();
    return user;
  }
}
