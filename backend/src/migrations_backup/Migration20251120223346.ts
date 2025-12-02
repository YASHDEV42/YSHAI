import { Migration } from '@mikro-orm/migrations';

export class Migration20251120223346 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post_tag" drop constraint "post_tag_tagId_foreign";`);

    this.addSql(`drop table if exists "tag" cascade;`);

    this.addSql(`drop table if exists "post_tag" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "tag" ("id" serial primary key, "ownerId" int not null, "name" varchar(255) not null, "normalized" varchar(255) not null, "created_at" timestamptz not null, "metadata" jsonb null);`);
    this.addSql(`create index "tag_normalized_index" on "tag" ("normalized");`);
    this.addSql(`alter table "tag" add constraint "tag_ownerId_normalized_unique" unique ("ownerId", "normalized");`);

    this.addSql(`create table "post_tag" ("id" serial primary key, "postId" int not null, "tagId" int not null, "created_at" timestamptz not null);`);
    this.addSql(`create index "post_tag_postId_index" on "post_tag" ("postId");`);
    this.addSql(`create index "post_tag_tagId_index" on "post_tag" ("tagId");`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_postId_tagId_unique" unique ("postId", "tagId");`);

    this.addSql(`alter table "tag" add constraint "tag_ownerId_foreign" foreign key ("ownerId") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "post_tag" add constraint "post_tag_postId_foreign" foreign key ("postId") references "post" ("id") on update cascade;`);
    this.addSql(`alter table "post_tag" add constraint "post_tag_tagId_foreign" foreign key ("tagId") references "tag" ("id") on update cascade;`);
  }

}
