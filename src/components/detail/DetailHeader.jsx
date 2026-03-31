import React from 'react';

export function DetailHeader({ title, subtitle, badges, meta, actions, avatar }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="flex flex-wrap items-start gap-4">
        {avatar}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[34px] font-semibold tracking-[-0.06em] text-text">{title}</h1>
            {badges}
          </div>
          {subtitle && <div className="mt-1 text-[13px] text-text-muted">{subtitle}</div>}
          {meta && <div className="mt-2 flex flex-wrap gap-4 text-[13px] text-text-muted">{meta}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
