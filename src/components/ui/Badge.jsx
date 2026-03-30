import React from 'react';

export function Badge({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-[0.12em] rounded-[999px] px-2.5 py-1';

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
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shadow-none"></div>}
      {children}
    </span>
  );
}
