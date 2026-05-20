import React from 'react';
import { Check, ChevronDown, Copy, Send } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { ActionBtn } from '../ui/ActionBtn';
import { StatusChip } from '../ui/StatusChip';

export function DrawerSection({ title, children, className = '', collapsible = false, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        type="button"
        disabled={!collapsible}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 group/section ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 transition-colors group-hover/section:text-primary">
          {title}
        </span>
        <div className="h-[1px] flex-1 bg-border/20 shadow-[0_1px_0_rgba(255,255,255,0.02)]" />
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

export function DrawerField({ label, value, mono = false, accent, className = '', copyable = false, wide = false }) {
  const [copied, setCopied] = React.useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';

  const handleCopy = () => {
    if (!hasValue) return;
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${wide ? 'col-span-2' : ''} ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">
        {label}
      </span>
      <div
        className={`group relative flex h-10 min-w-0 shrink-0 items-center rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text transition-all hover:border-border/40 ${copyable ? 'pr-9' : ''} ${mono ? 'font-mono' : ''}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        <span className="min-w-0 truncate">
          {hasValue ? value : <span className="opacity-20">-</span>}
        </span>
        {copyable && hasValue && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[7px] text-text-muted/35 opacity-0 transition-all hover:bg-surface-bright/20 hover:text-text group-hover:opacity-100"
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function DrawerGrid({ children, cols = 2, gap = 2, className = '' }) {
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };
  const gapMap = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
  };

  return (
    <div className={`grid ${colMap[cols] ?? 'grid-cols-2'} ${gapMap[gap] ?? 'gap-2'} ${className}`}>
      {children}
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder, type = 'text', mono = false, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${mono ? 'font-mono' : ''}`}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, placeholder, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <div className="relative">
        <select
          value={value ?? ''}
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

export function TextareaField({ label, value, onChange, placeholder, rows = 4, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="resize-none rounded-[10px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
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

export function DrawerActionGrid({ actions = [], cols = 2, className = '' }) {
  if (!actions.length) return null;
  const colClass = cols === 1 ? 'sm:grid-cols-1' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className={`grid grid-cols-1 gap-2 ${colClass} ${className}`}>
      {actions.map(({ label, icon, Icon, variant = 'default', onClick, disabled, closeOnClick }, index) => (
        <ActionBtn
          key={label ?? index}
          label={label}
          Icon={Icon ?? icon}
          variant={variant}
          disabled={disabled}
          onClick={onClick}
          closeOnClick={closeOnClick}
        />
      ))}
    </div>
  );
}

export function DrawerSummary({ title, subtitle, status, meta = [], accent = 'var(--brand)', children }) {
  return (
    <div
      className="rounded-[12px] border bg-bg/40 px-4 py-3.5"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 22%, var(--border))`,
        background: `color-mix(in srgb, ${accent} 5%, transparent)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {title && <div className="truncate text-[16px] font-black tracking-[-0.02em] text-text">{title}</div>}
          {subtitle && <div className="mt-1 font-mono text-[10px] text-text-muted/45">{subtitle}</div>}
        </div>
        {status && <StatusChip value={status} size="lg" />}
      </div>
      {meta.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {meta.map((item) => (
            <span key={`${item.label}-${item.value}`} className="rounded-[5px] border border-border/25 px-2 py-0.5 text-[10px] font-semibold text-text-muted/65">
              {item.label ? `${item.label}: ` : ''}{item.value}
            </span>
          ))}
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function DrawerAuditTrail({ entries = [] }) {
  if (!entries.length) return null;

  return (
    <div className="relative space-y-0">
      <div className="absolute bottom-3 left-[7px] top-3 w-px bg-border/20" />
      {entries.map((entry, index) => (
        <div key={`${entry.action}-${entry.ts}-${index}`} className="flex gap-3 pb-3">
          <div className="z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border border-border/30 bg-surface-elevated" style={{ boxShadow: '0 0 0 2px var(--bg)' }} />
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold text-text/75">{entry.action}</div>
            <div className="mt-0.5 font-mono text-[10px] text-text-muted/40">{entry.by} · {entry.ts}</div>
            {entry.note && <div className="mt-0.5 text-[10.5px] text-text-muted/50">{entry.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OperatorNoteSection({ value, onChange, onSave, placeholder = 'Add an internal note...', defaultOpen = false }) {
  return (
    <DrawerSection title="Operator Note" collapsible defaultOpen={defaultOpen}>
      <div className="mt-2 space-y-2">
        <TextareaField
          label="Audit Log Note"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
        />
        <div className="flex justify-end">
          <ActionBtn
            label="Save Note"
            Icon={Send}
            variant="brand"
            disabled={!String(value ?? '').trim()}
            onClick={onSave}
            small
          />
        </div>
      </div>
    </DrawerSection>
  );
}

export function RecordDrawer({
  open,
  onClose,
  title,
  subtitle,
  eyebrow = 'Record Details',
  width = 'max-w-[720px]',
  record,
  summary,
  sections = [],
  actions = [],
  auditTrail,
  noteConfig,
  footer,
  children,
}) {
  const computedFooter = footer ?? (
    actions.length > 0
      ? <DrawerActionGrid actions={actions.map((action) => ({ ...action, onClick: action.onClick ? () => action.onClick(record) : undefined }))} />
      : null
  );

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      eyebrow={eyebrow}
      width={width}
      footer={computedFooter}
    >
      <div className="space-y-6">
        {summary && <DrawerSummary {...summary} />}
        {sections.map((section) => (
          <DrawerSection
            key={section.title}
            title={section.title}
            collapsible={section.collapsible}
            defaultOpen={section.defaultOpen}
          >
            {section.children ?? (
              <DrawerGrid cols={section.cols ?? 2}>
                {(section.fields ?? []).map((field) => (
                  <DrawerField
                    key={field.key ?? field.label}
                    label={field.label}
                    value={typeof field.value === 'function' ? field.value(record) : field.value}
                    mono={field.mono}
                    accent={field.accent}
                    copyable={field.copyable}
                    wide={field.wide}
                    className={field.className}
                  />
                ))}
              </DrawerGrid>
            )}
          </DrawerSection>
        ))}
        {children}
        {noteConfig && <OperatorNoteSection {...noteConfig} />}
        {auditTrail?.length > 0 && (
          <DrawerSection title="Audit Trail" collapsible defaultOpen={false}>
            <DrawerAuditTrail entries={auditTrail} />
          </DrawerSection>
        )}
      </div>
    </AdminDrawer>
  );
}
