import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Copy, CreditCard, Search, Terminal, UserCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const QUICK_ACTIONS = [
  { label: 'Approve KYC', Icon: UserCheck, path: '/compliance/kyc', accent: 'var(--positive)' },
  { label: 'Review W/D', Icon: CreditCard, path: '/finance/withdrawals', accent: 'var(--warning)' },
  { label: 'Open User', Icon: Search, path: '/users', accent: 'var(--brand)' },
  { label: 'Trade Log', Icon: Terminal, path: '/trading/logs', accent: 'var(--purple)' },
  { label: 'Copy Trading', Icon: Copy, path: '/copy-trading', accent: 'var(--cyan)' },
  { label: 'Support Ticket', Icon: Activity, path: '/support', accent: 'var(--negative)' },
];

export function DashboardQuickActions() {
  const navigate = useNavigate();
  return (
    <Card>
      <div className="text-[13px] font-semibold text-text mb-3">Quick Actions</div>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map(({ label, Icon, path, accent }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex items-center gap-2.5 rounded-[9px] border border-border/20 bg-bg/50 px-3 py-2.5 text-left hover:border-border/50 hover:bg-surface/60 transition-all group"
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] transition-transform duration-300 group-hover:scale-110"
              style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}
            >
              <Icon size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-semibold text-text-muted group-hover:text-text transition-colors leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
