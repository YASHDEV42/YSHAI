// =========================
// Shared primitive types
// =========================

export type UserRole = "user" | "admin";
export type TeamRole = "owner" | "admin" | "editor" | "viewer";
export type TimeFormat = "12h" | "24h";
export type Provider = "x" | "instagram" | "linkedin" | "tiktok";
export type PostStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "failed"
  | "pending_approval";
export type JobStatus = "pending" | "processing" | "success" | "failed";
export type PlanName = "Free" | "Pro" | "Business";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "incomplete_expired";
export type Currency = "SAR" | "USD" | "EUR";
export type InvoiceStatus = "paid" | "unpaid" | "refunded" | "failed";
export type NotificationType =
  | "post.published"
  | "post.failed"
  | "analytics.updated"
  | "account.disconnected"
  | "subscription.ending"
  | "system";
export type WebhookEvent =
  | "post.published"
  | "post.failed"
  | "account.disconnected";

// =========================
// Auth / Users
// =========================

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  timezone?: string;
  isEmailVerified: boolean;
  language?: string;
  locale?: string;
  timeFormat?: TimeFormat;
  createdAt: string;
  updatedAt: string;
  /**
   * OpenAPI: avatarUrl: { type: object, nullable: true }
   * In practice this is usually a URL string or null.
   */
  avatarUrl?: string | null;
}

// This one is not in the OpenAPI spec directly; keep it as a local model
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

// =========================
// Social Accounts / Tokens
// =========================

// Combination of LinkAccountWithTokensDto + what /accounts/me will likely return.
export interface ISocialAccount {
  id: number;
  provider: Provider;
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

// =========================
// Posts & Media
// =========================

export interface IMediaSummary {
  // MediaSummaryDto
  id: number;
  url: string;
  type: "image" | "video";
}

/**
 * Full media as returned by /media endpoints (MediaResponseDto)
 */
export interface IMedia extends IMediaSummary {
  orderIndex: number;
  createdAt: string;
  postId: number;
}

/**
 * Summary for a post target (PostTargetSummaryDto) used in PostResponseDto.targets
 */
export interface IPostTargetSummary {
  id: number;
  provider: Provider;
  status: "pending" | "scheduled" | "processing" | "success" | "failed";
  externalPostId?: string | null;
  externalUrl?: string | null;
  lastError?: string | null;
}

/**
 * PostResponseDto
 */
export interface IPost {
  id: number;
  contentAr: string;
  contentEn?: string | null;
  status: PostStatus;
  isRecurring: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  scheduledAt: string; // OpenAPI: scheduledAt (response) / scheduleAt (create DTO)
  campaignId?: number | null;
  templateId?: number | null;

  // Relations returned in PostResponseDto
  targets: IPostTargetSummary[];
  media: IMediaSummary[];

  // If you really have this in DB but not in OpenAPI, keep it optional:
  deletedAt?: string | null;
}

// Not in spec; this is your own log model, which is fine.
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

// =========================
// Post Targets & Jobs
// =========================

/**
 * PostTargetResponseDto
 */
export interface IPostTarget {
  id: number;
  postId: number;
  socialAccountId: number;
  provider: Provider;
  status: "pending" | "scheduled" | "processing" | "success" | "failed";
  attempt: number;
  lastError?: string | null;
  externalPostId?: string | null;
  externalUrl?: string | null;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * JobResponseDto
 */
export interface IJob {
  id: number;
  postId: number;
  targetId?: number | null;
  provider: Provider;
  status: JobStatus;
  lastError?: string | null;
  attempt: number;
  scheduledAt: string;
  executedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =========================
// Billing: Plans / Subscriptions / Invoices
// =========================

/**
 * PlanResponseDto
 */
export interface IPlan {
  id: number;
  name: PlanName;
  slug: string;
  description?: string | null;
  priceMonthly: number;
  priceYearly?: number | null;
  maxAccounts: number;
  aiCreditsUnlimited: boolean;
  aiCreditsLimit?: number | null;
  maxPostsPerMonth: number;
  maxScheduledPosts: number;
  teamCollaboration: boolean;
  analyticsExport: boolean;
  prioritySupport: boolean;
  isActive: boolean;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * SubscriptionResponseDto
 */
export interface ISubscription {
  id: number;
  status: SubscriptionStatus;
  periodStartsAt: string;
  periodEndsAt: string;
  canceledAt?: string | null;
  paymentGatewaySubscriptionId?: string | null;
  createdAt: string;
  updatedAt: string;
  planId: number;

