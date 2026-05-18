/**
 * finance/pages/ApprovalsPage.jsx
 */
import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Check, CheckCircle2, Clock, Copy, Download, Eye, FileText, Lock, MessageSquare, ShieldAlert, Timer, User, X, XCircle, Zap } from 'lucide-react';

import { approvalsData, RISK_CLR } from '../data/financeMockData';
import { KpiCard, StatusBadge, RiskBadge, PriorityBadge, SummaryPills, Toast, IconBtn } from '../components/FinanceShared';
import { FinanceTable, FinanceToolbar, FilterRow, UserCell, FinanceDrawer, DrawerSection, DF, DGrid, DrawerNoteEditor, RiskPanel, Pagination } from '../components/FinanceDrawer';
import { Card } from '../../../components/ui/Card';

function ApprovalsPage() {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [priorityF, setPriorityF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...approvalsData];
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (priorityF !== 'ALL') r = r.filter(x => x.priority === priorityF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (search) r = r.filter(x => x.id.includes(search) || x.user.name.toLowerCase().includes(search.toLowerCase()) || x.rule.includes(search));
    return r;
  }, [search, typeF, riskF, priorityF, statusF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);

  const kpis = [
    { label: 'Pending Approvals', value: approvalsData.filter(a => a.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting decision' },
    { label: 'SLA Breaches', value: approvalsData.filter(a => a.sla < 20 && a.status === 'PENDING').length, Icon: Timer, accent: 'var(--negative)', sub: 'Past SLA threshold', urgent: true },
    { label: 'High Risk', value: approvalsData.filter(a => a.risk === 'HIGH').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'Need compliance sign-off', urgent: true },
    { label: 'Auto-Approved', value: 0, Icon: Zap, accent: 'var(--positive)', sub: 'By rules engine' },
    { label: 'Rejected', value: approvalsData.filter(a => a.status === 'REJECTED').length, Icon: XCircle, accent: 'var(--negative)', sub: 'Declined by reviewer' },
    { label: 'Escalated', value: approvalsData.filter(a => a.status === 'ESCALATED').length, Icon: ArrowUpRight, accent: 'var(--warning)', sub: 'Senior review needed', urgent: true },
  ];

  const SlaBar = ({ pct }) => {
    const color = pct === 0 ? 'var(--negative)' : pct < 30 ? 'var(--warning)' : 'var(--positive)';
    return (
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, pct)}%`, background: color }} />
        </div>
        <span className="text-[9.5px] font-mono flex-shrink-0" style={{ color }}>{pct}%</span>
      </div>
    );
  };

  const cols = [
    { key: 'id', label: 'Record ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'user', label: 'User', render: v => <UserCell u={v} /> },
    { key: 'amount', label: 'Amount', render: v => <span className="font-mono font-bold text-[12.5px] text-brand">{v}</span> },
    { key: 'type', label: 'Type', render: v => <span className="text-[10.5px] font-bold font-heading" style={{ color: v === 'DEPOSIT' ? 'var(--positive)' : 'var(--negative)' }}>{v}</span> },
    { key: 'risk', label: 'Risk', render: v => <RiskBadge value={v} /> },
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge value={v} /> },
    { key: 'rule', label: 'Rule Triggered', render: v => <span className="text-[10px] font-mono text-text-muted/55">{v.replace(/_/g, ' ')}</span> },
    { key: 'reviewer', label: 'Reviewer', render: v => <span className={`text-[11px] font-heading ${v === 'Unassigned' ? 'text-negative font-bold' : 'text-text-muted/55'}`}>{v}</span> },
    { key: 'sla', label: 'SLA', render: v => <SlaBar pct={v} /> },
    { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
    {
      key: '_act', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {r.status === 'PENDING' && <>
            <button onClick={e => { e.stopPropagation(); act('Approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110" title="Approve"><Check size={10} /></button>
            <button onClick={e => { e.stopPropagation(); act('Rejected', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110" title="Reject"><X size={10} /></button>
            <button onClick={e => { e.stopPropagation(); act('Escalated', r.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 flex items-center justify-center text-warning/60 hover:text-warning cursor-pointer" title="Escalate"><ArrowUpRight size={10} /></button>
            <button onClick={e => { e.stopPropagation(); act('Locked', r.id); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer" title="Lock"><Lock size={10} /></button>
          </>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">{kpis.map(k => <KpiCard key={k.label}{...k} />)}</div>

      {approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.04] px-4 py-3">
          <Timer size={14} className="text-negative flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">
              {approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length} Approval{approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length > 1 ? 's' : ''} Approaching SLA Breach
            </div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">Critical and high-risk items require immediate review to maintain SLA compliance.</div>
          </div>
          <IconBtn label="Review Critical" Icon={Eye} variant="danger" small onClick={() => { setPriorityF('CRITICAL'); setStatusF('PENDING'); }} />
        </div>
      )}

      <Toast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <FinanceToolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'ESCALATED']}
            activeFilter={statusF} setFilter={v => { setStatusF(v); setPage(1); }}
            actions={[
              { label: 'Bulk Approve', Icon: CheckCircle2, primary: true, onClick: () => act('Bulk approved', 'eligible items') },
              { label: 'Export', Icon: Download, onClick: () => act('Exported', 'approvals queue') },
            ]}
            extra={
              <>
                <SummaryPills items={[
                  { label: 'Pending', val: approvalsData.filter(a => a.status === 'PENDING').length, color: 'var(--warning)' },
                  { label: 'Approved', val: approvalsData.filter(a => a.status === 'APPROVED').length, color: 'var(--positive)' },
                  { label: 'Rejected', val: approvalsData.filter(a => a.status === 'REJECTED').length, color: 'var(--negative)' },
                  { label: 'Escalated', val: approvalsData.filter(a => a.status === 'ESCALATED').length, color: 'var(--warning)' },
                  { label: 'Critical', val: approvalsData.filter(a => a.priority === 'CRITICAL').length, color: 'var(--negative)' },
                ]} />
                <FilterRow filters={[
                  { label: 'Type', value: typeF, set: setTypeF, options: ['ALL', 'DEPOSIT', 'WITHDRAWAL'] },
                  { label: 'Risk', value: riskF, set: setRiskF, options: ['ALL', 'LOW', 'MEDIUM', 'HIGH'] },
                  { label: 'Priority', value: priorityF, set: setPriorityF, options: ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
                ]} />
              </>
            }
          />
        </div>
        <FinanceTable cols={cols} rows={paged} onRow={r => setDrawer(r)}
          footer={<Pagination total={filtered.length} page={page} perPage={PER} setPage={setPage} />} />
      </Card>

      {/* Approval Drawer */}
      <FinanceDrawer open={!!drawer} onClose={() => setDrawer(null)} title={`Approval — ${drawer?.id}`} subtitle="Review rule triggers, SLA status, and approve or reject the request." footer={
        drawer ? (
          <div className="flex flex-col gap-2 w-full">
            {drawer.status === 'PENDING' && (
              <div className="grid grid-cols-2 gap-2">
                <IconBtn label="Approve" Icon={CheckCircle2} variant="success" onClick={() => { act('Approved', drawer.id); setDrawer(null); }} />
                <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { act('Rejected', drawer.id); setDrawer(null); }} />
                <IconBtn label="Request Info" Icon={MessageSquare} variant="cyan" onClick={() => act('Info requested', drawer.id)} />
                <IconBtn label="Escalate" Icon={ArrowUpRight} variant="orange" onClick={() => { act('Escalated', drawer.id); setDrawer(null); }} />
                <IconBtn label="Lock Record" Icon={Lock} variant="danger" onClick={() => act('Locked', drawer.id)} />
                <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', drawer.id)} />
              </div>
            )}
            {drawer.status !== 'PENDING' && (
              <div className="grid grid-cols-2 gap-2">
                <IconBtn label="Copy ID" Icon={Copy} variant="default" onClick={() => { navigator.clipboard.writeText(drawer.id); act('Copied', drawer.id); }} />
                <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', drawer.id)} />
              </div>
            )}
          </div>
        ) : null
      }>
        {drawer && (
          <>
            {/* Header */}
            <div className="rounded-[12px] border border-white/[0.07] overflow-hidden">
              <div className="px-4 py-3.5 flex items-center justify-between"
                style={{ background: `color-mix(in srgb, ${RISK_CLR[drawer.risk] || 'rgba(255,255,255,0.1)'} 6%, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div className="text-[17px] font-black font-heading text-text">{drawer.amount}</div>
                  <div className="text-[10px] font-mono text-text-muted/40 mt-0.5">{drawer.type} · {drawer.id}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <PriorityBadge value={drawer.priority} />
                  <RiskBadge value={drawer.risk} />
                  <StatusBadge value={drawer.status} />
                </div>
              </div>
            </div>

            <DrawerSection title="Approval Details">
              <DGrid>
                <DF label="Record ID" value={drawer.id} mono copyable />
                <DF label="Type" value={drawer.type} accent={drawer.type === 'DEPOSIT' ? 'var(--positive)' : 'var(--negative)'} />
                <DF label="Amount" value={drawer.amount} mono accent="var(--brand)" />
                <DF label="Reviewer" value={drawer.reviewer} accent={drawer.reviewer === 'Unassigned' ? 'var(--negative)' : undefined} />
                <DF label="Rule" value={drawer.rule.replace(/_/g, ' ')} wide />
                <DF label="Created" value={drawer.created} mono />
                <DF label="SLA" value={`${drawer.sla}% remaining`} mono />
              </DGrid>
            </DrawerSection>

            <DrawerSection title="User Context">
              <DGrid>
                <DF label="User" value={drawer.user.name} copyable />
                <DF label="UID" value={drawer.user.uid} mono copyable />
                <DF label="Email" value={drawer.user.email} mono wide />
              </DGrid>
            </DrawerSection>

            {/* Risk analysis */}
            <DrawerSection title="Risk Analysis">
              <RiskPanel risk={drawer.risk} />
              <div className="mt-2 rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                <div className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/35 mb-1.5 font-heading">Rule Triggered</div>
                <div className="text-[12px] font-mono text-text/70">{drawer.rule.replace(/_/g, ' ')}</div>
              </div>
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

export { ApprovalsPage };
