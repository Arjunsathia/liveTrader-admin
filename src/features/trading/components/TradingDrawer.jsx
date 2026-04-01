import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection } from '../../../components/overlays/DrawerUI';

/**
 * Base Drawer layout for Trading.
 * Wraps the canonical AdminDrawer and adds Trading-specific features like Note Area and success feedback.
 */
export function TradingDrawer({ open, title, subtitle, onClose, children, actionDone, width = "max-w-[720px]" }) {
  const [note, setNote] = useState('');

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      eyebrow="Trading Terminal"
      width={width}
      footer={(
        <div className="space-y-4">
          <DrawerSection title="Operator Note" collapsible defaultOpen={false}>
            <div className="space-y-2 mt-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note for the audit log…"
                rows={3}
                className="w-full rounded-[10px] border border-border/25 bg-bg/60 px-3 py-2.5 text-[12px] text-text outline-none placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none transition-all"
              />
              <button
                disabled={!note.trim()}
                onClick={() => { console.log('Saved note:', note); setNote(''); }}
                className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[11px] font-semibold disabled:opacity-35 transition-all bg-brand text-surface-dark hover:brightness-110 active:scale-95"
              >
                <Send size={11} /> Save Note
              </button>
            </div>
          </DrawerSection>

          {actionDone && (
            <div className="flex items-center gap-2 rounded-[10px] border border-positive/25 bg-positive/5 px-3 py-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={12} className="text-positive" />
              <span className="text-[11px] text-positive/80 font-medium">System: {actionDone}</span>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-6 pb-4">
        {children}
      </div>
    </AdminDrawer>
  );
}

/**
 * Shared Quick Actions for Trading drawers.
 */
export function TradingQuickActions({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {actions.map(({ label, color, icon: Icon, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex items-center gap-2 rounded-[10px] border px-3 py-3 text-[11px] font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98] group"
          style={{
            color: color,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        >
          <Icon size={12} className="group-hover:scale-110 transition-transform" />
          {label}
        </button>
      ))}
    </div>
  );
}
