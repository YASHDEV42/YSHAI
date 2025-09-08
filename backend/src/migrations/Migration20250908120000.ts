import { Migration } from '@mikro-orm/migrations';

export class Migration20250908120000 extends Migration {
  override up(): void {
    this.addSql(
      'create table "password_reset_token" ("id" serial primary key, "user_id" int not null, "token_hash" varchar(255) not null, "used" boolean not null default false, "expires_at" timestamptz not null, "created_at" timestamptz not null);',
    );
    this.addSql(
      'alter table "password_reset_token" add constraint "password_reset_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'create index "prt_user_idx" on "password_reset_token" ("user_id");',
    );
    this.addSql(
      'create index "prt_token_hash_idx" on "password_reset_token" ("token_hash");',
    );
  }

  override down(): void {
    this.addSql('drop table if exists "password_reset_token" cascade;');
  }
}
