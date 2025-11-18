'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

const toastVariants = {
  success: 'bg-green-500/20 border-green-500/50 text-green-400',
  error: 'bg-red-500/20 border-red-500/50 text-red-400',
  info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

const toastIcons = {
  success: <CheckCircle size={20} className="flex-shrink-0" />,
  error: <AlertCircle size={20} className="flex-shrink-0" />,
  info: <Info size={20} className="flex-shrink-0" />,
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast-${Date.now()}`;
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-32 right-6 z-40 flex flex-col gap-2">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, x: 100 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 100 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${toastVariants[toast.type]} max-w-sm`}
        >
          {toastIcons[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current/60 hover:text-current/100 transition ml-2"
          >
            <X size={16} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
