import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'src/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. email already exists).',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({ name: 'token', type: String, required: true, description: 'Verification token from email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async verifyEmail(@Query('token') token: string) {
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
  @ApiResponse({ status: 200, description: 'Verification email resent.' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g. user not found or already verified).' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  })
  async resendVerification(@Body('email') email: string) {
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

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'User logged in successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid credentials or email not verified).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          maxLength: 50,
          minLength: 5,
        },
        password: {
          type: 'string',
          maxLength: 100,
          minLength: 6,
        },
      },
      required: ['email', 'password'],
    },
  })
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  logout(@Request() req: { user: User }) {
    return this.authService.logout(req.user);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. invalid refresh token).',
  })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.userId, dto.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 200, description: 'Password reset link sent.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', maxLength: 50, minLength: 5 },
      },
      required: ['email'],
    },
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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
  async resetPassword(@Body() dto: { token: string; newPassword: string }) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
