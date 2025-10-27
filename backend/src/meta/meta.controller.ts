import { Body, Controller, Post } from '@nestjs/common';
import { MetaService } from './meta.service';
import { OauthCallbackDto } from './dto/oauth-callback.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Controller('meta')
export class MetaController {
  constructor(
    private readonly meta: MetaService,
    private readonly accounts: AccountsService,
  ) { }

  @Post('oauth/callback')
  async oauthCallback(@Body() { shortToken, userId }: OauthCallbackDto) {
    // 1) get long-lived user token
    let longUser: { access_token: string; expires_in: number };
    try {
      longUser = await this.meta.exchangeShortToLong(shortToken);
    } catch (e) {
      console.warn('⚠️ exchangeShortToLong failed, using original token');
      longUser = { access_token: shortToken, expires_in: 5184000 }; // 60 days fallback
    }

    // 2) get pages for this user
    const pages = (await this.meta.listPages(longUser.access_token)).data ?? [];
    if (!pages.length) {
      throw new Error('No Facebook Pages found for this user');
    }
    const page = pages[0]; // MVP: pick first page (later let user choose)
    const pageToken = page.access_token;

    // 3) get Instagram Business user id from page
    const igUserId = await this.meta.getIgUserId(page.id, pageToken);
    if (!igUserId) {
      throw new Error('No Instagram Business account connected to the selected Page');
    }

    // 4) Persist via your AccountsService
    const result = await this.accounts.link(
      Number(userId),
      { provider: 'instagram', providerAccountId: igUserId },
      {
        accessToken: pageToken,                 // used for posting
        refreshToken: longUser.access_token,    // long-lived user token (~60d)
        expiresAt: new Date(Date.now() + longUser.expires_in * 1000),
      },
    );

    return {
      ...result,
      providerAccountId: igUserId,
      pageId: page.id,
      pageName: page.name,
    };
  }
}
