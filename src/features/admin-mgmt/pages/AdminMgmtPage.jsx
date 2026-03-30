import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ShieldCheck, UserCheck, Key, Lock, Plus, Users, ShieldAlert } from 'lucide-react';

export function AdminMgmtPage() {
  const admins = [
    { name: 'Alex Rivera', role: 'SUPER ADMIN', permissions: 'ALL', status: 'ACTIVE', last_active: 'Now' },
    { name: 'System Auditor', role: 'AUDITOR', permissions: 'READ_ONLY', status: 'ACTIVE', last_active: '2h ago' },
    { name: 'Support lead', role: 'OPERATOR', permissions: 'SUPPORT_ONLY', status: 'OFFLINE', last_active: '1d ago' },
    { name: 'Finance Admin', role: 'MANAGER', permissions: 'FINANCE_ONLY', status: 'ACTIVE', last_active: '15m ago' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
        <StatCard label="Admin Users" value="08" subtext="Internal platform staff" icon={Users} />
        <StatCard label="Active Sessions" value="02" subtext="Current admin access" icon={ShieldCheck} />
        <StatCard label="Security Logs" value="NOMINAL" subtext="0 flags detected" icon={Lock} />
      </div>

      <Card title="Personnel Registry" subtitle="Admin User Roles & Permissions" padding={false} className="animate-fade-up delay-100">
        <Table 
          headers={['Administrator Identity', 'Functional Role', 'Permission Level', 'Current Status', 'Identity Trace', 'Management']}
          data={admins}
          rowRenderer={(admin, i) => (
            <TableRow key={i}>
              <TableCell className="font-bold text-text">{admin.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-primary/60" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">{admin.role}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-text-muted text-[10px]">{admin.permissions}</TableCell>
              <TableCell>
                <Badge variant={admin.status === 'ACTIVE' ? 'success' : 'muted'} dot>{admin.status}</Badge>
              </TableCell>
              <TableCell className="text-text-muted opacity-60 font-mono italic">{admin.last_active}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" icon={Key}>Credentials</Button>
              </TableCell>
            </TableRow>
          )}
        />
        <div className="p-4 border-t border-border/40 flex justify-end bg-white/2">
            <Button variant="primary" icon={Plus}>Provision New Admin Account</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up delay-200">
          <Card title="Role-Based Access" subtitle="Define Permission Packages">
              <div className="space-y-3">
                  {['Financial Approver', 'Compliance Auditor', 'Trading Spectator'].map((role, i) => (
                      <div key={i} className="p-4 rounded-[8px] bg-white/2 border border-white/5 flex justify-between items-center">
                          <span className="font-bold">{role}</span>
                          <Button size="sm" variant="secondary">Configure</Button>
                      </div>
                  ))}
              </div>
          </Card>
          <Card title="Security Hardening" subtitle="Global Access Policies">
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-[8px] bg-white/2 border border-white/5">
                      <span className="text-[13px] font-bold">Require Admin MFA</span>
                      <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[8px] bg-white/2 border border-white/5">
                      <span className="text-[13px] font-bold">Auto-session Timeout</span>
                      <span className="text-text-muted font-mono">15m</span>
                  </div>
                  <Button variant="ghost" className="w-full">View Full Security Audit Log</Button>
               </div>
          </Card>
      </div>
    </div>
  );
}
