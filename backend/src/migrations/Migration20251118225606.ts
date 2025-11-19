import { Migration } from '@mikro-orm/migrations';

export class Migration20251118225606 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tag" drop constraint "tag_normalized_unique";`);

    this.addSql(`alter table "tag" add column "ownerId" int not null;`);
    this.addSql(`alter table "tag" add constraint "tag_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "tag" add constraint "tag_ownerId_normalized_unique" unique ("ownerId", "normalized");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tag" drop constraint "tag_ownerId_foreign";`);

    this.addSql(`alter table "tag" drop constraint "tag_ownerId_normalized_unique";`);
    this.addSql(`alter table "tag" drop column "ownerId";`);

    this.addSql(`alter table "tag" add constraint "tag_normalized_unique" unique ("normalized");`);
  }

}
