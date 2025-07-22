import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_glossary_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__glossary_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_heading_block_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_image_block_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_block_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_image_block_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TABLE IF NOT EXISTS "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"summary" varchar,
  	"definition" jsonb,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_glossary_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "glossary_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"glossary_categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_glossary_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_term" varchar,
  	"version_summary" varchar,
  	"version_definition" jsonb,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_is_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__glossary_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_glossary_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"glossary_categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "merchants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"description" varchar NOT NULL,
  	"website" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_zip" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "merchants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"merchant_categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category_id" integer,
  	"is_published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faq_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" jsonb,
  	"version_category_id" integer,
  	"version_is_published" boolean DEFAULT true,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "sources_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "glossary_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "merchant_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "faq_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "source_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum_pages_blocks_heading_block_level" DEFAULT 'h2',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"size" "enum_pages_blocks_image_block_size" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_structured_article" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enable_table_of_contents" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"level" "enum__pages_v_blocks_heading_block_level" DEFAULT 'h2',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"size" "enum__pages_v_blocks_image_block_size" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_structured_article" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_table_of_contents" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "merchants_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "merchant_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "source_categories_id" integer;
  DO $$ BEGIN
   ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_glossary_categories_fk" FOREIGN KEY ("glossary_categories_id") REFERENCES "public"."glossary_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_parent_id_glossary_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_glossary_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_glossary_categories_fk" FOREIGN KEY ("glossary_categories_id") REFERENCES "public"."glossary_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "merchants" ADD CONSTRAINT "merchants_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "merchants_rels" ADD CONSTRAINT "merchants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "merchants_rels" ADD CONSTRAINT "merchants_rels_merchant_categories_fk" FOREIGN KEY ("merchant_categories_id") REFERENCES "public"."merchant_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "faq" ADD CONSTRAINT "faq_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_parent_id_faq_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_version_category_id_faq_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."faq_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sources_tags" ADD CONSTRAINT "sources_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sources" ADD CONSTRAINT "sources_category_id_source_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."source_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_heading_block" ADD CONSTRAINT "pages_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_rich_text_block" ADD CONSTRAINT "pages_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_structured_article" ADD CONSTRAINT "pages_blocks_structured_article_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_heading_block" ADD CONSTRAINT "_pages_v_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_structured_article" ADD CONSTRAINT "_pages_v_blocks_structured_article_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "glossary_slug_idx" ON "glossary" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "glossary__status_idx" ON "glossary" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "glossary_rels_order_idx" ON "glossary_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "glossary_rels_parent_idx" ON "glossary_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "glossary_rels_path_idx" ON "glossary_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "glossary_rels_glossary_categories_id_idx" ON "glossary_rels" USING btree ("glossary_categories_id");
  CREATE INDEX IF NOT EXISTS "_glossary_v_parent_idx" ON "_glossary_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_glossary_v_version_version_slug_idx" ON "_glossary_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_glossary_v_version_version_updated_at_idx" ON "_glossary_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_glossary_v_version_version_created_at_idx" ON "_glossary_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_glossary_v_version_version__status_idx" ON "_glossary_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_glossary_v_created_at_idx" ON "_glossary_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_glossary_v_updated_at_idx" ON "_glossary_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_glossary_v_latest_idx" ON "_glossary_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_glossary_v_rels_order_idx" ON "_glossary_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_glossary_v_rels_parent_idx" ON "_glossary_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_glossary_v_rels_path_idx" ON "_glossary_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_glossary_v_rels_glossary_categories_id_idx" ON "_glossary_v_rels" USING btree ("glossary_categories_id");
  CREATE INDEX IF NOT EXISTS "merchants_slug_idx" ON "merchants" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "merchants_logo_idx" ON "merchants" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "merchants_updated_at_idx" ON "merchants" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "merchants_created_at_idx" ON "merchants" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "merchants_rels_order_idx" ON "merchants_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "merchants_rels_parent_idx" ON "merchants_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "merchants_rels_path_idx" ON "merchants_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "merchants_rels_merchant_categories_id_idx" ON "merchants_rels" USING btree ("merchant_categories_id");
  CREATE INDEX IF NOT EXISTS "faq_category_idx" ON "faq" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "faq__status_idx" ON "faq" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_faq_v_parent_idx" ON "_faq_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_faq_v_version_version_category_idx" ON "_faq_v" USING btree ("version_category_id");
  CREATE INDEX IF NOT EXISTS "_faq_v_version_version_updated_at_idx" ON "_faq_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_faq_v_version_version_created_at_idx" ON "_faq_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "sources_tags_order_idx" ON "sources_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "sources_tags_parent_id_idx" ON "sources_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "sources_category_idx" ON "sources" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "sources_updated_at_idx" ON "sources" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sources_created_at_idx" ON "sources" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "glossary_categories_slug_idx" ON "glossary_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "glossary_categories_updated_at_idx" ON "glossary_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "glossary_categories_created_at_idx" ON "glossary_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "merchant_categories_slug_idx" ON "merchant_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "merchant_categories_updated_at_idx" ON "merchant_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "merchant_categories_created_at_idx" ON "merchant_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "faq_categories_updated_at_idx" ON "faq_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "faq_categories_created_at_idx" ON "faq_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "source_categories_updated_at_idx" ON "source_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "source_categories_created_at_idx" ON "source_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_order_idx" ON "pages_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_parent_id_idx" ON "pages_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_path_idx" ON "pages_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_order_idx" ON "pages_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_parent_id_idx" ON "pages_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_path_idx" ON "pages_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_order_idx" ON "pages_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_parent_id_idx" ON "pages_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_path_idx" ON "pages_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_image_idx" ON "pages_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_structured_article_order_idx" ON "pages_blocks_structured_article" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_structured_article_parent_id_idx" ON "pages_blocks_structured_article" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_structured_article_path_idx" ON "pages_blocks_structured_article" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_order_idx" ON "_pages_v_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_parent_id_idx" ON "_pages_v_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_path_idx" ON "_pages_v_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_order_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_parent_id_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_path_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_order_idx" ON "_pages_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_parent_id_idx" ON "_pages_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_path_idx" ON "_pages_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_image_idx" ON "_pages_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_structured_article_order_idx" ON "_pages_v_blocks_structured_article" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_structured_article_parent_id_idx" ON "_pages_v_blocks_structured_article" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_structured_article_path_idx" ON "_pages_v_blocks_structured_article" USING btree ("_path");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_merchants_fk" FOREIGN KEY ("merchants_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_categories_fk" FOREIGN KEY ("glossary_categories_id") REFERENCES "public"."glossary_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_merchant_categories_fk" FOREIGN KEY ("merchant_categories_id") REFERENCES "public"."merchant_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_categories_fk" FOREIGN KEY ("faq_categories_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_source_categories_fk" FOREIGN KEY ("source_categories_id") REFERENCES "public"."source_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_merchants_id_idx" ON "payload_locked_documents_rels" USING btree ("merchants_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("sources_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_glossary_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_merchant_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("merchant_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_faq_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_source_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("source_categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "glossary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "glossary_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_glossary_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_glossary_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "merchants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "merchants_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faq_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sources_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "glossary_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "merchant_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "source_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_structured_article" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_structured_article" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "glossary_rels" CASCADE;
  DROP TABLE "_glossary_v" CASCADE;
  DROP TABLE "_glossary_v_rels" CASCADE;
  DROP TABLE "merchants" CASCADE;
  DROP TABLE "merchants_rels" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP TABLE "sources_tags" CASCADE;
  DROP TABLE "sources" CASCADE;
  DROP TABLE "glossary_categories" CASCADE;
  DROP TABLE "merchant_categories" CASCADE;
  DROP TABLE "faq_categories" CASCADE;
  DROP TABLE "source_categories" CASCADE;
  DROP TABLE "pages_blocks_heading_block" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block" CASCADE;
  DROP TABLE "pages_blocks_image_block" CASCADE;
  DROP TABLE "pages_blocks_structured_article" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_block" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_structured_article" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_glossary_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_merchants_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_glossary_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_merchant_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_source_categories_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_glossary_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_merchants_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_faq_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_sources_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_glossary_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_merchant_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_faq_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_source_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "glossary_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "merchants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "faq_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "sources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "glossary_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "merchant_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "faq_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "source_categories_id";
  DROP TYPE "public"."enum_glossary_status";
  DROP TYPE "public"."enum__glossary_v_version_status";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_heading_block_level";
  DROP TYPE "public"."enum_pages_blocks_image_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_block_level";
  DROP TYPE "public"."enum__pages_v_blocks_image_block_size";`)
}
