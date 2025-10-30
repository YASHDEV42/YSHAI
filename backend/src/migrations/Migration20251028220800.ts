import { Migration } from '@mikro-orm/migrations';

export class Migration20251028220800 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "social_account" add column "username" varchar(255) null, add column "profile_picture" varchar(255) null, add column "account_type" varchar(255) null, add column "followers" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "social_account" drop column "username", drop column "profile_picture", drop column "account_type", drop column "followers";`);
  }

}
