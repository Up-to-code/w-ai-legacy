import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (type, message, duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  success: (message, duration) =>
    set((state) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { id, type: 'success' as ToastType, message, duration: duration || 5000 };
      
      setTimeout(() => {
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        }));
      }, duration || 5000);
      
      return { toasts: [...state.toasts, newToast] };
    }),

  error: (message, duration) =>
    set((state) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { id, type: 'error' as ToastType, message, duration: duration || 5000 };
      
      setTimeout(() => {
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        }));
      }, duration || 5000);
      
      return { toasts: [...state.toasts, newToast] };
    }),

  info: (message, duration) =>
    set((state) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { id, type: 'info' as ToastType, message, duration: duration || 5000 };
      
      setTimeout(() => {
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        }));
      }, duration || 5000);
      
      return { toasts: [...state.toasts, newToast] };
    }),

  warning: (message, duration) =>
    set((state) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { id, type: 'warning' as ToastType, message, duration: duration || 5000 };
      
      setTimeout(() => {
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        }));
      }, duration || 5000);
      
      return { toasts: [...state.toasts, newToast] };
    }),
}));
