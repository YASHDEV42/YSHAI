import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { LinkAccountWithTokensDto } from './dto/link-account-with-tokens.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Link Account' })
  link(
    @Req() req: { user: { userId: number } },
    @Body() dto: LinkAccountWithTokensDto,
  ): Promise<{ id: number; message: string }> {
    type LinkBody = {
      provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';
      providerAccountId: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: string;
    };
    const body = dto as unknown as LinkBody;
    const tokenPayload =
      body.accessToken || body.refreshToken || body.expiresAt
        ? {
            accessToken: body.accessToken,
            refreshToken: body.refreshToken,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
          }
        : undefined;

    return this.accounts.link(
      req.user.userId,
      { provider: body.provider, providerAccountId: body.providerAccountId },
      tokenPayload,
    );
  }

  @Delete(':accountId')
  @ApiOperation({ summary: 'Unlink Account' })
  unlink(
    @Req() req: { user: { userId: number } },
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<{ message: string }> {
    return this.accounts.unlink(req.user.userId, accountId);
  }
}
