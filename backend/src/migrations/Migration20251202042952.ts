import { Migration } from '@mikro-orm/migrations';

export class Migration20251202042952 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "plan" ("id" serial primary key, "name" varchar(255) not null, "slug" varchar(255) not null, "price_monthly" int not null, "price_yearly" int null, "max_accounts" int not null, "ai_credits_unlimited" boolean not null, "ai_credits_limit" int null, "max_posts_per_month" int not null, "max_scheduled_posts" int not null, "team_collaboration" boolean not null, "analytics_export" boolean not null, "priority_support" boolean not null, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "plan" add constraint "plan_slug_unique" unique ("slug");`);

    this.addSql(`create table "system_config" ("id" serial primary key, "key" varchar(255) not null, "value" jsonb null, "description" varchar(255) null, "type" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "updated_by_user_id" int null, "deleted_at" timestamptz null);`);
    this.addSql(`create index "system_config_key_index" on "system_config" ("key");`);
    this.addSql(`alter table "system_config" add constraint "system_config_key_unique" unique ("key");`);

    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password_hash" varchar(255) null, "name" varchar(255) not null, "role" varchar(255) not null default 'user', "avatar_url" varchar(255) null, "timezone" varchar(255) null, "is_email_verified" boolean not null default false, "language" varchar(255) null, "locale" varchar(255) null, "time_format" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`create index "user_email_index" on "user" ("email");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "team" ("id" serial primary key, "name" varchar(255) not null, "ownerId" int not null, "description" varchar(255) null, "avatar_url" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);

    this.addSql(`create table "subscription" ("id" serial primary key, "userId" int not null, "planId" int not null, "status" varchar(255) not null, "trial_ends_at" timestamptz null, "period_starts_at" timestamptz not null, "period_ends_at" timestamptz not null, "canceled_at" timestamptz null, "cancel_at_period_end" boolean null, "payment_gateway_subscription_id" varchar(255) null, "payment_gateway_customer_id" varchar(255) null, "last_payment_at" timestamptz null, "next_billing_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`create index "subscription_userId_index" on "subscription" ("userId");`);
    this.addSql(`create index "subscription_planId_index" on "subscription" ("planId");`);

    this.addSql(`create table "social_account" ("id" serial primary key, "provider" varchar(255) not null default 'x', "provider_account_id" varchar(255) not null, "userId" int not null, "username" varchar(255) null, "active" boolean not null default true, "followers_count" int null, "connected_at" timestamptz not null, "profile_picture_url" text null, "page_id" varchar(255) null, "page_name" varchar(255) null, "disconnected_at" timestamptz null);`);

    this.addSql(`create table "account_token" ("id" serial primary key, "socialAccountId" int not null, "token_type" varchar(255) not null, "token_encrypted" text not null, "expires_at" timestamptz null, "revoked" boolean not null default false, "created_at" timestamptz not null);`);

    this.addSql(`create table "refresh_token" ("id" serial primary key, "userId" int not null, "token_hash" varchar(255) not null, "user_agent" varchar(255) null, "ip_address" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "revoked" boolean not null default false, "revoked_at" timestamptz null, "expires_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "refresh_token_userId_index" on "refresh_token" ("userId");`);
    this.addSql(`create index "refresh_token_expires_at_index" on "refresh_token" ("expires_at");`);

    this.addSql(`create table "password_reset_token" ("id" serial primary key, "userId" int not null, "token_hash" varchar(255) not null, "used" boolean not null default false, "used_at" timestamptz null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "password_reset_token_userId_index" on "password_reset_token" ("userId");`);
    this.addSql(`create index "password_reset_token_expires_at_index" on "password_reset_token" ("expires_at");`);

    this.addSql(`create table "notification" ("id" serial primary key, "userId" int not null, "type" varchar(255) not null, "title" jsonb not null, "message" jsonb not null, "data" jsonb null, "link" varchar(255) null, "read" boolean not null default false, "created_at" timestamptz not null, "read_at" timestamptz null, "deleted_at" timestamptz null, "metadata" jsonb null);`);
    this.addSql(`create index "notification_userId_index" on "notification" ("userId");`);
    this.addSql(`create index "notification_created_at_index" on "notification" ("created_at");`);

    this.addSql(`create table "membership" ("id" serial primary key, "userId" int not null, "teamId" int not null, "role" varchar(255) not null, "joined_at" timestamptz not null, "left_at" timestamptz null, "metadata" jsonb null);`);
    this.addSql(`create index "membership_userId_index" on "membership" ("userId");`);
    this.addSql(`create index "membership_teamId_index" on "membership" ("teamId");`);
    this.addSql(`alter table "membership" add constraint "membership_userId_teamId_unique" unique ("userId", "teamId");`);

    this.addSql(`create table "invoice" ("id" serial primary key, "userId" int not null, "subscriptionId" int null, "amount" int not null, "currency" varchar(255) not null, "status" varchar(255) not null, "payment_gateway_id" varchar(255) null, "payment_method" varchar(255) null, "issued_at" timestamptz not null, "paid_at" timestamptz null, "refunded_at" timestamptz null, "downloaded_at" timestamptz null, "pdf_url" varchar(255) null, "metadata" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`create index "invoice_user_idx" on "invoice" ("userId");`);
    this.addSql(`create index "invoice_subscription_idx" on "invoice" ("subscriptionId");`);

    this.addSql(`create table "campaign" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) null, "ownerId" int not null, "teamId" int null, "status" varchar(255) not null, "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "metadata" jsonb null);`);

    this.addSql(`create table "post" ("id" serial primary key, "authorId" int not null, "teamId" int null, "content_ar" varchar(255) not null, "content_en" varchar(255) null, "status" varchar(255) not null default 'draft', "is_recurring" boolean not null default false, "published_at" timestamptz null, "scheduled_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "campaignId" int null);`);
    this.addSql(`create index "post_scheduled_at_index" on "post" ("scheduled_at");`);

    this.addSql(`create table "post_target" ("id" serial primary key, "postId" int not null, "socialAccountId" int not null, "status" varchar(255) not null default 'pending', "attempt" int not null default 0, "last_error" varchar(255) null, "external_post_id" varchar(255) null, "external_url" varchar(255) null, "scheduled_at" timestamptz null, "published_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`create index "post_target_post_idx" on "post_target" ("postId");`);
    this.addSql(`create index "post_target_account_idx" on "post_target" ("socialAccountId");`);
    this.addSql(`create index "post_target_scheduled_at_index" on "post_target" ("scheduled_at");`);

    this.addSql(`create table "post_analytics" ("id" serial primary key, "postId" int not null, "socialAccountId" int null, "provider" varchar(255) not null, "impressions" int not null default 0, "clicks" int not null default 0, "likes" int not null default 0, "comments" int not null default 0, "shares" int not null default 0, "fetched_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "post_analytics_post_idx" on "post_analytics" ("postId");`);
    this.addSql(`create index "post_analytics_fetched_at_index" on "post_analytics" ("fetched_at");`);

    this.addSql(`create table "media" ("id" serial primary key, "postId" int null, "url" varchar(255) not null, "type" varchar(255) not null, "order_index" int not null default 0, "created_at" timestamptz not null);`);

    this.addSql(`create table "job" ("id" serial primary key, "postId" int not null, "postTargetId" int null, "provider" varchar(255) not null, "attempt" int not null default 0, "status" varchar(255) not null, "last_error" varchar(255) null, "scheduled_at" timestamptz not null, "executed_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "job_scheduled_at_index" on "job" ("scheduled_at");`);

    this.addSql(`create table "generation" ("id" serial primary key, "postId" int not null, "userId" int not null, "prompt" varchar(255) not null, "text" varchar(255) not null, "dialect" varchar(255) not null, "tone" varchar(255) not null, "model" varchar(255) null, "temperature" int null, "max_tokens" int null, "metadata" jsonb null, "generated_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "moderation_result" ("id" serial primary key, "generationId" int null, "postId" int null, "provider" varchar(255) not null, "verdict" varchar(255) not null, "details" jsonb null, "created_at" timestamptz not null);`);
    this.addSql(`create index "moderation_result_generationId_index" on "moderation_result" ("generationId");`);
    this.addSql(`create index "moderation_result_postId_index" on "moderation_result" ("postId");`);

    this.addSql(`create table "audit_log" ("id" serial primary key, "userId" int null, "action" varchar(255) not null, "entity_type" varchar(255) null, "entity_id" varchar(255) null, "details" jsonb null, "ip_address" varchar(255) null, "user_agent" varchar(255) null, "correlation_id" varchar(255) null, "created_at" timestamptz not null, "metadata" varchar(255) null);`);
    this.addSql(`create index "audit_log_userId_index" on "audit_log" ("userId");`);
    this.addSql(`create index "audit_log_action_index" on "audit_log" ("action");`);
    this.addSql(`create index "audit_log_entity_type_index" on "audit_log" ("entity_type");`);
    this.addSql(`create index "audit_log_entity_id_index" on "audit_log" ("entity_id");`);
    this.addSql(`create index "audit_log_created_at_index" on "audit_log" ("created_at");`);

    this.addSql(`create table "aiusage_log" ("id" serial primary key, "userId" int not null, "subscriptionId" int null, "generationId" int null, "model_used" varchar(255) not null, "input_tokens" int not null, "output_tokens" int not null, "cost_usd" int not null, "created_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "aiusage_log_userId_index" on "aiusage_log" ("userId");`);
    this.addSql(`create index "aiusage_log_subscriptionId_index" on "aiusage_log" ("subscriptionId");`);
    this.addSql(`create index "aiusage_log_created_at_index" on "aiusage_log" ("created_at");`);

    this.addSql(`create table "webhook_subscription" ("id" serial primary key, "userId" int not null, "url" varchar(255) not null, "event" varchar(255) not null, "active" boolean not null default true, "secret_encrypted" text not null, "last_success_at" timestamptz null, "last_failure_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "metadata" jsonb null);`);
    this.addSql(`create index "webhook_subscription_event_index" on "webhook_subscription" ("event");`);
    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_userId_event_url_unique" unique ("userId", "event", "url");`);

    this.addSql(`create table "webhook_delivery_attempt" ("id" serial primary key, "subscriptionId" int not null, "url" varchar(255) not null, "event" varchar(255) not null, "attempt_number" int not null, "status" varchar(255) not null, "response_code" int null, "response_body" text null, "error_message" varchar(255) null, "duration_ms" int null, "payload_hash" varchar(255) not null, "created_at" timestamptz not null, "metadata" jsonb null, "attempted_at" timestamptz not null);`);
    this.addSql(`create index "webhook_delivery_attempt_subscriptionId_index" on "webhook_delivery_attempt" ("subscriptionId");`);
    this.addSql(`create index "webhook_delivery_attempt_event_index" on "webhook_delivery_attempt" ("event");`);
    this.addSql(`create index "webhook_delivery_attempt_status_index" on "webhook_delivery_attempt" ("status");`);
    this.addSql(`create index "webhook_delivery_attempt_created_at_index" on "webhook_delivery_attempt" ("created_at");`);

    this.addSql(`alter table "team" add constraint "team_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "subscription" add constraint "subscription_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "subscription" add constraint "subscription_planId_foreign" foreign key ("planId") references "plan" ("id") on update cascade;`);

    this.addSql(`alter table "social_account" add constraint "social_account_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "account_token" add constraint "account_token_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade;`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "password_reset_token" add constraint "password_reset_token_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "notification" add constraint "notification_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "membership" add constraint "membership_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "membership" add constraint "membership_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade;`);

    this.addSql(`alter table "invoice" add constraint "invoice_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "invoice" add constraint "invoice_subscriptionId_foreign" foreign key ("subscriptionId") references "subscription" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "campaign" add constraint "campaign_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "campaign" add constraint "campaign_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "post" add constraint "post_authorId_foreign" foreign key ("authorId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "post" add constraint "post_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_campaignId_foreign" foreign key ("campaignId") references "campaign" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "post_target" add constraint "post_target_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_target" add constraint "post_target_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade;`);

    this.addSql(`alter table "post_analytics" add constraint "post_analytics_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_analytics" add constraint "post_analytics_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "media" add constraint "media_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "job" add constraint "job_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "job" add constraint "job_postTargetId_foreign" foreign key ("postTargetId") references "post_target" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "generation" add constraint "generation_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "generation" add constraint "generation_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "moderation_result" add constraint "moderation_result_generationId_foreign" foreign key ("generationId") references "generation" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "audit_log" add constraint "audit_log_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_subscriptionId_foreign" foreign key ("subscriptionId") references "subscription" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_generationId_foreign" foreign key ("generationId") references "generation" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "webhook_delivery_attempt" add constraint "webhook_delivery_attempt_subscriptionId_foreign" foreign key ("subscriptionId") references "webhook_subscription" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "subscription" drop constraint "subscription_planId_foreign";`);

    this.addSql(`alter table "team" drop constraint "team_ownerId_foreign";`);

    this.addSql(`alter table "subscription" drop constraint "subscription_userId_foreign";`);

    this.addSql(`alter table "social_account" drop constraint "social_account_userId_foreign";`);

    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_userId_foreign";`);

    this.addSql(`alter table "password_reset_token" drop constraint "password_reset_token_userId_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_userId_foreign";`);

    this.addSql(`alter table "membership" drop constraint "membership_userId_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_userId_foreign";`);

    this.addSql(`alter table "campaign" drop constraint "campaign_ownerId_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_authorId_foreign";`);

    this.addSql(`alter table "generation" drop constraint "generation_userId_foreign";`);

    this.addSql(`alter table "audit_log" drop constraint "audit_log_userId_foreign";`);

    this.addSql(`alter table "aiusage_log" drop constraint "aiusage_log_userId_foreign";`);

    this.addSql(`alter table "webhook_subscription" drop constraint "webhook_subscription_userId_foreign";`);

    this.addSql(`alter table "membership" drop constraint "membership_teamId_foreign";`);

    this.addSql(`alter table "campaign" drop constraint "campaign_teamId_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_teamId_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_subscriptionId_foreign";`);

    this.addSql(`alter table "aiusage_log" drop constraint "aiusage_log_subscriptionId_foreign";`);

    this.addSql(`alter table "account_token" drop constraint "account_token_socialAccountId_foreign";`);

    this.addSql(`alter table "post_target" drop constraint "post_target_socialAccountId_foreign";`);

    this.addSql(`alter table "post_analytics" drop constraint "post_analytics_socialAccountId_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_campaignId_foreign";`);

    this.addSql(`alter table "post_target" drop constraint "post_target_postId_foreign";`);

    this.addSql(`alter table "post_analytics" drop constraint "post_analytics_postId_foreign";`);

    this.addSql(`alter table "media" drop constraint "media_postId_foreign";`);

    this.addSql(`alter table "job" drop constraint "job_postId_foreign";`);

    this.addSql(`alter table "generation" drop constraint "generation_postId_foreign";`);

    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_postId_foreign";`);

    this.addSql(`alter table "job" drop constraint "job_postTargetId_foreign";`);

    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_generationId_foreign";`);

    this.addSql(`alter table "aiusage_log" drop constraint "aiusage_log_generationId_foreign";`);

    this.addSql(`alter table "webhook_delivery_attempt" drop constraint "webhook_delivery_attempt_subscriptionId_foreign";`);

    this.addSql(`drop table if exists "plan" cascade;`);

    this.addSql(`drop table if exists "system_config" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "team" cascade;`);

    this.addSql(`drop table if exists "subscription" cascade;`);

    this.addSql(`drop table if exists "social_account" cascade;`);

    this.addSql(`drop table if exists "account_token" cascade;`);

    this.addSql(`drop table if exists "refresh_token" cascade;`);

    this.addSql(`drop table if exists "password_reset_token" cascade;`);

    this.addSql(`drop table if exists "notification" cascade;`);

    this.addSql(`drop table if exists "membership" cascade;`);

    this.addSql(`drop table if exists "invoice" cascade;`);

    this.addSql(`drop table if exists "campaign" cascade;`);

    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`drop table if exists "post_target" cascade;`);

    this.addSql(`drop table if exists "post_analytics" cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);

    this.addSql(`drop table if exists "job" cascade;`);

    this.addSql(`drop table if exists "generation" cascade;`);

    this.addSql(`drop table if exists "moderation_result" cascade;`);

    this.addSql(`drop table if exists "audit_log" cascade;`);

    this.addSql(`drop table if exists "aiusage_log" cascade;`);

    this.addSql(`drop table if exists "webhook_subscription" cascade;`);

    this.addSql(`drop table if exists "webhook_delivery_attempt" cascade;`);
  }

}
