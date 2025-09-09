/* eslint-disable */
import { Injectable } from '@nestjs/common';
import {
  ProviderName,
  ProviderPublisher,
  PublishInput,
  PublishResult,
} from './publisher.types';

// Placeholder adapters; implement real API calls per provider
class XPublisher implements ProviderPublisher {
  async publish(input: PublishInput): Promise<PublishResult> {
    void input;
    return Promise.reject(new Error('XPublisher not implemented'));
  }
}
class InstagramPublisher implements ProviderPublisher {
  async publish(input: PublishInput): Promise<PublishResult> {
    void input;
    return Promise.reject(new Error('InstagramPublisher not implemented'));
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
  get(provider: ProviderName): ProviderPublisher {
    switch (provider) {
      case 'x':
        return new XPublisher();
      case 'instagram':
        return new InstagramPublisher();
      case 'linkedin':
        return new LinkedInPublisher();
      case 'tiktok':
        return new TikTokPublisher();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
