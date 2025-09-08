import { Migration } from '@mikro-orm/migrations';

export class Migration20250907183016 extends Migration {
  override up(): void {
    this.addSql(
      `alter table "user" add column "reset_token_expires_at" timestamptz null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "user" drop column "reset_token_expires_at";`);
  }
}
