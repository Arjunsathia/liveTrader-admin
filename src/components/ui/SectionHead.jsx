import React from 'react';

export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {Ic && <Ic size={11} className="flex-shrink-0 text-text-muted/45" />}
      <span className="select-none text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/45 font-heading">
        {title}
      </span>
      <div className="h-px flex-1 bg-border/25" />
      {action}
    </div>
  );
}
