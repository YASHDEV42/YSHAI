import { Migration } from '@mikro-orm/migrations';

export class Migration20251116013058 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "avatar_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "avatar_url";`);
  }

}
