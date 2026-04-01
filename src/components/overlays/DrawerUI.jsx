import React from 'react';

import { ChevronDown } from 'lucide-react';

export function DrawerSection({ title, children, className = "", collapsible = false, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        type="button"
        disabled={!collapsible}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 group/section ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 group-hover/section:text-primary transition-colors">
          {title}
        </span>
        <div className="flex-1 h-[1px] bg-border/20 shadow-[0_1px_0_rgba(255,255,255,0.02)]" />
        {collapsible && (
          <ChevronDown 
            size={12} 
            className={`text-text-muted/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        )}
      </button>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-500 fill-mode-both">
          {children}
        </div>
      )}
    </div>
  );
}

export function DrawerField({ label, value, mono = false, accent, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">
        {label}
      </span>
      <div 
        className={`flex h-10 items-center rounded-[10px] border border-border/25 bg-bg/50 px-3 text-[12.5px] transition-all hover:border-border/40 ${mono ? 'font-mono' : 'font-medium'} tracking-tight shrink-0`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        {value || <span className="opacity-20">—</span>}
      </div>
    </div>
  );
}

export function DrawerGrid({ children, cols = 2, gap = 2 }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };
  
  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}
