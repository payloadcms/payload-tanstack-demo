import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP INDEX "payload_jobs_processing_idx";
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;
  ALTER TABLE "payload_jobs" ADD COLUMN "processing_until" timestamp(3) with time zone;
  ALTER TABLE "payload_jobs" ADD COLUMN "processing_token" varchar;
  CREATE INDEX "payload_jobs_processing_until_idx" ON "payload_jobs" USING btree ("processing_until");
  ALTER TABLE "payload_jobs" DROP COLUMN "processing";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP INDEX "payload_jobs_processing_until_idx";
  ALTER TABLE "payload_jobs" ADD COLUMN "processing" boolean DEFAULT false;
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";
  ALTER TABLE "payload_jobs" DROP COLUMN "processing_until";
  ALTER TABLE "payload_jobs" DROP COLUMN "processing_token";`)
}
