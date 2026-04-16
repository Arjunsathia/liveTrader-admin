import React, { useState } from 'react';
import {
  AlertOctagon, BadgePercent, CheckCircle2, CircleDollarSign,
  Download, GitBranch, ShieldAlert, Trophy, UserPlus, Wallet, Zap,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KpiCard } from '../../../components/cards/KpiCard';
import {
  overviewKpis, referralGrowth, commissionTrend, topPartners, payoutAlerts,
} from '../configs/overview.config';
import { IBCard, IBBadge, IBRiskBadge, IBTierBadge, SectionHead, IBChartTip, TraderAvatar, IBToast, IBIconBtn } from '../components/IBShared';

export function IBOverviewPage() {
  const [toast, setToast] = useState(null);
  const act = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="space-y-5">
      <IBToast msg={toast} />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {overviewKpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <IBCard>
          <SectionHead title="Referral Growth" Icon={UserPlus} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={referralGrowth}>
                <defs>
                  <linearGradient id="ibRefG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--brand)"    stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--brand)"    stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ibActG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--positive)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={38} />
                <Tooltip content={<IBChartTip />} />
                <Area type="monotone" dataKey="referrals" stroke="var(--brand)"    strokeWidth={2} fill="url(#ibRefG)" />
                <Area type="monotone" dataKey="active"    stroke="var(--positive)" strokeWidth={2} fill="url(#ibActG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Total Referrals', 'var(--brand)'], ['Active Users', 'var(--positive)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </IBCard>

        <IBCard>
          <SectionHead title="Commission Trend" Icon={CircleDollarSign} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionTrend} barCategoryGap="32%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={44} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip content={<IBChartTip />} />
                <Bar dataKey="approved" fill="rgba(218,165,32,0.65)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pending"  fill="rgba(217,119,6,0.45)"  radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Approved', 'var(--brand)'], ['Pending', 'var(--warning)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </IBCard>
      </div>

      {/* Top IB Partners + Payout Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <IBCard pad={false}>
          <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
            <SectionHead title="Top IB Partners" Icon={Trophy} />
            <button className="text-[10px] text-primary font-bold hover:underline cursor-pointer font-heading">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border/20">
                  {['#', 'Partner', 'Region', 'Referrals', 'Revenue', 'Tier', 'Growth'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/50 font-heading bg-bg/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topPartners.map((p, i) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-bg/60 transition-colors last:border-0">
                    <td className="px-5 py-3">
                      <span className={`text-[13px] font-black font-heading ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-text-muted/30'}`}>#{i + 1}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <TraderAvatar name={p.name} />
                        <div>
                          <div className="text-[12px] font-semibold font-heading text-text/80">{p.name}</div>
                          <div className="text-[10px] font-mono text-text-muted/40">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-text-muted/50 font-heading">{p.region}</td>
                    <td className="px-5 py-3 font-mono text-brand font-bold">{p.referrals?.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono font-bold text-text/75">{p.revenue}</td>
                    <td className="px-5 py-3"><IBTierBadge value={p.tier} /></td>
                    <td className="px-5 py-3">
                      <span className={`font-mono font-bold text-[11px] ${p.trend.startsWith('+') ? 'text-positive' : 'text-negative'}`}>{p.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </IBCard>

        <IBCard>
          <SectionHead title="Payout Alerts" Icon={AlertOctagon}
            action={<span className="text-[10px] font-black text-negative font-heading">{payoutAlerts.filter(a => a.urgent).length} urgent</span>}
          />
          <div className="space-y-2">
            {payoutAlerts.map(a => (
              <div key={a.id}
                className={`flex items-center gap-3 rounded-[9px] border px-3 py-2.5 hover:brightness-105 transition-all cursor-pointer
                  ${a.urgent ? 'border-negative/[0.25] bg-negative/[0.06]' : 'border-border/25 bg-bg/50'}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.urgent ? 'bg-negative animate-pulse' : 'bg-positive'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-semibold text-text/80 font-heading truncate">{a.partner}</div>
                  <div className="text-[10px] font-mono text-text-muted/40">{a.id} · {a.ts}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-mono font-bold text-[12px] text-brand">{a.amount}</span>
                  <IBRiskBadge value={a.risk} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border/25">
            <IBIconBtn label="Process All Pending" Icon={CheckCircle2} variant="success" small onClick={() => act('Batch approved')} />
            <IBIconBtn label="Risk Review"         Icon={ShieldAlert}  variant="warning" small onClick={() => act('Risk queue opened')} />
          </div>
        </IBCard>
      </div>

      {/* Quick Actions */}
      <IBCard>
        <SectionHead title="Quick Actions" Icon={Zap} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Add IB Partner',         Icon: UserPlus,     variant: 'brand'   },
            { label: 'Bulk Payout Batch',       Icon: Wallet,       variant: 'success' },
            { label: 'Export Commission Rep.',  Icon: Download,     variant: 'default' },
            { label: 'Risk Review Queue',       Icon: AlertOctagon, variant: 'warning' },
            { label: 'Tier Adjustment',         Icon: BadgePercent, variant: 'cyan'    },
            { label: 'Partner Network Map',     Icon: GitBranch,    variant: 'default' },
          ].map(a => <IBIconBtn key={a.label} {...a} onClick={() => act(a.label)} />)}
        </div>
      </IBCard>
    </div>
  );
}
