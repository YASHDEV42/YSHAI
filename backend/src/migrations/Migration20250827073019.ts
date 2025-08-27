import { Migration } from '@mikro-orm/migrations';

export class Migration20250827073019 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "plan" ("id" varchar(255) not null, "name" varchar(255) not null default 'Free', "price_monthly" int not null default 0, "max_accounts" int not null default 5, "ai_credits_unlimited" boolean not null default false, "ai_credits_limit" int not null, "team_collaboration" boolean not null default false, "analytics_export" boolean not null default false, "created_at" timestamptz not null, constraint "plan_pkey" primary key ("id"));`);

    this.addSql(`create table "tag" ("id" varchar(255) not null, "name" varchar(255) not null, "normalized" varchar(255) not null, "created_at" timestamptz not null, constraint "tag_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password_hash" varchar(255) null, "name" varchar(255) not null, "role" varchar(255) not null default 'user', "timezone" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "team" ("id" varchar(255) not null, "name" varchar(255) not null, "owner_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "team_pkey" primary key ("id"));`);

    this.addSql(`create table "template" ("id" varchar(255) not null, "name" varchar(255) not null, "content_ar" varchar(255) not null, "content_en" varchar(255) null, "owner_id" int not null, "team_id" varchar(255) null, "visibility" varchar(255) not null default 'private', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "template_pkey" primary key ("id"));`);

    this.addSql(`create table "system_config" ("id" varchar(255) not null, "value" varchar(255) not null, "description" varchar(255) null, "type" varchar(255) not null default 'string', "created_at" timestamptz not null, "updated_at" timestamptz not null, "updated_by_id" int null, constraint "system_config_pkey" primary key ("id"));`);

    this.addSql(`create table "subscription" ("id" varchar(255) not null, "user_id" int not null, "plan_id" varchar(255) not null, "status" varchar(255) not null default 'active', "period_starts_at" timestamptz not null, "period_ends_at" timestamptz not null, "canceled_at" timestamptz null, "payment_gateway_subscription_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "subscription_pkey" primary key ("id"));`);

    this.addSql(`create table "social_account" ("id" varchar(255) not null, "provider" varchar(255) not null default 'x', "provider_account_id" varchar(255) not null, "user_id" int not null, "active" boolean not null default true, "connected_at" timestamptz not null, "disconnected_at" timestamptz null, constraint "social_account_pkey" primary key ("id"));`);

    this.addSql(`create table "account_token" ("id" varchar(255) not null, "account_id" varchar(255) not null, "token_type" varchar(255) not null default 'access', "token_encrypted" varchar(255) not null, "expires_at" timestamptz null, "revoked" boolean not null default false, "created_at" timestamptz not null, constraint "account_token_pkey" primary key ("id"));`);

    this.addSql(`create table "refresh_token" ("id" serial primary key, "user_id" int not null, "token_hash" varchar(255) not null, "user_agent" varchar(255) not null, "ip_address" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "revoked" boolean not null default false, "expires_at" timestamptz not null);`);
    this.addSql(`create index "refresh_token_revoked_index" on "refresh_token" ("revoked");`);
    this.addSql(`create index "refresh_token_expires_at_index" on "refresh_token" ("expires_at");`);

    this.addSql(`create table "notification" ("id" varchar(255) not null, "user_id" int not null, "type" varchar(255) not null default 'post_scheduled', "payload" jsonb not null, "read" boolean not null default false, "created_at" timestamptz not null, "link" varchar(255) null, constraint "notification_pkey" primary key ("id"));`);

    this.addSql(`create table "membership" ("id" varchar(255) not null, "user_id" int not null, "team_id" varchar(255) not null, "role" varchar(255) not null default 'editor', "joined_at" timestamptz not null, "left_at" timestamptz null, constraint "membership_pkey" primary key ("id"));`);

    this.addSql(`create table "invoice" ("id" varchar(255) not null, "amount" int not null, "currency" varchar(255) not null default 'SAR', "status" varchar(255) not null default 'unpaid', "payment_gateway_id" varchar(255) not null, "payment_method" varchar(255) not null, "issued_at" timestamptz not null, "paid_at" timestamptz null, "downloaded_at" timestamptz null, "pdf_url" varchar(255) null, "metadata" jsonb null, "user_id" int not null, "subscription_id" varchar(255) not null, constraint "invoice_pkey" primary key ("id"));`);
    this.addSql(`create index "invoice_user_idx" on "invoice" ("user_id");`);
    this.addSql(`create index "invoice_subscription_idx" on "invoice" ("subscription_id");`);

    this.addSql(`create table "campaign" ("id" varchar(255) not null, "name" varchar(255) not null, "owner_id" int not null, "status" varchar(255) not null default 'active', "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "campaign_pkey" primary key ("id"));`);

    this.addSql(`create table "post" ("id" varchar(255) not null, "author_id" int not null, "team_id" varchar(255) null, "social_account_id" varchar(255) null, "content_ar" varchar(255) not null, "content_en" varchar(255) null, "status" varchar(255) not null default 'draft', "is_recurring" boolean not null default false, "published_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "campaign_id" varchar(255) null, "template_id" varchar(255) null, "schedule_at" timestamptz not null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`create index "post_schedule_status_idx" on "post" ("schedule_at");`);

    this.addSql(`create table "post_tag" ("id" varchar(255) not null, "post_id" varchar(255) not null, "tag_id" varchar(255) not null, "created_at" timestamptz not null, constraint "post_tag_pkey" primary key ("id"));`);

    this.addSql(`create table "post_analytics" ("id" varchar(255) not null, "post_id" varchar(255) not null, "impressions" int not null default 0, "clicks" int not null default 0, "likes" int not null default 0, "comments" int not null default 0, "shares" int not null default 0, "fetched_at" timestamptz not null, constraint "post_analytics_pkey" primary key ("id"));`);
    this.addSql(`create index "post_analytics_post_time_idx" on "post_analytics" ("post_id");`);

    this.addSql(`create table "media" ("id" varchar(255) not null, "post_id" varchar(255) not null, "url" varchar(255) not null, "type" varchar(255) not null default 'image', "order_index" int not null default 0, "created_at" timestamptz not null, constraint "media_pkey" primary key ("id"));`);

    this.addSql(`create table "job" ("id" varchar(255) not null, "post_id" varchar(255) not null, "provider" varchar(255) not null default 'x', "attempt" int not null default 0, "status" varchar(255) not null default 'pending', "last_error" varchar(255) null, "scheduled_at" timestamptz not null, "executed_at" timestamptz null, constraint "job_pkey" primary key ("id"));`);

    this.addSql(`create table "generation" ("id" varchar(255) not null, "post_id" varchar(255) not null, "prompt" varchar(255) not null, "text" varchar(255) not null, "dialect" varchar(255) not null default 'MSA', "tone" varchar(255) not null default 'casual', "generated_at" timestamptz not null, "updated_at" timestamptz not null, constraint "generation_pkey" primary key ("id"));`);

    this.addSql(`create table "moderation_result" ("id" varchar(255) not null, "generation_id" varchar(255) null, "post_id" varchar(255) not null, "provider" varchar(255) not null default 'openai', "verdict" varchar(255) not null default 'allowed', "details" jsonb null, "checked_at" timestamptz not null, constraint "moderation_result_pkey" primary key ("id"));`);

    this.addSql(`create table "audit_log" ("id" varchar(255) not null, "user_id" int not null, "action" varchar(255) not null, "entity_type" varchar(255) not null, "entity_id" varchar(255) not null, "details" jsonb null, "timestamp" timestamptz not null, constraint "audit_log_pkey" primary key ("id"));`);

    this.addSql(`create table "ai_usage_log" ("id" varchar(255) not null, "user_id" int not null, "subscription_id" varchar(255) null, "generation_id" varchar(255) null, "model_used" varchar(255) not null default 'gpt-4o-mini', "input_tokens" int not null, "output_tokens" int not null, "cost_usd" int not null, "created_at" timestamptz not null, "metadata" jsonb null, constraint "ai_usage_log_pkey" primary key ("id"));`);

    this.addSql(`create table "webhook_subscription" ("id" varchar(255) not null, "user_id" int not null, "url" varchar(255) not null, "event" varchar(255) not null default 'post.published', "active" boolean not null default true, "secret_encrypted" varchar(255) not null, "created_at" timestamptz not null, constraint "webhook_subscription_pkey" primary key ("id"));`);

    this.addSql(`alter table "team" add constraint "team_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "template" add constraint "template_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "template" add constraint "template_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "system_config" add constraint "system_config_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "subscription" add constraint "subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "subscription" add constraint "subscription_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade;`);

    this.addSql(`alter table "social_account" add constraint "social_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "account_token" add constraint "account_token_account_id_foreign" foreign key ("account_id") references "social_account" ("id") on update cascade;`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "membership" add constraint "membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "membership" add constraint "membership_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade;`);

    this.addSql(`alter table "invoice" add constraint "invoice_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "invoice" add constraint "invoice_subscription_id_foreign" foreign key ("subscription_id") references "subscription" ("id") on update cascade;`);

    this.addSql(`alter table "campaign" add constraint "campaign_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "post" add constraint "post_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_social_account_id_foreign" foreign key ("social_account_id") references "social_account" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post" add constraint "post_template_id_foreign" foreign key ("template_id") references "template" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "post_tag" add constraint "post_tag_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;`);

    this.addSql(`alter table "post_analytics" add constraint "post_analytics_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "job" add constraint "job_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "generation" add constraint "generation_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "moderation_result" add constraint "moderation_result_generation_id_foreign" foreign key ("generation_id") references "generation" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "moderation_result" add constraint "moderation_result_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);

    this.addSql(`alter table "audit_log" add constraint "audit_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_subscription_id_foreign" foreign key ("subscription_id") references "subscription" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "ai_usage_log" add constraint "ai_usage_log_generation_id_foreign" foreign key ("generation_id") references "generation" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "webhook_subscription" add constraint "webhook_subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
