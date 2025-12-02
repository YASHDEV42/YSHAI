import { Migration } from '@mikro-orm/migrations';

export class Migration20251121201034 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post" drop constraint "post_templateId_foreign";`);

    this.addSql(`drop table if exists "template" cascade;`);

    this.addSql(`alter table "post" drop column "templateId";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "template" ("id" serial primary key, "name" varchar(255) not null, "content_ar" varchar(255) not null, "content_en" varchar(255) null, "description" varchar(255) null, "ownerId" int not null, "teamId" int null, "visibility" varchar(255) not null, "language" varchar(255) null, "metadata" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);

    this.addSql(`alter table "template" add constraint "template_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "template" add constraint "template_teamId_foreign" foreign key ("teamId") references "team" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "post" add column "templateId" int null;`);
    this.addSql(`alter table "post" add constraint "post_templateId_foreign" foreign key ("templateId") references "template" ("id") on update cascade on delete set null;`);
  }

}
