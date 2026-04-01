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
        className={`fixed right-0 top-0 bottom-0 flex h-full w-full ${width} flex-col overflow-hidden border-l border-border/40 bg-surface-elevated shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ 
          transform: active ? 'translateX(0)' : 'translateX(100%)',
          backgroundColor: 'var(--surface-2)' 
        }}
      >
        {/* Left accent reflective bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[0.5px] bg-white/[0.08] backdrop-blur-sm z-[10]" />

        <div className="flex items-start justify-between gap-4 border-b border-border/15 px-6 py-6 relative z-[5]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{eyebrow}</p>
            <h3 className="mt-1.5 text-[24px] font-bold tracking-[-0.04em] text-text">{title}</h3>
            {subtitle && <p className="mt-2 text-[13px] font-medium text-text-muted/60">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border/25 text-text-muted/40 hover:bg-surface-bright/20 hover:text-text transition-all"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative z-[5] bg-bg/20">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border/15 px-6 py-5 bg-surface-elevated/50 backdrop-blur-sm relative z-[5]">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
