/* eslint-disable */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250909103000 extends Migration {
  override up(): void {
    this.addSql(
      `create table "post_target" (
        "id" serial primary key,
        "post_id" int not null,
        "social_account_id" int not null,
        "status" varchar(255) not null default 'pending',
        "attempt" int not null default 0,
        "last_error" varchar(255) null,
        "external_post_id" varchar(255) null,
        "external_url" varchar(255) null,
        "scheduled_at" timestamptz null,
        "published_at" timestamptz null,
        "created_at" timestamptz not null,
        "updated_at" timestamptz not null
      );`,
    );
    this.addSql(
      `create index "post_target_post_idx" on "post_target" ("post_id");`,
    );
    this.addSql(
      `create index "post_target_account_idx" on "post_target" ("social_account_id");`,
    );

    this.addSql(
      `alter table "post_target" add constraint "post_target_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "post_target" add constraint "post_target_social_account_id_foreign" foreign key ("social_account_id") references "social_account" ("id") on update cascade;`,
    );
  }
}
