import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface CreateContactParams {
    userId: string;
    phone: string;
    name?: string;
    metadata?: Record<string, any>;
}

export async function getOrCreateContact(params: CreateContactParams) {
    const { userId, phone, name, metadata } = params;

    // Check if contact exists
    const [existingContact] = await db
        .select()
        .from(contact)
        .where(and(
            eq(contact.userId, userId),
            eq(contact.phone, phone)
        ))
        .limit(1);

    if (existingContact) {
        // Optional: Update metadata if provided? 
        // For now, simpler to just return. The user said "save... dataat", 
        // usually implies saving new data. 
        // Let's create a logic to merge metadata if needed, but for "new cumers" logic,
        // we primarily care about creation. 
        return existingContact;
    }

    // Create new contact
    const [newContact] = await db
        .insert(contact)
        .values({
            userId,
            phone,
            name: name || phone, // Fallback to phone if name missing
            tags: ["whatsapp_inbound"],
            orderCount: "0",
            notes: "Created automatically from incoming WhatsApp message",
            metadata: metadata ? JSON.stringify(metadata) : null,
        })
        .returning();

    return newContact;
}
