import React from 'react';
import { Check, UserRound, Contact, ScanFace, MapPin, ClipboardCheck, Send } from 'lucide-react';

const STEPS = [
  { label: 'Personal', sub: 'Identity details', Icon: UserRound },
  { label: 'Document', sub: 'ID upload', Icon: Contact },
  { label: 'Face check', sub: 'Selfie verify', Icon: ScanFace },
  { label: 'Address', sub: 'Proof of address', Icon: MapPin },
  { label: 'Review', sub: 'Confirm & submit', Icon: ClipboardCheck },
  { label: 'Submitted', sub: 'Awaiting review', Icon: Send },
];

export function KycProgressStepper({ current = 1, completed = [], onSelect }) {
  const doneCount = STEPS.filter((_, i) => completed[i] || (i + 1) < current).length;
  const pct = Math.round((Math.max(0, current - 1) / (STEPS.length - 1)) * 100);

  return (
    <div>
      {/* ── Progress track ── */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold text-text">
          Step <span className="text-brand">{current}</span> of {STEPS.length}
        </p>
        <p className="text-[11px] text-text-muted">
          {doneCount} of {STEPS.length - 1} steps completed
        </p>
      </div>
      <div className="h-1 rounded-full bg-muted-surface overflow-hidden mb-5">
        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* ── Step cards ── */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STEPS.map(({ label, sub, Icon }, i) => {
          const num = i + 1;
          const done = completed[i] || num < current;
          const active = num === current;
          const locked = num > current && !completed[i];

          return (
            <button key={label} type="button"
              disabled={locked}
              onClick={() => !locked && onSelect?.(num)}
              className={[
                'relative p-3 rounded-[10px] border text-left transition-all',
                active ? 'border-brand/50 bg-brand/[0.08]'
                  : done ? 'border-positive/30 bg-positive/[0.04] hover:border-positive/50'
                    : locked ? 'border-border/20 bg-muted-surface/20 opacity-40 cursor-not-allowed'
                      : 'border-border/30 bg-surface hover:border-border/55',
              ].join(' ')}
            >
              <span className="absolute top-2.5 right-2.5 font-mono text-[8px] text-text-muted/25 font-bold">
                {String(num).padStart(2, '0')}
              </span>

              <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center mb-2 transition-colors ${done ? 'bg-positive/15 text-positive'
                : active ? 'bg-brand text-text-on-accent'
                  : 'bg-muted-surface text-text-muted'
                }`}>
                {done ? <Check size={13} strokeWidth={3} /> : <Icon size={13} />}
              </div>

              <p className={`text-[10px] font-black uppercase tracking-[0.07em] leading-tight ${active ? 'text-brand' : done ? 'text-positive' : 'text-text-muted'
                }`}>
                {label}
              </p>
              <p className="text-[9.5px] text-text-muted/60 mt-0.5 leading-tight">{sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}