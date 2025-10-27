import { Migration } from '@mikro-orm/migrations';

export class Migration20251027021340 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "account_token" alter column "token_encrypted" type text using ("token_encrypted"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account_token" alter column "token_encrypted" type varchar(255) using ("token_encrypted"::varchar(255));`);
  }

}
