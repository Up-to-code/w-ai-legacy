import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("--- FINAL DB VERIFICATION ---");
  try {
    // 1. Check template.language existence
    const langCheck = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'template' AND column_name = 'language'
    `);
    console.log("Template 'language' column:", JSON.stringify(langCheck, null, 2));

    // 2. Try a real query matching the runtime error
    const tplQuery = await db.execute(sql`SELECT "id", "name", "language" FROM "template" LIMIT 1`);
    console.log("Template query result:", JSON.stringify(tplQuery, null, 2));

    // 3. Check botSetting structure
    const botCheck = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bot_setting'
    `);
    console.log("BotSetting columns:", JSON.stringify(botCheck, null, 2));

    console.log("✅ Verification complete!");
  } catch (error: any) {
    console.error("❌ Verification failed:", error.message);
  } finally {
    process.exit(0);
  }
}

run();
