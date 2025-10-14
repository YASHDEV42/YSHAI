import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}
  async getProfile(userId: number) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    //saving the file
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
  async updateProfile(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    this.em.assign(user, updateData);
    await this.em.flush();
    return user;
  }

  async updatePreferences(
    userId: number,
    prefs: UpdatePreferencesDto,
  ): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    if (prefs.timezone !== undefined) user.timezone = prefs.timezone;
    if (prefs.language !== undefined) user.language = prefs.language;
    if (prefs.locale !== undefined) user.locale = prefs.locale;
    if (prefs.timeFormat !== undefined) user.timeFormat = prefs.timeFormat;
    // Optional extension points: user.language, user.locale, user.timeFormat
    await this.em.flush();
    return { message: 'Preferences updated' };
  }
}
