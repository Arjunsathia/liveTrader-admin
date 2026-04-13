import React, { useState, useMemo } from 'react';
import { CircleDollarSign, ShieldAlert, Download, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { fundedRows } from '../configs/funded.config';
import { Badge, RiskBadge } from '../components/PropShared';
import { PropToolbar } from '../components/PropToolbar';
import { PropTable } from '../components/PropTable';
import { FundedDrawer } from '../components/PropDrawer';
import { Card } from '../../../components/ui/Card';

export function FundedAccountsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);

  const onAction = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = fundedRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter || (filter === 'PAYOUT' && r.payoutReady));
    if (search) rows = rows.filter(r => r.trader.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, filter]);

  const cols = [
    { key: 'id', label: 'Account', render: v => <span className="font-mono text-text-muted/60 text-[10.5px]">{v}</span> },
    {
      key: 'trader', label: 'Trader', render: (v, r) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[5px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
            {v.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/80">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/35">{r.uid}</div>
          </div>
        </div>
      )
    },
    { key: 'funded', label: 'Funded', render: v => <span className="font-mono font-bold text-brand text-[11px]">{v}</span> },
    {
      key: 'pnl', label: 'PnL', render: (v, r) => (
        <div>
          <span className="font-mono font-bold text-[11.5px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span>
          <div className="text-[10px] font-mono" style={{ color: r.pnlPct?.startsWith('+') ? 'var(--positive)' : 'var(--negative)', opacity: 0.6 }}>{r.pnlPct}</div>
        </div>
      )
    },
    {
      key: 'drawdown', label: 'Drawdown', render: (v, r) => {
        const pct = parseFloat(v?.replace('-', '').replace('%', '')) || 0;
        const limit = parseFloat(r.maxDD?.replace('%', '')) || 10;
        const ratio = Math.min(pct / limit, 1);
        return (
          <div className="w-20">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-mono text-negative">{v}</span>
              <span className="text-text-muted/30 font-mono">{r.maxDD}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: ratio > 0.8 ? 'var(--negative)' : ratio > 0.5 ? 'var(--warning)' : 'var(--positive)' }} />
            </div>
          </div>
        );
      }
    },
    {
      key: 'payout', label: 'Payout', render: (v, r) => (
        r.payoutReady
          ? <span className="font-mono font-bold text-brand text-[11px]">{v}</span>
          : <span className="text-text-muted/30 text-[10.5px] font-heading">Not eligible</span>
      )
    },
    { key: 'risk', label: 'Risk', render: v => <RiskBadge value={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    {
      key: '_actions', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {r.payoutReady && (
            <button onClick={e => { e.stopPropagation(); onAction('Payout approved', r.id); }}
              className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110">
              <CircleDollarSign size={10} />
            </button>
          )}
          <button onClick={e => { e.stopPropagation(); onAction('Warning sent', r.id); }}
            className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning flex items-center justify-center cursor-pointer hover:brightness-110">
            <AlertTriangle size={10} />
          </button>
          <button onClick={e => { e.stopPropagation(); onAction('Account suspended', r.id); }}
            className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110">
            <Lock size={10} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <PropToolbar
        search={search} setSearch={setSearch}
        filters={['ALL', 'ACTIVE', 'WARNED', 'BREACHED', 'PAYOUT']}
        activeFilter={filter} setFilter={setFilter}
        actions={[
          { label: 'Batch Payout', Icon: CircleDollarSign, primary: true, onClick: () => onAction('Batch payout initiated', '') },
          { label: 'Risk Export', Icon: ShieldAlert, onClick: () => onAction('Exported', 'risk report') },
          { label: 'Export', Icon: Download, onClick: () => onAction('Exported', 'funded list') },
        ]}
      />

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Funded', val: `$${fundedRows.reduce((s, r) => s + parseInt(r.funded.replace(/\D/g, '')), 0).toLocaleString()}`, color: 'var(--brand)' },
          { label: 'Total PnL', val: '+$30,687', color: 'var(--positive)' },
          { label: 'Payout Eligible', val: `${fundedRows.filter(r => r.payoutReady).length} accounts`, color: 'var(--brand)' },
          { label: 'Risk Flags', val: `${fundedRows.filter(r => r.risk === 'HIGH').length} HIGH`, color: 'var(--negative)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/40 bg-surface-elevated px-4 py-3">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-text-muted/60 font-heading mb-1.5">{s.label}</div>
            <div className="text-[18px] font-bold font-heading tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <Card
        title="Funded Accounts"
        subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <PropTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>

      <FundedDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={onAction} />
    </div>
  );
}
