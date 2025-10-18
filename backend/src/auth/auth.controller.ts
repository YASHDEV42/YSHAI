import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Query,
  BadRequestException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Response } from 'express';
import { MessageResponseDto } from './dto/message-response.dto';
import { TokensResponseDto } from './dto/token-response.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { Request } from 'express';
import {
  ResetPasswordDto,
  ResendVerificationDto,
} from './dto/reset-password.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

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
  async login(
    @Req() req: { user: { id: number; email: string, role: string } },
    @Body() _body: LoginDto,
    // Use Response to set cookies
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
      req.user.email,
      req.user.role,
    );
    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return { message: 'Login successful' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokensResponseDto })
  async refresh(@Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    console.log('Refresh token from cookie:', refreshToken);
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 min
      path: '/',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { message: 'Tokens refreshed' };
  }
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'User logged out successfully.', type: String })
  @ApiNotFoundResponse({ description: 'Unauthorized.', type: String })
  async logout(@Req() req: { user: { id: number } }): Promise<void> {
    return await this.authService.logout(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({
    description: 'Password reset link sent.',
    type: MessageResponseDto,
  }) @ApiNotFoundResponse({
    description: 'Bad request.',
    type: MessageResponseDto,
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponseDto | void> {
    return await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'Password reset successfully.',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Bad request.',
    type: MessageResponseDto,
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({
    name: 'token',
    type: String,
    required: true,
    description: 'Verification token from email',
  })
  @ApiOkResponse({ description: 'Email verified successfully.', type: String })
  @ApiNotFoundResponse({
    description: 'Invalid or expired token.',
    type: String,
  })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const payload = this.authService.verifyEmailVerificationToken(token);
    if (!payload) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.authService.markEmailAsVerified(payload.id);
    return { message: 'Your email has been verified! You can now log in.' };
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiOkResponse({
    description: 'Verification email resent.',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Bad request (e.g. user not found or already verified).',
    type: MessageResponseDto,
  })
  @ApiBody({ type: ResendVerificationDto })
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.authService.findUserByEmail(dto.email);
    if (!user) {
      // Do not reveal whether email exists (security best practice)
      return {
        message:
          'If this email is registered, a verification link has been sent.',
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const token = this.authService.generateEmailVerificationToken(
      user.id,
      user.email,
    );
    await this.authService.sendVerificationEmail(user.email, token);
    return { message: 'Verification email resent.' };
  }
}
