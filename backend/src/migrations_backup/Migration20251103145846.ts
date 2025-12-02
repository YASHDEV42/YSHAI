import { Migration } from '@mikro-orm/migrations';

export class Migration20251103145846 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "social_account" drop column "username", drop column "profile_picture", drop column "account_type", drop column "followers";`);

    this.addSql(`alter table "account_token" add column "username" varchar(255) null, add column "followers_count" int null, add column "profile_picture_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "social_account" add column "username" varchar(255) null, add column "profile_picture" varchar(255) null, add column "account_type" varchar(255) null, add column "followers" int null;`);

    this.addSql(`alter table "account_token" drop column "username", drop column "followers_count", drop column "profile_picture_url";`);
  }

}
