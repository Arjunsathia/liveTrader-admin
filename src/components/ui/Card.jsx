import React from 'react';

/**
 * Standard Operational Card
 * Design: Solid Deep Navigation Surface (Strict Minimal)
 */
export function Card({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '', 
  padding = true, 
  ...props 
}) {
  return (
    <div 
      className={`bg-surface-elevated border border-border/40 rounded-[8px] relative overflow-hidden group/panel transition-all duration-300 ${className}`} 
      {...props}
    >
      {(title || actions) && (
        <div className="px-6 py-4 flex justify-between items-center bg-surface-elevated border-b border-border/10">
          <div className="flex flex-col gap-0.5">
            {title && <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/65">{title}</h3>}
            {subtitle && <h4 className="text-[17px] font-heading font-semibold text-text tracking-[-0.03em]">{subtitle}</h4>}
          </div>
          {actions && <div className="flex gap-2 items-center">{actions}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
}

/**
 * High-Density Stat Card
 * Design: Solid Navigation Surface (Strict Minimal)
 */
export function StatCard({ 
  label, 
  value, 
  subtext, 
  trend = 'neutral', 
  icon: Icon, 
  className = '',
  ...props 
}) {
  const trendColors = {
    up: 'text-positive bg-positive/10',
    down: 'text-negative bg-negative/10',
    danger: 'text-negative bg-negative/10',
    warning: 'text-warning bg-warning/10',
    neutral: 'text-text-muted bg-white/5',
  };

  return (
    <div 
      className={`bg-surface-elevated border border-border/40 p-5 rounded-[8px] flex flex-col gap-2 transition-all duration-400 hover:translate-y-[-2px] group relative overflow-hidden cursor-default ${className}`} 
      {...props}
    >
      <div className="flex justify-between items-start z-10 relative">
        <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-semibold opacity-65 truncate">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-[6px] ${trendColors[trend]} transition-all duration-300`}>
            <Icon size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="text-[28px] font-heading font-semibold text-text tracking-[-0.04em] font-mono tabular-nums z-10 relative">{value}</div>
      <div className={`text-[11px] font-medium tracking-[-0.01em] ${trend === 'up' ? 'text-positive' : trend === 'down' || trend === 'danger' ? 'text-negative' : trend === 'warning' ? 'text-warning' : 'text-text-muted opacity-60'} z-10 relative`}>
        {subtext}
      </div>
    </div>
  );
}
