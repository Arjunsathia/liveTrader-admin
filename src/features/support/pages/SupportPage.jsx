import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertOctagon, Inbox } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import TicketsPage from '@/features/support/pages/TicketsPage';
import EscalatedPage from '@/features/support/pages/EscalatedPage';
import { ticketsData }    from '@/config/constants/support/mockData';

/* ── Sub-navigation definition ─────────────────────────── */
const NAV_ITEMS = [
  {
    id:    'tickets',
    path:  '/support/tickets',
    label: 'Tickets',
    Icon:  Inbox,
    badge: () => ticketsData.filter((t) => t.status === 'OPEN').length,
  },
  {
    id:    'escalated',
    path:  '/support/escalated',
    label: 'Escalated',
    Icon:  AlertOctagon,
    badge: () => ticketsData.filter((t) => t.status === 'ESCALATED').length,
    urgent: true,
  },
];

const PAGE_MAP = {
  tickets:   TicketsPage,
  escalated: EscalatedPage,
};

/* ── Main dispatcher ────────────────────────────────────── */
function SupportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const slug = location.pathname.split('/').filter(Boolean).pop();
  const found = NAV_ITEMS.find((n) => n.id === slug);
  const activeId = found?.id ?? 'tickets';

  const PageComponent = PAGE_MAP[activeId] ?? TicketsPage;

  return (
    <PageShell className="!pt-0">
      {/* ── Sticky sub-nav — exact same pattern as ReportsPage ── */}
      <div
        className="sticky top-[68px] z-20 -mx-6 px-6 mb-5 pt-4 pb-3 border-b border-border/20"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const { id, path, label, Icon, badge, urgent } = item;
            const active    = activeId === id;
            const badgeVal  = badge();
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
                {badgeVal > 0 && (
                  <span
                    className={[
                      'min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black font-heading',
                      'flex items-center justify-center leading-none',
                      urgent
                        ? 'bg-negative/[0.15] border border-negative/[0.25] text-negative'
                        : 'bg-positive/[0.15] border border-positive/[0.25] text-positive',
                    ].join(' ')}
                  >
                    {badgeVal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active page ── */}
      <div className="animate-in fade-in duration-200">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default SupportPage;