import { Migration } from '@mikro-orm/migrations';

export class Migration20250905120000 extends Migration {
  override up(): void {
    this.addSql(
      `create table "webhook_delivery_attempt" ("id" serial primary key, "subscription_id" int not null, "url" varchar(255) not null, "event" varchar(255) not null default 'post.published', "attempt_number" int not null, "status" varchar(255) not null, "response_code" int null, "error_message" varchar(255) null, "duration_ms" int null, "payload_hash" varchar(255) not null, "created_at" timestamptz not null);`,
    );
    this.addSql(
      `alter table "webhook_delivery_attempt" add constraint "webhook_delivery_attempt_subscription_id_foreign" foreign key ("subscription_id") references "webhook_subscription" ("id") on update cascade;`,
    );
    this.addSql(
      `create index "wda_subscription_idx" on "webhook_delivery_attempt" ("subscription_id");`,
    );
  }
}
