import React, { useState, useMemo } from 'react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Plus, Pause, Play, PlayCircle, Trash2, Layers, AlertOctagon, AlarmClock, Mail, Clock, FileText, Check, X, Zap, RefreshCw } from 'lucide-react';
import { exportTemplates, exportFailureLog } from '../data/reportsMockData';
import { FormatBadge, TYPE_CLR, FORMAT_ICONS, FORMAT_CLR, TypePill, IconBtn, STATUS_CLR, StatusBadge } from '../components/ReportsShared';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerGrid, DrawerField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';

function TemplateDetailDrawer({ open, tpl, onClose, onAction }) {
  if (!tpl) return null;

  return (
    <AdminDrawer
      open={open}
      title={tpl.name}
      subtitle={tpl.id}
      eyebrow="Export Template"
      width="max-w-[500px]"
      onClose={onClose}
      footer={(
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
             <StatusBadge value={tpl.status} />
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      )}
    >
      <div className="space-y-6">
        <DrawerSection title="Configuration">
          <DrawerGrid>
            <DrawerField label="Type" value={tpl.type} accent={TYPE_CLR[tpl.type]} />
            <DrawerField label="Format" value={tpl.format} accent={FORMAT_CLR[tpl.format]} />
            <DrawerField label="Frequency" value={tpl.freq} />
            <DrawerField label="Last Run" value={tpl.lastRun} mono />
            <DrawerField label="Next Run" value={tpl.nextRun !== '—' ? tpl.nextRun : 'Paused'} mono wide />
          </DrawerGrid>
        </DrawerSection>
        
        <DrawerSection title="Recipients">
          <div className="flex flex-wrap gap-1.5">
            {tpl.recipients.map(r => (
              <div key={r} className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-[6px] border border-border/20 bg-bg/40 text-text-muted/70">
                <Mail size={10} className="text-text-muted/45" />{r}
              </div>
            ))}
          </div>
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-2 gap-2">
            <IconBtn label="Edit Template" Icon={Clock} variant="default" onClick={() => { onAction('Edit opened', tpl.id); onClose(); }} />
            <IconBtn label="Run Now" Icon={PlayCircle} variant="brand" onClick={() => { onAction('Triggered', tpl.id); onClose(); }} />
            <IconBtn label={tpl.status === 'PAUSED' ? 'Resume' : 'Pause'} Icon={tpl.status === 'PAUSED' ? Play : Pause} variant="warning" onClick={() => { onAction(tpl.status === 'PAUSED' ? 'Resumed' : 'Paused', tpl.id); onClose(); }} />
            <IconBtn label="Delete" Icon={Trash2} variant="danger" onClick={() => { onAction('Deleted', tpl.id); onClose(); }} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

export function ExportCenterScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [drawerTpl, setDrawerTpl] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [toast, setToast] = useState(null);
  const [formState, setFormState] = useState({ name: '', type: 'Finance', format: 'PDF', freq: 'Daily', recipients: '' });
  
  const act = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = exportTemplates;
    if (filter !== 'all') {
      if (['ACTIVE', 'PAUSED'].includes(filter)) rows = rows.filter(r => r.status === filter);
      else rows = rows.filter(r => r.type === filter);
    }
    if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, filter]);

  const freqColor = { Hourly: 'var(--negative)', Daily: 'var(--cyan)', Weekly: 'var(--brand)', Monthly: 'var(--text-muted)' };

  return (
    <div className="space-y-5">
      {toast && <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading"><CheckCircle2 size={13} />{toast}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Templates', val: exportTemplates.filter(t => t.status === 'ACTIVE').length, color: 'var(--positive)', Icon: Layers },
          { label: 'Paused Templates', val: exportTemplates.filter(t => t.status === 'PAUSED').length, color: 'var(--warning)', Icon: Pause },
          { label: 'Recent Failures', val: exportFailureLog.length, color: 'var(--negative)', Icon: AlertOctagon },
          { label: 'Next Scheduled', val: '< 1 hour', color: 'var(--cyan)', Icon: AlarmClock },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3 flex items-center gap-3">
            <s.Icon size={16} style={{ color: s.color }} className="opacity-60 flex-shrink-0" />
            <div>
              <div className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">{s.label}</div>
              <div className="text-[17px] font-bold font-heading tracking-[-0.02em] mt-0.5" style={{ color: s.color }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">
        <div className="space-y-4">
          <PageToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search templates…"
            filterSets={[
              { label: 'Filter', get: filter, set: setFilter, opts: ['all', 'ACTIVE', 'PAUSED', 'Finance', 'Trading', 'User', 'System'].map(f => ({value: f, label: f === 'all' ? 'All' : f})) },
            ]}
            actions={[
              { label: 'Run All Now', icon: PlayCircle, variant: 'secondary', onClick: () => act('All active templates triggered') },
              { label: 'New Template', icon: Plus, variant: 'primary', onClick: () => setShowAddDrawer(true) },
            ]}
          />

          <div className="grid grid-cols-1 gap-3">
            {filtered.length > 0 ? filtered.map(tpl => {
              const FmtIc = FORMAT_ICONS[tpl.format] || FileText;
              const fmtColor = FORMAT_CLR[tpl.format] || 'var(--text-muted)';
              const fqColor = freqColor[tpl.freq] || 'var(--text-muted)';
              const isPaused = tpl.status === 'PAUSED';

              return (
                <div key={tpl.id} onClick={() => setDrawerTpl(tpl)}
                  className={`group rounded-[12px] border p-4 cursor-pointer transition-all duration-200 hover:border-primary/20 hover:bg-bg/60
                    ${isPaused ? 'border-border/10 bg-bg/20 opacity-70' : 'border-border/20 bg-bg/30'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-[9px] flex items-center justify-center border flex-shrink-0"
                        style={{ background: `color-mix(in srgb, ${fmtColor} 12%, transparent)`, borderColor: `color-mix(in srgb, ${fmtColor} 20%, transparent)` }}>
                        <FmtIc size={16} style={{ color: fmtColor }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold font-heading text-text tracking-[-0.01em] truncate">{tpl.name}</div>
                        <div className="text-[10px] font-mono text-text-muted/50 mt-0.5">{tpl.id}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                       <StatusBadge value={tpl.status} />
                      <TypePill value={tpl.type} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap text-[10.5px] mb-3">
                    <div className="flex items-center gap-1.5 font-heading font-bold" style={{ color: fqColor }}>
                      <AlarmClock size={10} className="flex-shrink-0" />
                      {tpl.freq}
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted/60 font-heading">
                      <Mail size={10} className="flex-shrink-0" />
                      {tpl.recipients.length} recipient{tpl.recipients.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted/50 font-mono">
                      <Clock size={10} className="flex-shrink-0" />
                      Last: {tpl.lastRun}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tpl.recipients.map(r => (
                      <span key={r} className="text-[9.5px] font-mono px-2 py-0.5 rounded-[4px] border border-border/20 text-text-muted/60 bg-bg/40">{r}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/15">
                    <div className="text-[10px] text-text-muted/40 font-heading">
                      Next: <span className="text-text-muted/60 font-mono">{tpl.nextRun !== '—' ? tpl.nextRun : 'Paused'}</span>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconBtn 
                        label={isPaused ? 'Resume' : 'Pause'} 
                        Icon={isPaused ? Play : Pause} 
                        variant={isPaused ? 'success' : 'warning'} 
                        small 
                        onClick={e => { e.stopPropagation(); act(isPaused ? 'Resumed' : 'Paused'); }} 
                      />
                      <IconBtn 
                        label="Run Now" 
                        Icon={PlayCircle} 
                        variant="brand" 
                        small 
                        onClick={e => { e.stopPropagation(); act('Triggered'); }} 
                      />
                      <button onClick={e => { e.stopPropagation(); act('Deleted'); }}
                        className="flex items-center justify-center w-7 h-7 rounded-[7px] border border-negative/15 text-negative/50 hover:text-negative hover:bg-negative/10 cursor-pointer transition-colors flex-shrink-0">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-20 bg-bg/20 rounded-[12px] border border-dashed border-border/40">
                <Layers size={32} className="text-text-muted/15 mb-4" />
                <div className="text-[14px] font-bold text-text-muted/40 font-heading">No templates found</div>
                <div className="text-[11px] text-text-muted/20 font-heading mt-1">Try adjusting your filters or create a new one</div>
                <Button variant="secondary" className="mt-6" onClick={() => setShowAddDrawer(true)}>Create First Template</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 xl:sticky xl:top-[136px]">
          <Card heading="Export Insights" padding={true}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-[9px] bg-primary/5 border border-primary/10">
                <Zap size={16} className="text-primary" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-text/80 font-heading">Automation Enabled</div>
                  <div className="text-[10px] text-text-muted/50 font-heading">All scheduled jobs are running normally.</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted/35 font-heading">Recent Performance</div>
                {[
                  { label: 'Success Rate', val: '99.2%', trend: '+0.4%' },
                  { label: 'Avg Latency', val: '1.2s', trend: '-0.1s' },
                  { label: 'Total Volume', val: '4.8 GB', trend: '+12%' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-1 border-b border-border/10 last:border-0">
                    <span className="text-[11px] text-text-muted/60 font-heading">{stat.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-text/80">{stat.val}</span>
                      <span className="text-[9px] font-mono text-positive">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="w-full" onClick={() => setShowAddDrawer(true)}>New Template</Button>
            </div>
          </Card>

          <Card heading="Failure History" padding={true} actions={<span className="text-[10px] font-black text-negative font-heading">{exportFailureLog.length} recent</span>}>
            <div className="space-y-2.5">
              {exportFailureLog.map(f => (
                <div key={f.id} className="rounded-[9px] border border-negative/20 bg-negative/5 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-[11.5px] font-bold text-text/80 font-heading">{f.template}</div>
                    <span className="font-mono text-[9.5px] text-text-muted/45 flex-shrink-0">{f.ts.split(' ')[0]}</span>
                  </div>
                  <div className="text-[10.5px] text-negative/80 font-heading leading-snug">{f.reason}</div>
                  <div className="flex gap-1.5 mt-2.5">
                    <IconBtn label="Retry" Icon={RefreshCw} variant="warning" small onClick={() => act('Retried')} />
                    <IconBtn label="Dismiss" Icon={X} variant="default" small onClick={() => act('Dismissed')} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <TemplateDetailDrawer open={!!drawerTpl} tpl={drawerTpl} onClose={() => setDrawerTpl(null)} onAction={act} />
      
      <AdminDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        title="Create Export Template"
        eyebrow="New Automation"
        width="max-w-[480px]"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowAddDrawer(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setShowAddDrawer(false); act(`Template "${formState.name || 'New'}" created`); }}>Create Template</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <DrawerSection title="General Details">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading px-1">Template Name</label>
                <input value={formState.name} onChange={e => setFormState(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Finance Weekly PDF"
                  className="w-full h-11 px-4 rounded-[12px] border border-border/30 bg-bg/40 text-[14px] text-text outline-none placeholder:text-text-muted/30 focus:border-primary/40 focus:bg-bg/60 transition-all font-heading" />
              </div>
              
              <DrawerGrid>
                {[
                  { label: 'Report Type', key: 'type', opts: ['Finance', 'Trading', 'User', 'System'] },
                  { label: 'Export Format', key: 'format', opts: ['PDF', 'XLSX', 'CSV', 'JSON'] },
                  { label: 'Run Frequency', key: 'freq', opts: ['Hourly', 'Daily', 'Weekly', 'Monthly'] },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading px-1">{f.label}</label>
                    <div className="relative group/sel">
                      <select value={formState[f.key]} onChange={e => setFormState(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full h-11 px-4 pr-8 rounded-[12px] border border-border/30 bg-bg/40 text-[13px] text-text outline-none font-heading appearance-none cursor-pointer focus:border-primary/40 focus:bg-bg/60 transition-all">
                        {f.opts.map(o => <option key={o} className="bg-bg text-text">{o}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/30 group-hover/sel:text-text-muted/60 transition-colors">
                        <Clock size={12} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                ))}
              </DrawerGrid>
            </div>
          </DrawerSection>

          <DrawerSection title="Recipients & Delivery">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading px-1">Email Recipients (comma separated)</label>
                <div className="relative group/ipt">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/25 group-focus-within/ipt:text-primary/50 transition-colors" />
                  <input value={formState.recipients} onChange={e => setFormState(p => ({ ...p, recipients: e.target.value }))} placeholder="ops@firm.com, manager@firm.com"
                    className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border/30 bg-bg/40 text-[13px] text-text outline-none placeholder:text-text-muted/30 focus:border-primary/40 focus:bg-bg/60 transition-all font-mono" />
                </div>
              </div>
              <div className="p-4 rounded-[12px] bg-warning/5 border border-warning/10 flex gap-3">
                <AlertOctagon size={16} className="text-warning flex-shrink-0 mt-0.5" />
                <div className="text-[11.5px] text-warning/80 font-heading leading-relaxed">
                  Templates are active immediately upon creation. Ensure recipients are verified to prevent delivery failure.
                </div>
              </div>
            </div>
          </DrawerSection>
        </div>
      </AdminDrawer>
    </div>
  );
}
