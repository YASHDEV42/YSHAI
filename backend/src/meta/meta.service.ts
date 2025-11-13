import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import crypto from 'crypto';
import { EntityManager } from '@mikro-orm/core';
import { MediaService } from 'src/media/media.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';

const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? 'v24.0';
const G = (p: string) => `https://graph.facebook.com/${GRAPH_VERSION}${p}`;
const logger = new Logger('mets.service');

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
    private readonly media: MediaService,
    private readonly accounts: AccountsService,
  ) {}

  // ========= Utilities =========

  private appSecretProof(token: string) {
    const secret =
      process.env.META_CLIENT_SECRET || process.env.META_APP_SECRET || '';
    return crypto.createHmac('sha256', secret).update(token).digest('hex');
  }

  private handleGraphError(err: any): never {
    const fbErr = err?.response?.data?.error;
    if (fbErr) {
      const payload = {
        code: fbErr.code,
        subcode: fbErr.error_subcode,
        type: fbErr.type,
        message: fbErr.message,
      };
      throw new BadRequestException(payload);
    }
    throw new BadRequestException(err?.message ?? 'Meta Graph error');
  }

  private async graphGet<T>(
    path: string,
    params: Record<string, any>,
  ): Promise<T> {
    try {
      const token = params.access_token as string | undefined;
      if (token) params.appsecret_proof = this.appSecretProof(token);
      const res = await lastValueFrom(
        this.http.get(G(path), { params, timeout: 15000 }),
      );
      return res.data as T;
    } catch (err) {
      this.handleGraphError(err);
    }
  }

  private async graphPost<T>(
    path: string,
    data: Record<string, any>,
  ): Promise<T> {
    try {
      const token = data.access_token as string | undefined;
      const params: any = {};
      if (token) params.appsecret_proof = this.appSecretProof(token);
      const res = await lastValueFrom(
        this.http.post(G(path), data, { params, timeout: 15000 }),
      );
      return res.data as T;
    } catch (err) {
      this.handleGraphError(err);
    }
  }

  // ========= OAuth & Linking =========

  async handleOauthCallback(shortToken: string, userId: number) {
    // 1) Exchange short-lived token for long-lived user token
    const longUser = await this.exchangeShortToLong(shortToken);
    console.log('Exchanged long-lived token:', longUser);

    // 2) List pages for this user
    const pagesResp = await this.listPages(longUser.access_token);
    console.log('Fetched pages:', pagesResp);
    const pages = pagesResp?.data ?? [];
    if (!pages.length)
      throw new BadRequestException('No Facebook Pages found for this user');

    // 3) Auto-pick a page that has an IG Business account
    let chosen: { id: string; name: string; access_token: string } | null =
      null;
    let igUserId: string | null = null;

    for (const p of pages) {
      const found = await this.getIgUserId(p.id, p.access_token);
      if (found) {
        chosen = p;
        igUserId = found;
        break;
      }
    }
    if (!chosen || !igUserId) {
      throw new BadRequestException(
        'No Page with a connected Instagram Business account was found.',
      );
    }
    console.log('chosen page:', chosen, 'igUserId:', igUserId);

    const expiresAt = new Date(
      Date.now() + (longUser.expires_in || 5184000) * 1000,
    );

    // 4) Link account & persist tokens
    logger.log(
      'Linking Instagram account for ',
      userId,
      'igUserId:',
      igUserId,
      'chosen page:',
      chosen.access_token,
      'longUser token:',
      longUser.access_token,
      'longUser expiresAt:',
      expiresAt,
    );

    const link = await this.accounts.link(
      userId,
      { provider: 'instagram', providerAccountId: igUserId },
      {
        accessToken: chosen.access_token, // Page access token
        refreshToken: longUser.access_token, // Long-lived user token
        expiresAt: isNaN(expiresAt.getTime()) ? undefined : expiresAt,
      },
    );
    console.log('Linked account');

    // Persist page metadata
    const accountEntity = await this.em.findOne(SocialAccount, { id: link.id });
    if (accountEntity) {
      (accountEntity as any).pageId = chosen.id;
      (accountEntity as any).pageName = chosen.name;
      await this.em.flush();
    }

    this.logger.log(
      `Linked IG ${igUserId} for user ${userId} (page: ${chosen.name})`,
    );
    return {
      id: link.id,
      providerAccountId: igUserId,
      pageId: chosen.id,
      pageName: chosen.name,
      expiresAt,
    };
  }

  private async exchangeShortToLong(shortToken: string) {
    try {
      const data = await this.graphGet<{
        access_token: string;
        token_type: string;
        expires_in: number;
      }>('/oauth/access_token', {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_CLIENT_ID || process.env.META_APP_ID,
        client_secret:
          process.env.META_CLIENT_SECRET || process.env.META_APP_SECRET,
        fb_exchange_token: shortToken,
      });
      return data;
    } catch (err) {
      this.logger.error('Token exchange failed');
      throw err;
    }
  }

  private async listPages(longUserToken: string) {
    return this.graphGet<{
      data: Array<{ id: string; name: string; access_token: string }>;
    }>('/me/accounts', { access_token: longUserToken });
  }

  private async getIgUserId(pageId: string, pageToken: string) {
    const data = await this.graphGet<{
      instagram_business_account?: { id: string };
    }>(`/${pageId}`, {
      fields: 'instagram_business_account',
      access_token: pageToken,
    });
    return data?.instagram_business_account?.id ?? null;
  }

  // ========= Publishing =========

  async publishWithAutoRefresh(params: {
    file: Express.Multer.File;
    userId: number;
    caption: string;
  }) {
    const { file, userId, caption } = params;
    this.logger.log(
      'publishWithAutoRefresh called with: ',
      file.size,
      caption,
      userId,
    );
    // Upload to your media store
    const media = await this.media.upload({ buffer: file.buffer });

    // Get the linked IG account for this user
    const account = await this.em.findOne(
      SocialAccount,
      { user: userId, provider: 'instagram' },
      { populate: ['tokens'] },
    );
    if (!account) throw new NotFoundException('Instagram account not linked');

    // Tokens
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
      return { ...res, cloudinaryUrl: media.url };
    } catch (err: any) {
      const fbErr = err?.response?.data?.error;
      const sub = fbErr?.error_subcode;
      const expired =
        fbErr?.code === 190 && [458, 459, 463, 490, 492].includes(sub);

      if (!expired) this.handleGraphError(err);

      this.logger.warn(
        'Access token expired — refreshing page token and retrying...',
      );
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
      return { ...res, refreshed: true, cloudinaryUrl: media.url };
    }
  }

  async publishToInstagram(params: {
    accessToken: string;
    caption: string;
    mediaUrl: string;
    providerAccountId: string; // ig_user_id
  }) {
    const { accessToken, caption, mediaUrl, providerAccountId } = params;

    // 1) Create media container
    const createRes = await this.graphPost<{ id: string }>(
      `/${providerAccountId}/media`,
      {
        image_url: mediaUrl,
        caption,
        access_token: accessToken,
      },
    );

    const creationId = createRes?.id;
    if (!creationId)
      throw new BadRequestException('Failed to create media container');

    // 2) Wait for media to be ready
    await this.waitForMediaReady(creationId, accessToken);

    // 3) Publish
    const publishRes = await this.graphPost<{ id: string }>(
      `/${providerAccountId}/media_publish`,
      {
        creation_id: creationId,
        access_token: accessToken,
      },
    );

    const igPostId = publishRes?.id;
    if (!igPostId) throw new BadRequestException('Failed to publish media');

    // 4) Fetch details
    const details = await this.graphGet<{
      id: string;
      permalink: string;
      timestamp: string;
      media_type: string;
      media_url?: string;
      thumbnail_url?: string;
      caption?: string;
    }>(`/${igPostId}`, {
      fields:
        'id,permalink,timestamp,media_type,media_url,thumbnail_url,caption',
      access_token: accessToken,
    });

    return {
      externalPostId: details.id,
      externalUrl: details.permalink,
      publishedAt: new Date(details.timestamp),
      mediaType: details.media_type,
      mediaUrl: details.media_url ?? details.thumbnail_url,
      caption: details.caption ?? '',
    };
  }

  private async waitForMediaReady(creationId: string, accessToken: string) {
    let attempts = 0;
    let status = 'IN_PROGRESS';

    while (status === 'IN_PROGRESS' && attempts < 10) {
      const delay = Math.round(2000 * Math.pow(1.5, attempts));
      await new Promise((r) => setTimeout(r, delay));
      attempts++;

      const check = await this.graphGet<{ status_code: string }>(
        `/${creationId}`,
        {
          fields: 'status_code',
          access_token: accessToken,
        },
      );
      status = check.status_code;
    }

    if (status !== 'FINISHED') {
      throw new BadRequestException(
        `Media processing did not finish (status=${status})`,
      );
    }
  }

  private async mintPageAccessTokenFromUser(
    account: SocialAccount,
    userLongLived: string,
  ): Promise<string> {
    const pagesResp = await this.listPages(userLongLived);
    const pages = pagesResp?.data ?? [];

    let pageAccessToken: string | null = null;

    for (const p of pages) {
      const foundIg = await this.getIgUserId(p.id, p.access_token);
      if (foundIg && foundIg === account.providerAccountId) {
        pageAccessToken = p.access_token;
        break;
      }
    }

    if (!pageAccessToken) {
      throw new BadRequestException(
        'Matching page for IG account not found for this user',
      );
    }

    // Persist (transactional)
    const em = this.em.fork();
    await em.transactional(async (tx) => {
      const acc = await tx.findOne(
        SocialAccount,
        { id: account.id },
        { populate: ['tokens'] },
      );
      if (!acc)
        throw new NotFoundException(
          'Account not found while minting page token',
        );

      const existing = acc.tokens
        .getItems()
        .find((t) => t.tokenType === 'access');
      if (existing) {
        existing.tokenEncrypted = pageAccessToken;
        existing.expiresAt = undefined;
      } else {
        const newTok = tx.create(AccountToken, {
          account: tx.getReference(SocialAccount, account.id),
          tokenType: 'access',
          tokenEncrypted: pageAccessToken,
          revoked: false,
          createdAt: new Date(),
        });
        tx.persist(newTok);
        acc.tokens.add(newTok);
      }
    });

    return pageAccessToken;
  }

  // ========= Profiles / Page resolution (server-resolved tokens) =========

  async getInstagramProfileForUser(pageId: string, userId: number) {
    // Get user’s long-lived token and mint page token for that page
    const account = await this.em.findOne(
      SocialAccount,
      { user: userId, provider: 'instagram' },
      { populate: ['tokens'] },
    );
    if (!account) throw new NotFoundException('Instagram account not linked');

    const userLongLived =
      account.tokens.getItems().find((t) => t.tokenType === 'refresh')
        ?.tokenEncrypted ?? null;
    if (!userLongLived)
      throw new BadRequestException('Missing long-lived user token');

    // Ensure page token for requested pageId
    const pages = (await this.listPages(userLongLived))?.data ?? [];
    const targetPage = pages.find((p) => p.id === pageId);
    if (!targetPage)
      throw new BadRequestException(
        'Requested Page not available for this user',
      );

    const igUserId = await this.getIgUserId(pageId, targetPage.access_token);
    if (!igUserId) {
      throw new BadRequestException(
        `No Instagram Business account connected to Page ${pageId}`,
      );
    }

    const res = await this.graphGet<{
      id: string;
      username: string;
      followers_count: number;
      profile_picture_url?: string;
    }>(`/${igUserId}`, {
      fields: 'id,username,followers_count,profile_picture_url',
      access_token: targetPage.access_token,
    });

    return {
      igUserId: res.id,
      username: res.username,
      followersCount: res.followers_count,
      profilePicture: res.profile_picture_url ?? null,
    };
  }

  async getPageIdFromIgAccountForUser(igUserId: string, userId: number) {
    const account = await this.em.findOne(
      SocialAccount,
      { user: userId, provider: 'instagram' },
      { populate: ['tokens'] },
    );
    if (!account) throw new NotFoundException('Instagram account not linked');

    const userLongLived =
      account.tokens.getItems().find((t) => t.tokenType === 'refresh')
        ?.tokenEncrypted ?? null;
    if (!userLongLived)
      throw new BadRequestException('Missing long-lived user token');

    const res = await this.listPages(userLongLived);
    const pages = res?.data ?? [];

    for (const p of pages) {
      const foundIg = await this.getIgUserId(p.id, p.access_token);
      if (foundIg && foundIg === igUserId) {
        return { pageId: p.id, pageName: p.name };
      }
    }
    return null;
  }

  async getInstagramPostsForUser(params: {
    igUserId: string;
    userId: number;
    limit?: number;
    after?: string;
  }) {
    const { igUserId, userId, limit, after } = params;

    const account = await this.em.findOne(
      SocialAccount,
      { user: userId, provider: 'instagram' },
      { populate: ['tokens'] },
    );
    if (!account) throw new NotFoundException('Instagram account not linked');

    const userLongLived =
      account.tokens.getItems().find((t) => t.tokenType === 'refresh')
        ?.tokenEncrypted ?? null;
    if (!userLongLived)
      throw new BadRequestException('Missing long-lived user token');

    // get page token for the page that owns this igUserId
    const pageAccessToken = await this.mintPageAccessTokenFromUser(
      account,
      userLongLived,
    );

    const data = await this.graphGet<{
      data: Array<{
        id: string;
        caption?: string;
        media_type: string;
        media_url?: string;
        thumbnail_url?: string;
        permalink: string;
        timestamp: string;
        like_count?: number;
        comments_count?: number;
      }>;
      paging?: {
        next?: string;
        previous?: string;
        cursors?: { before?: string; after?: string };
      };
    }>(`/${igUserId}/media`, {
      fields:
        'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,thumbnail_url',
      access_token: pageAccessToken,
      limit: limit ?? 20,
      after,
    });

    const items = (data.data ?? []).map((p) => ({
      id: p.id,
      caption: p.caption ?? '',
      mediaUrl: p.media_url ?? p.thumbnail_url ?? null,
      permalink: p.permalink,
      timestamp: p.timestamp,
      likeCount: p.like_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      mediaType: p.media_type,
    }));

    return {
      success: true,
      data: items,
      paging: data.paging ?? {},
    };
  }
}
