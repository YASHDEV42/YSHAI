import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { randomBytes, createHash } from 'crypto';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { PasswordResetToken } from 'src/entities/password-reset-token.entity';
import { MailerService } from 'src/mailer/mailer.service';

const logger = new Logger('Auth');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly mailer: MailerService,
  ) {}
  private async generateTokens(user: User) {
    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const tokenEntity = this.em.create(RefreshToken, {
      user,
      userId: user.id,
      tokenHash,
      revoked: false,
      ipAddress: '<user_ip_address>',
      userAgent: '<user_agent>',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.em.persistAndFlush(tokenEntity);

    return { accessToken, refreshToken };
  }
  async register(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);
    logger.log(`Password Hashed Successfully!`);
    const user = this.em.create(User, {
      email,
      passwordHash: hashed,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
    });
    await this.em.persistAndFlush(user);
    logger.log(`User Registered Successfully!`);
    return this.generateTokens(user);
  }
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (await bcrypt.compare(pass, user.passwordHash)) {
      logger.log('User validated successfully');
      return user;
    }
    throw new UnauthorizedException('Invalid password');
  }

  async login(user: User) {
    return this.generateTokens(user);
  }
  async logout(user: User) {
    const token = await this.em.findOne(RefreshToken, {
      userId: user.id,
      revoked: false,
    });
    if (token) {
      token.revoked = true;
      await this.em.persistAndFlush(token);
    }
  }
  async refresh(userId: number, refreshToken: string) {
    const candidates = await this.em.find(
      RefreshToken,
      {
        user: userId,
        revoked: false,
        expiresAt: { $gt: new Date() },
      },
      { orderBy: { createdAt: 'DESC' } },
    );

    for (const t of candidates) {
      const matches = await bcrypt.compare(refreshToken, t.tokenHash);
      if (!matches) continue;

      if (t.expiresAt < new Date())
        throw new UnauthorizedException('Expired refresh token');
      if (t.revoked) throw new UnauthorizedException('Revoked refresh token');

      const user = await this.em.findOne(User, { id: userId });
      if (!user) throw new UnauthorizedException('User not found');

      return this.generateTokens(user);
    }

    throw new UnauthorizedException('Invalid refresh token');
  }
  async forgotPassword(email: string) {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      // Do not reveal whether the email exists
      return;
    }

    // Invalidate any previous active tokens for this user
    await this.em.nativeUpdate(
      PasswordResetToken,
      { user, used: false, expiresAt: { $gt: new Date() } },
      { used: true },
    );

    // Generate a secure token and store only its hash in a separate entity
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const reset = this.em.create(PasswordResetToken, {
      user,
      tokenHash,
      used: false,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(reset);

    // Send email with the plain token embedded in a reset link
    await this.mailer.sendPasswordResetEmail(user.email, token);
    logger.log(`Password reset token generated for ${email}`);

    return { message: 'If the email exists, a reset link has been sent.' };
  }
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword)
      throw new BadRequestException('Token and newPassword are required');

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const reset = await this.em.findOne(
      PasswordResetToken,
      {
        tokenHash,
        used: false,
        expiresAt: { $gt: new Date() },
      },
      { populate: ['user'] },
    );
    if (!reset) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = reset.user as User;
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    reset.used = true;
    await this.em.persistAndFlush([user, reset]);
    logger.log(`Password reset successfully for user ${user.email}`);
    return { message: 'Password reset successfully' };
  }
}
