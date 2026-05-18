/**
 * finance/pages/DepositsPage.jsx
 */
import React, { useState, useMemo } from 'react';
import { ArrowDownLeft, CheckCircle2, Clock, Download, Plus, ShieldAlert, TrendingUp, XCircle } from 'lucide-react';
import { depositsData } from '../data/financeMockData';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, SummaryPills, Toast } from '../components/FinanceShared';
import { FinanceTable, FinanceToolbar, FilterRow, UserCell, QuickActions, FinanceRecordDrawer, Pagination } from '../components/FinanceDrawer';
import { Card } from '../../../components/ui/Card';

function DepositsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...depositsData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) r = r.filter(x => x.id.includes(search) || x.user.name.toLowerCase().includes(search.toLowerCase()) || x.user.uid.includes(search) || x.user.email.includes(search));
    return r;
  }, [search, statusF, methodF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const vol24 = depositsData.filter(d => d.status !== 'FAILED').reduce((s, d) => s + d.amtRaw, 0);

  const kpis = [
    { label: 'Total Deposits', value: depositsData.length, Icon: ArrowDownLeft, accent: 'var(--cyan)', sub: 'All time' },
    { label: 'Pending Review', value: depositsData.filter(d => d.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting action' },
    { label: 'Approved Today', value: depositsData.filter(d => d.status === 'APPROVED').length, Icon: CheckCircle2, accent: 'var(--positive)', sub: 'Processed successfully' },
    { label: 'Failed', value: depositsData.filter(d => d.status === 'FAILED').length, Icon: XCircle, accent: 'var(--negative)', sub: 'Payment errors' },
    { label: 'Flagged', value: depositsData.filter(d => d.status === 'FLAGGED').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'AML / compliance hold', urgent: true },
    { label: '24h Volume', value: `$${(vol24 / 1000).toFixed(1)}K`, Icon: TrendingUp, accent: 'var(--brand)', sub: 'Gross deposit volume' },
  ];

  const cols = [
    { key: 'id', label: 'Deposit ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'user', label: 'User', render: v => <UserCell u={v} /> },
    { key: 'amount', label: 'Amount', render: (v, r) => <AmountCell value={v} type="DEPOSIT" /> },
    { key: 'method', label: 'Method', render: v => <MethodBadge value={v} /> },
    { key: 'rail', label: 'Rail/Provider', render: v => <span className="text-[10.5px] font-heading border border-white/[0.06] px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{v}</span> },
    { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
    { key: 'risk', label: 'Risk', render: v => <RiskBadge value={v} /> },
    { key: 'created', label: 'Created', render: v => <span className="font-mono text-text-muted/40 text-[10px]">{v}</span> },
    { key: 'reviewedBy', label: 'Reviewed By', render: v => <span className="text-text-muted/50 font-heading">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <QuickActions row={r}
          onApprove={() => { act('Approved', r.id); }}
          onReject={() => { act('Rejected', r.id); }}
          onFlag={() => { act('Flagged', r.id); }} />
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">{kpis.map(k => <KpiCard key={k.label}{...k} />)}</div>

      {depositsData.filter(d => d.status === 'FLAGGED').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.04] px-4 py-3">
          <ShieldAlert size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">{depositsData.filter(d => d.status === 'FLAGGED').length} Deposits Flagged for AML / Compliance Review</div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">Requires compliance team action before funds can be credited to user accounts.</div>
          </div>
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <FinanceToolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'PENDING', 'APPROVED', 'FLAGGED', 'FAILED']}
            activeFilter={statusF} setFilter={v => { setStatusF(v); setPage(1); }}
            actions={[
              { label: 'Export', Icon: Download, onClick: () => act('Exported', 'deposits') },
              { label: 'New Deposit', Icon: Plus, primary: true, onClick: () => act('Manual deposit', 'form opened') },
            ]}
            extra={
              <>
                <SummaryPills items={[
                  { label: 'Total', val: depositsData.length, color: 'var(--text-muted)' },
                  { label: 'Pending', val: depositsData.filter(d => d.status === 'PENDING').length, color: 'var(--warning)' },
                  { label: 'Approved', val: depositsData.filter(d => d.status === 'APPROVED').length, color: 'var(--positive)' },
                  { label: 'Flagged', val: depositsData.filter(d => d.status === 'FLAGGED').length, color: 'var(--negative)' },
                  { label: 'Failed', val: depositsData.filter(d => d.status === 'FAILED').length, color: 'var(--negative)' },
                ]} />
                <FilterRow filters={[
                  { label: 'Method', value: methodF, set: setMethodF, options: ['ALL', 'Bank Wire', 'Card', 'Crypto', 'E-Wallet'] },
                  { label: 'Risk', value: riskF, set: setRiskF, options: ['ALL', 'LOW', 'MEDIUM', 'HIGH'] },
                ]} />
              </>
            }
          />
        </div>
        <FinanceTable cols={cols} rows={paged} onRow={r => setDrawer(r)}
          footer={<Pagination total={filtered.length} page={page} perPage={PER} setPage={setPage} />} />
      </Card>
      <FinanceRecordDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} type="Deposit" onAction={act} />
    </div>
  );
}

export { DepositsPage };
