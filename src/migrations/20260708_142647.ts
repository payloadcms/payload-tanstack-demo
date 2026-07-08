import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "generate_slug";
  ALTER TABLE "_pages_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "posts" DROP COLUMN "generate_slug";
  ALTER TABLE "_posts_v" DROP COLUMN "version_generate_slug";
  ALTER TABLE "categories" DROP COLUMN "generate_slug";
  ALTER TABLE "_categories_v" DROP COLUMN "version_generate_slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_pages_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "categories" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_categories_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;`)
}
