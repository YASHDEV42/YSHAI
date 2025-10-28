import { Injectable } from '@nestjs/common';
import {
  ProviderName,
  ProviderPublisher,
  PublishInput,
  PublishResult,
} from './publisher.types';
import { MetaService } from 'src/meta/meta.service';

class XPublisher implements ProviderPublisher {
  async publish(input: PublishInput): Promise<PublishResult> {
    void input;
    return Promise.reject(new Error('XPublisher not implemented'));
  }
}
@Injectable()
export class InstagramPublisher implements ProviderPublisher {
  constructor(private readonly meta: MetaService) { }

  async publish(input: PublishInput): Promise<PublishResult> {
    const { accessToken, text, providerAccountId, mediaUrls } = input;

    if (!mediaUrls?.length) {
      throw new Error('No media URLs provided');
    }

    const mediaUrl = mediaUrls[0]; // only one image for now

    const res = await this.meta.publishToInstagram({
      accessToken,
      caption: text,
      mediaUrl,
      providerAccountId,
    });

    return {
      externalPostId: res.externalPostId,
      externalUrl: res.externalUrl,
      publishedAt: res.publishedAt,
    };
  }
}
class LinkedInPublisher implements ProviderPublisher {
  async publish(input: PublishInput): Promise<PublishResult> {
    void input;
    return Promise.reject(new Error('LinkedInPublisher not implemented'));
  }
}
class TikTokPublisher implements ProviderPublisher {
  async publish(input: PublishInput): Promise<PublishResult> {
    void input;
    return Promise.reject(new Error('TikTokPublisher not implemented'));
  }
}

@Injectable()
export class ProviderFactory {
  constructor(private readonly meta: MetaService) { }

  get(provider: ProviderName): ProviderPublisher {
    switch (provider) {
      case 'instagram':
        return new InstagramPublisher(this.meta);
      //TODO: add others later
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
