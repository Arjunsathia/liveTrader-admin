import React from 'react';

/**
 * Badge — shared status badge component.
 *
 * Usage A (variant-based, for UsersTables / generic status):
 *   <Badge variant="success" dot>VERIFIED</Badge>
 *
 * Usage B (colorMap-based, for Finance chips):
 *   <Badge colorMap={STATUS_COLOR} value="PENDING">PENDING</Badge>
 */
export function Badge({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  dot = false,
  colorMap,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold uppercase tracking-[0.12em] rounded-[5px] px-2 py-0.5';

  /* If a colorMap is provided, derive colors from it directly */
  if (colorMap) {
    const col = colorMap[children] ??
      colorMap[String(children)] ?? { c: 'var(--text-muted)', bg: 'var(--bg)', border: 'transparent' };
    return (
      <span
        className={`${baseStyles} text-[10px] font-black ${className}`}
        style={{
          color: col.c,
          background: col.bg,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: col.border ?? `color-mix(in srgb, ${col.c} 25%, transparent)`,
        }}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />}
        {children}
      </span>
    );
  }

  /* Variant-based (original behavior) */
  const variants = {
    info: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-positive/10 text-positive border border-positive/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-negative/10 text-negative border border-negative/20',
    muted: 'bg-surface/50 text-text-muted border border-border/40',
  };

  const sizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] ?? variants.info} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />}
      {children}
    </span>
  );
}
