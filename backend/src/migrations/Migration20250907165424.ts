import { Migration } from '@mikro-orm/migrations';

export class Migration20250907165424 extends Migration {
  override up(): void {
    // webhook_delivery_attempt table already exists (created in Migration20250905120000)
    this.addSql('alter table "media" drop constraint "media_post_id_foreign";');

    this.addSql(
      'alter table "user" add column "language" varchar(255) null, add column "locale" varchar(255) null, add column "time_format" varchar(255) null;',
    );

    this.addSql(
      'alter table "media" alter column "post_id" type int using ("post_id"::int);',
    );
    this.addSql('alter table "media" alter column "post_id" drop not null;');
    this.addSql(
      'alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "moderation_result" alter column "provider" type varchar(255) using ("provider"::varchar(255));',
    );
    this.addSql(
      'alter table "moderation_result" alter column "provider" set default \'gemini\';',
    );
  }

  override down(): void {
    this.addSql('alter table "media" drop constraint "media_post_id_foreign";');

    this.addSql(
      'alter table "user" drop column "language", drop column "locale", drop column "time_format";',
    );

    this.addSql(
      'alter table "media" alter column "post_id" type int using ("post_id"::int);',
    );
    this.addSql('alter table "media" alter column "post_id" set not null;');
    this.addSql(
      'alter table "media" add constraint "media_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "moderation_result" alter column "provider" type varchar(255) using ("provider"::varchar(255));',
    );
    this.addSql(
      'alter table "moderation_result" alter column "provider" set default \'openai\';',
    );
  }
}
