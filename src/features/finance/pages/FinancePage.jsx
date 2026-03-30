import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ArrowUpCircle, ArrowDownCircle, History, Filter, Download, Plus, CheckCircle2, XCircle } from 'lucide-react';

export function FinancePage() {
  const transactions = [
    { type: 'DEPOSIT', amount: '$15,000.00', method: 'Binance Pay', id: 'TXN-90210', user: 'Marco Rossi', status: 'COMPLETED', date: '2024-03-30 09:42' },
    { type: 'WITHDRAW', amount: '$2,500.00', method: 'Wire Transfer', id: 'TXN-90211', user: 'Elena Vance', status: 'PENDING', date: '2024-03-30 10:15' },
    { type: 'WITHDRAW', amount: '$12,000.00', method: 'USDT (ERC20)', id: 'TXN-90212', user: 'Kofi Arhin', status: 'FLAGGED', date: '2024-03-30 10:30' },
    { type: 'DEPOSIT', amount: '$5,000.00', method: 'Credit Card', id: 'TXN-90213', user: 'Sara Johnson', status: 'COMPLETED', date: '2024-03-30 11:05' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Total Net Equity" value="$241.4M" subtext="+1.2% exposure" trend="up" icon={Plus} />
        <StatCard label="Pending Withdrawals" value="$38,200" subtext="12 items waiting" trend="warning" icon={ArrowDownCircle} />
        <StatCard label="24h Deposits" value="$125,000" subtext="42 transactions" trend="up" icon={ArrowUpCircle} />
        <StatCard label="Daily Net Flow" value="+$86,800" subtext="Positive liquidity" trend="up" icon={History} />
      </div>

      {/* Control Bar */}
      <div className="bg-surface-elevated border border-border/40 p-4 rounded-[8px] flex items-center justify-between gap-4 animate-fade-up delay-100">
        <div className="flex gap-4 items-center">
            <Button variant="secondary" icon={ArrowUpCircle}>Deposit Logs</Button>
            <Button variant="secondary" icon={ArrowDownCircle}>Withdrawal Queue</Button>
            <Button variant="secondary" icon={History}>Transaction History</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Filter}>Advanced Filters</Button>
          <Button variant="primary" icon={Plus}>Manual Adjustment</Button>
        </div>
      </div>

      {/* Transaction Table */}
      <Card title="Treasury Monitor" subtitle="Live Deposit & Withdrawal Tracking" padding={false} className="animate-fade-up delay-200">
        <Table 
          headers={['Transaction ID', 'User', 'Operation', 'Amount', 'Method', 'Current Status', 'Timestamp']}
          data={transactions}
          rowRenderer={(txn, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono text-text-muted font-bold">{txn.id}</TableCell>
              <TableCell className="font-bold text-text">{txn.user}</TableCell>
              <TableCell>
                <Badge variant={txn.type === 'DEPOSIT' ? 'success' : 'danger'}>{txn.type}</Badge>
              </TableCell>
              <TableCell className="font-bold text-text font-heading">{txn.amount}</TableCell>
              <TableCell className="text-text-muted">{txn.method}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={txn.status === 'COMPLETED' ? 'success' : txn.status === 'PENDING' ? 'warning' : 'danger'} dot>
                    {txn.status}
                  </Badge>
                  {txn.status === 'PENDING' && (
                    <div className="flex gap-1 ml-2">
                      <Button size="sm" variant="ghost" className="p-1 min-w-0 h-6 w-6"><CheckCircle2 size={14} className="text-positive"/></Button>
                      <Button size="sm" variant="ghost" className="p-1 min-w-0 h-6 w-6"><XCircle size={14} className="text-negative"/></Button>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right text-text-muted opacity-60 font-mono">{txn.date}</TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
}
