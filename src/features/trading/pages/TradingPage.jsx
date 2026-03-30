import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { LineChart, BarChart3, Activity, Eye, Zap, AlertCircle } from 'lucide-react';

export function TradingPage() {
  const positions = [
    { pair: 'EUR/USD', user: 'Marco Rossi', side: 'BUY', size: '1.20 Lots', entry: '1.09240', current: '1.09450', pnl: '+$210.00' },
    { pair: 'BTC/USDT', user: 'Elena Vance', side: 'SELL', size: '0.45 BTC', entry: '64,200', current: '63,100', pnl: '+$495.00' },
    { pair: 'XAU/USD', user: 'Kofi Arhin', side: 'BUY', size: '10.0 oz', entry: '2,150.40', current: '2,145.20', pnl: '-$52.00' },
    { pair: 'GBP/JPY', user: 'Sara Johnson', side: 'SELL', size: '2.50 Lots', entry: '190.45', current: '190.80', pnl: '-$350.00' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Live Positions" value="1,242" subtext="Current active trades" trend="up" icon={Activity} />
        <StatCard label="24h Volume" value="$25.4M" subtext="Platform total" trend="up" icon={BarChart3} />
        <StatCard label="Execution Latency" value="14ms" subtext="LP average" trend="up" icon={Zap} />
        <StatCard label="Exposure Risk" value="4.2%" subtext="Within threshold" trend="warning" icon={AlertCircle} />
      </div>

      <Card title="Live Monitoring" subtitle="Real-time Trade Execution Data" padding={false} className="animate-fade-up delay-100">
        <Table 
          headers={['Market Pair', 'Trader', 'Direction', 'Size/Lots', 'Entry Price', 'Current', 'PnL Monitor']}
          data={positions}
          rowRenderer={(pos, i) => (
            <TableRow key={i}>
              <TableCell className="font-heading font-black text-primary">{pos.pair}</TableCell>
              <TableCell className="font-bold text-text">{pos.user}</TableCell>
              <TableCell>
                <Badge variant={pos.side === 'BUY' ? 'success' : 'danger'}>{pos.side}</Badge>
              </TableCell>
              <TableCell className="font-mono text-text-muted">{pos.size}</TableCell>
              <TableCell className="font-mono text-text-muted">{pos.entry}</TableCell>
              <TableCell className="font-mono text-text-muted">{pos.current}</TableCell>
              <TableCell className={`font-heading font-black ${pos.pnl.startsWith('+') ? 'text-positive' : 'text-negative'}`}>
                {pos.pnl}
              </TableCell>
            </TableRow>
          )}
        />
        <div className="p-4 border-t border-border/40 flex justify-end bg-white/2">
            <Button variant="secondary" icon={Eye}>View Global Heatmap</Button>
        </div>
      </Card>
    </div>
  );
}
