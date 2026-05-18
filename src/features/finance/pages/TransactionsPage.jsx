 /**
 * finance/pages/TransactionsPage.jsx
 */
import React, { useState, useMemo } from 'react';
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, BarChart2, CircleDollarSign, Copy, Database, Download, Eye, FileText, Flag, RefreshCw, RotateCcw, Settings, Star, User } from 'lucide-react';

import { transactionsData, TXN_TYPE_CLR, STATUS_CLR } from '../data/financeMockData';
import { KpiCard, StatusBadge, MethodBadge, AmountCell, SummaryPills, Toast } from '../components/FinanceShared';
import { FinanceTable, FinanceToolbar, FilterRow, UserCell, FinanceDrawer, DrawerSection, DF, DGrid, DrawerAuditTrail, IconBtn, Pagination } from '../components/FinanceDrawer';
import { Card } from '../../../components/ui/Card';

function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 8;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...transactionsData];
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (search) r = r.filter(x => x.id.includes(search) || x.reference.includes(search) || x.user.name.toLowerCase().includes(search.toLowerCase()) || x.user.uid.includes(search));
    return r;
  }, [search, typeF, statusF, methodF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const credits = transactionsData.filter(t => t.amtRaw > 0).reduce((s, t) => s + t.amtRaw, 0);
  const debits = transactionsData.filter(t => t.amtRaw < 0).reduce((s, t) => s + Math.abs(t.amtRaw), 0);
  const reversals = transactionsData.filter(t => t.type === 'REVERSAL').length;

  const kpis = [
    { label: 'Total Transactions', value: transactionsData.length, Icon: ArrowLeftRight, accent: 'var(--cyan)', sub: 'All ledger entries' },
    { label: 'Credits', value: `$${(credits / 1000).toFixed(1)}K`, Icon: ArrowDownLeft, accent: 'var(--positive)', sub: 'Total inflow' },
    { label: 'Debits', value: `$${(debits / 1000).toFixed(1)}K`, Icon: ArrowUpRight, accent: 'var(--negative)', sub: 'Total outflow' },
    { label: 'Reversals', value: reversals, Icon: RotateCcw, accent: 'var(--warning)', sub: 'Chargebacks & reversals' },
    { label: 'Flagged', value: transactionsData.filter(t => t.status === 'FLAGGED').length, Icon: Flag, accent: 'var(--negative)', sub: 'Under investigation', urgent: true },
    { label: 'Net Volume', value: `$${((credits - debits) / 1000).toFixed(1)}K`, Icon: BarChart2, accent: 'var(--brand)', sub: 'Net ledger movement' },
  ];

  const TXN_ICONS = { DEPOSIT: ArrowDownLeft, WITHDRAWAL: ArrowUpRight, FEE: CircleDollarSign, REVERSAL: RotateCcw, COMMISSION: Star, ADJUSTMENT: Settings };

  const cols = [
    { key: 'id', label: 'TXN ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'user', label: 'User', render: v => <UserCell u={v} /> },
    {
      key: 'type', label: 'Type', render: v => {
        const Ic = TXN_ICONS[v] || ArrowLeftRight;
        const c = TXN_TYPE_CLR[v] || 'var(--text-muted)';
        return (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold font-heading" style={{ color: c }}>
            <Ic size={11} className="flex-shrink-0" />{v}
          </span>
        );
      }
    },
    { key: 'amount', label: 'Amount', render: (v, r) => <AmountCell value={v} type={r.type} /> },
    { key: 'method', label: 'Method', render: v => <MethodBadge value={v} /> },
    { key: 'reference', label: 'Reference', render: v => <span className="font-mono text-cyan text-[10.5px]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
    { key: 'ts', label: 'Timestamp', render: v => <span className="font-mono text-text-muted/40 text-[10px]">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); act('Exported', r.id); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Download size={10} /></button>
          {r.status === 'FLAGGED' && <button onClick={e => { e.stopPropagation(); act('Reviewed', r.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning flex items-center justify-center cursor-pointer"><Eye size={10} /></button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">{kpis.map(k => <KpiCard key={k.label}{...k} />)}</div>

      <Toast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <FinanceToolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'SETTLED', 'PENDING', 'FLAGGED', 'FROZEN']}
            activeFilter={statusF} setFilter={v => { setStatusF(v); setPage(1); }}
            actions={[
              { label: 'Export Ledger', Icon: Download, onClick: () => act('Exported', 'ledger') },
            ]}
            extra={
              <>
              <SummaryPills items={[
                { label: 'Deposits', val: transactionsData.filter(t => t.type === 'DEPOSIT').length, color: 'var(--positive)' },
                { label: 'Withdrawals', val: transactionsData.filter(t => t.type === 'WITHDRAWAL').length, color: 'var(--negative)' },
                { label: 'Fees', val: transactionsData.filter(t => t.type === 'FEE').length, color: 'var(--warning)' },
                { label: 'Reversals', val: transactionsData.filter(t => t.type === 'REVERSAL').length, color: 'var(--cyan)' },
                { label: 'Commissions', val: transactionsData.filter(t => t.type === 'COMMISSION').length, color: 'var(--brand)' },
              ]} />
              <FilterRow filters={[
                { label: 'Type', value: typeF, set: setTypeF, options: ['ALL', 'DEPOSIT', 'WITHDRAWAL', 'FEE', 'REVERSAL', 'COMMISSION', 'ADJUSTMENT'] },
                { label: 'Method', value: methodF, set: setMethodF, options: ['ALL', 'Bank Wire', 'Card', 'Crypto', 'E-Wallet', 'Internal'] },
              ]} />
              </>
            }
          />
        </div>
        <FinanceTable cols={cols} rows={paged} onRow={r => setDrawer(r)}
          footer={<Pagination total={filtered.length} page={page} perPage={PER} setPage={setPage} />} />
      </Card>

      {/* Transactions drawer (custom because structure differs) */}
      <FinanceDrawer open={!!drawer} onClose={() => setDrawer(null)} title={`Transaction — ${drawer?.id}`} subtitle="Inspect ledger mapping and transaction context." footer={
        drawer ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <IconBtn label="Export" Icon={Download} variant="default" onClick={() => { act('Exported', drawer.id); }} />
            <IconBtn label="Copy TXN ID" Icon={Copy} variant="cyan" onClick={() => { navigator.clipboard.writeText(drawer.id); act('Copied', drawer.id); }} />
            {drawer.status === 'FLAGGED' && <IconBtn label="Review" Icon={Eye} variant="warning" onClick={() => { act('Reviewed', drawer.id); setDrawer(null); }} />}
          </div>
        ) : null
      }>
        {drawer && (
          <>
            <DrawerSection title="Transaction Summary">
              <DGrid>
                <DF label="TXN ID" value={drawer.id} mono copyable />
                <DF label="Type" value={drawer.type} accent={TXN_TYPE_CLR[drawer.type]} />
                <DF label="Amount" value={drawer.amount} mono accent={drawer.amtRaw > 0 ? 'var(--positive)' : 'var(--negative)'} />
                <DF label="Method" value={drawer.method} />
                <DF label="Reference" value={drawer.reference} mono copyable />
                <DF label="Status" value={drawer.status} accent={STATUS_CLR[drawer.status]} />
                <DF label="Timestamp" value={drawer.ts} mono wide />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="User Context">
              <DGrid>
                <DF label="User" value={drawer.user.name} copyable />
                <DF label="UID" value={drawer.user.uid} mono copyable />
                <DF label="Email" value={drawer.user.email} mono wide />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="Ledger Mapping">
              <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-4 py-3 space-y-2">
                {[
                  { label: 'Debit Account', val: drawer.amtRaw > 0 ? 'External Gateway' : 'User Wallet' },
                  { label: 'Credit Account', val: drawer.amtRaw > 0 ? 'User Wallet' : 'External Gateway' },
                  { label: 'Ledger Entry', val: `${drawer.reference} · ${drawer.ts}` },
                  { label: 'Settled', val: drawer.status === 'SETTLED' ? 'Yes' : 'No' },
                ].map(l => (
                  <div key={l.label} className="flex justify-between text-[11.5px]">
                    <span className="text-text-muted/45 font-heading">{l.label}</span>
                    <span className="font-heading font-semibold text-text/70">{l.val}</span>
                  </div>
                ))}
              </div>
            </DrawerSection>
            <DrawerSection title="Audit Trail" collapsible>
              <DrawerAuditTrail entries={[
                { action: 'Transaction created', by: 'System', ts: drawer.ts, note: `Source: ${drawer.method}` },
                { action: 'Ledger entry recorded', by: 'System', ts: drawer.ts, note: null },
                { action: 'Settlement processed', by: 'System', ts: drawer.ts, note: drawer.status === 'SETTLED' ? 'Settled successfully' : null },
              ]} />
            </DrawerSection>
          </>
        )}
      </FinanceDrawer>
    </div>
  );
}

export { TransactionsPage };
