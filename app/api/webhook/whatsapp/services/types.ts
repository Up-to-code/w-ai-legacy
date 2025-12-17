export interface WhatsAppWebhookPayload {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: {
          profile: {
            name: string;
          };
          wa_id: string;
        }[];
        messages?: {
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contacts' | 'interactive' | 'reaction' | 'button' | 'unknown';
          image?: MediaMessage;
          video?: MediaMessage;
          audio?: MediaMessage;
          document?: MediaMessage;
          sticker?: MediaMessage;
          location?: LocationMessage;
          contacts?: ContactMessage[];
          interactive?: InteractiveMessage;
          reaction?: ReactionMessage;
          context?: ContextMessage;
          [key: string]: unknown;
        }[];
        statuses?: WhatsAppStatusUpdate[];
      };
      field: string;
    }[];
  }[];
}

export interface WhatsAppStatusUpdate {
   id: string;
   status: 'sent' | 'delivered' | 'read' | 'failed';
   recipient_id: string;
   timestamp: string;
   conversation?: {
       id: string;
       origin: {
           type: string;
       };
   };
   pricing?: {
       billable: boolean;
       pricing_model: string;
       category: string;
   };
   errors?: {
       code: number;
       title: string;
       message?: string;
       error_data?: {
           details: string;
       };
   }[];
}

export interface MediaMessage {
  id: string;
  link?: string;
  caption?: string;
  filename?: string;
  mime_type: string;
  sha256?: string;
  file_size?: number;
}

export interface LocationMessage {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
}

export interface ContactMessage {
  name: {
    formatted_name: string;
    first_name?: string;
  };
  phones?: {
    phone?: string;
    type?: string;
  }[];
}

export interface InteractiveMessage {
  type: 'button_reply' | 'list_reply';
  button_reply?: {
    id: string;
    title: string;
  };
  list_reply?: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface ReactionMessage {
  message_id: string;
  emoji: string;
}

export interface ContextMessage {
  from: string;
  id: string;
}

export interface WebhookVisual {
    icon: string;
    color: string;
    title: string;
    description: string;
}

export interface ExtractedWebhookData {
    eventType: string;
    visual?: WebhookVisual;
    timestamp: Date;
    phoneNumberId: string;
    displayPhoneNumber: string;
    waId: string;
    displayName: string;
    messageId?: string;
    conversationId: string;
    content: unknown;
    status?: unknown;
    error?: unknown;
    raw: unknown;
}
