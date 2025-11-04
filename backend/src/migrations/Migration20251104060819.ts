import { Migration } from '@mikro-orm/migrations';

export class Migration20251104060819 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "social_account" drop column "active", drop column "connected_at";`);

    this.addSql(`alter table "social_account" add column "page_id" varchar(255) null, add column "page_name" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "social_account" drop column "page_id", drop column "page_name";`);

    this.addSql(`alter table "social_account" add column "active" boolean not null default true, add column "connected_at" timestamptz not null;`);
  }

}
