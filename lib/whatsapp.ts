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

    const url = `https://graph.facebook.com/v17.0/${credentials.phoneNumberId}/messages`;

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
