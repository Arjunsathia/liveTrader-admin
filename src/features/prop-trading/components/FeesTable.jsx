import React from 'react';
import { Edit2, PauseCircle, PlayCircle, CircleDollarSign } from 'lucide-react';
import { Card, SectionHead, IconBtn, Badge } from './PropShared';

export function FeesTable({ rows, showToast }) {
  return (
    <Card pad={false}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <SectionHead title="Challenge Entry Fees" Icon={CircleDollarSign} />
        <IconBtn label="Edit Fees" Icon={Edit2} variant="default" small onClick={() => showToast('Fee edit mode')} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Challenge', 'Fee', 'Refundable', 'Free Retry', 'Status', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/30 font-heading">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-3 font-heading font-semibold text-text/75">{r.challenge}</td>
                <td className="px-5 py-3 font-mono font-bold text-brand">{r.fee}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-black uppercase font-heading ${r.refundable ? 'text-positive' : 'text-text-muted/40'}`}>
                    {r.refundable ? '✓ Yes' : '✗ No'}
                  </span>
                </td>
                <td className="px-5 py-3 text-text-muted/30 font-heading text-[10.5px]">No</td>
                <td className="px-5 py-3"><Badge value={r.active ? 'ACTIVE' : 'PAUSED'} /></td>
                <td className="px-5 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button onClick={() => showToast(`Editing ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
                    <button onClick={() => showToast(`Toggled ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-warning cursor-pointer">{r.active ? <PauseCircle size={10} /> : <PlayCircle size={10} />}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
