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
   * =======================================
   * STEP 1: OAuth → Link Instagram Account
   * =======================================
   */
  async handleOauthCallback(shortToken: string, userId: number) {
    let longUser: { access_token: string; expires_in: number };

    try {
      this.logger.log('Exchanging short-lived token for long-lived token...');
      longUser = await this.exchangeShortToLong(shortToken);
    } catch {
      this.logger.warn('Exchange failed — using short token as fallback');
      longUser = { access_token: shortToken, expires_in: 60 * 24 * 60 * 60 };
    }

    this.logger.log('Listing Facebook Pages for user...');
    const pagesResp = await this.listPages(longUser.access_token);
    const pages = pagesResp?.data ?? [];
    if (!pages.length) throw new BadRequestException('No Facebook Pages found');

    const page = pages[0];
    this.logger.log('✅ Found pages:', pages);

    const igUserId = await this.getIgUserId(page.id, page.access_token);
    if (!igUserId) {
      throw new BadRequestException(
        'No Instagram Business account connected to the selected Page',
      );
    }

    const expiresAt = new Date(
      Date.now() + (longUser.expires_in || 5184000) * 1000,
    );

    const link = await this.accounts.link(
      userId,
      {
        provider: 'instagram',
        providerAccountId: igUserId,
      },
      {
        accessToken: page.access_token,
        refreshToken: longUser.access_token,
        expiresAt: isNaN(expiresAt.getTime()) ? undefined : expiresAt,
      },
    );

    // Update the linked account with its Page info
    const accountEntity = await this.em.findOne(SocialAccount, { id: link.id });
    if (accountEntity) {
      (accountEntity as any).pageId = page.id;
      (accountEntity as any).pageName = page.name;
      await this.em.flush();
    }

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
   * =======================================
   * STEP 2: Publish with Auto Token Refresh
   * =======================================
   */
  async publishWithAutoRefresh(params: {
    file: Express.Multer.File;
    userId: number;
    caption: string;
  }) {
    const { file, userId, caption } = params;

    const media = await this.media.upload({ buffer: file.buffer });

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
      pageAccessToken = await this.mintPageAccessTokenFromUser(
        account,
        userLongLived,
      );
    }

    try {
      const res = await this.publishToInstagram({
        accessToken: pageAccessToken,
        caption,
        mediaUrl: media.url,
        providerAccountId: account.providerAccountId,
      });
      return { success: true, ...res, cloudinaryUrl: media.url };
    } catch (err: any) {
      const fbErr = err?.response?.data?.error;
      const expired =
        fbErr?.code === 190 &&
        (fbErr?.error_subcode === 463 || fbErr?.error_subcode === 490);

      if (!expired)
        throw new BadRequestException(
          fbErr ?? err?.message ?? 'Publish failed',
        );

      this.logger.warn('Access token expired — refreshing...');
      const freshPageToken = await this.mintPageAccessTokenFromUser(
        account,
        userLongLived,
      );

      const res = await this.publishToInstagram({
        accessToken: freshPageToken,
        caption,
        mediaUrl: media.url,
        providerAccountId: account.providerAccountId,
      });
      return { success: true, ...res, refreshed: true };
    }
  }

  async publishToInstagram(params: {
    accessToken: string;
    caption: string;
    mediaUrl: string;
    providerAccountId: string;
  }) {
    const { accessToken, caption, mediaUrl, providerAccountId } = params;

    const createRes = await lastValueFrom(
      this.http.post(G(`/${providerAccountId}/media`), {
        image_url: mediaUrl,
        caption,
        access_token: accessToken,
      }),
    );

    const creationId = createRes?.data?.id;
    if (!creationId) throw new BadRequestException('Failed to create media');

    await this.waitForMediaReady(creationId, accessToken);

    const publishRes = await lastValueFrom(
      this.http.post(G(`/${providerAccountId}/media_publish`), {
        creation_id: creationId,
        access_token: accessToken,
      }),
    );

    const igPostId = publishRes?.data?.id;

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
   * =======================================
   * NEW ✨: Get Instagram Posts
   * =======================================
   */
  async getInstagramPosts(igUserId: string, accessToken: string) {
    this.logger.log(`Fetching Instagram posts for IG user ID: ${igUserId}`);

    const res = await lastValueFrom(
      this.http.get(G(`/${igUserId}/media`), {
        params: {
          fields:
            'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,thumbnail_url',
          access_token: accessToken,
        },
      }),
    );

    const posts = res.data?.data ?? [];
    if (!posts.length) this.logger.warn('No posts found for this account');

    return posts.map((p: any) => ({
      id: p.id,
      caption: p.caption || '',
      mediaUrl: p.media_url || p.thumbnail_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      likeCount: p.like_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      mediaType: p.media_type,
    }));
  }

  /**
   * =======================================
   * Instagram Profile & Page Resolution
   * =======================================
   */
  async getInstagramProfile(pageId: string, pageAccessToken: string) {
    const igUserId = await this.getIgUserId(pageId, pageAccessToken);
    if (!igUserId) {
      throw new BadRequestException(
        `No Instagram Business account connected to Page ${pageId}`,
      );
    }

    const res = await lastValueFrom(
      this.http.get(G(`/${igUserId}`), {
        params: {
          fields: 'id,username,followers_count,profile_picture_url',
          access_token: pageAccessToken,
        },
      }),
    );

    return {
      igUserId: res.data.id,
      username: res.data.username,
      followersCount: res.data.followers_count,
      profilePicture: res.data.profile_picture_url,
    };
  }

  async getPageIdFromIgAccount(
    igUserId: string,
    userLongLivedToken: string,
  ): Promise<{ pageId: string; pageName: string } | null> {
    this.logger.log(`Resolving Page ID for IG account ${igUserId}...`);
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
        if (foundIg && foundIg === igUserId)
          return { pageId: p.id, pageName: p.name };
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * =======================================
   * Internal Helpers
   * =======================================
   */
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
    return res.data?.instagram_business_account?.id ?? null;
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
    }
    if (status !== 'FINISHED')
      throw new BadRequestException(`Media upload failed: ${status}`);
  }
  private async mintPageAccessTokenFromUser(
    account: SocialAccount,
    userLongLived: string,
  ): Promise<string> {
    const pagesResp = await lastValueFrom(
      this.http.get(G('/me/accounts'), {
        params: { access_token: userLongLived },
      }),
    );

    const pages: Array<{ id: string; access_token: string }> =
      pagesResp.data?.data ?? [];

    let pageAccessToken: string | null = null;
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
        if (foundIg && foundIg === account.providerAccountId) {
          pageAccessToken = p.access_token;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!pageAccessToken) {
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

    if (!pageAccessToken)
      throw new BadRequestException('Failed to mint page access token');

    // Persist the new token
    const em = this.em.fork();
    const old = account.tokens.getItems().find((t) => t.tokenType === 'access');
    if (old) {
      old.tokenEncrypted = pageAccessToken;
      old.expiresAt = undefined;
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
}
