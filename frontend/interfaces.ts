export interface IUser {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  timezone?: string;
  isEmailVerified: boolean;
  language?: string;
  locale?: string;
  timeFormat?: "12h" | "24h";
  createdAt: string;
  updatedAt: string;
}

export interface IRefreshToken {
  id: number;
  userAgent?: string;
  ipAddress?: string;
  revoked: boolean;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ISocialAccount {
  id: number;
  provider: "x" | "instagram" | "linkedin" | "tiktok";
  providerAccountId: string;
  username?: string;
  active: boolean;
  followersCount?: number;
  connectedAt: string;
  profilePictureUrl?: string;
  pageId?: string;
  pageName?: string;
  disconnectedAt?: string;
}
export interface IAccountToken {
  id: number;
  tokenType: "access" | "refresh";
  expiresAt?: string;
  revoked: boolean;
  username?: string;
  followersCount?: number;
  profilePictureUrl?: string;
  createdAt: string;
}
export interface IPost {
  id: number;
  contentAr: string;
  contentEn?: string;
  status: "draft" | "scheduled" | "published" | "failed" | "pending_approval";
  isRecurring: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  scheduleAt: string;
}
export interface IMedia {
  id: number;
  url: string;
  type: "image" | "video";
  orderIndex: number;
  createdAt: string;
}
export interface IGeneration {
  id: number;
  prompt: string;
  text: string;
  dialect: "MSA" | "Gulf" | "Levantine" | "Egyptian";
  tone: "formal" | "casual" | "humorous" | "promotional";
  metadata?: Record<string, any>;
  generatedAt: string;
  updatedAt: string;
}
export interface IPostTarget {
  id: number;
  status: "pending" | "scheduled" | "processing" | "success" | "failed";
  attempt: number;
  lastError?: string;
  externalPostId?: string;
  externalUrl?: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  socialAccountId: number;
}
export interface IJob {
  id: number;
  provider: "x" | "instagram" | "linkedin" | "tiktok";
  attempt: number;
  status: "pending" | "processing" | "success" | "failed";
  lastError?: string;
  scheduledAt: string;
  executedAt?: string;
}
export interface ITag {
  id: number;
  name: string;
  normalized: string;
  createdAt: string;
  metadata?: Record<string, any>;
}
export interface IPostTag {
  id: number;
  createdAt: string;
  tagId: number;
}
export interface IPlan {
  id: number;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly?: number;
  maxAccounts: number;
  aiCreditsUnlimited: boolean;
  aiCreditsLimit?: number;
  maxPostsPerMonth: number;
  maxScheduledPosts: number;
  teamCollaboration: boolean;
  analyticsExport: boolean;
  prioritySupport: boolean;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface ISubscription {
  id: number;
  status:
    | "active"
    | "canceled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "incomplete_expired";
  trialEndsAt?: string;
  periodStartsAt: string;
  periodEndsAt: string;
  canceledAt?: string;
  cancelAtPeriodEnd?: boolean;
  paymentGatewaySubscriptionId?: string;
  paymentGatewayCustomerId?: string;
  lastPaymentAt?: string;
  nextBillingAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface IInvoice {
  id: number;
  amount: number;
  currency: "SAR" | "USD" | "EUR";
  status: "paid" | "unpaid" | "refunded" | "failed";
  paymentGatewayId?: string;
  paymentMethod?: string;
  issuedAt: string;
  paidAt?: string;
  refundedAt?: string;
  downloadedAt?: string;
  pdfUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface ITeam {
  id: number;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
export interface IMembership {
  id: number;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: string;
  leftAt?: string;
  metadata?: Record<string, any>;
  userId: number;
  teamId: number;
}
export interface IPostAnalytics {
  id: number;
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
  fetchedAt: string;
}
export interface IWebhookSubscription {
  id: number;
  url: string;
  event:
    | "post.published"
    | "post.failed"
    | "post.scheduled"
    | "analytics.updated"
    | "account.disconnected"
    | "campaign.completed";
  active: boolean;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  metadata?: Record<string, any>;
}
export interface IWebhookDeliveryAttempt {
  id: number;
  url: string;
  event: string;
  attemptNumber: number;
  status: "delivered" | "failed";
  responseCode?: number;
  errorMessage?: string;
  durationMs?: number;
  payloadHash: string;
  createdAt: string;
}
export interface INotification {
  id: number;
  type: string;
  title: Record<string, string>;
  message: Record<string, string>;
  data?: Record<string, any>;
  link?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  deletedAt?: string;
}
export interface IAuditLog {
  id: number;
  action: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
}
export interface IAIUsageLog {
  id: number;
  modelUsed: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  createdAt: string;
  metadata?: Record<string, any>;
}
