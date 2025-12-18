import { db } from "./lib/db";
import { botSetting } from "./lib/db/schema";
import { sql, eq } from "drizzle-orm";

async function run() {
  console.log("Updating existing bot settings...");
  try {
    // Update all users to openrouter andglm-4.5 if they are using openai default
    await db.execute(sql`
      UPDATE bot_setting 
      SET "aiProvider" = 'openrouter', 
          "aiModel" = 'z-ai/glm-4.5-air:free' 
      WHERE "aiProvider" = 'openai' OR "aiProvider" IS NULL
    `);
    
    console.log("✅ Database settings updated successfully!");
  } catch (error) {
    console.error("❌ Error updating database:", error);
  } finally {
    process.exit(0);
  }
}

run();
