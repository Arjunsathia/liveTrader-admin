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
  eyebrow = 'Trading Operations',
}) {
  const [note, setNote] = useState('');

  return (
    <MainDrawer
      open={open}
      onClose={onClose}
      width={width}
    >
      <DrawerHeader title={title} subtitle={subtitle} eyebrow={eyebrow} onClose={onClose} />
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
              <span className="text-[11px] font-semibold uppercase tracking-wider text-positive select-none">System: {actionDone}</span>
            </div>
          )}
          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11.5px] text-text-muted/75 leading-snug max-w-[280px]">
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
    <div className="grid grid-cols-2 gap-2 mt-2">
      {actions.map(({ label, color, icon: Icon, onClick }) => (
        <button
          type="button"
          key={label}
          onClick={onClick}
          className="group flex items-center gap-2 h-10 px-3.5 rounded-[10px] border text-left text-[12px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 8%, transparent)`,
            borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
          }}
        >
          {Icon && (
            <Icon
              size={12}
              className="shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ color }}
            />
          )}
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
