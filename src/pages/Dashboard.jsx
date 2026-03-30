import React from 'react'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  MoreVertical,
  Activity,
  ShieldCheck,
  Plus,
  History,
  TrendingUp,
  FileText
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

// Mock Data for the chart
const revenueData = [
  { name: '00:00', value: 45000 },
  { name: '04:00', value: 52000 },
  { name: '08:00', value: 48000 },
  { name: '12:00', value: 61000 },
  { name: '16:00', value: 55000 },
  { name: '20:00', value: 67000 },
  { name: '23:59', value: 72000 },
];

const KPICard = ({ label, value, subtext, trend, delay }) => (
  <div className={`bg-surface-elevated border border-border p-5 rounded-[8px] flex flex-col gap-2 transition-all duration-300 hover:translate-y-[-2px] animate-fade-up delay-${delay} relative overflow-hidden group`}>
    <div className="flex justify-between items-start">
       <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">{label}</span>
       <div className={`p-1.5 rounded-[6px] ${
           trend === 'up' ? 'bg-positive/10 text-positive' : 
           trend === 'down' ? 'bg-negative/10 text-negative' : 
           'bg-warning/10 text-warning'
       }`}>
           {trend === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : 
            trend === 'down' ? <ArrowDownRight size={14} strokeWidth={3} /> :
            <AlertTriangle size={14} strokeWidth={3} />}
       </div>
    </div>
    <div className="text-2xl font-heading font-bold text-text tracking-tight price-data">{value}</div>
    <div className={`text-[11px] font-bold ${
        trend === 'up' ? 'text-positive' : 
        trend === 'down' ? 'text-negative' : 
        'text-warning'
    }`}>{subtext}</div>
  </div>
)

const AlertItem = ({ type, message, time }) => {
  const icon = type === 'critical' ? <AlertTriangle size={16} className="text-negative" /> : 
               type === 'warning' ? <Activity size={16} className="text-primary" /> : 
               <ShieldCheck size={16} className="text-positive" />;
  
  return (
    <div className="flex gap-4 p-3 rounded-[8px] bg-white/2 border border-border/40 hover:bg-white/5 transition-colors group">
       <div className="mt-1 shrink-0">{icon}</div>
       <div className="flex-1">
          <p className="text-[13px] font-bold text-text tracking-tight group-hover:text-primary transition-colors">{message}</p>
          <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1 opacity-60">{time}</p>
       </div>
    </div>
  )
}

