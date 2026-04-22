import React from 'react';

const ACTION_BTN_VARIANTS = {
  danger: { border: '1px solid rgba(239,68,68,0.22)', bg: 'rgba(239,68,68,0.07)', color: '#ef4444' },
  success: { border: '1px solid rgba(74,225,118,0.22)', bg: 'rgba(74,225,118,0.07)', color: 'var(--positive)' },
  warning: { border: '1px solid rgba(217,119,6,0.22)', bg: 'rgba(217,119,6,0.07)', color: '#d97706' },
  cyan: { border: '1px solid rgba(6,182,212,0.22)', bg: 'rgba(6,182,212,0.07)', color: 'var(--cyan)' },
  brand: { border: '1px solid rgba(218,165,32,0.25)', bg: 'rgba(218,165,32,0.09)', color: 'var(--brand)' },
  default: { border: '1px solid rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' },
};

export function ActionBtn({ Icon: Ic, label, variant = 'default', onClick, small = false }) {
  const style = ACTION_BTN_VARIANTS[variant] ?? ACTION_BTN_VARIANTS.default;
  const sizeClass = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 ${sizeClass} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: style.border, background: style.bg, color: style.color }}
    >
      {Ic && <Ic size={small ? 11 : 12} />}
      {label}
    </button>
  );
}
