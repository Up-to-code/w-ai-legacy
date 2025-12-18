import { db } from "./lib/db";
import { template, user } from "./lib/db/schema";
import { eq } from "drizzle-orm";

async function seedDemoTemplates() {
  try {
    // Get the first user to assign templates to
    const [firstUser] = await db.select().from(user).limit(1);
    
    if (!firstUser) {
      console.error("No user found in database. Please log in first.");
      return;
    }

    const demoTemplates = [
      {
        userId: firstUser.id,
        name: "otp_verification_ar",
        content: "رمز التحقق الخاص بك هو: {{1}}. يرجى عدم مشاركة هذا الرمز مع أي شخص.",
        category: "utility",
        usageCount: "12",
      },
      {
        userId: firstUser.id,
        name: "marketing_promo_ar",
        content: "مرحباً {{1}}! خصم خاص 20% لفترة محدودة على جميع المنتجات. استخدم الكود: {{2}} عند الدفع.",
        category: "marketing",
        usageCount: "45",
      },
      {
        userId: firstUser.id,
        name: "shipping_update_ar",
        content: "أهلاً {{1}}، طلبك رقم {{2}} قيد الشحن الآن. يمكنك تتبع الشحنة من هنا: {{3}}",
        category: "utility",
        usageCount: "28",
      },
      {
        userId: firstUser.id,
        name: "welcome_message_ar",
        content: "شكراً لتواصلك معنا! نحن هنا لمساعدتك. كيف يمكننا خدمتك اليوم؟",
        category: "general",
        usageCount: "156",
      }
    ];

    console.log("Seeding demo templates...");
    
    for (const tpl of demoTemplates) {
      // Check if exists
      const [existing] = await db.select().from(template).where(eq(template.name, tpl.name)).limit(1);
      if (!existing) {
        await db.insert(template).values(tpl);
        console.log(`Added: ${tpl.name}`);
      } else {
        console.log(`Skipped (exists): ${tpl.name}`);
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedDemoTemplates();
