import React, { useState, useMemo } from 'react';
import { AlertCircle, ArrowUpRight, Check, CheckCircle2, Download, Globe, MessageSquare, PackageX, RefreshCw, ShieldX, User, XCircle, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { failedPaymentsData, STATUS_CLR, SEV_CLR } from '@/config/constants/finance/mockData';
import { KpiCard, StatusBadge, MethodBadge, Toast } from '../components/FinanceComponents';
import { UserCell, FinanceDrawer, DrawerSection, DF, DGrid, DrawerAuditTrail, DrawerNoteEditor, IconBtn, Pagination } from '../components/FinanceDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Finance Operations',
  title: 'Failed Payments',
  description: 'Gateway and provider failures — retry queues, system errors, and manual resolutions.',
};

function FailedPaymentsPage() {
  const [search, setSearch] = useState('');
  const [providerF, setProviderF] = useState('ALL');
  const [sevF, setSevF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [page, setPage] = useState(1);
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...failedPaymentsData];
    if (providerF !== 'ALL') r = r.filter(x => x.provider === providerF);
    if (sevF !== 'ALL') r = r.filter(x => x.severity === sevF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.reason.toLowerCase().includes(q) || 
        x.code.toLowerCase().includes(q)
      );
    }
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

  const SEV_COLORS_MAP = { 
    LOW: 'var(--positive)', 
    MEDIUM: 'var(--warning)', 
    HIGH: 'var(--negative)', 
    CRITICAL: 'var(--negative)' 
  };

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => act('Bulk retry', 'initiated')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={12} /> Retry All
            </button>
            <button
              type="button"
              onClick={() => act('Exported', 'failures')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Download size={12} /> Export Failures
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* Critical Warnings */}
        {failedPaymentsData.filter(f => f.severity === 'CRITICAL').length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <ShieldX size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[12px] font-bold text-negative font-heading">
                {failedPaymentsData.filter(f => f.severity === 'CRITICAL').length} Critical Payment Failures — Manual Intervention Required
              </h4>
              <p className="text-[11px] text-negative/70 font-heading mt-0.5 leading-relaxed">
                These cannot be retried automatically. MLRO or Finance lead sign-off needed.
              </p>
            </div>
          </div>
        )}

        <Toast msg={toast} onDone={() => setToast(null)} />

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">

          {/* Table Header */}
          <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: PAGE.accent }}
              />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                Failed Ledger Records
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border font-mono"
                style={{ color: PAGE.accent, background: `color-mix(in srgb, ${PAGE.accent} 10%, transparent)`, borderColor: `color-mix(in srgb, ${PAGE.accent} 22%, transparent)` }}
              >
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search failed txn…"
                  className="h-7 pl-7 pr-3 w-36 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'UNRESOLVED', 'RETRY', 'RESOLVED'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Provider Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Provider:</span>
                <select
                  value={providerF}
                  onChange={(e) => { setProviderF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'SWIFT', 'Stripe', 'Fireblocks', 'Skrill', 'Adyen', 'SEPA', 'Neteller'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Severity Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Severity:</span>
                <select
                  value={sevF}
                  onChange={(e) => { setSevF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Failure Reason</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Retries</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                      No failed payments found matching filters.
                    </td>
                  </tr>
                ) : (
                  paged.map((row) => {
                    const isCritical = row.severity === 'CRITICAL' || row.severity === 'HIGH';
                    const isMedium = row.severity === 'MEDIUM';

                    return (
                      <tr
                        key={row.id}
                        onClick={() => drawerState.open(row)}
                        className={`group cursor-pointer transition-colors border-l-2 border-transparent ${
                          isCritical
                            ? 'hover:bg-negative/5 hover:border-l-negative'
                            : isMedium
                            ? 'hover:bg-warning/5 hover:border-l-warning'
                            : 'hover:bg-positive/5 hover:border-l-positive'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-brand">{row.id}</td>
                        <td className="px-4 py-3.5"><UserCell u={row.user} /></td>
                        <td className="px-4 py-3.5"><MethodBadge value={row.method} /></td>
                        <td className="px-4 py-3.5">
                          <code className="font-mono text-[10.5px] text-cyan bg-cyan/[0.07] border border-cyan/[0.15] px-1.5 py-0.5 rounded-[4px]">
                            {row.provider}
                          </code>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[11px] font-mono text-text/70">
                            {row.reason.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.code}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-[9.5px] font-black uppercase tracking-[0.09em] font-heading px-2 py-[3px] rounded-[5px]"
                            style={{ 
                              color: SEV_COLORS_MAP[row.severity], 
                              background: `color-mix(in srgb, ${SEV_COLORS_MAP[row.severity]} 10%, transparent)`, 
                              border: `1px solid color-mix(in srgb, ${SEV_COLORS_MAP[row.severity]} 22%, transparent)` 
                            }}
                          >
                            {row.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge value={row.status} /></td>
                        <td className="px-4 py-3.5 font-mono text-[11.5px]">
                          {row.retries > 0 ? (
                            <span className="font-bold text-warning">{row.retries}×</span>
                          ) : (
                            <span className="text-text-muted/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.created}</td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {row.status !== 'RESOLVED' && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); act('Retried', row.id); }} 
                                  className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/[0.07] text-cyan flex items-center justify-center cursor-pointer hover:brightness-110 transition-colors" 
                                  title="Retry"
                                >
                                  <RefreshCw size={10} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); act('Resolved', row.id); }} 
                                  className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110 transition-colors" 
                                  title="Mark Resolved"
                                >
                                  <Check size={10} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border/10">
            <Pagination
              total={filtered.length}
              page={page}
              perPage={PER}
              setPage={setPage}
            />
          </div>
        </section>
      </div>

      {/* Failed Payment Drawer */}
      <FinanceDrawer open={drawerState.isOpen} onClose={() => drawerState.close()} title={`Failed Payment — ${drawerState.value?.id}`} subtitle="Review failure context, gateway logs, and error resolution options." footer={
        drawerState.value ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            {drawerState.value.status !== 'RESOLVED' && <>
              <IconBtn label="Retry Now" Icon={RefreshCw} variant="warning" onClick={() => { act('Retried', drawerState.value.id); drawerState.close(); }} />
              <IconBtn label="Mark Resolved" Icon={CheckCircle2} variant="success" onClick={() => { act('Resolved', drawerState.value.id); drawerState.close(); }} />
            </>}
            <IconBtn label="Escalate" Icon={ArrowUpRight} variant="orange" onClick={() => act('Escalated', drawerState.value.id)} />
            <IconBtn label="Export Report" Icon={Download} variant="default" onClick={() => act('Exported', drawerState.value.id)} />
          </div>
        ) : null
      }>
        {drawerState.value && (
          <>
            <div className="rounded-[12px] border border-negative/20 bg-negative/[0.05] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldX size={14} className="text-negative" />
                <span className="text-[13px] font-bold font-heading text-negative">Payment Failure Report</span>
              </div>
              <div className="text-[11.5px] text-negative/70 font-heading">Provider: <strong>{drawerState.value.provider}</strong> · Code: <strong>{drawerState.value.code}</strong></div>
              <div className="text-[11.5px] text-negative/70 font-heading mt-1">Reason: {drawerState.value.reason.replace(/_/g, ' ')}</div>
            </div>
            <DrawerSection title="Record Details">
              <DGrid>
                <DF label="Record ID" value={drawerState.value.id} mono copyable />
                <DF label="Provider" value={drawerState.value.provider} mono />
                <DF label="Method" value={drawerState.value.method} />
                <DF label="Error Code" value={drawerState.value.code} mono copyable />
                <DF label="Severity" value={drawerState.value.severity} accent={SEV_COLORS_MAP[drawerState.value.severity]} />
                <DF label="Status" value={drawerState.value.status} accent={STATUS_CLR[drawerState.value.status]} />
                <DF label="Retries" value={drawerState.value.retries} mono />
                <DF label="Created" value={drawerState.value.created} mono />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="User Context">
              <DGrid>
                <DF label="User" value={drawerState.value.user.name} copyable />
                <DF label="UID" value={drawerState.value.user.uid} mono copyable />
              </DGrid>
            </DrawerSection>
            <DrawerSection title="Retry History" collapsible>
              <DrawerAuditTrail entries={Array.from({ length: drawerState.value.retries || 0 }, (_, i) => ({
                action: `Retry attempt ${i + 1}`,
                by: 'PaymentEngine',
                ts: drawerState.value.created,
                note: `Result: FAILED — ${drawerState.value.reason.replace(/_/g, ' ')}`,
              })).concat([{ action: 'Initial failure recorded', by: 'PaymentGateway', ts: drawerState.value.created, note: `Code: ${drawerState.value.code}` }]).reverse()} />
            </DrawerSection>
            <DrawerSection title="Notes" collapsible>
              <DrawerNoteEditor onSave={() => act('Note saved', drawerState.value.id)} />
            </DrawerSection>
          </>
        )}
      </FinanceDrawer>
    </PageShell>
  );
}

export default FailedPaymentsPage;
