import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Query,
  BadRequestException,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Response } from 'express';
import { MessageResponseDto } from './dto/message-response.dto';
import { TokensResponseDto } from './dto/token-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: MessageResponseDto })
  async register(@Body() dto: RegisterDto): Promise<MessageResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) res: Response): Promise<MessageResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    try {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      });
    } catch (error) {
      console.error('Error setting access token cookie:', error);
    }
    res.cookie('refreshJwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log('Cookies set successfully');
    return { message: 'Login successful' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'User logged out successfully.', type: String })
  @ApiNotFoundResponse({ description: 'Unauthorized.', type: String })
  async logout(@Request() req: { user: any }): Promise<void> {
    return await this.authService.logout(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ description: 'Password reset link sent.', type: String })
  @ApiNotFoundResponse({ description: 'Bad request.', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', maxLength: 50, minLength: 5 },
      },
      required: ['email'],
    },
  })
  async forgotPassword(@Body('email') email: string): Promise<{ message: string } | void> {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ description: 'Password reset successfully.', type: Promise<{ message: string }> })
  @ApiNotFoundResponse({ description: 'Bad request.', type: Promise<{ message: string }> })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        newPassword: { type: 'string', minLength: 6 },
      },
      required: ['token', 'newPassword'],
    },
  })
  async resetPassword(@Body() dto: { token: string; newPassword: string }): Promise<{ message: string }> {
    return await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({ name: 'token', type: String, required: true, description: 'Verification token from email' })
  @ApiOkResponse({ description: 'Email verified successfully.', type: String })
  @ApiNotFoundResponse({ description: 'Invalid or expired token.', type: String })
  async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const payload = this.authService.verifyEmailVerificationToken(token);
    if (!payload) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.authService.markEmailAsVerified(payload.userId);
    return { message: 'Your email has been verified! You can now log in.' };
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiOkResponse({ description: 'Verification email resent.', type: String })
  @ApiNotFoundResponse({ description: 'Bad request (e.g. user not found or already verified).', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  })
  async resendVerification(@Body('email') email: string): Promise<{ message: string }> {
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      // Do not reveal whether email exists (security best practice)
      return { message: 'If this email is registered, a verification link has been sent.' };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const token = this.authService.generateEmailVerificationToken(user.id, user.email);
    await this.authService.sendVerificationEmail(user.email, token);
    return { message: 'Verification email resent.' };
  }
  @Post('refresh')
  @ApiOkResponse({ type: TokensResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensResponseDto> {
    return this.authService.refresh(dto.userId, dto.refreshToken);
  }
}
