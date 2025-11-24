export type ProviderName = 'instagram' | 'x' | 'linkedin' | 'tiktok';

export type MediaKind = 'image' | 'video';

export type PostKind = 'feed' | 'reel' | 'carousel';

export interface MediaItemInput {
  url: string;
  kind: MediaKind; // 'image' | 'video'
}

export interface PublishInput {
  accessToken: string;
  text: string;
  providerAccountId: string; // ig_user_id
  media: MediaItemInput[]; // instead of mediaUrls: string[]
  kind: PostKind; // 'feed' | 'reel' | 'carousel'
}

export interface PublishResult {
  externalPostId: string;
  externalUrl: string;
  publishedAt: Date;
}
export interface ProviderPublisher {
  publish(input: PublishInput): Promise<PublishResult>;
}
