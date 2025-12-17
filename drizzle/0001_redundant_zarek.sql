CREATE TABLE "bot_setting" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text DEFAULT 'المساعد الذكي',
	"tone" text DEFAULT 'friendly',
	"systemPrompt" text DEFAULT 'أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية.',
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bot_setting_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "campaign" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"targetAudienceCount" text DEFAULT '0',
	"deliveredCount" text DEFAULT '0',
	"readCount" text DEFAULT '0',
	"scheduledAt" timestamp,
	"sentAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"tags" text[],
	"orderCount" text DEFAULT '0',
	"lastActivityAt" timestamp,
	"notes" text,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"serviceId" text NOT NULL,
	"serviceName" text NOT NULL,
	"status" text DEFAULT 'disconnected' NOT NULL,
	"credentials" text,
	"metadata" text,
	"connectedAt" timestamp,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_source" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"fileUrl" text,
	"metadata" text,
	"sizeBytes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text,
	"contactId" text NOT NULL,
	"userId" text NOT NULL,
	"direction" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL,
	"metadata" text,
	"sentAt" timestamp,
	"readAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT 'blue',
	"contactCount" text DEFAULT '0',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"category" text DEFAULT 'general',
	"usageCount" text DEFAULT '0',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bot_setting" ADD CONSTRAINT "bot_setting_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration" ADD CONSTRAINT "integration_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_source" ADD CONSTRAINT "knowledge_source_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaign"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_contactId_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bot_setting_userId_idx" ON "bot_setting" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "campaign_userId_idx" ON "campaign" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "campaign_status_idx" ON "campaign" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_userId_idx" ON "contact" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "contact_phone_idx" ON "contact" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contact" USING btree ("email");--> statement-breakpoint
CREATE INDEX "integration_userId_idx" ON "integration" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "integration_serviceId_idx" ON "integration" USING btree ("serviceId");--> statement-breakpoint
CREATE INDEX "integration_status_idx" ON "integration" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_userId_serviceId_idx" ON "integration" USING btree ("userId","serviceId");--> statement-breakpoint
CREATE INDEX "knowledge_source_userId_idx" ON "knowledge_source" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "knowledge_source_type_idx" ON "knowledge_source" USING btree ("type");--> statement-breakpoint
CREATE INDEX "message_campaignId_idx" ON "message" USING btree ("campaignId");--> statement-breakpoint
CREATE INDEX "message_contactId_idx" ON "message" USING btree ("contactId");--> statement-breakpoint
CREATE INDEX "message_userId_idx" ON "message" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "message_status_idx" ON "message" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tag_userId_idx" ON "tag" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "template_userId_idx" ON "template" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "template_category_idx" ON "template" USING btree ("category");