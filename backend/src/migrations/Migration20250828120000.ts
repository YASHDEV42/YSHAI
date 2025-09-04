import { Migration } from '@mikro-orm/migrations';

export class Migration20250828120000 extends Migration {
  override up(): void {
    this.addSql('alter table "media" alter column "post_id" drop not null;');
  }

  override down(): void {
    // Caution: down migration may fail if existing rows have null post_id
    this.addSql('alter table "media" alter column "post_id" set not null;');
  }
}
