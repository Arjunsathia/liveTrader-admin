import React from 'react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  UserPlus 
} from 'lucide-react';

export function UsersPage() {
  const users = [
    { name: 'Marco Rossi', email: 'm.rossi@example.com', country: 'IT', status: 'VERIFIED', balance: '$42,500.00', registered: '2024-03-12' },
    { name: 'Elena Vance', email: 'e.vance@citadel.com', country: 'US', status: 'PENDING', balance: '$12,000.00', registered: '2024-03-28' },
    { name: 'Kofi Arhin', email: 'k.arhin@gh.com', country: 'GH', status: 'REJECTED', balance: '$5,000.00', registered: '2024-03-15' },
    { name: 'Sara Johnson', email: 's.johnson@uk.co', country: 'UK', status: 'VERIFIED', balance: '$250,200.00', registered: '2024-01-05' },
    { name: 'Li Wei', email: 'l.wei@hk.cn', country: 'HK', status: 'VERIFIED', balance: '$125,000.00', registered: '2023-11-22' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up">
        <StatCard label="Total Registered" value="12,842" subtext="+452 this month" trend="up" icon={Users} />
        <StatCard label="Verified Accounts" value="10,402" subtext="81% verification rate" trend="up" icon={ShieldCheck} />
        <StatCard label="Pending KYC" value="154" subtext="Avg delay: 18h" trend="warning" icon={ShieldAlert} />
        <StatCard label="Active Sessions" value="2,142" subtext="Current live traders" trend="up" icon={Activity} />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-elevated border border-border/40 p-4 rounded-[8px] flex items-center justify-between gap-4 animate-fade-up delay-100">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" size={16} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search by name, email, or UID..." 
            className="w-full h-10 bg-bg border border-white/5 rounded-[8px] pl-10 pr-4 text-[13px] text-text focus:outline-none focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Filter}>Filters</Button>
          <Button variant="secondary" icon={Download}>Export CSV</Button>
          <Button variant="primary" icon={UserPlus}>Onboard User</Button>
        </div>
      </div>

      {/* User Table */}
      <Card title="User Registry" subtitle="Detailed User & KYC Management" padding={false} className="animate-fade-up delay-200">
        <Table 
          headers={['User Details', 'Contact', 'Jurisdiction', 'Portfolio Balance', 'KYC Status', 'Registration']}
          data={users}
          rowRenderer={(user, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-primary font-bold border border-border/40">{user.name[0]}</div>
                  <div className="font-bold text-text">{user.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-text-muted">{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">
                    {user.country === 'IT' ? '🇮🇹' : user.country === 'US' ? '🇺🇸' : user.country === 'GH' ? '🇬🇭' : user.country === 'UK' ? '🇬🇧' : '🇨🇳'}
                  </span>
                  <span className="text-text-muted">{user.country}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-text font-heading">{user.balance}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'VERIFIED' ? 'success' : user.status === 'PENDING' ? 'warning' : 'danger'} dot>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-text-muted opacity-60 font-mono">{user.registered}</TableCell>
            </TableRow>
          )}
        />
        <div className="p-4 border-t border-border/40 flex justify-between items-center bg-white/2">
          <span className="text-[11px] text-text-muted font-black uppercase tracking-widest">Showing 1-5 of 12,842 users</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled>Prev</Button>
            <Button size="sm" variant="secondary">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
