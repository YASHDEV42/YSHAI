import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get current user profile using JWT
  @Get('me')
  @ApiOperation({ summary: 'Get current user using JWT' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async getProfile(@Req() req: { user: { id: number } }) {
    return this.usersService.getProfile(req.user.id);
  }

  // update current user profile using JWT
  @Put('me')
  @ApiOperation({ summary: 'Update current user using JWT' })
  @ApiResponse({
    status: 200,
    description: 'Current user updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async updateProfile(
    @Req() req: { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  // update current user preferences using JWT
  @Put('me/preferences')
  @ApiOperation({ summary: 'Update current user preferences using JWT' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully.',
  })
  async updatePreferences(
    @Req() req: { user: { id: number } },
    @Body() body: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(req.user.id, body);
  }
}
