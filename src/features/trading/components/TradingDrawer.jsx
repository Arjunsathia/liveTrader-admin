import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '../../../components/common/drawer';
import { OperatorNoteSection } from '../../../components/common/drawer';
import { ActionBtn } from '../../../components/ui';

export function TradingDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  actionDone,
  width = 'max-w-[720px]',
}) {
  const [note, setNote] = useState('');

  return (
    <MainDrawer
      open={open}
      onClose={onClose}
      width={width}
    >
      <DrawerHeader title={title} subtitle={subtitle} eyebrow="Trading Operations" onClose={onClose} />
      <DrawerBody>
        <div className="space-y-6">
          {children}

          {/* Operator note section — collapsible */}
          <OperatorNoteSection
            value={note}
            onChange={setNote}
            placeholder="Add an internal audit note…"
            onSave={() => {  setNote(''); }}
            defaultOpen={false}
          />
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="space-y-3">
          {/* Action confirmation banner */}
          {actionDone && (
            <div className="flex items-center gap-2 rounded-[10px] border border-positive/25 bg-positive/5 px-3 py-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={12} className="text-positive shrink-0" />
              <span className="text-[11px] font-semibold text-positive/80">System: {actionDone}</span>
            </div>
          )}
          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-text-muted/45 leading-snug max-w-[280px]">
              All actions are logged in the audit trail.
            </span>
            <ActionBtn variant="default" label="Close" onClick={onClose} />
          </div>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

export function TradingQuickActions({ actions }) {
  return (
    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {actions.map(({ label, color, icon, onClick }) => (
        <button
          type="button"
          key={label}
          onClick={onClick}
          className="group flex min-h-10 items-center gap-2 rounded-[10px] border px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        >
          {React.createElement(icon, {
            size: 12,
            className: 'shrink-0 transition-transform group-hover:scale-110',
          })}
          <span className="min-w-0 truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
