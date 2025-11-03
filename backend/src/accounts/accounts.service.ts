import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';

@Injectable()
export class AccountsService {
  constructor(private readonly em: EntityManager) {}

  async link(
    userId: number,
    payload: {
      provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';
      providerAccountId: string;
    },
    tokens?: { accessToken?: string; refreshToken?: string; expiresAt?: Date },
  ): Promise<{ id: number; message: string }> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new NotFoundException('User not found');

    let account = await this.em.findOne(SocialAccount, {
      user,
      provider: payload.provider,
      providerAccountId: payload.providerAccountId,
    });

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
    console.log(accounts);

    return accounts.map((acc) => ({
      id: acc.id,
      provider: acc.provider,
      providerAccountId: acc.providerAccountId,
      active: acc.active,
      disconnectedAt: acc.disconnectedAt,
      tokens: acc.tokens.getItems().map((t) => ({
        tokenType: t.tokenType,
        expiresAt: t.expiresAt,
      })),
    }));
  }
}
