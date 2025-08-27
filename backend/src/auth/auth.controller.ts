import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.gurad';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'src/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. email already exists).',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'User logged in successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. invalid email).',
  })
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. invalid refresh token).',
  })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.userId, dto.refreshToken);
  }
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req: { user: any }): any {
    if (!req.user) return null;
    return req.user;
  }
}
