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
        // Update last activity
        await db
            .update(contact)
            .set({ 
                lastActivityAt: new Date(),
                // Update name if it was just the phone number and we have a proper name now
                ...(existingContact.name === existingContact.phone && name ? { name } : {})
            })
            .where(eq(contact.id, existingContact.id));
        
        return existingContact;
    }

    // Create new contact
    const [newContact] = await db
        .insert(contact)
        .values({
            userId,
            phone,
            name: name || phone,
            tags: ["whatsapp_inbound"],
            orderCount: 0,
            lastActivityAt: new Date(),
            notes: "Created automatically from incoming WhatsApp message",
            metadata: metadata ? JSON.stringify(metadata) : null,
        })
        .returning();

    return newContact;
}
