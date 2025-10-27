import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const V = process.env.META_GRAPH_VERSION ?? 'v24.0';
const base = (p: string) => `https://graph.facebook.com/${V}${p}`;

@Injectable()
export class MetaService {
  constructor(private http: HttpService) { }

  private async get<T>(url: string, params: Record<string, any>) {
    const u = new URL(url); Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
    const { data } = await firstValueFrom(this.http.get<T>(u.toString()));
    return data;
  }
  private async post<T>(url: string, params: Record<string, any>) {
    const { data } = await firstValueFrom(this.http.post<T>(url, null, { params }));
    return data;
  }

  exchangeShortToLong(shortToken: string) {
    return this.get<{ access_token: string; token_type: string; expires_in: number }>(
      base('/oauth/access_token'),
      {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        fb_exchange_token: shortToken,
      },
    );
  }

  listPages(longUserToken: string) {
    return this.get<{ data: Array<{ id: string; name: string; access_token: string }> }>(
      base('/me/accounts'),
      { access_token: longUserToken },
    );
  }

  async getIgUserId(pageId: string, pageToken: string) {
    const data = await this.get<{ instagram_business_account?: { id: string } }>(
      base(`/${pageId}`),
      { access_token: pageToken, fields: 'instagram_business_account' },
    );
    return data.instagram_business_account?.id ?? null;
  }

  // optional: profile/insights/publish will come later
}
