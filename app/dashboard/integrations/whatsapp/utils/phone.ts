// Phone validation utilities

export const MIN_PHONE_LENGTH = 7;
export const MAX_PHONE_LENGTH = 15;

// Validate phone number length
export function isValidPhoneLength(phone: string): boolean {
  return phone.length >= MIN_PHONE_LENGTH && phone.length <= MAX_PHONE_LENGTH;
}

// Clean phone number (remove non-digits except +)
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

// Format phone with country code
export function formatFullPhone(countryCode: string, phone: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `${countryCode}${cleanPhone}`;
}

// Get phone validation error message
export function getPhoneValidationError(phone: string): string | null {
  if (phone.length === 0) return null;
  if (phone.length < MIN_PHONE_LENGTH) {
    return "رقم الهاتف يجب أن يكون 7 أرقام على الأقل";
  }
  if (phone.length > MAX_PHONE_LENGTH) {
    return "رقم الهاتف طويل جداً";
  }
  return null;
}
