import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Copy, Users, TrendingUp, Star, MoreVertical } from 'lucide-react';

export function CopyTradingPage() {
  const providers = [
    { name: 'Alpha Quant', followers: '1,204', aum: '$4.2M', roi: '+142%', risk: '3/10', status: 'ACTIVE' },
    { name: 'Prime Signal', followers: '840', aum: '$1.8M', roi: '+95%', risk: '5/10', status: 'ACTIVE' },
    { name: 'Trend Master', followers: '2,142', aum: '$12.5M', roi: '+210%', risk: '2/10', status: 'PAUSED' },
    { name: 'Forex Ghost', followers: '450', aum: '$800k', roi: '+64%', risk: '7/10', status: 'ACTIVE' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Total Providers" value="42" subtext="Verified Strategy Managers" trend="up" icon={Star} />
        <StatCard label="Total Followers" value="5,842" subtext="Across all strategies" trend="up" icon={Users} />
        <StatCard label="Copy Trading AUM" value="$22.5M" subtext="Managed equity" trend="up" icon={TrendingUp} />
        <StatCard label="Strategy ROI Avg" value="+12.4%" subtext="Last 30 days" trend="up" icon={Copy} />
      </div>

      <Card title="Strategy Management" subtitle="Provider Performance & Integrity" padding={false} className="animate-fade-up delay-100">
        <Table 
          headers={['Strategy Provider', 'Followers', 'Assets Managed', 'All-Time ROI', 'Risk Profile', 'Status', 'Actions']}
          data={providers}
          rowRenderer={(p, i) => (
            <TableRow key={i}>
              <TableCell className="font-heading font-black text-text">{p.name}</TableCell>
              <TableCell className="font-bold text-text-muted">{p.followers}</TableCell>
              <TableCell className="font-bold text-text">{p.aum}</TableCell>
              <TableCell className="font-heading font-black text-positive">{p.roi}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface-bright rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(parseInt(p.risk)/10)*100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted">{p.risk}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'warning'} dot>{p.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="p-1 min-w-0"><MoreVertical size={16} /></Button>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
}
