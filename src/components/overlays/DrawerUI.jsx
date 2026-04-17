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
        className={`flex h-10 items-center rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text transition-all hover:border-border/40 ${mono ? 'font-mono' : ''} shrink-0`}
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

/* ──────────────────────────────────────────────────────────
   Form Elements ported from AddUserDrawer standard
───────────────────────────────────────────────────────────── */

export function TextField({ label, value, onChange, placeholder, type = 'text', mono = false }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${mono ? 'font-mono' : ''}`}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-[10px] border border-border/25 bg-bg px-3 pr-8 text-[12px] text-text outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            typeof option === 'string'
              ? <option key={option} value={option}>{option}</option>
              : <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/45" />
      </div>
    </label>
  );
}

export function TextareaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-[10px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export function ToggleField({ label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-border/20 bg-bg/50 px-3 py-3 shadow-card-subtle">
      <div>
        <div className="text-[12px] font-medium text-text">{label}</div>
        {description && <div className="mt-1 text-[11px] text-text-muted/60">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{ background: checked ? 'var(--brand)' : 'var(--border)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </button>
    </div>
  );
}
