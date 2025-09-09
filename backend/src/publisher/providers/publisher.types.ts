export type ProviderName = 'x' | 'instagram' | 'linkedin' | 'tiktok';

export interface PublishInput {
  text: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  // Opaque token string after decryption
  accessToken: string;
  // Provider-specific account id (e.g., user id, page id)
  providerAccountId: string;
}

export interface PublishResult {
  externalPostId: string;
  externalUrl?: string;
  publishedAt?: Date;
}

export interface ProviderPublisher {
  publish(input: PublishInput): Promise<PublishResult>;
}
