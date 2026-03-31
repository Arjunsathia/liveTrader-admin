import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function AdminDrawer({
  open,
  title,
  subtitle,
  children,
  footer,
  onClose,
  width = 'max-w-[640px]',
  eyebrow = 'Quick Edit',
}) {
  const [active, setActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small timeout to trigger CSS transition after mounting
      const timer = setTimeout(() => setActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      // Match duration-400 below
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Backdrop with Fade */}
      <div 
        className={`absolute inset-0 bg-[#020617]/65 backdrop-blur-md transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer Surface with Velocity Slide */}
      <aside 
        className={`fixed right-0 top-0 bottom-0 flex h-full w-full ${width} flex-col overflow-hidden border-l border-border/40 bg-surface shadow-[0_20px_70px_rgba(2,6,23,0.45)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ transform: active ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/30 px-5 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{eyebrow}</p>
            <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-text">{title}</h3>
            {subtitle && <p className="mt-2 text-[13px] text-text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border/30 text-text-muted hover:bg-surface-elevated hover:text-text"
          >
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">{children}</div>
        {footer && <div className="shrink-0 border-t border-border/30 px-5 py-4">{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}
