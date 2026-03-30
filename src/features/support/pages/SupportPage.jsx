import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  LifeBuoy, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight 
} from 'lucide-react';

export function SupportPage() {
  const tickets = [
    { id: 'TKT-1025', subject: 'Withdrawal Delay', user: 'Marco Rossi', priority: 'HIGH', status: 'OPEN', date: '12m ago' },
    { id: 'TKT-1024', subject: '2FA Reset Request', user: 'Elena Vance', priority: 'MEDIUM', status: 'IN_PROGRESS', date: '2h ago' },
    { id: 'TKT-1023', subject: 'API Key Error', user: 'Kofi Arhin', priority: 'LOW', status: 'RESOLVED', date: '5h ago' },
    { id: 'TKT-1022', subject: 'Account Verification', user: 'Sara Johnson', priority: 'MEDIUM', status: 'OPEN', date: 'yesterday' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Live Tickets" value="42" subtext="Awaiting response" trend="warning" icon={MessageSquare} />
        <StatCard label="Avg Response Time" value="1.5h" subtext="Last 24 hours" trend="up" icon={Clock} />
        <StatCard label="Urgent Escalations" value="03" subtext="Management review" trend="danger" icon={AlertCircle} />
        <StatCard label="User Satisfaction" value="4.8/5" subtext="Service rating" trend="up" icon={LifeBuoy} />
      </div>

      <Card title="Helpdesk Monitor" subtitle="Live Support Ticket Stream" padding={false} className="animate-fade-up delay-100">
        <Table 
          headers={['Ticket ID', 'Identity', 'Subject Area', 'Priority', 'Current Status', 'Last Active', 'Thread']}
          data={tickets}
          rowRenderer={(t, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono text-text-muted font-bold">{t.id}</TableCell>
              <TableCell className="font-bold text-text">{t.user}</TableCell>
              <TableCell className="text-text-muted max-w-[200px] truncate">{t.subject}</TableCell>
              <TableCell>
                <Badge variant={t.priority === 'HIGH' ? 'danger' : t.priority === 'MEDIUM' ? 'warning' : 'info'}>
                    {t.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={t.status === 'OPEN' ? 'danger' : t.status === 'RESOLVED' ? 'success' : 'warning'} dot>
                    {t.status}
                </Badge>
              </TableCell>
              <TableCell className="text-text-muted opacity-60 font-mono italic">{t.date}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="secondary" icon={ChevronRight}>Open Ticket</Button>
              </TableCell>
            </TableRow>
          )}
        />
        <div className="p-4 border-t border-border/40 flex justify-between items-center bg-white/2">
            <Button variant="ghost" size="sm" icon={Plus}>Create Manual Ticket</Button>
            <Button variant="secondary" size="sm">View Support Archives</Button>
        </div>
      </Card>
    </div>
  );
}
