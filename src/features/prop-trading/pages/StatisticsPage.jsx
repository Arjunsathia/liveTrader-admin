import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Download, Users, BarChart2, BarChart3 } from 'lucide-react';
import { statsKpis, appTrend, challengeStats } from '../configs/statistics.config';
import { completionTrend } from '../configs/overview.config';
import { SectionHead, Card, IconBtn, CustomTooltip } from '../components/PropShared';
import { PropStatsCards } from '../components/PropStatsCards';

export function StatisticsPage() {
  const [period, setPeriod] = useState('3M');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {['1M', '3M', '6M', '1Y', 'ALL'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 h-8 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all duration-150 border
                ${period === p ? 'bg-primary/[0.12] text-primary border-primary/20' : 'border-white/[0.06] text-text-muted/40 hover:text-text-muted bg-transparent'}`}>
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
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <SectionHead title="Challenge Performance Breakdown" Icon={BarChart3} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Challenge', 'Applications', 'Pass Rate', 'Fail Rate', 'Funded', 'Revenue', 'Avg. Days'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/30 font-heading whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {challengeStats.map(r => (
                <tr key={r.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-heading font-semibold text-text/75">{r.name}</td>
                  <td className="px-5 py-3 font-mono text-text-muted/60">{r.apps.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/[0.05]">
                        <div className="h-full rounded-full bg-positive" style={{ width: `${r.pass}%` }} />
                      </div>
                      <span className="font-mono font-bold text-positive">{r.pass}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-negative">{r.fail}%</td>
                  <td className="px-5 py-3 font-mono text-brand font-bold">{r.funded}</td>
                  <td className="px-5 py-3 font-mono font-bold text-text/70">{r.revenue}</td>
                  <td className="px-5 py-3 font-mono text-text-muted/50">~{12 + challengeStats.indexOf(r) * 1}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
