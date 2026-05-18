/**
 * finance/pages/WithdrawalsPage.jsx
 */
import React, { useState, useMemo } from 'react';
import { AlertOctagon, ArrowUpRight, CheckCircle2, Clock, Download, Lock, Play, ShieldAlert, TrendingDown, XCircle } from 'lucide-react';
import { withdrawalsData } from '../data/financeMockData';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, SummaryPills, Toast } from '../components/FinanceShared';
import { FinanceTable, FinanceToolbar, FilterRow, UserCell, QuickActions, FinanceRecordDrawer, Pagination } from '../components/FinanceDrawer';
import { Card } from '../../../components/ui/Card';

function WithdrawalsPage() {
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
    let r = [...withdrawalsData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) r = r.filter(x => x.id.includes(search) || x.user.name.toLowerCase().includes(search.toLowerCase()) || x.user.uid.includes(search));
    return r;
  }, [search, statusF, methodF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const vol24 = withdrawalsData.filter(d => d.status === 'PAID').reduce((s, d) => s + d.amtRaw, 0);

  const kpis = [
    { label: 'Total Withdrawals', value: withdrawalsData.length, Icon: ArrowUpRight, accent: 'var(--cyan)', sub: 'All time' },
    { label: 'Pending Review', value: withdrawalsData.filter(d => d.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting action' },
    { label: 'Approved Today', value: withdrawalsData.filter(d => d.status === 'PAID').length, Icon: CheckCircle2, accent: 'var(--positive)', sub: 'Paid out successfully' },
    { label: 'Frozen/Rejected', value: withdrawalsData.filter(d => ['FROZEN', 'REJECTED'].includes(d.status)).length, Icon: Lock, accent: 'var(--negative)', sub: 'Blocked withdrawals', urgent: true },
    { label: 'Flagged', value: withdrawalsData.filter(d => d.status === 'FLAGGED').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'AML / sanctions hold', urgent: true },
    { label: '24h Volume', value: `$${(vol24 / 1000).toFixed(1)}K`, Icon: TrendingDown, accent: 'var(--brand)', sub: 'Gross payout volume' },
  ];

  const cols = [
    { key: 'id', label: 'WDR ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'user', label: 'User', render: v => <UserCell u={v} /> },
    { key: 'amount', label: 'Amount', render: v => <AmountCell value={`-${v}`} type="WITHDRAWAL" /> },
    { key: 'destination', label: 'Destination', render: v => <span className="font-mono text-text-muted/55 text-[10.5px] max-w-[160px] block truncate">{v}</span> },
    { key: 'method', label: 'Method', render: v => <MethodBadge value={v} /> },
    { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
    { key: 'risk', label: 'Risk', render: v => <RiskBadge value={v} /> },
    { key: 'compliance', label: 'Compliance', render: v => <span className="text-[10.5px] font-bold font-heading" style={{ color: v === 'PASS' ? 'var(--positive)' : v === 'FAIL' ? 'var(--negative)' : 'var(--warning)' }}>{v}</span> },
    { key: 'aml', label: 'AML', render: v => <span className="text-[10.5px] font-bold font-heading" style={{ color: v === 'CLEAR' ? 'var(--positive)' : v === 'FLAG' ? 'var(--negative)' : 'var(--warning)' }}>{v}</span> },
    { key: 'created', label: 'Created', render: v => <span className="font-mono text-text-muted/40 text-[10px]">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <QuickActions row={r}
          onApprove={() => act('Approved', r.id)}
          onReject={() => act('Rejected', r.id)}
          onFlag={() => act('Flagged', r.id)} />
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">{kpis.map(k => <KpiCard key={k.label}{...k} />)}</div>

      {withdrawalsData.filter(d => d.aml === 'FLAG').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.04] px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">{withdrawalsData.filter(d => d.aml === 'FLAG').length} Withdrawals with AML Flag â€” Manual Review Required</div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">Funds are frozen pending compliance clearance. Do not release without MLRO sign-off.</div>
          </div>
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <FinanceToolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'PENDING', 'PROCESSING', 'PAID', 'FROZEN', 'FLAGGED', 'REJECTED']}
            activeFilter={statusF} setFilter={v => { setStatusF(v); setPage(1); }}
            actions={[
              { label: 'Export', Icon: Download, onClick: () => act('Exported', 'withdrawals') },
              { label: 'Batch Process', Icon: Play, primary: true, onClick: () => act('Batch', 'initiated') },
            ]}
            extra={
              <>
                <SummaryPills items={[
                  { label: 'Pending', val: withdrawalsData.filter(d => d.status === 'PENDING').length, color: 'var(--warning)' },
                  { label: 'Processing', val: withdrawalsData.filter(d => d.status === 'PROCESSING').length, color: 'var(--cyan)' },
                  { label: 'Paid', val: withdrawalsData.filter(d => d.status === 'PAID').length, color: 'var(--positive)' },
                  { label: 'Frozen', val: withdrawalsData.filter(d => d.status === 'FROZEN').length, color: 'var(--negative)' },
                  { label: 'Flagged', val: withdrawalsData.filter(d => d.status === 'FLAGGED').length, color: 'var(--negative)' },
                  { label: 'Rejected', val: withdrawalsData.filter(d => d.status === 'REJECTED').length, color: 'var(--negative)' },
                ]} />
                <FilterRow filters={[
                  { label: 'Method', value: methodF, set: setMethodF, options: ['ALL', 'Bank Wire', 'Crypto', 'E-Wallet'] },
                  { label: 'Risk', value: riskF, set: setRiskF, options: ['ALL', 'LOW', 'MEDIUM', 'HIGH'] },
                ]} />
              </>
            }
          />
        </div>
        <FinanceTable cols={cols} rows={paged} onRow={r => setDrawer(r)}
          footer={<Pagination total={filtered.length} page={page} perPage={PER} setPage={setPage} />} />
      </Card>
      <FinanceRecordDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} type="Withdrawal" onAction={act} />
    </div>
  );
}

export { WithdrawalsPage };
