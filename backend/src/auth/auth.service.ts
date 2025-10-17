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
import { RegisterDto } from './dto/register.dto';

const logger = new Logger('Auth');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly mailer: MailerService,
  ) { }

  // generate token
  private async generateTokens(
    id: number,
    email: string,
    role: string,
    ipAddress: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { id, email, role };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const user = await this.em.findOneOrFail(User, { id });
    await this.em.nativeUpdate(
      RefreshToken,
      { userId: id },
      { revoked: true },
    );
    const tokenEntity = this.em.create(RefreshToken, {
      user,
      userId: id,
      tokenHash,
      revoked: false,
      ipAddress,
      userAgent: '<user_agent>', //TODO: get actual user agent
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.em.persistAndFlush(tokenEntity);

    return { accessToken, refreshToken };
  }

  // find user by email Function
  async findUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  // send verification email Function
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
    await this.mailer.sendEmailVerification(email, url);
  }

  // register User Function
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const { email, password, name, timezone, timeFormat } = dto;
    //cheack if email already exists
    const existing = await this.em.findOne(User, { email });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    logger.log(`Registering user with email: ${email}`);

    //hash the password
    const hashed = await bcrypt.hash(password, 10);
    logger.log(`Password Hashed Successfully!`);

    //cerate the user
    const user = this.em.create(User, {
      email,
      passwordHash: hashed,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isEmailVerified: false,
      timezone,
      timeFormat,
    });
    await this.em.persistAndFlush(user);
    logger.log(`✅ User Registered Successfully!`);

    // generate email verification token
    const verificationToken = this.generateEmailVerificationToken(
      user.id,
      user.email,
    );
    await this.mailer.sendEmailVerification(user.email, verificationToken);
    logger.log(`Verification email sent to ${email}`);

    // reutrn success message
    return {
      message:
        'User registered. Please check your email to verify your account.',
    };
  }

  // generate email verification token Function
  generateEmailVerificationToken(id: number, email: string): string {
    //sign and return token
    return this.jwtService.sign(
      { id, email },
      {
        expiresIn: '1h',
        secret:
          process.env.JWT_VERIFICATION_SECRET || 'strong_secret_hahahah$%',
      },
    );
  }

  // verify email verification token Function
  verifyEmailVerificationToken(
    token: string,
  ): { id: number; email: string } | null {
    try {
      const payload: unknown = this.jwtService.verify(token, {
        secret:
          process.env.JWT_VERIFICATION_SECRET || 'strong_secret_hahahah$%',
      });

      const isValid = (p: unknown): p is { id: number; email: string } => {
        return (
          typeof p === 'object' &&
          p !== null &&
          'id' in p &&
          typeof (p as { id: unknown }).id === 'number' &&
          'email' in p &&
          typeof (p as { email: unknown }).email === 'string' &&
          ((p as { email: string }).email?.length ?? 0) > 0
        );
      };

      if (isValid(payload)) {
        return {
          id: payload.id,
          email: payload.email,
        };
      }

      logger.warn('Token payload has invalid structure', payload as any);
      return null;
    } catch (error) {
      logger.warn('Invalid or expired email verification token', error);
      return null;
    }
  }

  // mark email as verified Function
  async markEmailAsVerified(id: number): Promise<void> {
    //find the user
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    //marking email as verified
    logger.log(`Marking email as verified for user: ${user.email}`);
    if (user.isEmailVerified) {
      logger.log(`User ${user.email} already verified`);
      return;
    }
    user.isEmailVerified = true;
    user.updatedAt = new Date();
    await this.em.flush();
    logger.log(`Email verified for user: ${user.email}`);
  }

  // validate user Function
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.passwordHash) {
      throw new UnauthorizedException('Password not found');
    }
    if (!(await bcrypt.compare(pass, user.passwordHash))) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }
    logger.log('User validated successfully');
    return user;
  }

  // login User Function
  async login(id: number, email: string, role: string, ipAddress: string): Promise<{ accessToken: string; refreshToken: string }> {

    return this.generateTokens(id, email, role, ipAddress);
  }

  // logout User Function
  async logout(user: { id: number }): Promise<void> {
    //find the active token for this user and revoke it
    const token = await this.em.findOne(RefreshToken, {
      userId: user.id,
      revoked: false,
    });
    if (!token) {
      throw new BadRequestException('No active session found');
    }
    logger.log(`Logging out user`);
    if (token) {
      token.revoked = true;
      await this.em.persistAndFlush(token);
    }
    logger.log(`User logged out successfully`);
  }

  // refresh tokens Function
  async refresh(
    refreshToken: string,
    ipAddress: string = 'unknown'
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userPayload = await this.jwtService.verifyAsync(refreshToken);
    if (!userPayload) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { id } = userPayload as { id: number; email: string; role: string };
    const candidates = await this.em.find(
      RefreshToken,
      {
        user: id,
        revoked: false,
        expiresAt: { $gt: new Date() },
      },
      { orderBy: { createdAt: 'DESC' } },
    );
    if (!candidates || candidates.length === 0) {
      throw new UnauthorizedException('No valid refresh tokens found');
    }
    logger.log(
      `Found ${candidates.length} candidate tokens for user ID ${id}`,
    );

    // find the matching token
    for (const t of candidates) {
      const matches = await bcrypt.compare(refreshToken, t.tokenHash);
      if (!matches) continue;

      if (t.expiresAt < new Date())
        throw new UnauthorizedException('Expired refresh token');
      if (t.revoked) throw new UnauthorizedException('Revoked refresh token');

      const user = await this.em.findOne(User, { id });
      if (!user) throw new UnauthorizedException('User not found');

      logger.log(`Refresh token valid for user: ${user.email}`);
      return this.generateTokens(user.id, user.email, user.role, ipAddress);
    }

    logger.log(`No matching refresh token found for user ID ${id}`);
    throw new UnauthorizedException('Invalid refresh token');
  }

  // forgot password Function
  async forgotPassword(email: string): Promise<{ message: string } | void> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      // Do not reveal whether the email exists
      return;
    }

    logger.log(`Generating password reset token for ${email}`);
    await this.em.nativeUpdate(
      PasswordResetToken,
      { user, used: false, expiresAt: { $gt: new Date() } },
      { used: true },
    );

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const reset = this.em.create(PasswordResetToken, {
      user,
      tokenHash,
      used: false,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(reset);

    await this.mailer.sendPasswordResetEmail(user.email, token);
    logger.log(`Password reset token generated for ${email}`);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  // reset password Function
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword)
      throw new BadRequestException('Token and newPassword are required');

    logger.log(`Attempting password reset`);
    const tokenHash = createHash('sha256').update(token).digest('hex');
    if (!tokenHash) {
      logger.warn('Invalid token format');
      throw new BadRequestException('Invalid token format');
    }
    logger.log(`Token hash generated`);
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
      logger.warn('Invalid or expired password reset token');
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
