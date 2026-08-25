import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const alertVariants = {
  error: {
    container: 'bg-red-50/95 border-l-4 border-red-600 text-red-900 shadow-sm',
    icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
    badge: 'bg-red-100 text-red-800'
  },
  warning: {
    container: 'bg-amber-50/95 border-l-4 border-amber-500 text-amber-900 shadow-sm',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    badge: 'bg-amber-100 text-amber-800'
  },
  success: {
    container: 'bg-emerald-50/95 border-l-4 border-emerald-500 text-emerald-900 shadow-sm',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    badge: 'bg-emerald-100 text-emerald-800'
  },
  info: {
    container: 'bg-blue-50/95 border-l-4 border-blue-600 text-blue-900 shadow-sm',
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    badge: 'bg-blue-100 text-blue-800'
  }
};

const Alert = ({ type = 'info', title, message, children, onClose, className = '' }) => {
  const variant = alertVariants[type] || alertVariants.info;
  const content = message || children;

  return (
    <div
      role="alert"
      className={`p-4 rounded-r-xl border border-r-slate-200/80 border-y-slate-200/80 transition-all duration-200 flex items-start justify-between gap-3 ${variant.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        {variant.icon}
        <div className="text-xs sm:text-sm font-sans leading-relaxed">
          {title && <h4 className="font-bold mb-0.5 leading-tight">{title}</h4>}
          <div className="font-medium text-slate-800/90">{content}</div>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
