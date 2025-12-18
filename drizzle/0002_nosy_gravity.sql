ALTER TABLE "campaign" ALTER COLUMN "targetAudienceCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "targetAudienceCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "deliveredCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "deliveredCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "readCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "campaign" ALTER COLUMN "readCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "orderCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "orderCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "tag" ALTER COLUMN "contactCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tag" ALTER COLUMN "contactCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "usageCount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "usageCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "audienceType" text DEFAULT 'all';--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "includedTags" text[];--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "contactLimit" integer;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "recentDays" integer;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "messageType" text DEFAULT 'text';--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "messageContent" text;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "templateId" text;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "language" text DEFAULT 'ar';--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_templateId_template_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."template"("id") ON DELETE set null ON UPDATE no action;