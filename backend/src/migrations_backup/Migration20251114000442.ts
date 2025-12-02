import { Migration } from '@mikro-orm/migrations';

export class Migration20251114000442 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "aiusage_log" ("id" serial primary key, "userId" int not null, "subscriptionId" int null, "generationId" int null, "model_used" varchar(255) not null, "input_tokens" int not null, "output_tokens" int not null, "cost_usd" int not null, "created_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "aiusage_log_userId_index" on "aiusage_log" ("userId");`);
    this.addSql(`create index "aiusage_log_subscriptionId_index" on "aiusage_log" ("subscriptionId");`);
    this.addSql(`create index "aiusage_log_created_at_index" on "aiusage_log" ("created_at");`);

    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_subscriptionId_foreign" foreign key ("subscriptionId") references "subscription" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "aiusage_log" add constraint "aiusage_log_generationId_foreign" foreign key ("generationId") references "generation" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "ai_usage_log" cascade;`);

    this.addSql(`alter table "system_config" drop constraint "system_config_updated_by_id_foreign";`);

    this.addSql(`alter table "team" drop constraint "team_owner_id_foreign";`);

    this.addSql(`alter table "template" drop constraint "template_owner_id_foreign";`);
    this.addSql(`alter table "template" drop constraint "template_team_id_foreign";`);

    this.addSql(`alter table "subscription" drop constraint "subscription_user_id_foreign";`);
    this.addSql(`alter table "subscription" drop constraint "subscription_plan_id_foreign";`);

    this.addSql(`alter table "social_account" drop constraint "social_account_user_id_foreign";`);

    this.addSql(`alter table "account_token" drop constraint "account_token_account_id_foreign";`);

    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`);

    this.addSql(`alter table "password_reset_token" drop constraint "password_reset_token_user_id_foreign";`);

    this.addSql(`alter table "notification" drop constraint if exists "notification_type_check";`);

    this.addSql(`alter table "notification" drop constraint "notification_user_id_foreign";`);

    this.addSql(`alter table "membership" drop constraint "membership_user_id_foreign";`);
    this.addSql(`alter table "membership" drop constraint "membership_team_id_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_user_id_foreign";`);
    this.addSql(`alter table "invoice" drop constraint "invoice_subscription_id_foreign";`);

    this.addSql(`alter table "campaign" drop constraint "campaign_owner_id_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_author_id_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_team_id_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_campaign_id_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_template_id_foreign";`);

    this.addSql(`alter table "post_target" drop constraint "post_target_post_id_foreign";`);
    this.addSql(`alter table "post_target" drop constraint "post_target_social_account_id_foreign";`);

    this.addSql(`alter table "post_tag" drop constraint "post_tag_post_id_foreign";`);
    this.addSql(`alter table "post_tag" drop constraint "post_tag_tag_id_foreign";`);

    this.addSql(`alter table "post_analytics" drop constraint "post_analytics_post_id_foreign";`);

    this.addSql(`alter table "media" drop constraint "media_post_id_foreign";`);

    this.addSql(`alter table "job" drop constraint "job_post_id_foreign";`);
    this.addSql(`alter table "job" drop constraint "job_target_id_foreign";`);

    this.addSql(`alter table "generation" drop constraint "generation_post_id_foreign";`);

    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_generation_id_foreign";`);
    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_post_id_foreign";`);

    this.addSql(`alter table "audit_log" drop constraint "audit_log_user_id_foreign";`);

    this.addSql(`alter table "webhook_subscription" drop constraint "webhook_subscription_user_id_foreign";`);

    this.addSql(`alter table "webhook_delivery_attempt" drop constraint "webhook_delivery_attempt_subscription_id_foreign";`);

    this.addSql(`alter table "plan" add column "slug" varchar(255) not null, add column "price_yearly" int null, add column "max_posts_per_month" int not null, add column "max_scheduled_posts" int not null, add column "priority_support" boolean not null, add column "metadata" jsonb null, add column "is_active" boolean not null default true, add column "updated_at" timestamptz not null;`);
    this.addSql(`alter table "plan" alter column "name" drop default;`);
    this.addSql(`alter table "plan" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "plan" alter column "price_monthly" drop default;`);
    this.addSql(`alter table "plan" alter column "price_monthly" type int using ("price_monthly"::int);`);
    this.addSql(`alter table "plan" alter column "max_accounts" drop default;`);
    this.addSql(`alter table "plan" alter column "max_accounts" type int using ("max_accounts"::int);`);
    this.addSql(`alter table "plan" alter column "ai_credits_unlimited" drop default;`);
    this.addSql(`alter table "plan" alter column "ai_credits_unlimited" type boolean using ("ai_credits_unlimited"::boolean);`);
    this.addSql(`alter table "plan" alter column "ai_credits_limit" type int using ("ai_credits_limit"::int);`);
    this.addSql(`alter table "plan" alter column "ai_credits_limit" drop not null;`);
    this.addSql(`alter table "plan" alter column "team_collaboration" drop default;`);
    this.addSql(`alter table "plan" alter column "team_collaboration" type boolean using ("team_collaboration"::boolean);`);
    this.addSql(`alter table "plan" alter column "analytics_export" drop default;`);
    this.addSql(`alter table "plan" alter column "analytics_export" type boolean using ("analytics_export"::boolean);`);
    this.addSql(`alter table "plan" add constraint "plan_slug_unique" unique ("slug");`);

    this.addSql(`alter table "system_config" drop column "updated_by_id";`);

    this.addSql(`alter table "system_config" add column "key" varchar(255) not null, add column "updated_by_user_id" int null, add column "deleted_at" timestamptz null;`);
    this.addSql(`alter table "system_config" alter column "value" type jsonb using ("value"::jsonb);`);
    this.addSql(`alter table "system_config" alter column "value" drop not null;`);
    this.addSql(`alter table "system_config" alter column "type" drop default;`);
    this.addSql(`alter table "system_config" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`create index "system_config_key_index" on "system_config" ("key");`);
    this.addSql(`alter table "system_config" add constraint "system_config_key_unique" unique ("key");`);

    this.addSql(`alter table "tag" add column "metadata" jsonb null;`);
    this.addSql(`create index "tag_normalized_index" on "tag" ("normalized");`);
    this.addSql(`alter table "tag" add constraint "tag_normalized_unique" unique ("normalized");`);

    this.addSql(`alter table "user" drop column "reset_token", drop column "reset_token_expires_at";`);

    this.addSql(`create index "user_email_index" on "user" ("email");`);

    this.addSql(`alter table "team" add column "description" varchar(255) null, add column "avatar_url" varchar(255) null;`);
    this.addSql(`alter table "team" rename column "owner_id" to "ownerId";`);
    this.addSql(`alter table "team" add constraint "team_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "template" add column "description" varchar(255) null, add column "language" varchar(255) null, add column "metadata" jsonb null, add column "deleted_at" timestamptz null;`);
    this.addSql(`alter table "template" alter column "visibility" drop default;`);
    this.addSql(`alter table "template" alter column "visibility" type varchar(255) using ("visibility"::varchar(255));`);
    this.addSql(`alter table "template" rename column "owner_id" to "ownerId";`);
    this.addSql(`alter table "template" rename column "team_id" to "teamId";`);
    this.addSql(`alter table "template" add constraint "template_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "template" add constraint "template_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "subscription" drop column "user_id", drop column "plan_id";`);

    this.addSql(`alter table "subscription" add column "userId" int not null, add column "planId" int not null, add column "trial_ends_at" timestamptz null, add column "cancel_at_period_end" boolean null, add column "payment_gateway_customer_id" varchar(255) null, add column "last_payment_at" timestamptz null, add column "next_billing_at" timestamptz null, add column "metadata" jsonb null, add column "deleted_at" timestamptz null;`);
    this.addSql(`alter table "subscription" alter column "status" drop default;`);
    this.addSql(`alter table "subscription" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "subscription" alter column "payment_gateway_subscription_id" type varchar(255) using ("payment_gateway_subscription_id"::varchar(255));`);
    this.addSql(`alter table "subscription" alter column "payment_gateway_subscription_id" drop not null;`);
    this.addSql(`alter table "subscription" add constraint "subscription_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "subscription" add constraint "subscription_planId_foreign" foreign key ("planId") references "plan" ("id") on update cascade;`);
    this.addSql(`create index "subscription_userId_index" on "subscription" ("userId");`);
    this.addSql(`create index "subscription_planId_index" on "subscription" ("planId");`);

    this.addSql(`alter table "social_account" rename column "user_id" to "userId";`);
    this.addSql(`alter table "social_account" add constraint "social_account_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "account_token" drop column "username", drop column "followers_count", drop column "profile_picture_url";`);

    this.addSql(`alter table "account_token" alter column "token_type" drop default;`);
    this.addSql(`alter table "account_token" alter column "token_type" type varchar(255) using ("token_type"::varchar(255));`);
    this.addSql(`alter table "account_token" rename column "account_id" to "socialAccountId";`);
    this.addSql(`alter table "account_token" add constraint "account_token_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade;`);

    this.addSql(`drop index "refresh_token_revoked_index";`);

    this.addSql(`alter table "refresh_token" add column "revoked_at" timestamptz null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "refresh_token" alter column "user_agent" type varchar(255) using ("user_agent"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "user_agent" drop not null;`);
    this.addSql(`alter table "refresh_token" alter column "ip_address" type varchar(255) using ("ip_address"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "ip_address" drop not null;`);
    this.addSql(`alter table "refresh_token" rename column "user_id" to "userId";`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`create index "refresh_token_userId_index" on "refresh_token" ("userId");`);

    this.addSql(`drop index "password_reset_token_token_hash_index";`);

    this.addSql(`alter table "password_reset_token" add column "used_at" timestamptz null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "password_reset_token" rename column "user_id" to "userId";`);
    this.addSql(`alter table "password_reset_token" add constraint "password_reset_token_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`create index "password_reset_token_userId_index" on "password_reset_token" ("userId");`);
    this.addSql(`create index "password_reset_token_expires_at_index" on "password_reset_token" ("expires_at");`);

    this.addSql(`alter table "notification" add column "read_at" timestamptz null, add column "deleted_at" timestamptz null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "notification" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "notification" rename column "user_id" to "userId";`);
    this.addSql(`alter table "notification" add constraint "notification_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`create index "notification_userId_index" on "notification" ("userId");`);
    this.addSql(`create index "notification_created_at_index" on "notification" ("created_at");`);

    this.addSql(`alter table "membership" drop column "user_id", drop column "team_id";`);

    this.addSql(`alter table "membership" add column "userId" int not null, add column "teamId" int not null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "membership" alter column "role" drop default;`);
    this.addSql(`alter table "membership" alter column "role" type varchar(255) using ("role"::varchar(255));`);
    this.addSql(`alter table "membership" add constraint "membership_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "membership" add constraint "membership_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade;`);
    this.addSql(`create index "membership_userId_index" on "membership" ("userId");`);
    this.addSql(`create index "membership_teamId_index" on "membership" ("teamId");`);
    this.addSql(`alter table "membership" add constraint "membership_userId_teamId_unique" unique ("userId", "teamId");`);

    this.addSql(`drop index "invoice_user_idx";`);
    this.addSql(`drop index "invoice_subscription_idx";`);
    this.addSql(`alter table "invoice" drop column "user_id", drop column "subscription_id";`);

    this.addSql(`alter table "invoice" add column "userId" int not null, add column "subscriptionId" int null, add column "refunded_at" timestamptz null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);
    this.addSql(`alter table "invoice" alter column "currency" drop default;`);
    this.addSql(`alter table "invoice" alter column "currency" type varchar(255) using ("currency"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "status" drop default;`);
    this.addSql(`alter table "invoice" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "payment_gateway_id" type varchar(255) using ("payment_gateway_id"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "payment_gateway_id" drop not null;`);
    this.addSql(`alter table "invoice" alter column "payment_method" type varchar(255) using ("payment_method"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "payment_method" drop not null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "invoice" add constraint "invoice_subscriptionId_foreign" foreign key ("subscriptionId") references "subscription" ("id") on update cascade on delete set null;`);
    this.addSql(`create index "invoice_user_idx" on "invoice" ("userId");`);
    this.addSql(`create index "invoice_subscription_idx" on "invoice" ("subscriptionId");`);

    this.addSql(`alter table "campaign" add column "description" varchar(255) null, add column "teamId" int null, add column "deleted_at" timestamptz null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "campaign" alter column "status" drop default;`);
    this.addSql(`alter table "campaign" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "campaign" add constraint "campaign_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "campaign" rename column "owner_id" to "ownerId";`);
    this.addSql(`alter table "campaign" add constraint "campaign_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);

    this.addSql(`drop index "post_schedule_status_idx";`);
    this.addSql(`alter table "post" drop column "team_id", drop column "campaign_id", drop column "template_id", drop column "schedule_at";`);

    this.addSql(`alter table "post" add column "teamId" int null, add column "scheduled_at" timestamptz null, add column "campaignId" int null, add column "templateId" int null;`);
    this.addSql(`alter table "post" add constraint "post_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_campaignId_foreign" foreign key ("campaignId") references "campaign" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_templateId_foreign" foreign key ("templateId") references "template" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" rename column "author_id" to "authorId";`);
    this.addSql(`alter table "post" add constraint "post_authorId_foreign" foreign key ("authorId") references "user" ("id") on update cascade;`);
    this.addSql(`create index "post_scheduled_at_index" on "post" ("scheduled_at");`);

    this.addSql(`drop index "post_target_post_idx";`);
    this.addSql(`drop index "post_target_account_idx";`);
    this.addSql(`alter table "post_target" drop column "post_id", drop column "social_account_id";`);

    this.addSql(`alter table "post_target" add column "postId" int not null, add column "socialAccountId" int not null;`);
    this.addSql(`alter table "post_target" add constraint "post_target_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_target" add constraint "post_target_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade;`);
    this.addSql(`create index "post_target_scheduled_at_index" on "post_target" ("scheduled_at");`);
    this.addSql(`create index "post_target_post_idx" on "post_target" ("postId");`);
    this.addSql(`create index "post_target_account_idx" on "post_target" ("socialAccountId");`);

    this.addSql(`alter table "post_tag" drop column "post_id", drop column "tag_id";`);

    this.addSql(`alter table "post_tag" add column "postId" int not null, add column "tagId" int not null;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_tagId_foreign" foreign key ("tagId") references "tag" ("id") on update cascade;`);
    this.addSql(`create index "post_tag_postId_index" on "post_tag" ("postId");`);
    this.addSql(`create index "post_tag_tagId_index" on "post_tag" ("tagId");`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_postId_tagId_unique" unique ("postId", "tagId");`);

    this.addSql(`drop index "post_analytics_post_time_idx";`);

    this.addSql(`alter table "post_analytics" add column "socialAccountId" int null, add column "provider" varchar(255) not null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "post_analytics" add constraint "post_analytics_socialAccountId_foreign" foreign key ("socialAccountId") references "social_account" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post_analytics" rename column "post_id" to "postId";`);
    this.addSql(`alter table "post_analytics" add constraint "post_analytics_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`create index "post_analytics_post_idx" on "post_analytics" ("postId");`);
    this.addSql(`create index "post_analytics_fetched_at_index" on "post_analytics" ("fetched_at");`);

    this.addSql(`alter table "media" alter column "type" drop default;`);
    this.addSql(`alter table "media" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "media" rename column "post_id" to "postId";`);
    this.addSql(`alter table "media" add constraint "media_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "job" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "job" alter column "provider" drop default;`);
    this.addSql(`alter table "job" alter column "provider" type varchar(255) using ("provider"::varchar(255));`);
    this.addSql(`alter table "job" alter column "status" drop default;`);
    this.addSql(`alter table "job" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "job" rename column "post_id" to "postId";`);
    this.addSql(`alter table "job" rename column "target_id" to "postTargetId";`);
    this.addSql(`alter table "job" add constraint "job_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "job" add constraint "job_postTargetId_foreign" foreign key ("postTargetId") references "post_target" ("id") on update cascade on delete set null;`);
    this.addSql(`create index "job_scheduled_at_index" on "job" ("scheduled_at");`);

    this.addSql(`alter table "generation" add column "userId" int not null, add column "model" varchar(255) null, add column "temperature" int null, add column "max_tokens" int null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "generation" alter column "dialect" drop default;`);
    this.addSql(`alter table "generation" alter column "dialect" type varchar(255) using ("dialect"::varchar(255));`);
    this.addSql(`alter table "generation" alter column "tone" drop default;`);
    this.addSql(`alter table "generation" alter column "tone" type varchar(255) using ("tone"::varchar(255));`);
    this.addSql(`alter table "generation" add constraint "generation_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "generation" rename column "post_id" to "postId";`);
    this.addSql(`alter table "generation" add constraint "generation_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "moderation_result" drop column "post_id";`);

    this.addSql(`alter table "moderation_result" add column "postId" int null;`);
    this.addSql(`alter table "moderation_result" alter column "provider" drop default;`);
    this.addSql(`alter table "moderation_result" alter column "provider" type varchar(255) using ("provider"::varchar(255));`);
    this.addSql(`alter table "moderation_result" alter column "verdict" drop default;`);
    this.addSql(`alter table "moderation_result" alter column "verdict" type varchar(255) using ("verdict"::varchar(255));`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "moderation_result" rename column "generation_id" to "generationId";`);
    this.addSql(`alter table "moderation_result" rename column "checked_at" to "created_at";`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_generationId_foreign" foreign key ("generationId") references "generation" ("id") on update cascade on delete set null;`);
    this.addSql(`create index "moderation_result_generationId_index" on "moderation_result" ("generationId");`);
    this.addSql(`create index "moderation_result_postId_index" on "moderation_result" ("postId");`);

    this.addSql(`alter table "audit_log" drop column "user_id";`);

    this.addSql(`alter table "audit_log" add column "userId" int null, add column "ip_address" varchar(255) null, add column "user_agent" varchar(255) null, add column "correlation_id" varchar(255) null, add column "metadata" varchar(255) null;`);
    this.addSql(`alter table "audit_log" alter column "entity_type" type varchar(255) using ("entity_type"::varchar(255));`);
    this.addSql(`alter table "audit_log" alter column "entity_type" drop not null;`);
    this.addSql(`alter table "audit_log" alter column "entity_id" type varchar(255) using ("entity_id"::varchar(255));`);
    this.addSql(`alter table "audit_log" alter column "entity_id" drop not null;`);
    this.addSql(`alter table "audit_log" add constraint "audit_log_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "audit_log" rename column "timestamp" to "created_at";`);
    this.addSql(`create index "audit_log_userId_index" on "audit_log" ("userId");`);
    this.addSql(`create index "audit_log_action_index" on "audit_log" ("action");`);
    this.addSql(`create index "audit_log_entity_type_index" on "audit_log" ("entity_type");`);
    this.addSql(`create index "audit_log_entity_id_index" on "audit_log" ("entity_id");`);
    this.addSql(`create index "audit_log_created_at_index" on "audit_log" ("created_at");`);

    this.addSql(`alter table "webhook_subscription" add column "last_success_at" timestamptz null, add column "last_failure_at" timestamptz null, add column "updated_at" timestamptz not null, add column "deleted_at" timestamptz null, add column "metadata" jsonb null;`);
    this.addSql(`alter table "webhook_subscription" alter column "event" drop default;`);
    this.addSql(`alter table "webhook_subscription" alter column "event" type varchar(255) using ("event"::varchar(255));`);
    this.addSql(`alter table "webhook_subscription" alter column "secret_encrypted" type text using ("secret_encrypted"::text);`);
    this.addSql(`alter table "webhook_subscription" rename column "user_id" to "userId";`);
    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_userId_foreign" foreign key ("userId") references "user" ("id") on update cascade;`);
    this.addSql(`create index "webhook_subscription_event_index" on "webhook_subscription" ("event");`);
    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_userId_event_url_unique" unique ("userId", "event", "url");`);

    this.addSql(`alter table "webhook_delivery_attempt" add column "response_body" text null, add column "metadata" jsonb null, add column "attempted_at" timestamptz not null;`);
    this.addSql(`alter table "webhook_delivery_attempt" rename column "subscription_id" to "subscriptionId";`);
    this.addSql(`alter table "webhook_delivery_attempt" add constraint "webhook_delivery_attempt_subscriptionId_foreign" foreign key ("subscriptionId") references "webhook_subscription" ("id") on update cascade;`);
    this.addSql(`create index "webhook_delivery_attempt_subscriptionId_index" on "webhook_delivery_attempt" ("subscriptionId");`);
    this.addSql(`create index "webhook_delivery_attempt_event_index" on "webhook_delivery_attempt" ("event");`);
    this.addSql(`create index "webhook_delivery_attempt_status_index" on "webhook_delivery_attempt" ("status");`);
    this.addSql(`create index "webhook_delivery_attempt_created_at_index" on "webhook_delivery_attempt" ("created_at");`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "ai_usage_log" ("id" serial primary key, "user_id" int not null, "subscription_id" int null, "generation_id" int null, "model_used" varchar(255) not null default 'gpt-4o-mini', "input_tokens" int not null, "output_tokens" int not null, "cost_usd" int not null, "created_at" timestamptz not null, "metadata" jsonb null);`);

    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_subscription_id_foreign" foreign key ("subscription_id") references "subscription" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_generation_id_foreign" foreign key ("generation_id") references "generation" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "aiusage_log" cascade;`);

    this.addSql(`alter table "team" drop constraint "team_ownerId_foreign";`);

    this.addSql(`alter table "template" drop constraint "template_ownerId_foreign";`);
    this.addSql(`alter table "template" drop constraint "template_teamId_foreign";`);

    this.addSql(`alter table "subscription" drop constraint "subscription_userId_foreign";`);
    this.addSql(`alter table "subscription" drop constraint "subscription_planId_foreign";`);

    this.addSql(`alter table "social_account" drop constraint "social_account_userId_foreign";`);

    this.addSql(`alter table "account_token" drop constraint "account_token_socialAccountId_foreign";`);

    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_userId_foreign";`);

    this.addSql(`alter table "password_reset_token" drop constraint "password_reset_token_userId_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_userId_foreign";`);

    this.addSql(`alter table "membership" drop constraint "membership_userId_foreign";`);
    this.addSql(`alter table "membership" drop constraint "membership_teamId_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_userId_foreign";`);
    this.addSql(`alter table "invoice" drop constraint "invoice_subscriptionId_foreign";`);

    this.addSql(`alter table "campaign" drop constraint "campaign_ownerId_foreign";`);
    this.addSql(`alter table "campaign" drop constraint "campaign_teamId_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_authorId_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_teamId_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_campaignId_foreign";`);
    this.addSql(`alter table "post" drop constraint "post_templateId_foreign";`);

    this.addSql(`alter table "post_target" drop constraint "post_target_postId_foreign";`);
    this.addSql(`alter table "post_target" drop constraint "post_target_socialAccountId_foreign";`);

    this.addSql(`alter table "post_tag" drop constraint "post_tag_postId_foreign";`);
    this.addSql(`alter table "post_tag" drop constraint "post_tag_tagId_foreign";`);

    this.addSql(`alter table "post_analytics" drop constraint "post_analytics_postId_foreign";`);
    this.addSql(`alter table "post_analytics" drop constraint "post_analytics_socialAccountId_foreign";`);

    this.addSql(`alter table "media" drop constraint "media_postId_foreign";`);

    this.addSql(`alter table "job" drop constraint "job_postId_foreign";`);
    this.addSql(`alter table "job" drop constraint "job_postTargetId_foreign";`);

    this.addSql(`alter table "generation" drop constraint "generation_postId_foreign";`);
    this.addSql(`alter table "generation" drop constraint "generation_userId_foreign";`);

    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_generationId_foreign";`);
    this.addSql(`alter table "moderation_result" drop constraint "moderation_result_postId_foreign";`);

    this.addSql(`alter table "audit_log" drop constraint "audit_log_userId_foreign";`);

    this.addSql(`alter table "webhook_subscription" drop constraint "webhook_subscription_userId_foreign";`);

    this.addSql(`alter table "webhook_delivery_attempt" drop constraint "webhook_delivery_attempt_subscriptionId_foreign";`);

    this.addSql(`alter table "plan" drop constraint "plan_slug_unique";`);
    this.addSql(`alter table "plan" drop column "slug", drop column "price_yearly", drop column "max_posts_per_month", drop column "max_scheduled_posts", drop column "priority_support", drop column "metadata", drop column "is_active", drop column "updated_at";`);

    this.addSql(`alter table "plan" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "plan" alter column "name" set default 'Free';`);
    this.addSql(`alter table "plan" alter column "price_monthly" type int using ("price_monthly"::int);`);
    this.addSql(`alter table "plan" alter column "price_monthly" set default 0;`);
    this.addSql(`alter table "plan" alter column "max_accounts" type int using ("max_accounts"::int);`);
    this.addSql(`alter table "plan" alter column "max_accounts" set default 5;`);
    this.addSql(`alter table "plan" alter column "ai_credits_unlimited" type boolean using ("ai_credits_unlimited"::boolean);`);
    this.addSql(`alter table "plan" alter column "ai_credits_unlimited" set default false;`);
    this.addSql(`alter table "plan" alter column "ai_credits_limit" type int using ("ai_credits_limit"::int);`);
    this.addSql(`alter table "plan" alter column "ai_credits_limit" set not null;`);
    this.addSql(`alter table "plan" alter column "team_collaboration" type boolean using ("team_collaboration"::boolean);`);
    this.addSql(`alter table "plan" alter column "team_collaboration" set default false;`);
    this.addSql(`alter table "plan" alter column "analytics_export" type boolean using ("analytics_export"::boolean);`);
    this.addSql(`alter table "plan" alter column "analytics_export" set default false;`);

    this.addSql(`drop index "tag_normalized_index";`);
    this.addSql(`alter table "tag" drop constraint "tag_normalized_unique";`);
    this.addSql(`alter table "tag" drop column "metadata";`);

    this.addSql(`drop index "user_email_index";`);

    this.addSql(`alter table "user" add column "reset_token" varchar(255) null, add column "reset_token_expires_at" timestamptz null;`);

    this.addSql(`alter table "team" drop column "description", drop column "avatar_url";`);

    this.addSql(`alter table "team" rename column "ownerId" to "owner_id";`);
    this.addSql(`alter table "team" add constraint "team_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "template" drop column "description", drop column "language", drop column "metadata", drop column "deleted_at";`);

    this.addSql(`alter table "template" alter column "visibility" type varchar(255) using ("visibility"::varchar(255));`);
    this.addSql(`alter table "template" alter column "visibility" set default 'private';`);
    this.addSql(`alter table "template" rename column "ownerId" to "owner_id";`);
    this.addSql(`alter table "template" rename column "teamId" to "team_id";`);
    this.addSql(`alter table "template" add constraint "template_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "template" add constraint "template_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;`);

    this.addSql(`drop index "system_config_key_index";`);
    this.addSql(`alter table "system_config" drop constraint "system_config_key_unique";`);
    this.addSql(`alter table "system_config" drop column "key", drop column "updated_by_user_id", drop column "deleted_at";`);

    this.addSql(`alter table "system_config" add column "updated_by_id" int null;`);
    this.addSql(`alter table "system_config" alter column "value" type varchar(255) using ("value"::varchar(255));`);
    this.addSql(`alter table "system_config" alter column "value" set not null;`);
    this.addSql(`alter table "system_config" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "system_config" alter column "type" set default 'string';`);
    this.addSql(`alter table "system_config" add constraint "system_config_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`drop index "subscription_userId_index";`);
    this.addSql(`drop index "subscription_planId_index";`);
    this.addSql(`alter table "subscription" drop column "userId", drop column "planId", drop column "trial_ends_at", drop column "cancel_at_period_end", drop column "payment_gateway_customer_id", drop column "last_payment_at", drop column "next_billing_at", drop column "metadata", drop column "deleted_at";`);

    this.addSql(`alter table "subscription" add column "user_id" int not null, add column "plan_id" int not null;`);
    this.addSql(`alter table "subscription" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "subscription" alter column "status" set default 'active';`);
    this.addSql(`alter table "subscription" alter column "payment_gateway_subscription_id" type varchar(255) using ("payment_gateway_subscription_id"::varchar(255));`);
    this.addSql(`alter table "subscription" alter column "payment_gateway_subscription_id" set not null;`);
    this.addSql(`alter table "subscription" add constraint "subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "subscription" add constraint "subscription_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade;`);

    this.addSql(`alter table "social_account" rename column "userId" to "user_id";`);
    this.addSql(`alter table "social_account" add constraint "social_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "account_token" add column "username" varchar(255) null, add column "followers_count" int null, add column "profile_picture_url" varchar(255) null;`);
    this.addSql(`alter table "account_token" alter column "token_type" type varchar(255) using ("token_type"::varchar(255));`);
    this.addSql(`alter table "account_token" alter column "token_type" set default 'access';`);
    this.addSql(`alter table "account_token" rename column "socialAccountId" to "account_id";`);
    this.addSql(`alter table "account_token" add constraint "account_token_account_id_foreign" foreign key ("account_id") references "social_account" ("id") on update cascade;`);

    this.addSql(`drop index "refresh_token_userId_index";`);
    this.addSql(`alter table "refresh_token" drop column "revoked_at", drop column "metadata";`);

    this.addSql(`alter table "refresh_token" alter column "user_agent" type varchar(255) using ("user_agent"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "user_agent" set not null;`);
    this.addSql(`alter table "refresh_token" alter column "ip_address" type varchar(255) using ("ip_address"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "ip_address" set not null;`);
    this.addSql(`alter table "refresh_token" rename column "userId" to "user_id";`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`create index "refresh_token_revoked_index" on "refresh_token" ("revoked");`);

    this.addSql(`drop index "password_reset_token_userId_index";`);
    this.addSql(`drop index "password_reset_token_expires_at_index";`);
    this.addSql(`alter table "password_reset_token" drop column "used_at", drop column "metadata";`);

    this.addSql(`alter table "password_reset_token" rename column "userId" to "user_id";`);
    this.addSql(`alter table "password_reset_token" add constraint "password_reset_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`create index "password_reset_token_token_hash_index" on "password_reset_token" ("token_hash");`);

    this.addSql(`drop index "notification_userId_index";`);
    this.addSql(`drop index "notification_created_at_index";`);
    this.addSql(`alter table "notification" drop column "read_at", drop column "deleted_at", drop column "metadata";`);

    this.addSql(`alter table "notification" alter column "type" type text using ("type"::text);`);
    this.addSql(`alter table "notification" add constraint "notification_type_check" check("type" in ('post_scheduled', 'publish_failed', 'ai_ready', 'approved'));`);
    this.addSql(`alter table "notification" rename column "userId" to "user_id";`);
    this.addSql(`alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop index "membership_userId_index";`);
    this.addSql(`drop index "membership_teamId_index";`);
    this.addSql(`alter table "membership" drop constraint "membership_userId_teamId_unique";`);
    this.addSql(`alter table "membership" drop column "userId", drop column "teamId", drop column "metadata";`);

    this.addSql(`alter table "membership" add column "user_id" int not null, add column "team_id" int not null;`);
    this.addSql(`alter table "membership" alter column "role" type varchar(255) using ("role"::varchar(255));`);
    this.addSql(`alter table "membership" alter column "role" set default 'editor';`);
    this.addSql(`alter table "membership" add constraint "membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "membership" add constraint "membership_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;`);

    this.addSql(`drop index "invoice_user_idx";`);
    this.addSql(`drop index "invoice_subscription_idx";`);
    this.addSql(`alter table "invoice" drop column "subscriptionId", drop column "refunded_at", drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "invoice" add column "subscription_id" int not null;`);
    this.addSql(`alter table "invoice" alter column "currency" type varchar(255) using ("currency"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "currency" set default 'SAR';`);
    this.addSql(`alter table "invoice" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "status" set default 'unpaid';`);
    this.addSql(`alter table "invoice" alter column "payment_gateway_id" type varchar(255) using ("payment_gateway_id"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "payment_gateway_id" set not null;`);
    this.addSql(`alter table "invoice" alter column "payment_method" type varchar(255) using ("payment_method"::varchar(255));`);
    this.addSql(`alter table "invoice" alter column "payment_method" set not null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_subscription_id_foreign" foreign key ("subscription_id") references "subscription" ("id") on update cascade;`);
    this.addSql(`alter table "invoice" rename column "userId" to "user_id";`);
    this.addSql(`alter table "invoice" add constraint "invoice_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`create index "invoice_user_idx" on "invoice" ("user_id");`);
    this.addSql(`create index "invoice_subscription_idx" on "invoice" ("subscription_id");`);

    this.addSql(`alter table "campaign" drop column "description", drop column "teamId", drop column "deleted_at", drop column "metadata";`);

    this.addSql(`alter table "campaign" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "campaign" alter column "status" set default 'active';`);
    this.addSql(`alter table "campaign" rename column "ownerId" to "owner_id";`);
    this.addSql(`alter table "campaign" add constraint "campaign_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop index "post_scheduled_at_index";`);
    this.addSql(`alter table "post" drop column "teamId", drop column "scheduled_at", drop column "campaignId", drop column "templateId";`);

    this.addSql(`alter table "post" add column "team_id" int null, add column "campaign_id" int null, add column "template_id" int null, add column "schedule_at" timestamptz not null;`);
    this.addSql(`alter table "post" add constraint "post_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_template_id_foreign" foreign key ("template_id") references "template" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" rename column "authorId" to "author_id";`);
    this.addSql(`alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
    this.addSql(`create index "post_schedule_status_idx" on "post" ("schedule_at");`);

    this.addSql(`drop index "post_target_scheduled_at_index";`);
    this.addSql(`drop index "post_target_post_idx";`);
    this.addSql(`drop index "post_target_account_idx";`);
    this.addSql(`alter table "post_target" drop column "postId", drop column "socialAccountId";`);

    this.addSql(`alter table "post_target" add column "post_id" int not null, add column "social_account_id" int not null;`);
    this.addSql(`alter table "post_target" add constraint "post_target_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_target" add constraint "post_target_social_account_id_foreign" foreign key ("social_account_id") references "social_account" ("id") on update cascade;`);
    this.addSql(`create index "post_target_post_idx" on "post_target" ("post_id");`);
    this.addSql(`create index "post_target_account_idx" on "post_target" ("social_account_id");`);

    this.addSql(`drop index "post_tag_postId_index";`);
    this.addSql(`drop index "post_tag_tagId_index";`);
    this.addSql(`alter table "post_tag" drop constraint "post_tag_postId_tagId_unique";`);
    this.addSql(`alter table "post_tag" drop column "postId", drop column "tagId";`);

    this.addSql(`alter table "post_tag" add column "post_id" int not null, add column "tag_id" int not null;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;`);

    this.addSql(`drop index "post_analytics_post_idx";`);
    this.addSql(`drop index "post_analytics_fetched_at_index";`);
    this.addSql(`alter table "post_analytics" drop column "socialAccountId", drop column "provider", drop column "created_at", drop column "updated_at", drop column "metadata";`);

    this.addSql(`alter table "post_analytics" rename column "postId" to "post_id";`);
    this.addSql(`alter table "post_analytics" add constraint "post_analytics_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`create index "post_analytics_post_time_idx" on "post_analytics" ("post_id");`);

    this.addSql(`alter table "media" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "media" alter column "type" set default 'image';`);
    this.addSql(`alter table "media" rename column "postId" to "post_id";`);
    this.addSql(`alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete set null;`);

    this.addSql(`drop index "job_scheduled_at_index";`);
    this.addSql(`alter table "job" drop column "created_at", drop column "updated_at", drop column "metadata";`);

    this.addSql(`alter table "job" alter column "provider" type varchar(255) using ("provider"::varchar(255));`);
    this.addSql(`alter table "job" alter column "provider" set default 'x';`);
    this.addSql(`alter table "job" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "job" alter column "status" set default 'pending';`);
    this.addSql(`alter table "job" rename column "postId" to "post_id";`);
    this.addSql(`alter table "job" rename column "postTargetId" to "target_id";`);
    this.addSql(`alter table "job" add constraint "job_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "job" add constraint "job_target_id_foreign" foreign key ("target_id") references "post_target" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "generation" drop column "userId", drop column "model", drop column "temperature", drop column "max_tokens", drop column "metadata";`);

    this.addSql(`alter table "generation" alter column "dialect" type varchar(255) using ("dialect"::varchar(255));`);
    this.addSql(`alter table "generation" alter column "dialect" set default 'MSA';`);
    this.addSql(`alter table "generation" alter column "tone" type varchar(255) using ("tone"::varchar(255));`);
    this.addSql(`alter table "generation" alter column "tone" set default 'casual';`);
    this.addSql(`alter table "generation" rename column "postId" to "post_id";`);
    this.addSql(`alter table "generation" add constraint "generation_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`drop index "moderation_result_generationId_index";`);
    this.addSql(`drop index "moderation_result_postId_index";`);
    this.addSql(`alter table "moderation_result" drop column "postId";`);

    this.addSql(`alter table "moderation_result" add column "post_id" int not null;`);
    this.addSql(`alter table "moderation_result" alter column "provider" type varchar(255) using ("provider"::varchar(255));`);
    this.addSql(`alter table "moderation_result" alter column "provider" set default 'gemini';`);
    this.addSql(`alter table "moderation_result" alter column "verdict" type varchar(255) using ("verdict"::varchar(255));`);
    this.addSql(`alter table "moderation_result" alter column "verdict" set default 'allowed';`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "moderation_result" rename column "generationId" to "generation_id";`);
    this.addSql(`alter table "moderation_result" rename column "created_at" to "checked_at";`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_generation_id_foreign" foreign key ("generation_id") references "generation" ("id") on update cascade on delete set null;`);

    this.addSql(`drop index "audit_log_userId_index";`);
    this.addSql(`drop index "audit_log_action_index";`);
    this.addSql(`drop index "audit_log_entity_type_index";`);
    this.addSql(`drop index "audit_log_entity_id_index";`);
    this.addSql(`drop index "audit_log_created_at_index";`);
    this.addSql(`alter table "audit_log" drop column "userId", drop column "ip_address", drop column "user_agent", drop column "correlation_id", drop column "metadata";`);

    this.addSql(`alter table "audit_log" add column "user_id" int not null;`);
    this.addSql(`alter table "audit_log" alter column "entity_type" type varchar(255) using ("entity_type"::varchar(255));`);
    this.addSql(`alter table "audit_log" alter column "entity_type" set not null;`);
    this.addSql(`alter table "audit_log" alter column "entity_id" type varchar(255) using ("entity_id"::varchar(255));`);
    this.addSql(`alter table "audit_log" alter column "entity_id" set not null;`);
    this.addSql(`alter table "audit_log" add constraint "audit_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "audit_log" rename column "created_at" to "timestamp";`);

    this.addSql(`drop index "webhook_subscription_event_index";`);
    this.addSql(`alter table "webhook_subscription" drop constraint "webhook_subscription_userId_event_url_unique";`);
    this.addSql(`alter table "webhook_subscription" drop column "last_success_at", drop column "last_failure_at", drop column "updated_at", drop column "deleted_at", drop column "metadata";`);

    this.addSql(`alter table "webhook_subscription" alter column "event" type varchar(255) using ("event"::varchar(255));`);
    this.addSql(`alter table "webhook_subscription" alter column "event" set default 'post.published';`);
    this.addSql(`alter table "webhook_subscription" alter column "secret_encrypted" type varchar(255) using ("secret_encrypted"::varchar(255));`);
    this.addSql(`alter table "webhook_subscription" rename column "userId" to "user_id";`);
    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop index "webhook_delivery_attempt_subscriptionId_index";`);
    this.addSql(`drop index "webhook_delivery_attempt_event_index";`);
    this.addSql(`drop index "webhook_delivery_attempt_status_index";`);
    this.addSql(`drop index "webhook_delivery_attempt_created_at_index";`);
    this.addSql(`alter table "webhook_delivery_attempt" drop column "response_body", drop column "metadata", drop column "attempted_at";`);

    this.addSql(`alter table "webhook_delivery_attempt" rename column "subscriptionId" to "subscription_id";`);
    this.addSql(`alter table "webhook_delivery_attempt" add constraint "webhook_delivery_attempt_subscription_id_foreign" foreign key ("subscription_id") references "webhook_subscription" ("id") on update cascade;`);
  }

}
