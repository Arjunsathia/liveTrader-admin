import React from 'react';
import { CheckCircle2, Circle, Clock3, ShieldCheck, UserRound, Contact, ScanFace, MapPin } from 'lucide-react';

const ITEMS = [
  { label: 'Personal details', sub: '~2 min', Icon: UserRound },
  { label: 'Identity ID card', sub: '~3 min', Icon: Contact },
  { label: 'Selfie photo', sub: '~1 min', Icon: ScanFace },
  { label: 'Address document', sub: '~2 min', Icon: MapPin },
];

export function KycRequirementsBox({ completed = [], current = 0 }) {
  const doneCount = completed.filter(Boolean).length;
  const minsLeft = ITEMS.reduce((acc, { sub }, i) => acc + (completed[i] ? 0 : parseInt(sub)), 0);

  return (
    <div className="rounded-[12px] border border-border/40 bg-surface-elevated p-5">

      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={15} className="text-brand" />
        <h3 className="font-heading font-semibold text-[13.5px]">Steps checklist</h3>
      </div>
      <p className="text-[11px] text-text-muted mb-4 pl-[23px]">
        {doneCount} of {ITEMS.length} completed
        {minsLeft > 0 && (
          <span className="ml-2 inline-flex items-center gap-1 text-brand font-bold">
            <Clock3 size={10} /> ~{minsLeft} min left
          </span>
        )}
      </p>

      <div className="space-y-2">
        {ITEMS.map((item, i) => {
          const { label, sub, Icon } = item;
          const done = Boolean(completed[i]);
          const active = i + 1 === current;

          return (
            <div key={label}
              className={`flex items-center justify-between gap-3 rounded-[9px] px-3 py-2.5 transition-colors ${active ? 'bg-brand/[0.06] border border-brand/20' : ''}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-positive/15 text-positive'
                  : active ? 'bg-brand/15 text-brand'
                    : 'bg-muted-surface text-text-muted/50'
                  }`}>
                  <Icon size={13} />
                </div>
                <div>
                  <p className={`text-[12px] font-semibold leading-tight ${done ? 'text-text-muted line-through decoration-text-muted/35' : active ? 'text-text' : 'text-text-muted'}`}>
                    {label}
                  </p>
                  {!done && <p className="text-[10px] text-text-muted/60">{sub}</p>}
                </div>
              </div>

              {done ? <CheckCircle2 size={14} className="text-positive shrink-0" />
                : active ? <span className="text-[9px] font-black uppercase tracking-[0.1em] text-brand shrink-0">In progress</span>
                  : <Circle size={14} className="text-border/40 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}