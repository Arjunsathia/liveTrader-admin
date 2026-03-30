import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Activity,
  History,
  ShieldAlert,
  Wallet,
  Users,
  BarChart3,
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// UI Components
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';

const revenueData = [
  { name: '00:00', value: 45000 },
  { name: '04:00', value: 52000 },
  { name: '08:00', value: 48000 },
  { name: '12:00', value: 61000 },
  { name: '16:00', value: 55000 },
  { name: '20:00', value: 67000 },
  { name: '23:59', value: 72000 },
];

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-2">
      {/* KPI Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Platform Equity" value="$241.4M" subtext="+2.4% avg exposure" trend="up" icon={Wallet} />
        <StatCard label="KYC Backlog" value="154" subtext="URGENT: >24h delay" trend="warning" icon={ShieldAlert} />
        <StatCard label="Pending Withdrawals" value="$38,200" subtext="12 requests pending" trend="down" icon={ArrowDownRight} />
        <StatCard label="24h Volume (Lots)" value="12,842.5" subtext="+15.2k vs yesterday" trend="up" icon={BarChart3} />
        <StatCard label="Live Connections" value="8,402" subtext="42 onboarding today" trend="up" icon={Users} />
      </div>

      {/* Insight Section */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Main Chart Analytics */}
        <div className="col-span-12 lg:col-span-8">
          <Card 
            title="Revenue Analytics" 
            subtitle="Liquidity Flow & Volume" 
            actions={
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">1H</Button>
                <Button size="sm" variant="secondary">1D</Button>
                <Button size="sm" variant="ghost">1W</Button>
              </div>
            }
          >
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} fontFamily='monospace' />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} fontFamily='monospace' />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px', fontFamily: 'Manrope, sans-serif', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                    itemStyle={{ color: 'var(--brand)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--brand)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Operational Priority */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <Card title="System Priority" subtitle="Active Tasks" actions={<Badge variant="danger" dot>4 critical</Badge>}>
            <div className="flex flex-col gap-4 mt-2">
              {[
                { type: 'danger', icon: AlertTriangle, title: 'KYC Backlog: 154 users > 24h', msg: 'Verification queue latency exceeding SLA.' },
                { type: 'info', icon: Zap, title: 'LMAX Liquidity: Nominal', msg: 'Average latency: 14.2ms.' },
                { type: 'warning', icon: Wallet, title: 'Large Withdrawal: $15,000', msg: 'Multiple risk flags detected for UID #90211.' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-[8px] bg-white/2 border border-border/40 hover:bg-white/5 transition-all group">
                  <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0
                    ${alert.type === 'danger' ? 'bg-negative/10 text-negative' : alert.type === 'info' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                    <alert.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-text mb-0.5">{alert.title}</p>
                    <p className="text-[11px] text-text-muted leading-tight">{alert.msg}</p>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-2">View Operations Center</Button>
            </div>
          </Card>
        </div>

        {/* Master Trade Stream */}
        <div className="col-span-12">
          <Card title="Live Stream" subtitle="Master Network Activity" padding={false}>
            <Table 
              headers={['Identity', 'Module', 'Operation', 'Asset Details', 'Status', 'Timestamp']}
              data={[
                { user: 'Marco Rossi', uid: '19284', mod: 'Trading', op: 'BUY', asset: 'BTC/USDT @ $64,200', status: 'FILLED', time: '10:42:05' },
                { user: 'Elena Vance', uid: '20112', mod: 'Finance', op: 'DEPOSIT', asset: '$12,000.00 Wire', status: 'PENDING', time: '10:39:12' },
                { user: 'Kofi Arhin', uid: '18552', mod: 'Finance', op: 'WITHDR', asset: '5,000 USDT (ERC20)', status: 'REJECTED', time: '10:35:55' },
                { user: 'Sara Johnson', uid: '21004', mod: 'Trading', op: 'SELL', asset: 'ETH/USDT @ $3,450', status: 'FILLED', time: '10:28:14' },
              ]}
              rowRenderer={(row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-primary font-bold border border-border/40">{row.user[0]}</div>
                      <div>
                        <div className="font-bold text-text">{row.user}</div>
                        <div className="text-[10px] text-text-muted">UID: {row.uid}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted opacity-60">{row.mod}</div></TableCell>
                  <TableCell><Badge variant={row.op === 'BUY' ? 'success' : row.op === 'DEPOSIT' ? 'info' : 'danger'}>{row.op}</Badge></TableCell>
                  <TableCell className="font-medium text-text font-heading">{row.asset}</TableCell>
                  <TableCell><Badge dot variant={row.status === 'FILLED' ? 'success' : row.status === 'PENDING' ? 'info' : 'danger'}>{row.status}</Badge></TableCell>
                  <TableCell className="text-right text-text-muted opacity-40 font-mono italic">{row.time}</TableCell>
                </TableRow>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
