import { Migration } from '@mikro-orm/migrations';

export class Migration20251113012136 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "social_account" alter column "profile_picture_url" type text using ("profile_picture_url"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "social_account" alter column "profile_picture_url" type varchar(255) using ("profile_picture_url"::varchar(255));`);
  }

}
