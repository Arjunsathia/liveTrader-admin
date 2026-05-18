import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { SectionHead } from '../../../components/ui/SectionHead';
import { Badge } from '../../../components/ui/Badge';
import { KpiCard } from '../../../components/cards/KpiCard';
import { IconBtn, FORMAT_ICONS, FORMAT_CLR, TYPE_CLR, StatusBadge } from '../components/ReportsShared';
import { ActivityBarChart, DeliveryAreaChart, TypePieChart } from '../components/ReportsCharts';
import {
  overviewKpis, reportActivity, reportTypeSplit, deliveryTrend, recentReports
} from '../data/reportsMockData';
import {
  CheckCircle2, Plus, AlarmClock, Download, RefreshCw, Layers, Send, Clock, BarChart2, PieChart, Zap, FileText
} from 'lucide-react';

export function ReportsOverviewScreen() {
  const [toast, setToast] = useState(null);
  const act = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {overviewKpis.map(k => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            Icon={k.Icon}
            accent={k.color}
            trend={k.trend}
            sub={k.sub}
            trendUp={k.trend?.startsWith('+') ? true : k.trend?.startsWith('-') ? false : undefined}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Report Activity */}
        <Card className="xl:col-span-2">
          <SectionHead title="Report Generation Activity (Today)" Icon={BarChart2} />
          <ActivityBarChart data={reportActivity} />
          <div className="flex gap-4 mt-1">
            {[['Generated', 'var(--brand)'], ['Failed', 'var(--negative)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </Card>

        {/* Type split donut */}
        <Card>
          <SectionHead title="Reports by Type" Icon={PieChart} />
          <div className="flex items-center gap-3">
            <TypePieChart data={reportTypeSplit} />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              {reportTypeSplit.map(t => (
                <div key={t.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  <span className="text-[10px] font-heading text-text-muted/55">{t.name}</span>
                  <span className="text-[10.5px] font-mono font-bold ml-auto" style={{ color: t.color }}>{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Delivery trend + Recent reports */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
        {/* Delivery Success Trend */}
        <Card>
          <SectionHead title="Delivery Success Trend (7 Days)" Icon={Send} />
          <DeliveryAreaChart data={deliveryTrend} />
          <div className="flex gap-4 mt-1">
            {[['Success', 'var(--positive)'], ['Failed (dashed)', 'var(--negative)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <SectionHead title="Recent Reports" Icon={Clock}
            action={<button className="text-[10px] text-primary font-bold hover:underline cursor-pointer font-heading">View all →</button>}
          />
          <div className="space-y-1.5">
            {recentReports.map(r => {
              const FmtIc = FORMAT_ICONS[r.format] || FileText;
              const fmtC = FORMAT_CLR[r.format] || 'var(--text-muted)';
              const typeC = TYPE_CLR[r.type] || 'rgba(255,255,255,0.3)';
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-[9px] border border-border/30 bg-bg/40 px-3 py-2.5 hover:border-border/60 hover:bg-bg/60 transition-all cursor-pointer group">
                  <div className="w-7 h-7 rounded-[7px] flex items-center justify-center border flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${fmtC} 12%, transparent)`, borderColor: `color-mix(in srgb, ${fmtC} 20%, transparent)` }}>
                    <FmtIc size={13} style={{ color: fmtC }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold text-text/90 font-heading truncate">{r.name}</div>
                    <div className="text-[10px] font-mono text-text-muted/50 mt-0.5">{r.id} · {r.generatedAt}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge value={r.status} />
                    <span className="text-[9px] font-bold uppercase font-heading" style={{ color: typeC }}>{r.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <SectionHead title="Quick Actions" Icon={Zap} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Generate Report', Icon: Plus, variant: 'brand' },
            { label: 'Schedule Export', Icon: AlarmClock, variant: 'cyan' },
            { label: 'Download All Ready', Icon: Download, variant: 'success' },
            { label: 'Retry Failed Jobs', Icon: RefreshCw, variant: 'warning' },
            { label: 'Manage Templates', Icon: Layers, variant: 'default' },
            { label: 'Export Center', Icon: Send, variant: 'default' },
          ].map(a => <IconBtn key={a.label} {...a} onClick={() => act(a.label)} />)}
        </div>
      </Card>
    </div>
  );
}
