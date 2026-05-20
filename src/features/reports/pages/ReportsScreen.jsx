import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, DollarSign, TrendingUp, Users, Cpu, Send } from 'lucide-react';
import { PageShell } from '@components/common/PageShell';
import { ReportsOverviewScreen } from './ReportsOverview';
import { FinanceReportsScreen } from './FinanceReports';
import { TradingReportsScreen } from './TradingReports';
import { UserReportsScreen } from './UserReports';
import { SystemReportsScreen } from './SystemReports';
import { ExportCenterScreen } from './ExportCenter';

const NAV_ITEMS = [
  { id: 'overview',  path: '/reports',          label: 'Overview',        Icon: LayoutDashboard },
  { id: 'finance',   path: '/reports/finance',   label: 'Finance',         Icon: DollarSign      },
  { id: 'trading',   path: '/reports/trading',   label: 'Trading',         Icon: TrendingUp      },
  { id: 'users',     path: '/reports/users',     label: 'Users',           Icon: Users           },
  { id: 'system',    path: '/reports/system',    label: 'System Jobs',     Icon: Cpu             },
  { id: 'exports',   path: '/reports/exports',   label: 'Export Center',   Icon: Send            },
];

const PAGE_MAP = {
  overview: ReportsOverviewScreen,
  finance:  FinanceReportsScreen,
  trading:  TradingReportsScreen,
  users:    UserReportsScreen,
  system:   SystemReportsScreen,
  exports:  ExportCenterScreen,
};

export function ReportsScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = NAV_ITEMS.find((n) => n.path === location.pathname);
  const activeId = active?.id ?? 'overview';

  const PageComponent = PAGE_MAP[activeId] ?? PAGE_MAP.overview;

  return (
    <PageShell className="!pt-0">
      {/* ── Sticky sub-nav ── */}
      <div className="sticky top-[68px] z-20 -mx-6 px-6 mb-5 pt-4 pb-3 border-b border-border/20"
        style={{ backgroundColor: 'var(--bg)' }}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const { id, path, label, Icon } = item;
            const active = activeId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(path)}
                className={[
                  'flex flex-shrink-0 items-center gap-1.5 rounded-[9px] border px-3 py-2',
                  'text-[12px] font-semibold font-heading transition-all duration-200',
                  active
                    ? 'border-primary/25 bg-primary/10 text-primary'
                    : 'border-transparent bg-transparent text-text-muted hover:border-border/35 hover:bg-bg/50 hover:text-text',
                ].join(' ')}
              >
                <Icon size={13} className="flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Page ── */}
      <div className="animate-fade-up">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default ReportsScreen;