import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountsService {
  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  // link the the social account to the user by storing the provider info and tokens in the social_accounts and account_tokens tables

  async link(
    id: number,
    payload: {
      provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';
      providerAccountId: string;
    },
    tokens?: { accessToken?: string; refreshToken?: string; expiresAt?: Date },
  ): Promise<{ id: number; message: string }> {
    //first find the user by the id extracted from the jwt access-token stored in the cookie
    const user = await this.em.findOne(User, { id });
    if (!user) throw new NotFoundException('User not found');

    //then find if the social account already exists for the user with the given provider and providerAccountId
    let account = await this.em.findOne(SocialAccount, {
      user,
      provider: payload.provider,
      providerAccountId: payload.providerAccountId,
    });

    // if not create a new social account entry, else update the existing one to be active
    if (!account) {
      account = new SocialAccount();
      account.user = user;
      account.provider = payload.provider;
      account.providerAccountId = payload.providerAccountId;
      account.active = true;
      await this.em.persistAndFlush(account);
    } else {
      account.active = true;
      account.disconnectedAt = undefined;
      await this.em.flush();
    }

    // ✅ If Instagram, fetch username and followers_count
    if (payload.provider === 'instagram' && tokens?.accessToken) {
      try {
        const res = await lastValueFrom(
          this.http.get(
            `https://graph.facebook.com/v24.0/${payload.providerAccountId}`,
            {
              params: {
                fields: 'username,followers_count,profile_picture_url',
                access_token: tokens.accessToken,
              },
            },
          ),
        );
        const data = res.data;
        account.username = data.username;
        account.followersCount = data.followers_count;
        account.profilePictureUrl = data.profile_picture_url;
      } catch (err) {
        console.warn(
          '⚠️ Could not fetch Instagram profile metadata:',
          err?.response?.data || err.message,
        );
      }
    }

    // ✅ Store tokens
    if (tokens?.accessToken) {
      const access = new AccountToken();
      access.account = account;
      access.tokenType = 'access';
      access.tokenEncrypted = tokens.accessToken;
      access.expiresAt = tokens.expiresAt;
      this.em.persist(access);
    }

    if (tokens?.refreshToken) {
      const refresh = new AccountToken();
      refresh.account = account;
      refresh.tokenType = 'refresh';
      refresh.tokenEncrypted = tokens.refreshToken;
      this.em.persist(refresh);
    }

    if (tokens?.accessToken || tokens?.refreshToken) {
      await this.em.flush();
    }

    return { id: account.id, message: 'Account linked' };
  }

  async unlink(
    userId: number,
    accountId: number,
  ): Promise<{ message: string }> {
    const account = await this.em.findOne(
      SocialAccount,
      { id: accountId },
      { populate: ['user'] },
    );
    if (!account || account.user.id !== userId) {
      throw new NotFoundException('Account not found');
    }
    account.active = false;
    account.disconnectedAt = new Date();
    await this.em.flush();
    return { message: 'Account unlinked' };
  }

  async listForUser(userId: number) {
    const accounts = await this.em.find(
      SocialAccount,
      { user: userId },
      { populate: ['tokens'] },
    );

    return accounts.map((acc) => ({
      id: acc.id,
      provider: acc.provider,
      providerAccountId: acc.providerAccountId,
      active: acc.active,
      followersCount: acc.followersCount,
      username: acc.username,
      profilePictureUrl: acc.profilePictureUrl,
      disconnectedAt: acc.disconnectedAt,
      tokens: acc.tokens.getItems().map((t) => ({
        tokenType: t.tokenType,
        expiresAt: t.expiresAt,
      })),
    }));
  }
}
