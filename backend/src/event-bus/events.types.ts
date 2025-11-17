/* --------------------------------------------------------------------------
 *  FINAL EVENT PAYLOAD MAP FOR YSHAI — FULLY TYPED
 *  Supports:
 *   - Posts
 *   - Moderation
 *   - Publishing / Jobs
 *   - Accounts / Tokens
 *   - Teams
 *   - Users
 *   - Media
 *   - Notifications
 *   - Webhooks
 *   - Billing
 *   - Analytics
 *   - Security
 *   - Automation
 * -------------------------------------------------------------------------- */

export type EventName =
  | 'post.created'
  | 'post.updated'
  | 'post.deleted'
  | 'post.scheduled'
  | 'post.published'
  | 'post.failed'
  | 'post.moderation.completed'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.logged_in'
  | 'account.connected'
  | 'account.disconnected'
  | 'account.token_refreshed'
  | 'account.token_revoked'
  | 'team.created'
  | 'team.member_added'
  | 'team.member_removed'
  | 'team.role_updated'
  | 'media.uploaded'
  | 'media.deleted'
  | 'media.processing_completed'
  | 'moderation.completed'
  | 'moderation.flagged'
  | 'moderation.blocked'
  | 'job.created'
  | 'job.started'
  | 'job.succeeded'
  | 'job.failed'
  | 'job.rescheduled'
  | 'job.exhausted'
  | 'notification.created'
  | 'notification.read'
  | 'notification.deleted'
  | 'webhook.attempted'
  | 'webhook.succeeded'
  | 'webhook.failed'
  | 'webhook.retry_scheduled'
  | 'billing.subscription_created'
  | 'billing.subscription_updated'
  | 'billing.subscription_cancelled'
  | 'billing.subscription_renewed'
  | 'billing.invoice_created'
  | 'billing.invoice_paid'
  | 'billing.invoice_failed'
  | 'billing.quota_exceeded'
  | 'billing.credit_applied'
  | 'analytics.post_engagement'
  | 'analytics.post_reach'
  | 'analytics.post_impression'
  | 'analytics.user_active'
  | 'analytics.user_conversion'
  | 'analytics.user_churned'
  | 'automation.triggered'
  | 'automation.action_executed'
  | 'automation.action_failed'
  | 'security.login_failed'
  | 'security.login_succeeded'
  | 'security.session_expired'
  | 'security.api_key_created'
  | 'security.api_key_revoked'
  | 'security.suspicious_activity';

/* ------------------------------- PAYLOADS -------------------------------- */

export interface EventPayloadMap {
  /* POSTS */
  'post.created': {
    postId: number;
    authorId: number;
    teamId?: number | null;
    createdAt: string;
  };

  'post.updated': {
    postId: number;
    authorId: number;
    updatedFields: string[];
    updatedAt: string;
  };

  'post.deleted': {
    postId: number;
    authorId: number;
  };

  'post.scheduled': {
    postId: number;
    authorId: number;
    scheduledAt: string;
  };

  'post.published': {
    postId: number;
    authorId: number;
    provider: 'x' | 'instagram' | 'linkedin' | 'tiktok';
    externalPostId?: string | null;
    externalUrl?: string | null;
    publishedAt: string;
  };

  'post.failed': {
    postId: number;
    authorId: number;
    error: string;
    attempt: number;
  };

  'post.moderation.completed': {
    moderationId: number;
    postId: number;
    verdict: 'allowed' | 'flagged' | 'blocked';
    provider: string;
  };

  /* USERS */
  'user.created': { userId: number; email: string; createdAt: string };
  'user.updated': {
    userId: number;
    updatedFields: string[];
    updatedAt: string;
  };
  'user.deleted': { userId: number };
  'user.logged_in': { userId: number; ip: string; userAgent: string };

  /* ACCOUNTS */
  'account.connected': {
    userId: number;
    accountId: number;
    provider: string;
  };

  'account.disconnected': {
    userId: number;
    accountId: number;
    provider: string;
  };

  'account.token_refreshed': {
    accountId: number;
    provider: string;
    newTokenExpiresAt: string;
  };

  'account.token_revoked': {
    accountId: number;
    provider: string;
  };

  /* TEAMS */
  'team.created': {
    teamId: number;
    ownerId: number;
  };

  'team.member_added': {
    teamId: number;
    userId: number;
    role: string;
  };

  'team.member_removed': {
    teamId: number;
    userId: number;
  };

  'team.role_updated': {
    teamId: number;
    userId: number;
    newRole: string;
  };

  /* MEDIA */
  'media.uploaded': {
    mediaId: number;
    postId: number;
    url: string;
    type: string;
  };

  'media.deleted': {
    mediaId: number;
  };

  'media.processing_completed': {
    mediaId: number;
    postId: number;
    outputUrl?: string;
  };

  /* MODERATION */
  'moderation.completed': {
    moderationId: number;
    postId: number;
    verdict: string;
  };

  'moderation.flagged': {
    moderationId: number;
    postId: number;
    reason: string;
  };

  'moderation.blocked': {
    moderationId: number;
    postId: number;
    reason: string;
  };

  /* JOBS */
  'job.created': { jobId: number; postId: number };
  'job.started': { jobId: number };
  'job.succeeded': { jobId: number };
  'job.failed': { jobId: number; error: string };
  'job.rescheduled': { jobId: number; nextAttemptAt: string };
  'job.exhausted': { jobId: number; error: string };

  /* NOTIFICATIONS */
  'notification.created': { notificationId: number; userId: number };
  'notification.read': { notificationId: number; userId: number };
  'notification.deleted': { notificationId: number; userId: number };

  /* WEBHOOKS */
  'webhook.attempted': {
    deliveryId: number;
    webhookId: number;
    event: string;
  };
  'webhook.succeeded': { deliveryId: number; statusCode: number };
  'webhook.failed': { deliveryId: number; error: string };
  'webhook.retry_scheduled': { deliveryId: number; retryAt: string };

  /* BILLING */
  'billing.subscription_created': { userId: number; plan: string };
  'billing.subscription_updated': { userId: number; plan: string };
  'billing.subscription_cancelled': { userId: number; plan: string };
  'billing.subscription_renewed': { userId: number; plan: string };

  'billing.invoice_created': {
    invoiceId: number;
    userId: number;
    amount: number;
  };
  'billing.invoice_paid': { invoiceId: number; userId: number; amount: number };
  'billing.invoice_failed': {
    invoiceId: number;
    userId: number;
    amount: number;
  };

  'billing.quota_exceeded': { userId: number; resource: string };
  'billing.credit_applied': { userId: number; credit: number };

  /* ANALYTICS */
  'analytics.post_engagement': { postId: number; count: number };
  'analytics.post_reach': { postId: number; count: number };
  'analytics.post_impression': { postId: number; count: number };

  'analytics.user_active': { userId: number };
  'analytics.user_conversion': { userId: number };
  'analytics.user_churned': { userId: number };

  /* AUTOMATION */
  'automation.triggered': { automationId: number; triggerType: string };
  'automation.action_executed': { automationId: number; action: string };
  'automation.action_failed': {
    automationId: number;
    action: string;
    error: string;
  };

  /* SECURITY */
  'security.login_failed': { email: string; ip: string };
  'security.login_succeeded': { userId: number; ip: string };
  'security.session_expired': { userId: number };
  'security.api_key_created': { userId: number; keyId: string };
  'security.api_key_revoked': { userId: number; keyId: string };
  'security.suspicious_activity': { userId: number; activity: string };
}
