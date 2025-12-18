import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Starting DB fix...");
  try {
    // Check campaign columns
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'campaign'
    `);
    console.log("Current campaign columns:", JSON.stringify(columns, null, 2));

    // Check template columns
    const tplColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'template'
    `);
    console.log("Current template columns:", JSON.stringify(tplColumns, null, 2));

    const queries = [
      `ALTER TABLE "campaign" ALTER COLUMN "targetAudienceCount" TYPE integer USING "targetAudienceCount"::integer;`,
      `ALTER TABLE "campaign" ALTER COLUMN "targetAudienceCount" SET DEFAULT 0;`,
      `ALTER TABLE "campaign" ALTER COLUMN "deliveredCount" TYPE integer USING "deliveredCount"::integer;`,
      `ALTER TABLE "campaign" ALTER COLUMN "deliveredCount" SET DEFAULT 0;`,
      `ALTER TABLE "campaign" ALTER COLUMN "readCount" TYPE integer USING "readCount"::integer;`,
      `ALTER TABLE "campaign" ALTER COLUMN "readCount" SET DEFAULT 0;`,
      `ALTER TABLE "contact" ALTER COLUMN "orderCount" TYPE integer USING "orderCount"::integer;`,
      `ALTER TABLE "contact" ALTER COLUMN "orderCount" SET DEFAULT 0;`,
      `ALTER TABLE "tag" ALTER COLUMN "contactCount" TYPE integer USING "contactCount"::integer;`,
      `ALTER TABLE "tag" ALTER COLUMN "contactCount" SET DEFAULT 0;`,
      `ALTER TABLE "template" ALTER COLUMN "usageCount" TYPE integer USING "usageCount"::integer;`,
      `ALTER TABLE "template" ALTER COLUMN "usageCount" SET DEFAULT 0;`,
      `ALTER TABLE "campaign" ALTER COLUMN "contactLimit" TYPE integer USING "contactLimit"::integer;`,
      `ALTER TABLE "campaign" ALTER COLUMN "recentDays" TYPE integer USING "recentDays"::integer;`,
      // Add missing columns if they don't exist
      `ALTER TABLE "template" ADD COLUMN IF NOT EXISTS "language" text DEFAULT 'ar';`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "audienceType" text DEFAULT 'all';`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "includedTags" text[];`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "contactLimit" integer;`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "recentDays" integer;`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "messageType" text DEFAULT 'text';`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "messageContent" text;`,
      `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "templateId" text;`
    ];

    for (const query of queries) {
      try {
        console.log(`Executing: ${query}`);
        await db.execute(sql.raw(query));
      } catch (e: any) {
        console.error(`❌ Failed: ${query}`);
        console.error(`Error: ${e.message}`);
      }
    }
    console.log("✅ Database fixed successfully!");
  } catch (error) {
    console.error("❌ Error fixing database:", error);
  } finally {
    process.exit(0);
  }
}

run();
