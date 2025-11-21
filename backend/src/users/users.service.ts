import { EntityManager } from '@mikro-orm/core';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entities/user.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    private readonly mediaService: MediaService,
  ) {}

  async getProfile(id: number): Promise<UserResponseDto> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toDto(user);
  }
  async updateProfile(
    id: number,
    updateData: Partial<User>,
  ): Promise<UserResponseDto> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.em.assign(user, updateData);
    await this.em.flush();
    return this.toDto(user);
  }

  async updatePreferences(
    id: number,
    prefs: UpdatePreferencesDto,
  ): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (prefs.timezone !== undefined) user.timezone = prefs.timezone;
    if (prefs.language !== undefined) user.language = prefs.language;
    if (prefs.locale !== undefined) user.locale = prefs.locale;
    if (prefs.timeFormat !== undefined) user.timeFormat = prefs.timeFormat;
    // Optional extension points: user.language, user.locale, user.timeFormat
    await this.em.flush();
    return { message: 'Preferences updated' };
  }

  async changePassword(
    id: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id });
    if (!user || !user.passwordHash) {
      throw new NotFoundException('User not found');
    }

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.em.flush();
    return { message: 'Password changed successfully' };
  }

  async changeEmail(
    id: number,
    dto: ChangeEmailDto,
  ): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.email = dto.newEmail;
    user.isEmailVerified = false;
    await this.em.flush();
    return { message: 'Email updated. Please verify your new email.' };
  }

  async deleteAccount(
    id: number,
    dto: DeleteAccountDto,
  ): Promise<{ message: string }> {
    if (dto.confirm !== 'DELETE') {
      throw new BadRequestException('Confirmation phrase mismatch');
    }

    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete: mark deletedAt
    user.deletedAt = new Date();
    await this.em.flush();
    return { message: 'Account deleted' };
  }

  private toDto(user: User): UserResponseDto {
    return UserResponseDto.fromEntity(user);
  }
}
