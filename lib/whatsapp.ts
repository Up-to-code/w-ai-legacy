export interface WhatsAppCredentials {
  accessToken: string;
  phoneNumberId: string;
  verifyToken?: string;
  wabaId?: string;
}

interface WhatsAppMessageResponse {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

export async function sendMessage(
  to: string,
  content: string,
  credentials: WhatsAppCredentials
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Basic validation
    if (!credentials.accessToken || !credentials.phoneNumberId) {
      return { success: false, error: "Missing WhatsApp credentials" };
    }

    if (!to || !content) {
      return { success: false, error: "Missing recipient or content" };
    }

    const url = `https://graph.facebook.com/v21.0/${credentials.phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { preview_url: false, body: content },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return { 
        success: false, 
        error: data.error?.message || "Failed to send message via WhatsApp" 
      };
    }

    const responseData = data as WhatsAppMessageResponse;
    
    if (responseData.messages && responseData.messages.length > 0) {
      return { success: true, messageId: responseData.messages[0].id };
    }

    return { success: false, error: "No message ID returned from WhatsApp" };
  } catch (error: any) {
    console.error("WhatsApp Send Exception:", error);
    return { success: false, error: error.message || "Network error sending WhatsApp message" };
  }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(
  messageId: string,
  credentials: WhatsAppCredentials
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!credentials.accessToken || !credentials.phoneNumberId) {
      return { success: false, error: "Missing WhatsApp credentials" };
    }

    const url = `https://graph.facebook.com/v21.0/${credentials.phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("WhatsApp API Error (Mark as Read):", data);
      return { 
        success: false, 
        error: data.error?.message || "Failed to mark message as read" 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("WhatsApp Mark as Read Exception:", error);
    return { success: false, error: error.message || "Network error marking message as read" };
  }
}

export interface WhatsAppTemplate {
  name: string;
  category: string;
  language: string;
  id: string;
  components: any[];
  status: string;
}

export async function fetchWhatsAppTemplates(
  credentials: WhatsAppCredentials
): Promise<{ success: boolean; data?: WhatsAppTemplate[]; error?: string }> {
  try {
    if (!credentials.accessToken || !credentials.wabaId) {
      return { success: false, error: "Missing WhatsApp credentials (Access Token or WABA ID)" };
    }

    const url = `https://graph.facebook.com/v21.0/${credentials.wabaId}/message_templates`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${credentials.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Templates Error:", data);
      return { 
        success: false, 
        error: data.error?.message || "Failed to fetch templates from WhatsApp" 
      };
    }

    return { success: true, data: data.data as WhatsAppTemplate[] };
  } catch (error: any) {
    console.error("WhatsApp Fetch Templates Exception:", error);
    return { success: false, error: error.message || "Network error fetching WhatsApp templates" };
  }
}

