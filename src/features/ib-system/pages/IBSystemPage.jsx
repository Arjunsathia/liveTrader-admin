import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Share2, DollarSign, Award, Target, ChevronRight } from 'lucide-react';

export function IBSystemPage() {
  const referrals = [
    { name: 'John Doe Broker', level: 'Diamond', referral_count: '1,240', commission: '$12,500.00', status: 'ACTIVE' },
    { name: 'Sarah Partner', level: 'Gold', referral_count: '450', commission: '$4,200.00', status: 'ACTIVE' },
    { name: 'Mike Smith IB', level: 'Silver', referral_count: '120', commission: '$1,150.00', status: 'ACTIVE' },
    { name: 'Trading Genius', level: 'Platinum', referral_count: '840', commission: '$8,400.00', status: 'REVIEW' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Total IB Partners" value="214" subtext="Official referrals" trend="up" icon={Share2} />
        <StatCard label="Referral Volume" value="$45.2M" subtext="Trader net turnover" trend="up" icon={Target} />
        <StatCard label="Total Commissions" value="$142,500" subtext="Paid this month" trend="up" icon={DollarSign} />
        <StatCard label="Top IB Performance" value="+12%" subtext="Growth vs last month" trend="up" icon={Award} />
      </div>

      <Card title="Partnership Management" subtitle="IB Network & Commission Tracking" padding={false} className="animate-fade-up delay-100">
        <Table 
          headers={['Partner Name', 'Tier Level', 'Referral Count', 'Total Commission', 'Status', 'Network View']}
          data={referrals}
          rowRenderer={(ib, i) => (
            <TableRow key={i}>
              <TableCell className="font-bold text-text">{ib.name}</TableCell>
              <TableCell>
                <Badge variant={ib.level === 'Diamond' ? 'info' : ib.level === 'Platinum' ? 'success' : 'muted'}>
                    {ib.level}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-text-muted">{ib.referral_count}</TableCell>
              <TableCell className="font-heading font-black text-text price-data">{ib.commission}</TableCell>
              <TableCell>
                <Badge variant={ib.status === 'ACTIVE' ? 'success' : 'warning'} dot>{ib.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" icon={ChevronRight}>Referral Tree</Button>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
}
