import { Migration } from '@mikro-orm/migrations';

export class Migration20251104152055 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "social_account" add column "active" boolean not null default true, add column "connected_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "social_account" drop column "active", drop column "connected_at";`);
  }

}
