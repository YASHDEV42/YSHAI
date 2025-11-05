import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { LinkAccountWithTokensDto } from './dto/link-account-with-tokens.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LinkAccountResponseDto } from './dto/link-account.response.dto';
import { MessageDto } from 'src/common/dto/message.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Link Account' })
  @ApiResponse({ status: 201, type: LinkAccountResponseDto })
  link(
    @Req() req: { user: { id: number } },
    @Body() dto: LinkAccountWithTokensDto,
  ): Promise<{ id: number; message: string }> {
    type LinkBody = {
      provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';
      providerAccountId: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: string;
    };
    const body: LinkBody = dto;
    const tokenPayload =
      body.accessToken || body.refreshToken || body.expiresAt
        ? {
            accessToken: body.accessToken,
            refreshToken: body.refreshToken,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
          }
        : undefined;

    return this.accounts.link(
      req.user.id,
      { provider: body.provider, providerAccountId: body.providerAccountId },
      tokenPayload,
    );
  }

  @Delete(':accountId')
  @ApiOperation({ summary: 'Unlink Account' })
  @ApiResponse({ status: 200, type: MessageDto })
  unlink(
    @Req() req: { user: { id: number } },
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<{ message: string }> {
    return this.accounts.unlink(req.user.id, accountId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'List connected accounts for the authenticated user',
  })
  async getMyAccounts(@Req() req: { user: { id: number } }) {
    return this.accounts.listForUser(req.user.id);
  }
}