  // Extra client-side fields (not in OpenAPI, keep them optional)
  trialEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
  paymentGatewayCustomerId?: string;
  lastPaymentAt?: string;
  nextBillingAt?: string;
  metadata?: Record<string, any>;
}

// Not from API; your own “membership” abstraction
export interface IMembership {
  id: number;
  role: TeamRole;
  joinedAt: string;
  leftAt?: string;
  metadata?: Record<string, any>;
  userId: number;
  teamId: number;
}

/**
 * InvoiceResponseDto
 */
export interface IInvoice {
  id: number;
  subscriptionId: number;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  invoiceNumber: string;
  issuedAt: string;
  dueDate?: string | null;
  paidAt?: string | null;
  paymentGatewayInvoiceId?: string | null;
  pdfUrl?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

// =========================
// Analytics
// =========================

/**
 * PostInsightsDto
 */
export interface IPostAnalytics {
  postId: number;
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
  provider: Provider;
  socialAccountId?: number | null;
  fetchedAt: string;
}

/**
 * AccountInsightsDto
 */
export interface IAccountAnalytics {
  accountId: number;
  totalPosts: number;
  totalImpressions: number;
  totalClicks: number;
  totalEngagements: number;
}

/**
 * CampaignInsightsDto
 */
export interface ICampaignAnalytics {
  campaignId: number;
  posts: number;
  impressions: number;
  clicks: number;
  engagements: number;
}

// =========================
// Webhooks
// =========================

/**
 * CreateWebhookDto (request)
 */
export interface IWebhookCreate {
  url: string;
  event: WebhookEvent;
  secret: string;
}

/**
 * What your DB/UI probably uses for listing webhooks.
 * OpenAPI doesn't fully describe the response shape,
 * so treat this as your app-level contract.
 */
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

// =========================
// Notifications
// =========================

export interface INotificationMessage {
  // NotificationMessageDto
  value: Record<string, string>;
}

export interface IPostScheduledPayload {
  postId: number;
  platform: string;
  scheduledAt: string;
}

export interface IPublishFailedPayload {
  postId: number;
  error: string;
}

export type AIReadyArtifact = "caption" | "hashtags" | "alt_text";

export interface IAIReadyPayload {
  postId: number;
  artifact: AIReadyArtifact;
}

export interface IApprovedPayload {
  postId: number;
}

export type NotificationDataPayload =
  | IPostScheduledPayload
  | IPublishFailedPayload
  | IAIReadyPayload
  | IApprovedPayload;

/**
 * NotificationResponseDto
 */
export interface INotification {
  id: number;
  type: NotificationType;
  title: INotificationMessage;
  message: INotificationMessage;
  data?: NotificationDataPayload | null;
  /**
   * OpenAPI: link is `nullable` and has uri format; we treat as URL string or null.
   */
  link?: string | null;
  read: boolean;
  createdAt: string;
  // If you track these client-side:
  readAt?: string;
  deletedAt?: string;
}

// =========================
// Audit logs
// =========================

/**
 * TeamAuditLogResponseDto / AdminAuditLogResponseDto are very similar.
 */
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

// =========================
// AI usage logs (your own)
// =========================

// Not directly from /ai/usage/me response, but ok as a per-call log.
export interface IAIUsageLog {
  id: number;
  modelUsed: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

// =========================
// Backend Error Response Types
// =========================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorDto {
  statusCode: number;
  message: string;
  errors: ValidationError[];
}

export interface ErrorResponseDto {
  statusCode: number;
  message: string;
  error?: string;
}

// =========================
// Subscription DTOs Matching Backend
// =========================

export interface CreateSubscriptionDto {
  planId: number;
  paymentMethodId?: string;
}

export interface UpdateSubscriptionDto {
  planId?: number;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionWithPlan extends ISubscription {
  plan: IPlan;
}
