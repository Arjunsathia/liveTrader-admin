import React from 'react';
import { StatusBadge } from '../feedback/StatusBadge';

export function ActivityTimeline({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.time}-${item.title}`} className="rounded-[10px] border border-border/30 bg-bg/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-text">{item.title}</div>
              <div className="mt-1 text-[11px] text-text-muted">{item.source}</div>
            </div>
            {item.status && <StatusBadge status={item.status} />}
          </div>
          <div className="mt-2 text-[13px] leading-6 text-text-muted">{item.description}</div>
          <div className="mt-2 font-mono text-[11px] text-text-muted/80">{item.time}</div>
        </div>
      ))}
    </div>
  );
}
