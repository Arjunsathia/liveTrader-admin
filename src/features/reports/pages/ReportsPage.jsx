import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  FileText, 
  Download, 
  BarChart2, 
  PieChart, 
  Calendar, 
  ChevronDown, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';

export function ReportsPage() {
  const reports = [
    { name: 'Monthly Finance Audit', type: 'Financial', date: '2024-03-01', size: '2.4 MB', status: 'READY' },
    { name: 'Weekly Trading Statement', type: 'Trading', date: '2024-03-24', size: '1.1 MB', status: 'READY' },
    { name: 'User Growth Analytics', type: 'Marketing', date: '2024-03-28', size: '4.5 MB', status: 'GENERATING' },
    { name: 'IB Commission Summary', type: 'Finance', date: '2024-02-29', size: '0.8 MB', status: 'READY' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
        <StatCard label="Total Reports Generated" value="1,204" subtext="System total" icon={FileText} />
        <StatCard label="Storage Utilization" value="84.2 GB" subtext="Across S3 buckets" icon={BarChart2} />
        <StatCard label="Auto-Audit Success" value="99.8%" subtext="Automated integrity" icon={ShieldCheck} />
      </div>

      <div className="bg-surface-elevated border border-border/40 p-4 rounded-[8px] flex items-center justify-between gap-4 animate-fade-up delay-100">
        <div className="flex gap-2">
            <Button variant="secondary" icon={Calendar}>Range: Mar 2024</Button>
            <Button variant="secondary" icon={ChevronDown}>Type: All Reports</Button>
        </div>
        <Button variant="primary" icon={Plus}>Generate New Report</Button>
      </div>

      <Card title="Archive" subtitle="Generated System Reports & Audits" padding={false} className="animate-fade-up delay-200">
        <Table 
          headers={['Report Name', 'Category', 'Generated Date', 'File Size', 'Status', 'Download']}
          data={reports}
          rowRenderer={(r, i) => (
            <TableRow key={i}>
              <TableCell className="font-bold text-text">{r.name}</TableCell>
              <TableCell className="text-text-muted uppercase text-[10px] font-black tracking-widest">{r.type}</TableCell>
              <TableCell className="text-text-muted font-mono">{r.date}</TableCell>
              <TableCell className="text-text-muted">{r.size}</TableCell>
              <TableCell>
                <Badge variant={r.status === 'READY' ? 'success' : 'warning'} dot>{r.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" icon={Download} disabled={r.status === 'GENERATING'} />
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
}
