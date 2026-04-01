import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Monitor, BookOpen, Activity, BarChart2, Terminal, RefreshCw } from 'lucide-react';
import { PageShell } from '../../../layout/PageShell';

const SUB_PAGES = [
  { slug: 'accounts', label: 'Accounts', icon: Monitor },
  { slug: 'orders', label: 'Orders', icon: BookOpen },
  { slug: 'positions', label: 'Positions', icon: Activity },
  { slug: 'history', label: 'History', icon: BarChart2 },
  { slug: 'execution-logs', label: 'Exec Logs', icon: Terminal },
];

export function TradingLayout({ children }) {
  return (
    <PageShell title="Trading Operations">
      <div className="space-y-6">
        {children}
      </div>
    </PageShell>
  );
}
