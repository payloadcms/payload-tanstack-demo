import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_users_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "forms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_forms_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "form_submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_form_submissions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  UPDATE "payload_jobs_log" SET "input" = '{}'::jsonb WHERE "input" IS NULL;
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "input" SET NOT NULL;
  ALTER TABLE "pages_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "_media_v" ADD COLUMN "version_prefix" varchar DEFAULT '';
  ALTER TABLE "_media_v" ADD COLUMN "version__objectkey" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "_users_v" ADD COLUMN "version_reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "redirects_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_redirects_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "payload_jobs_log" ADD COLUMN "parent_task_slug" "enum_payload_jobs_log_parent_task_slug";
  ALTER TABLE "payload_jobs_log" ADD COLUMN "parent_task_i_d" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN "concurrency_key" varchar;
  ALTER TABLE "header_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_header_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_footer_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_rels" ADD CONSTRAINT "_users_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_rels" ADD CONSTRAINT "_users_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_rels" ADD CONSTRAINT "_forms_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_rels" ADD CONSTRAINT "_forms_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_form_submissions_v_rels" ADD CONSTRAINT "_form_submissions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_form_submissions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_form_submissions_v_rels" ADD CONSTRAINT "_form_submissions_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_users_id_idx" ON "media_rels" USING btree ("users_id");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_users_id_idx" ON "_media_v_rels" USING btree ("users_id");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_users_id_idx" ON "categories_rels" USING btree ("users_id");
  CREATE INDEX "_categories_v_rels_order_idx" ON "_categories_v_rels" USING btree ("order");
  CREATE INDEX "_categories_v_rels_parent_idx" ON "_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_categories_v_rels_path_idx" ON "_categories_v_rels" USING btree ("path");
  CREATE INDEX "_categories_v_rels_users_id_idx" ON "_categories_v_rels" USING btree ("users_id");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_users_id_idx" ON "users_rels" USING btree ("users_id");
  CREATE INDEX "_users_v_rels_order_idx" ON "_users_v_rels" USING btree ("order");
  CREATE INDEX "_users_v_rels_parent_idx" ON "_users_v_rels" USING btree ("parent_id");
  CREATE INDEX "_users_v_rels_path_idx" ON "_users_v_rels" USING btree ("path");
  CREATE INDEX "_users_v_rels_users_id_idx" ON "_users_v_rels" USING btree ("users_id");
  CREATE INDEX "forms_rels_order_idx" ON "forms_rels" USING btree ("order");
  CREATE INDEX "forms_rels_parent_idx" ON "forms_rels" USING btree ("parent_id");
  CREATE INDEX "forms_rels_path_idx" ON "forms_rels" USING btree ("path");
  CREATE INDEX "forms_rels_users_id_idx" ON "forms_rels" USING btree ("users_id");
  CREATE INDEX "_forms_v_rels_order_idx" ON "_forms_v_rels" USING btree ("order");
  CREATE INDEX "_forms_v_rels_parent_idx" ON "_forms_v_rels" USING btree ("parent_id");
  CREATE INDEX "_forms_v_rels_path_idx" ON "_forms_v_rels" USING btree ("path");
  CREATE INDEX "_forms_v_rels_users_id_idx" ON "_forms_v_rels" USING btree ("users_id");
  CREATE INDEX "form_submissions_rels_order_idx" ON "form_submissions_rels" USING btree ("order");
  CREATE INDEX "form_submissions_rels_parent_idx" ON "form_submissions_rels" USING btree ("parent_id");
  CREATE INDEX "form_submissions_rels_path_idx" ON "form_submissions_rels" USING btree ("path");
  CREATE INDEX "form_submissions_rels_users_id_idx" ON "form_submissions_rels" USING btree ("users_id");
  CREATE INDEX "_form_submissions_v_rels_order_idx" ON "_form_submissions_v_rels" USING btree ("order");
  CREATE INDEX "_form_submissions_v_rels_parent_idx" ON "_form_submissions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_form_submissions_v_rels_path_idx" ON "_form_submissions_v_rels" USING btree ("path");
  CREATE INDEX "_form_submissions_v_rels_users_id_idx" ON "_form_submissions_v_rels" USING btree ("users_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_users_id_idx" ON "pages_rels" USING btree ("users_id");
  CREATE INDEX "_pages_v_rels_users_id_idx" ON "_pages_v_rels" USING btree ("users_id");
  CREATE INDEX "redirects_rels_users_id_idx" ON "redirects_rels" USING btree ("users_id");
  CREATE INDEX "_redirects_v_rels_users_id_idx" ON "_redirects_v_rels" USING btree ("users_id");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "header_rels_users_id_idx" ON "header_rels" USING btree ("users_id");
  CREATE INDEX "_header_v_rels_users_id_idx" ON "_header_v_rels" USING btree ("users_id");
  CREATE INDEX "footer_rels_users_id_idx" ON "footer_rels" USING btree ("users_id");
  CREATE INDEX "_footer_v_rels_users_id_idx" ON "_footer_v_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_categories_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_users_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_form_submissions_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "_categories_v_rels" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "_users_v_rels" CASCADE;
  DROP TABLE "forms_rels" CASCADE;
  DROP TABLE "_forms_v_rels" CASCADE;
  DROP TABLE "form_submissions_rels" CASCADE;
  DROP TABLE "_form_submissions_v_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_users_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_users_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_users_fk";
  
  ALTER TABLE "_redirects_v_rels" DROP CONSTRAINT "_redirects_v_rels_users_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_users_fk";
  
  ALTER TABLE "_header_v_rels" DROP CONSTRAINT "_header_v_rels_users_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_users_fk";
  
  ALTER TABLE "_footer_v_rels" DROP CONSTRAINT "_footer_v_rels_users_fk";
  
  DROP INDEX "pages_rels_users_id_idx";
  DROP INDEX "_pages_v_rels_users_id_idx";
  DROP INDEX "redirects_rels_users_id_idx";
  DROP INDEX "_redirects_v_rels_users_id_idx";
  DROP INDEX "payload_jobs_concurrency_key_idx";
  DROP INDEX "header_rels_users_id_idx";
  DROP INDEX "_header_v_rels_users_id_idx";
  DROP INDEX "footer_rels_users_id_idx";
  DROP INDEX "_footer_v_rels_users_id_idx";
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "input" DROP NOT NULL;
  ALTER TABLE "pages_rels" DROP COLUMN "users_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "users_id";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "_media_v" DROP COLUMN "version_prefix";
  ALTER TABLE "_media_v" DROP COLUMN "version__objectkey";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "_users_v" DROP COLUMN "version_reset_password_requested_at";
  ALTER TABLE "redirects_rels" DROP COLUMN "users_id";
  ALTER TABLE "_redirects_v_rels" DROP COLUMN "users_id";
  ALTER TABLE "payload_jobs_log" DROP COLUMN "parent_task_slug";
  ALTER TABLE "payload_jobs_log" DROP COLUMN "parent_task_i_d";
  ALTER TABLE "payload_jobs" DROP COLUMN "concurrency_key";
  ALTER TABLE "header_rels" DROP COLUMN "users_id";
  ALTER TABLE "_header_v_rels" DROP COLUMN "users_id";
  ALTER TABLE "footer_rels" DROP COLUMN "users_id";
  ALTER TABLE "_footer_v_rels" DROP COLUMN "users_id";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";`)
}
