import React from 'react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

export function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (k, v) => v;
  return (
    <div className="rounded-[10px] border border-border/20 shadow-xl px-3 py-2.5 text-[11px] font-mono" style={{ background: 'var(--bg)' }}>
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 mb-1.5 font-heading">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/60 capitalize">{String(p.dataKey).replace(/_/g, ' ')}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>{fmt(p.dataKey, p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function ActivityBarChart({ data }) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}:00`} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip content={<ChartTip />} />
          <Bar dataKey="generated" fill="var(--brand)" radius={[3, 3, 0, 0]} opacity={0.8} />
          <Bar dataKey="failed" fill="var(--negative)" radius={[3, 3, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeliveryAreaChart({ data }) {
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sucG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<ChartTip />} />
          <Area type="monotone" dataKey="success" stroke="var(--positive)" strokeWidth={2} fill="url(#sucG)" />
          <Area type="monotone" dataKey="failed" stroke="var(--negative)" strokeWidth={2} fill="none" strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TypePieChart({ data }) {
  return (
    <div className="h-[150px] w-[150px] flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
            {data.map((t, i) => <Cell key={i} fill={t.color} />)}
          </Pie>
          <Tooltip content={({ active, payload }) => active && payload?.length ? (
            <div className="rounded-[8px] border border-border/20 px-3 py-2 text-[11px] font-mono shadow-xl" style={{ background: 'var(--bg)' }}>
              <div className="font-bold" style={{ color: payload[0].payload.color }}>{payload[0].name}</div>
              <div className="text-text-muted/60">{payload[0].value}% of reports</div>
            </div>
          ) : null} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
