/**
 * finance/pages/FailedPaymentsPage.jsx
 */
import React, { useState, useMemo } from 'react';
import { AlertCircle, ArrowUpRight, Check, CheckCircle2, Download, FileText, Globe, MessageSquare, PackageX, RefreshCw, ShieldX, User, XCircle } from 'lucide-react';
import { failedPaymentsData, STATUS_CLR, SEV_CLR } from '../data/financeMockData';
import { KpiCard, StatusBadge, MethodBadge, SummaryPills, Toast } from '../components/FinanceShared';
import { FinanceTable, FinanceToolbar, FilterRow, UserCell, FinanceDrawer, DrawerSection, DF, DGrid, DrawerAuditTrail, DrawerNoteEditor, IconBtn, Pagination } from '../components/FinanceDrawer';
import { Card } from '../../../components/ui/Card';

function FailedPaymentsPage() {
  const [search, setSearch] = useState('');
  const [providerF, setProviderF] = useState('ALL');
  const [sevF, setSevF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...failedPaymentsData];
    if (providerF !== 'ALL') r = r.filter(x => x.provider === providerF);
    if (sevF !== 'ALL') r = r.filter(x => x.severity === sevF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (search) r = r.filter(x => x.id.includes(search) || x.user.name.toLowerCase().includes(search.toLowerCase()) || x.reason.includes(search) || x.code.includes(search));
    return r;
  }, [search, providerF, sevF, statusF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);

  const kpis = [
    { label: 'Total Failed', value: failedPaymentsData.length, Icon: PackageX, accent: 'var(--negative)', sub: 'Payment failures' },
    { label: 'Retry Queue', value: failedPaymentsData.filter(f => f.status === 'RETRY').length, Icon: RefreshCw, accent: 'var(--warning)', sub: 'Scheduled for retry' },
    { label: 'Hard Failures', value: failedPaymentsData.filter(f => f.severity === 'CRITICAL').length, Icon: XCircle, accent: 'var(--negative)', sub: 'No retry possible', urgent: true },
    { label: 'Provider Errors', value: failedPaymentsData.filter(f => ['SWIFT', 'Fireblocks'].includes(f.provider)).length, Icon: Globe, accent: 'var(--warning)', sub: '3rd-party failures' },
    { label: 'AML Blocks', value: failedPaymentsData.filter(f => f.reason.includes('AML') || f.reason.includes('BLACKLIST')).length, Icon: ShieldX, accent: 'var(--negative)', sub: 'Compliance-related', urgent: true },
    { label: 'Unresolved', value: failedPaymentsData.filter(f => f.status === 'UNRESOLVED').length, Icon: AlertCircle, accent: 'var(--negative)', sub: 'Need manual resolution', urgent: true },
  ];

  const SEV_COLORS_MAP = { LOW: 'var(--positive)', MEDIUM: 'var(--warning)', HIGH: 'var(--negative)', CRITICAL: 'var(--negative)' };

  const cols = [
    { key: 'id', label: 'Record ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'user', label: 'User', render: v => <UserCell u={v} /> },
    { key: 'method', label: 'Method', render: v => <MethodBadge value={v} /> },
    { key: 'provider', label: 'Provider', render: v => <code className="font-mono text-[10.5px] text-cyan bg-cyan/[0.07] border border-cyan/[0.15] px-1.5 py-0.5 rounded-[4px]">{v}</code> },
    { key: 'reason', label: 'Failure Reason', render: v => <span className="text-[10.5px] font-mono text-text/60">{v.replace(/_/g, ' ')}</span> },
    { key: 'code', label: 'Code', render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    {
      key: 'severity', label: 'Severity', render: v => <span className="text-[9.5px] font-black uppercase tracking-[0.09em] font-heading px-2 py-[3px] rounded-[5px]"
        style={{ color: SEV_COLORS_MAP[v], background: `color-mix(in srgb, ${SEV_COLORS_MAP[v]} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${SEV_COLORS_MAP[v]} 22%, transparent)` }}>{v}</span>
    },
    { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
    { key: 'retries', label: 'Retries', render: v => <span className={`font-mono font-bold text-[11.5px] ${v > 0 ? 'text-warning' : 'text-text-muted/40'}`}>{v > 0 ? `${v}Ã—` : 'â€”'}</span> },
    { key: 'created', label: 'Created', render: v => <span className="font-mono text-text-muted/40 text-[10px]">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {r.status !== 'RESOLVED' && <>
            <button onClick={e => { e.stopPropagation(); act('Retried', r.id); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/[0.07] text-cyan flex items-center justify-center cursor-pointer hover:brightness-110" title="Retry"><RefreshCw size={10} /></button>
            <button onClick={e => { e.stopPropagation(); act('Resolved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110" title="Mark Resolved"><Check size={10} /></button>
          </>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">{kpis.map(k => <KpiCard key={k.label}{...k} />)}</div>

      {failedPaymentsData.filter(f => f.severity === 'CRITICAL').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.04] px-4 py-3">
          <ShieldX size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">{failedPaymentsData.filter(f => f.severity === 'CRITICAL').length} Critical Payment Failures â€” Manual Intervention Required</div>
            <div className="text-[12px] font-bold text-negative font-heading">{failedPaymentsData.filter(f => f.severity === 'CRITICAL').length} Critical Payment Failures — Manual Intervention Required</div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">These cannot be retried automatically. MLRO or Finance lead sign-off needed.</div>
          </div>
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <FinanceToolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'UNRESOLVED', 'RETRY', 'RESOLVED']}
            activeFilter={statusF} setFilter={v => { setStatusF(v); setPage(1); }}
            actions={[
              { label: 'Retry All', Icon: RefreshCw, onClick: () => act('Bulk retry', 'initiated') },
              { label: 'Export', Icon: Download, onClick: () => act('Exported', 'failures') },
            ]}
            extra={
              <>
                <SummaryPills items={[
                  { label: 'Unresolved', val: failedPaymentsData.filter(f => f.status === 'UNRESOLVED').length, color: 'var(--negative)' },
                  { label: 'Retry', val: failedPaymentsData.filter(f => f.status === 'RETRY').length, color: 'var(--warning)' },
                  { label: 'Resolved', val: failedPaymentsData.filter(f => f.status === 'RESOLVED').length, color: 'var(--positive)' },
                  { label: 'Critical', val: failedPaymentsData.filter(f => f.severity === 'CRITICAL').length, color: 'var(--negative)' },
                ]} />
                <FilterRow filters={[
                  { label: 'Provider', value: providerF, set: setProviderF, options: ['ALL', 'SWIFT', 'Stripe', 'Fireblocks', 'Skrill', 'Adyen', 'SEPA', 'Neteller'] },
                  { label: 'Severity', value: sevF, set: setSevF, options: ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                ]} />
              </>
            }
          />
        </div>
        <FinanceTable cols={cols} rows={paged} onRow={r => setDrawer(r)}
          footer={<Pagination total={filtered.length} page={page} perPage={PER} setPage={setPage} />} />
      </Card>

      {/* Failed payment drawer */}
      <FinanceDrawer open={!!drawer} onClose={() => setDrawer(null)} title={`Failed Payment — ${drawer?.id}`} subtitle="Review failure context, gateway logs, and error resolution options." footer={
        drawer ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            {drawer.status !== 'RESOLVED' && <>
              <IconBtn label="Retry Now" Icon={RefreshCw} variant="warning" onClick={() => { act('Retried', drawer.id); setDrawer(null); }} />
              <IconBtn label="Mark Resolved" Icon={CheckCircle2} variant="success" onClick={() => { act('Resolved', drawer.id); setDrawer(null); }} />
            </>}
            <IconBtn label="Escalate" Icon={ArrowUpRight} variant="orange" onClick={() => act('Escalated', drawer.id)} />
            <IconBtn label="Export Report" Icon={Download} variant="default" onClick={() => act('Exported', drawer.id)} />
          </div>
        ) : null
      }>
        {drawer && (
          <>
            <div className="rounded-[12px] border border-negative/20 bg-negative/[0.05] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldX size={14} className="text-negative" />
                <span className="text-[13px] font-bold font-heading text-negative">Payment Failure Report</span>
              </div>
              <div className="text-[11.5px] text-negative/70 font-heading">Provider: <strong>{drawer.provider}</strong> · Code: <strong>{drawer.code}</strong></div>
              <div className="text-[11.5px] text-negative/70 font-heading mt-1">Reason: {drawer.reason.replace(/_/g, ' ')}</div>
            </div>
            <DrawerSection title="Record Details">
              <DGrid>
                <DF label="Record ID" value={drawer.id} mono copyable />
                <DF label="Provider" value={drawer.provider} mono />
                <DF label="Method" value={drawer.method} />
                <DF label="Error Code" value={drawer.code} mono copyable />
                <DF label="Severity" value={drawer.severity} accent={SEV_COLORS_MAP[drawer.severity]} />
                <DF label="Status" value={drawer.status} accent={STATUS_CLR[drawer.status]} />
                <DF label="Retries" value={drawer.retries} mono />
                <DF label="Created" value={drawer.created} mono />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="User Context">
              <DGrid>
                <DF label="User" value={drawer.user.name} copyable />
                <DF label="UID" value={drawer.user.uid} mono copyable />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="Retry History" collapsible>
              <DrawerAuditTrail entries={Array.from({ length: drawer.retries || 0 }, (_, i) => ({
                action: `Retry attempt ${i + 1}`,
                by: 'PaymentEngine',
                ts: drawer.created,
                note: `Result: FAILED — ${drawer.reason.replace(/_/g, ' ')}`,
              })).concat([{ action: 'Initial failure recorded', by: 'PaymentGateway', ts: drawer.created, note: `Code: ${drawer.code}` }]).reverse()} />
            </DrawerSection>
            <DrawerSection title="Notes" collapsible>
              <DrawerNoteEditor onSave={n => act('Note saved', drawer.id)} />
            </DrawerSection>
          </>
        )}
      </FinanceDrawer>
    </div>
  );
}

export { FailedPaymentsPage };

