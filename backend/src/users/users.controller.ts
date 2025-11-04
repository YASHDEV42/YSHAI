import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Logger,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
const logger = new Logger('UsersController');

@ApiTags('Users')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user using JWT' })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async getProfile(
    @Req() req: { user: { id: number } },
  ): Promise<UserResponseDto> {
    return this.usersService.getProfile(req.user.id);
  }

  // update current user profile using JWT
  @Put('me')
  @ApiOperation({ summary: 'Update current user using JWT' })
  @ApiOkResponse({
    description: 'Current user updated successfully.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updateProfile(
    @Req() req: { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
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
  ): Promise<{ message: string }> {
    return this.usersService.updatePreferences(req.user.id, body);
  }
}
