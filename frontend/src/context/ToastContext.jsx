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
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-[90vw] pointer-events-none font-sans">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto transition-all transform duration-300 animate-in fade-in slide-in-from-top-4">
            <Alert
              type={toast.type}
              title={toast.title}
              onClose={() => removeToast(toast.id)}
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
