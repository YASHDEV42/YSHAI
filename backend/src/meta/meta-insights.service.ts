
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MetaInsightsService {
  private readonly logger = new Logger(MetaInsightsService.name);

  constructor(private readonly http: HttpService) { }

  async getPostInsights(externalPostId: string, accessToken: string) {
    try {
      const url = `https://graph.facebook.com/v21.0/${externalPostId}/insights`;
      const params = {
        metric: 'impressions,reach,likes,comments,saves',
        access_token: accessToken,
      };
      const res = await lastValueFrom(this.http.get(url, { params }));
      return res.data.data;
    } catch (e) {
      this.logger.warn(`⚠️ Failed to fetch insights for ${externalPostId}: ${e.message}`);
      return null;
    }
  }
}
