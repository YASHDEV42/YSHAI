import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { RefreshToken } from 'src/entities/refresh-token.entity';

const logger = new Logger('Auth');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly em: EntityManager,
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
}
