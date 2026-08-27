import React, { createContext, useContext, useState } from 'react';
import Alert from '../components/Alert';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', title = '', durationMs = 5000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, title };

    setToasts(prev => [...prev, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-3 top-3 z-[9999] flex max-h-[calc(100dvh-1.5rem)] flex-col items-stretch gap-2 overflow-y-auto font-sans sm:left-auto sm:right-4 sm:top-4 sm:w-[min(28rem,calc(100vw-2rem))] sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full min-w-0 transition-opacity duration-200 animate-in fade-in slide-in-from-top-2"
          >
            <Alert
              type={toast.type}
              title={toast.title}
              onClose={() => removeToast(toast.id)}
              className="w-full"
            >
              {toast.message}
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
