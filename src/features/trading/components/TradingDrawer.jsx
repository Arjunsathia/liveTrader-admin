import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, TextareaField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui';

export function TradingDrawer({ open, title, subtitle, onClose, children, actionDone, width = 'max-w-[720px]' }) {
  const [note, setNote] = useState('');

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      eyebrow="Trading Operations"
      width={width}
      footer={(
        <div className="space-y-3">
          {actionDone && (
            <div className="flex items-center gap-2 rounded-[10px] border border-positive/25 bg-positive/5 px-3 py-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={12} className="text-positive" />
              <span className="text-[11px] font-medium text-positive/80">System: {actionDone}</span>
            </div>
          )}

          <DrawerSection title="Operator Note" collapsible defaultOpen={false}>
            <div className="mt-2 space-y-2">
              <TextareaField
                label="Audit Log Note"
                value={note}
                onChange={setNote}
                placeholder="Add an internal note for the audit log..."
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  disabled={!note.trim()}
                  onClick={() => { console.log('Saved note:', note); setNote(''); }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </DrawerSection>
        </div>
      )}
    >
      <div className="space-y-5 pb-4">
        {children}
      </div>
    </AdminDrawer>
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
          className="group flex min-h-10 items-center gap-2 rounded-[10px] border px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:brightness-110 active:scale-[0.98]"
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
