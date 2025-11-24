import { Injectable } from '@nestjs/common';
import {
  ProviderName,
  ProviderPublisher,
  PublishInput,
  PublishResult,
} from './publisher.types';
import { MetaService } from 'src/meta/meta.service';

@Injectable()
export class InstagramPublisher implements ProviderPublisher {
  constructor(private readonly meta: MetaService) {}

  async publish(input: PublishInput): Promise<PublishResult> {
    const { accessToken, text, providerAccountId, media, kind } = input;

    if (!media?.length) {
      throw new Error('No media provided');
    }

    if (kind === 'reel') {
      return this.publishReel({
        accessToken,
        caption: text,
        providerAccountId,
        media,
      });
    }

    if (kind === 'carousel') {
      return this.publishCarousel({
        accessToken,
        caption: text,
        providerAccountId,
        media,
      });
    }

    // default: feed post (single image or video)
    return this.publishFeed({
      accessToken,
      caption: text,
      providerAccountId,
      media,
    });
  }

  // ---------- FEED POST (image or video) ----------

  private async publishFeed(params: {
    accessToken: string;
    caption: string;
    providerAccountId: string;
    media: MediaItemInput[];
  }): Promise<PublishResult> {
    const { accessToken, caption, providerAccountId, media } = params;

    if (media.length !== 1) {
      throw new Error('Feed post expects exactly one media item');
    }

    const item = media[0];

    const container = await this.meta.createMediaContainer({
      accessToken,
      caption,
      mediaUrl: item.url,
      providerAccountId,
      kind: 'feed',
      mediaType: item.kind, // 'image' | 'video'
      isCarouselItem: false,
    });

    // For video, make sure processing is done
    if (item.kind === 'video') {
      await this.meta['waitForMediaReady'](container.creationId, accessToken);
    }

    const res = await this.meta.publishContainer({
      accessToken,
      creationId: container.creationId,
      providerAccountId,
    });

    return res;
  }

  // ---------- REEL (single video) ----------

  private async publishReel(params: {
    accessToken: string;
    caption: string;
    providerAccountId: string;
    media: MediaItemInput[];
  }): Promise<PublishResult> {
    const { accessToken, caption, providerAccountId, media } = params;

    if (media.length !== 1) {
      throw new Error('Reel expects exactly one media item');
    }

    const item = media[0];

    if (item.kind !== 'video') {
      throw new Error('Reel media must be a video');
    }

    const container = await this.meta.createMediaContainer({
      accessToken,
      caption,
      mediaUrl: item.url,
      providerAccountId,
      kind: 'reel',
      mediaType: 'video',
      isCarouselItem: false,
    });

    await this.meta['waitForMediaReady'](container.creationId, accessToken);

    const res = await this.meta.publishContainer({
      accessToken,
      creationId: container.creationId,
      providerAccountId,
    });

    return res;
  }

  // ---------- CAROUSEL (mixed images + videos) ----------

  private async publishCarousel(params: {
    accessToken: string;
    caption: string;
    providerAccountId: string;
    media: MediaItemInput[];
  }): Promise<PublishResult> {
    const { accessToken, caption, providerAccountId, media } = params;

    if (media.length < 2) {
      throw new Error('Carousel expects at least two media items');
    }

    const creationIds: string[] = [];

    for (const item of media) {
      const container = await this.meta.createMediaContainer({
        accessToken,
        caption: undefined, // caption is on the parent carousel, not children
        mediaUrl: item.url,
        providerAccountId,
        kind: 'feed', // children are just feed-type items
        mediaType: item.kind,
        isCarouselItem: true,
      });

      // wait for video items to be ready
      if (item.kind === 'video') {
        await this.meta['waitForMediaReady'](container.creationId, accessToken);
      }

      creationIds.push(container.creationId);
    }

    const carousel = await this.meta.createCarouselMedia({
      accessToken,
      caption,
      children: creationIds,
      providerAccountId,
    });

    // In practice, carousel container can need processing too (especially with videos),
    // but usually publishing will fail if it's not ready; you can optionally poll here too.

    const res = await this.meta.publishContainer({
      accessToken,
      creationId: carousel.creationId,
      providerAccountId,
    });

    return res;
  }
}

// --------------------------------------------------

class XPublisher implements ProviderPublisher {
  async publish(): Promise<PublishResult> {
    throw new Error('XPublisher not implemented');
  }
}

class LinkedInPublisher implements ProviderPublisher {
  async publish(): Promise<PublishResult> {
    throw new Error('LinkedInPublisher not implemented');
  }
}

class TikTokPublisher implements ProviderPublisher {
  async publish(): Promise<PublishResult> {
    throw new Error('TikTokPublisher not implemented');
  }
}

// --------------------------------------------------

@Injectable()
export class ProviderFactory {
  constructor(private readonly meta: MetaService) {}

  get(provider: ProviderName): ProviderPublisher {
    switch (provider) {
      case 'instagram':
        return new InstagramPublisher(this.meta);

      case 'x':
        return new XPublisher();

      case 'linkedin':
        return new LinkedInPublisher();

      case 'tiktok':
        return new TikTokPublisher();

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
