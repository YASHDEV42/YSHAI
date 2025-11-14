import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Delete,
  Post,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
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
  async getProfile(
    @Req() req: { user: { id: number } },
  ): Promise<UserResponseDto> {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  async changePassword(
    @Req() req: { user: { id: number } },
    @Body() body: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(req.user.id, body);
  }

  @Put('me/email')
  @ApiOperation({ summary: 'Change current user email' })
  @ApiResponse({ status: 200, description: 'Email change requested.' })
  async changeEmail(
    @Req() req: { user: { id: number } },
    @Body() body: ChangeEmailDto,
  ): Promise<{ message: string }> {
    return this.usersService.changeEmail(req.user.id, body);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted.' })
  async deleteAccount(
    @Req() req: { user: { id: number } },
    @Body() body: DeleteAccountDto,
  ): Promise<{ message: string }> {
    return this.usersService.deleteAccount(req.user.id, body);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user using JWT' })
  @ApiOkResponse({
    description: 'Current user updated successfully.',
    type: UserResponseDto,
  })
  async updateProfile(
    @Req() req: { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

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

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload or update current user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (PNG or JPEG)',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({
    description: 'Avatar uploaded successfully.',
    type: UserResponseDto,
  })
  async uploadAvatar(
    @Req() req: { user: { id: number } },
    @UploadedFile() file: { path?: string; buffer?: Buffer },
  ): Promise<UserResponseDto> {
    return await this.usersService.uploadAvatarFromFile(req.user.id, file);
  }

  @Delete('me/avatar')
  @ApiOperation({ summary: 'Remove current user avatar' })
  @ApiOkResponse({
    description: 'Avatar removed successfully.',
    type: UserResponseDto,
  })
  async removeAvatar(
    @Req() req: { user: { id: number } },
  ): Promise<UserResponseDto> {
    return this.usersService.updateAvatarUrl(req.user.id, null);
  }
}
