import { WhatsAppAIConfig } from "../types";

/**
 * Check if current time is within business hours
 */
export function isWithinBusinessHours(
  businessHours: NonNullable<WhatsAppAIConfig['businessHours']>,
  timezone?: string
): boolean {
  try {
    const now = new Date();
    const tz = timezone || businessHours.timezone || "Africa/Cairo";
    
    // Get current time in the specified timezone
    const currentTime = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    // Get current day (0 = Sunday, 6 = Saturday)
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short'
    });
    const dayName = formatter.format(now);
    const dayMap: Record<string, number> = {
      'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
    };
    const currentDay = dayMap[dayName];

    // Check if today is a business day
    if (!businessHours.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is within business hours
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [startHour, startMinute] = businessHours.start.split(':').map(Number);
    const [endHour, endMinute] = businessHours.end.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMinute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } catch (error) {
    console.error('[Business Hours] Error checking time:', error);
    // Fail open - allow responses if there's an error
    return true;
  }
}

/**
 * Determine if AI should respond based on configuration
 */
export function shouldAIRespond(aiConfig?: WhatsAppAIConfig, botIsActive?: boolean): {
  shouldRespond: boolean;
  reason?: string;
} {
  // If no AI config, default to enabled (backward compatibility)
  if (!aiConfig) {
    return { shouldRespond: true };
  }

  // Check if AI is explicitly disabled
  if (!aiConfig.enabled) {
    return {
      shouldRespond: false,
      reason: 'AI auto-response is disabled'
    };
  }

  // Check if bot itself is inactive
  if (botIsActive === false) {
    return {
      shouldRespond: false,
      reason: 'Bot is not active'
    };
  }

  // Check business hours if enabled
  if (aiConfig.businessHoursOnly && aiConfig.businessHours) {
    const withinHours = isWithinBusinessHours(aiConfig.businessHours);
    if (!withinHours) {
      return {
        shouldRespond: false,
        reason: 'Outside business hours'
      };
    }
  }

  return { shouldRespond: true };
}

/**
 * Get default AI configuration
 */
export function getDefaultAIConfig(): WhatsAppAIConfig {
  return {
    enabled: true,
    responseDelay: 2, // 2 seconds default delay
    businessHoursOnly: false,
    businessHours: {
      start: "09:00",
      end: "18:00",
      timezone: "Africa/Cairo",
      days: [1, 2, 3, 4, 5] // Monday to Friday
    },
    fallbackMessage: "شكراً لتواصلك معنا! سنرد عليك في أقرب وقت خلال ساعات العمل."
  };
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
