import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EntityManager } from '@mikro-orm/core';
import { MediaService } from 'src/media/media.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';

const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? 'v24.0';
const G = (p: string) => `https://graph.facebook.com/${GRAPH_VERSION}${p}`;

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
    private readonly media: MediaService,
    private readonly accounts: AccountsService,
  ) {}

  /**
   * Step 1: OAuth callback → link Instagram Business account and store tokens.
   */
  async handleOauthCallback(shortToken: string, userId: string) {
    // 1) Exchange short → long-lived user token
    let longUser: { access_token: string; expires_in: number };
    try {
      this.logger.log('Exchanging short-lived token for long-lived token...');
      longUser = await this.exchangeShortToLong(shortToken);
    } catch {
      this.logger.warn(
        'exchangeShortToLong failed—using short token as fallback',
      );
      longUser = { access_token: shortToken, expires_in: 60 * 24 * 60 * 60 }; // ~60d (seconds)
      this.logger.log(
        'exchangeShortToLong successfully completed',
        longUser.access_token,
      );
    }

    // 2) Get Pages for that user
    let page: { id: string; name: string; access_token: string } | null = null;

    this.logger.log('Listing Facebook Pages for user...');
    const pagesResp = await this.listPages(longUser.access_token);
    const pages = pagesResp?.data ?? [];
    if (!pages.length) throw new BadRequestException('No Facebook Pages found');
    page = pages[0];
    this.logger.log('successfully listed Facebook Pages:', pages);

    // 3) Get connected IG business account id.id, page?.access_token);
    const igUserId = await this.getIgUserId(page?.id, page?.access_token);
    if (!igUserId) {
      throw new BadRequestException(
        'No Instagram Business account connected to the selected Page',
      );
    }

    // 4) Persist: access = page token, refresh = user long-lived token
    const expiresInSeconds =
      typeof longUser.expires_in === 'number' && !isNaN(longUser.expires_in)
        ? longUser.expires_in
        : 60 * 24 * 60 * 60; // 60 days fallback

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    if (isNaN(expiresAt.getTime())) {
      // still invalid → don’t persist the field
      this.logger.warn('⚠️ Invalid expiresAt, skipping timestamp persist');
    }

    const link = await this.accounts.link(
      Number(userId),
      { provider: 'instagram', providerAccountId: igUserId },
      {
        accessToken: page.access_token,
        refreshToken: longUser.access_token,
        expiresAt: isNaN(expiresAt.getTime()) ? undefined : expiresAt,
      },
    );

    this.logger.log(
      `Linked IG account ${igUserId} for user ${userId} (page: ${page.name})`,
    );

    return {
      id: link.id,
      message: 'Account linked',
      providerAccountId: igUserId,
      pageId: page.id,
      pageName: page.name,
    };
  }

  /**
   * Step 2: Publish with auto-refresh
   * - Upload to Cloudinary (MediaService)
   * - Try create/publish
   * - If token expired (190/463), use REFRESH (user long-lived) to mint new PAGE token,
   *   save it, and retry once.
   */
  async publishWithAutoRefresh(params: {
    file: Express.Multer.File;
    userId: number;
    caption: string;
  }) {
    const { file, userId, caption } = params;

    // Upload media first
    const media = await this.media.upload({ buffer: file.buffer });

    // Find IG account + tokens
    const account = await this.em.findOne(
      SocialAccount,
      { user: userId, provider: 'instagram' },
      { populate: ['tokens'] },
    );
    if (!account) throw new NotFoundException('Instagram account not linked');

    let pageAccessToken =
      account.tokens.getItems().find((t) => t.tokenType === 'access')
        ?.tokenEncrypted ?? null;
    const userLongLived =
      account.tokens.getItems().find((t) => t.tokenType === 'refresh')
        ?.tokenEncrypted ?? null;

    if (!userLongLived) {
      throw new BadRequestException('Missing long-lived user token (refresh)');
    }
    if (!pageAccessToken) {
      // No page token stored yet? mint one now from user token
      pageAccessToken = await this.mintPageAccessTokenFromUser(
        account,
        userLongLived,
      );
    }

    // Try publish
    try {
      const res = await this.publishToInstagram({
        accessToken: pageAccessToken,
        caption,
        mediaUrl: media.url,
        providerAccountId: account.providerAccountId,
      });
      return {
        success: true,
        ...res,
        cloudinaryUrl: media.url,
      };
    } catch (err: any) {
      const fbErr = err?.response?.data?.error;
      const expired =
        fbErr?.code === 190 &&
        (fbErr?.error_subcode === 463 || fbErr?.error_subcode === 490);
      if (!expired) {
        // rethrow non-expiration errors
        throw new BadRequestException(
          fbErr ?? err?.message ?? 'Publish failed',
        );
      }

      this.logger.warn(
        'Page access token expired—minting a fresh one and retrying once…',
      );
      // Mint new PAGE token from USER long-lived
      const freshPageToken = await this.mintPageAccessTokenFromUser(
        account,
        userLongLived,
      );

      // Retry once
      const res = await this.publishToInstagram({
        accessToken: freshPageToken,
        caption,
        mediaUrl: media.url,
        providerAccountId: account.providerAccountId,
      });

      return {
        success: true,
        ...res,
        cloudinaryUrl: media.url,
        refreshed: true,
      };
    }
  }

  /**
   * Low-level publish (no refresh logic).
   */
  async publishToInstagram(params: {
    accessToken: string;
    caption: string;
    mediaUrl: string;
    providerAccountId: string; // IG user id
  }) {
    const { accessToken, caption, mediaUrl, providerAccountId } = params;

    // 1) Create media container
    const createRes = await lastValueFrom(
      this.http.post(G(`/${providerAccountId}/media`), {
        image_url: mediaUrl,
        caption,
        access_token: accessToken,
      }),
    );
    const creationId = createRes?.data?.id;
    if (!creationId) throw new BadRequestException('Failed to create media');

    // Wait until media is ready
    await this.waitForMediaReady(creationId, accessToken);

    // 2) Publish container
    const publishRes = await lastValueFrom(
      this.http.post(G(`/${providerAccountId}/media_publish`), {
        creation_id: creationId,
        access_token: accessToken,
      }),
    );
    const igPostId = publishRes?.data?.id;

    // 3) Fetch permalink + timestamp
    const details = await lastValueFrom(
      this.http.get(G(`/${igPostId}`), {
        params: {
          fields: 'id,permalink,timestamp,media_type,media_url,caption',
          access_token: accessToken,
        },
      }),
    );

    return {
      externalPostId: details.data.id,
      externalUrl: details.data.permalink,
      publishedAt: new Date(details.data.timestamp),
      mediaType: details.data.media_type,
      mediaUrl: details.data.media_url,
      caption: details.data.caption,
    };
  }

  /**
   * Mint a fresh PAGE access token from a long-lived USER token
   * and persist it as the current 'access' token.
   */
  private async mintPageAccessTokenFromUser(
    account: SocialAccount,
    userLongLived: string,
  ) {
    // You can request a page token via: GET /{page-id}?fields=access_token&access_token={USER_TOKEN}
    // We need a page-id; we can fetch it through /me/accounts using the user token,
    // then find the page that owns the IG user id.
    const pagesResp = await lastValueFrom(
      this.http.get(G('/me/accounts'), {
        params: { access_token: userLongLived },
      }),
    );
    const pages: Array<{ id: string; access_token: string }> =
      pagesResp.data?.data ?? [];

    // Find the page that has this IG business account
    let pageAccessToken: string | null = null;
    for (const p of pages) {
      try {
        const igResp = await lastValueFrom(
          this.http.get(G(`/${p.id}`), {
            params: {
              fields: 'instagram_business_account',
              access_token: p.access_token, // can use page token here to query itself
            },
          }),
        );
        const foundIg = igResp.data?.instagram_business_account?.id;
        if (foundIg && foundIg === account.providerAccountId) {
          pageAccessToken = p.access_token;
          break;
        }
      } catch {
        // ignore and continue
      }
    }

    if (!pageAccessToken) {
      // Fallback: ask for page access_token directly with user token on the first page
      // (rarely needed if above loop finds it)
      const p = pages[0];
      if (!p)
        throw new BadRequestException('No pages available to mint page token');
      const pageDetail = await lastValueFrom(
        this.http.get(G(`/${p.id}`), {
          params: { fields: 'access_token', access_token: userLongLived },
        }),
      );
      pageAccessToken = pageDetail.data?.access_token;
    }

    if (!pageAccessToken) {
      throw new BadRequestException('Failed to mint page access token');
    }

    // Persist as the latest 'access' token
    const em = this.em.fork();
    const old = account.tokens.getItems().find((t) => t.tokenType === 'access');
    if (old) {
      old.tokenEncrypted = pageAccessToken;
      old.expiresAt = undefined; // page tokens typically don’t expose expiry
    } else {
      const newTok = em.create(AccountToken, {
        account: em.getReference(SocialAccount, account.id),
        tokenType: 'access',
        tokenEncrypted: pageAccessToken,
        revoked: false,
        createdAt: new Date(),
      });
      em.persist(newTok);
      account.tokens.add(newTok);
    }
    await em.flush();

    return pageAccessToken;
  }

  // ===== helpers used during OAuth linking =====

  private async exchangeShortToLong(shortToken: string) {
    const res = await lastValueFrom(
      this.http.get(G('/oauth/access_token'), {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.META_CLIENT_ID || process.env.META_APP_ID,
          client_secret:
            process.env.META_CLIENT_SECRET || process.env.META_APP_SECRET,
          fb_exchange_token: shortToken,
        },
      }),
    );
    return res.data as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
  }

  private async listPages(longUserToken: string) {
    const res = await lastValueFrom(
      this.http.get(G('/me/accounts'), {
        params: { access_token: longUserToken },
      }),
    );
    return res.data as {
      data: Array<{ id: string; name: string; access_token: string }>;
    };
  }

  private async getIgUserId(pageId: string, pageToken: string) {
    const res = await lastValueFrom(
      this.http.get(G(`/${pageId}`), {
        params: {
          fields: 'instagram_business_account',
          access_token: pageToken,
        },
      }),
    );
    return (res.data?.instagram_business_account?.id as string) ?? null;
  }

  private async waitForMediaReady(creationId: string, accessToken: string) {
    let status = 'IN_PROGRESS';
    while (status === 'IN_PROGRESS') {
      await new Promise((r) => setTimeout(r, 2000));
      const checkRes = await lastValueFrom(
        this.http.get(G(`/${creationId}`), {
          params: { fields: 'status_code', access_token: accessToken },
        }),
      );
      status = checkRes.data.status_code;
      this.logger.debug(`🎞 Media upload status: ${status}`);
    }
    if (status !== 'FINISHED') {
      throw new BadRequestException(`Media upload failed: ${status}`);
    }
  }
  /**
   * Get the connected Instagram Business account details
   * - username
   * - followers_count
   * - profile_picture_url
   */
  async getInstagramProfile(pageId: string, pageAccessToken: string) {
    // Step 1: Get IG user ID for this Page
    const igUserId = await this.getIgUserId(pageId, pageAccessToken);
    if (!igUserId) {
      throw new BadRequestException(
        `No Instagram Business account connected to Page ${pageId}`,
      );
    }

    // Step 2: Fetch IG profile details
    this.logger.log(`Fetching Instagram profile for IG user ID: ${igUserId}`);

    const res = await lastValueFrom(
      this.http.get(G(`/${igUserId}`), {
        params: {
          fields: 'id,username,followers_count,profile_picture_url',
          access_token: pageAccessToken,
        },
      }),
    );

    const data = res.data;
    return {
      igUserId: data.id,
      username: data.username,
      followersCount: data.followers_count,
      profilePicture: data.profile_picture_url,
    };
  }

  /**
   * Get Page ID for a linked Instagram account
   * (useful for debugging or verifying linkage)
   */
  async getPageIdFromIgAccount(
    igUserId: string,
    userLongLivedToken: string,
  ): Promise<{ pageId: string; pageName: string } | null> {
    this.logger.log(`Resolving Page ID for IG Business account ${igUserId}...`);

    // Use the user's long-lived token to list pages
    const res = await lastValueFrom(
      this.http.get(G('/me/accounts'), {
        params: { access_token: userLongLivedToken },
      }),
    );

    const pages: Array<{ id: string; name: string; access_token: string }> =
      res.data?.data ?? [];

    for (const p of pages) {
      try {
        const igResp = await lastValueFrom(
          this.http.get(G(`/${p.id}`), {
            params: {
              fields: 'instagram_business_account',
              access_token: p.access_token,
            },
          }),
        );
        const foundIg = igResp.data?.instagram_business_account?.id;
        if (foundIg && foundIg === igUserId) {
          this.logger.log(
            `✅ Found Page ${p.name} (${p.id}) linked to IG account ${igUserId}`,
          );
          return { pageId: p.id, pageName: p.name };
        }
      } catch {
        continue;
      }
    }

    this.logger.warn(`⚠️ No page found linked to IG account ${igUserId}`);
    return null;
  }
}
