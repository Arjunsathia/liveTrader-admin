import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Download, Users, BarChart2, BarChart3 } from 'lucide-react';
import { statsKpis, appTrend, challengeStats } from '../data/workspaces/statistics.workspace';
import { completionTrend } from '../data/workspaces/overview.workspace';
import { SectionHead, Card, IconBtn, CustomTooltip } from '../components/PropTradingShared';
import { PropStatsCards } from '../components/PropStatsCards';
import { FeatureTable } from '../../../components/tables/FeatureTable';

const perfCols = [
  { key: 'name',    label: 'Challenge',    render: (v) => <span className="font-heading font-semibold text-text/75">{v}</span> },
  { key: 'apps',    label: 'Applications', render: (v) => <span className="font-mono text-text-muted/60">{v.toLocaleString()}</span> },
  { key: 'pass',    label: 'Pass Rate',    render: (v) => (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/[0.05]">
        <div className="h-full rounded-full bg-positive" style={{ width: `${v}%` }} />
      </div>
      <span className="font-mono font-bold text-positive">{v}%</span>
    </div>
  )},
  { key: 'fail',    label: 'Fail Rate',    render: (v) => <span className="font-mono text-negative">{v}%</span> },
  { key: 'funded',  label: 'Funded',       render: (v) => <span className="font-mono text-brand font-bold">{v}</span> },
  { key: 'revenue', label: 'Revenue',      render: (v) => <span className="font-mono font-bold text-text/70">{v}</span> },
  { key: 'avgDays', label: 'Avg. Days',    render: (_, r, i) => <span className="font-mono text-text-muted/50">~{12 + (i ?? 0) * 1}d</span> },
];

export function StatisticsScreen() {
  const [period, setPeriod] = useState('3M');

  // Inject index for avgDays fake metric calculation map over rows
  const rankedStats = challengeStats.map((r, i) => ({ ...r, _idx: i }));
  // Override render to use _idx
  const cols = perfCols.map(c => 
    c.key === 'avgDays' 
    ? { ...c, render: (_, r) => <span className="font-mono text-text-muted/50">~{12 + r._idx * 1}d</span> }
    : c
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {['1M', '3M', '6M', '1Y', 'ALL'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 h-8 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all duration-150 border
                ${period === p ? 'bg-primary/[0.12] text-primary border-primary/20' : 'border-border/10 text-text-muted/40 hover:text-text-muted bg-transparent'}`}>
              {p}
            </button>
          ))}
        </div>
        <IconBtn label="Export Report" Icon={Download} variant="default" />
      </div>

      <PropStatsCards kpis={statsKpis} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <SectionHead title="Applications vs Funded Traders" Icon={Users} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appTrend}>
                <defs>
                  <linearGradient id="appG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fundG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="apps" stroke="var(--cyan)" strokeWidth={2} fill="url(#appG)" />
                <Area type="monotone" dataKey="funded" stroke="var(--positive)" strokeWidth={2} fill="url(#fundG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1">
            {[['Applications', 'var(--cyan)'], ['Funded', 'var(--positive)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHead title="Pass / Fail Rate Over Time" Icon={BarChart2} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={28} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="pass" stroke="var(--positive)" strokeWidth={2} dot={{ r: 3, fill: 'var(--positive)' }} />
                <Line type="monotone" dataKey="fail" stroke="var(--negative)" strokeWidth={2} dot={{ r: 3, fill: 'var(--negative)' }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card pad={false}>
        <div className="px-5 py-4 border-b border-border/25">
          <SectionHead title="Challenge Performance Breakdown" Icon={BarChart3} />
        </div>
        <FeatureTable cols={cols} rows={rankedStats} rowKey="name" />
      </Card>
    </div>
  );
}
