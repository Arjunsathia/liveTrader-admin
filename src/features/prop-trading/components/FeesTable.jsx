import React from 'react';
import { Edit2, PauseCircle, PlayCircle, CircleDollarSign } from 'lucide-react';
import { Card, SectionHead, IconBtn } from './PropTradingShared';
import { StatusChip as Badge } from '../../../components/ui';
import { FeatureTable } from '../../../components/tables/FeatureTable';

const feesCols = [
  { key: 'challenge',  label: 'Challenge',   render: (v) => <span className="font-heading font-semibold text-text/75">{v}</span> },
  { key: 'fee',        label: 'Fee',         render: (v) => <span className="font-mono font-bold text-brand">{v}</span> },
  { key: 'refundable', label: 'Refundable',  render: (v) => (
    <span className={`text-[10px] font-black uppercase font-heading ${v ? 'text-positive' : 'text-text-muted/40'}`}>
      {v ? '✓ Yes' : '✗ No'}
    </span>
  )},
  { key: 'freeRetry',  label: 'Free Retry',  render: () => <span className="text-text-muted/30 font-heading text-[10.5px]">No</span> },
  { key: 'active',     label: 'Status',      render: (v) => <Badge value={v ? 'ACTIVE' : 'PAUSED'} /> },
];

export function FeesTable({ rows, showToast }) {
  // Inject action col with showToast bound
  const cols = [
    ...feesCols,
    {
      key: '_actions', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => showToast(`Editing ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer">
            <Edit2 size={10} />
          </button>
          <button onClick={() => showToast(`Toggled ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-warning cursor-pointer">
            {r.active ? <PauseCircle size={10} /> : <PlayCircle size={10} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card pad={false}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/25">
        <SectionHead title="Challenge Entry Fees" Icon={CircleDollarSign} />
        <IconBtn label="Edit Fees" Icon={Edit2} variant="default" small onClick={() => showToast('Fee edit mode')} />
      </div>
      <FeatureTable cols={cols} rows={rows} />
    </Card>
  );
}
