import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Query,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { TokensResponseDto } from './dto/token-response.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResetPasswordDto,
  ResendVerificationDto,
} from './dto/reset-password.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';

@ApiStandardErrors()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: MessageResponseDto })
  async register(@Body() dto: RegisterDto): Promise<MessageResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiBody({ type: LoginDto })
  async login(
    @Req() req: { user: { id: number; email: string; role: string } },
    @Body() _body: LoginDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.login(
      req.user.id,
      req.user.email,
      req.user.role,
    );
    return { accessToken };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokensResponseDto })
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const { accessToken } = await this.authService.refresh(dto.refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'User logged out successfully.', type: String })
  async logout(@Req() req: { user: { id: number } }): Promise<void> {
    return this.authService.logout(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponseDto | void> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({
    name: 'token',
    type: String,
    required: true,
    description: 'Verification token from email',
  })
  @ApiOkResponse({
    description: 'Email verified successfully.',
    type: MessageResponseDto,
  })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<MessageResponseDto> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const payload = this.authService.verifyEmailVerificationToken(token);
    if (!payload) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    await this.authService.markEmailAsVerified(payload.id);

    return { message: 'Your email has been verified! You can now log in.' };
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBody({ type: ResendVerificationDto })
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.authService.findUserByEmail(dto.email);

    if (!user) {
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
