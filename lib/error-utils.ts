/**
 * Error handling utilities for Better Auth
 * Translates technical error messages to user-friendly Arabic messages
 */

export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Maps Better Auth error messages to user-friendly Arabic messages
 */
export function translateAuthError(error: AuthError | string): string {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const lowerMessage = errorMessage.toLowerCase();

  // Login/Sign-in and Registration errors - Generic message for security
  if (lowerMessage.includes('user not found') || 
      lowerMessage.includes('user does not exist') ||
      lowerMessage.includes('invalid password') || 
      lowerMessage.includes('incorrect password') || 
      lowerMessage.includes('wrong password') ||
      lowerMessage.includes('invalid credentials') ||
      lowerMessage.includes('email already exists') || 
      lowerMessage.includes('user already exists') || 
      lowerMessage.includes('email is already in use') ||
      (lowerMessage.includes('password') && (lowerMessage.includes('weak') || lowerMessage.includes('too short') || lowerMessage.includes('minimum'))) ||
      lowerMessage.includes('invalid email') || 
      lowerMessage.includes('email is not valid')) {
    return 'البريد الإلكتروني أو كلمة المرور بها مشاكل.';
  }

  if (lowerMessage.includes('required') || lowerMessage.includes('missing')) {
    return 'يرجى ملء جميع الحقول المطلوبة.';
  }

  // Network and server errors
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch failed') || lowerMessage.includes('connection')) {
    return 'خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.';
  }

  if (lowerMessage.includes('timeout')) {
    return 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.';
  }

  if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
    return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.';
  }

  // Session/Token errors
  if (lowerMessage.includes('session') || lowerMessage.includes('token')) {
    return 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
  }

  // Generic fallback
  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}

/**
 * Logs authentication errors with structured context
 */
export function logAuthError(context: string, error: unknown, additionalInfo?: Record<string, any>) {
  console.error(`[Auth Error - ${context}]`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  });
}
