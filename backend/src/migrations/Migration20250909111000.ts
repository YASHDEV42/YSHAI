/* eslint-disable */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250909111000 extends Migration {
  override up(): void {
    this.addSql('alter table "job" add column "target_id" int null;');
    this.addSql(
      'alter table "job" add constraint "job_target_id_foreign" foreign key ("target_id") references "post_target" ("id") on update cascade on delete set null;',
    );
  }
}