const TableRow = ({ user, uid, type, color, instrument, amount, status, time }) => (
  <tr className="border-b border-border/40 hover:bg-white/2 transition-colors">
    <td className="py-4 px-6">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-[11px] font-bold text-primary border border-border/40">{user.charAt(0)}</div>
          <div>
            <div className="font-bold text-[13px] text-text">{user}</div>
            <div className="text-[10px] text-text-muted font-bold tracking-tight">{uid}</div>
          </div>
       </div>
    </td>
    <td className="py-4 px-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-[4px] ${
            color === 'secondary' ? 'bg-positive/10 text-positive' : 
            color === 'primary' ? 'bg-primary/10 text-primary' : 
            'bg-negative/10 text-negative'
        }`}>
            {type}
        </span>
    </td>
    <td className="py-4 px-6 font-mono text-[12px] text-text-muted">{instrument}</td>
    <td className="py-4 px-6 font-heading font-bold text-[13px] text-text price-data">{amount}</td>
    <td className="py-4 px-6">
       <div className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${
           status === 'FILLED' ? 'text-positive' : 
           status === 'PENDING' ? 'text-primary' : 
           'text-negative'
       }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div>
          {status}
       </div>
    </td>
    <td className="py-4 px-6 text-right font-mono text-[11px] text-text-muted opacity-60">{time}</td>
  </tr>
)

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <KPICard label="Total Platform Equity" value="$241,425,502.00" subtext="+2.4% avg exposure" trend="up" delay="0" />
            <KPICard label="KYC Verification Queue" value="154" subtext="URGENT: >24h backlog" trend="warning" delay="1" />
            <KPICard label="Pending Withdrawals" value="$38,200.00" subtext="12 requests pending" trend="down" delay="2" />
            <KPICard label="24h Volume (Lots)" value="12,842.50" subtext="+15.2k vs yesterday" trend="up" delay="3" />
            <KPICard label="LPs Connectivity" value="NOMINAL" subtext="4 providers active" trend="up" delay="4" />
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Chart Area */}
            <div className="col-span-12 lg:col-span-8 bg-surface-elevated border border-border p-6 rounded-[8px] flex flex-col gap-6 animate-fade-up delay-1 relative overflow-hidden group/panel">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Liquidity & Flow</h3>
                        <h4 className="text-lg font-heading font-bold text-text mt-1">Global Revenue Analytics</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted bg-surface/30 px-2 py-1 rounded-[4px] border border-border/40">
                        <TrendingUp size={12} className="text-positive" /> 24H FLOW
                    </div>
                </div>
                <div className="h-[300px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="rgba(255, 255, 255, 0.2)" 
                                fontSize={10} 
                                axisLine={false} 
                                tickLine={false} 
                                fontFamily='JetBrains Mono'
                            />
                            <YAxis 
                                stroke="rgba(255, 255, 255, 0.2)" 
                                fontSize={10} 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(val) => `$${val/1000}k`} 
                                fontFamily='JetBrains Mono'
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--surface-2)', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '8px', 
                                    fontSize: '11px',
                                    fontFamily: 'Inter',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                                }}
                                itemStyle={{ color: 'var(--brand)', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--brand)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alerts Area */}
            <div className="col-span-12 lg:col-span-4 bg-surface-elevated border border-border p-6 rounded-[8px] flex flex-col gap-6 animate-fade-up delay-2 relative overflow-hidden group/panel">
                <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">System Integrity</h3>
                    <span className="px-2 py-0.5 rounded-full bg-negative/20 text-negative text-[9px] font-black tracking-widest uppercase animate-pulse">4 Critical</span>
                </div>
                <div className="flex flex-col gap-3">
                    <AlertItem type="critical" message="KYC Backlog: 154 users > 24h" time="12m ago" />
                    <AlertItem type="warning" message="Binance Cloud Latency: 240ms" time="45m ago" />
                    <AlertItem type="info" message="Weekly automated audit completed" time="2h ago" />
                    <AlertItem type="critical" message="Withdrawal Flagged: $15,000.00" time="3h ago" />
                    <button className="w-full mt-2 p-3 rounded-[8px] bg-white/2 border border-border/40 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text hover:bg-white/5 transition-all">
                        View All Operations
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="col-span-12 bg-surface-elevated border border-border rounded-[8px] overflow-hidden animate-fade-up delay-3 shadow-atmospheric">
                <div className="p-6 flex justify-between items-center border-b border-border/40">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Live Transaction Stream</h3>
                        <h4 className="text-lg font-heading font-bold text-text mt-1">Recent Network Activity</h4>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text transition-colors"><Plus size={14}/> Filter</button>
                        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text transition-colors"><History size={14}/> Full Log</button>
                    </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-white/2">
                                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Identity</th>
                                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Operation</th>
                                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Asset</th>
                                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Volume</th>
                                <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Status</th>
                                <th className="py-3 px-6 text-right text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="tabular price-data">
                            <TableRow 
                                user="Marco Rossi" uid="UID: 19284" type="TRADE" color="secondary" 
                                instrument="BTC/USDT" amount="0.4502 BTC" status="FILLED" time="10:42:05 UTC" 
                            />
                            <TableRow 
                                user="Elena Vance" uid="UID: 20112" type="DEPOSIT" color="primary" 
                                instrument="Wire Transfer" amount="$12,000.00" status="PENDING" time="10:39:12 UTC" 
                            />
                            <TableRow 
                                user="Kofi Arhin" uid="UID: 18552" type="WITHDRAW" color="tertiary" 
                                instrument="USDT (ERC20)" amount="5,000 USDT" status="REJECTED" time="10:35:55 UTC" 
                            />
                            <TableRow 
                                user="Sara Johnson" uid="UID: 21004" type="TRADE" color="secondary" 
                                instrument="ETH/USDT" amount="12.500 ETH" status="FILLED" time="10:28:14 UTC" 
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}
