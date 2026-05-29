import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function CopyTradingDrawer({ isOpen, onClose, title, description, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="relative w-full max-w-md h-full bg-[#141414] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 animate-in slide-in-from-right font-heading"
      >
        <div>
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-semibold text-text tracking-tight">{title}</h2>
              {description && <p className="text-[12.5px] text-text-muted/75 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-[6px] border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-text-muted/40 hover:text-text hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CopyTradingDrawer;
