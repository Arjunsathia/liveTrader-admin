import React, { useMemo, useState } from 'react';
import { Download, FileCheck, Layers, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/layout/PageShell';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../services/users.service';
import { UsersMt5Table } from '../components/UsersTable';
import { Mt5AccountDrawer } from '../components/UserDrawers';

const USER_NAV_TABS = [
  { id: 'list', label: 'User Directory', path: '/users', Icon: Users },
  { id: 'kyc', label: 'KYC Requests', path: '/users/kyc', Icon: FileCheck },
  { id: 'mt5', label: 'MT5 Accounts', path: '/users/mt5', Icon: Layers },
];

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Broker Integration',
  title: 'MT5 Accounts Bridge',
  description: 'Monitor meta-trader terminals, connection latency, margins, and dealing desk bridges.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function MT5QueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const mt5Drawer = useDrawerState(null);

  const filteredMt5 = useMemo(
    () => filterBySearch(usersService.listMt5Accounts(), search, ['login', 'user', 'server', 'group', 'status']),
    [search],
  );

  const mt5Table = useTableState(filteredMt5, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <div className="space-y-5">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredMt5, `mt5-accounts.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Inventory
            </button>
          </div>
        </header>



        {/* ── Table registry panel ── */}
        <Card padding={false}>
          {/* Custom Premium Table Header Panel */}
          <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: PAGE.accent }}
              />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                MT5 Accounts Inventory
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border font-mono animate-fade-in"
                style={{
                  color: PAGE.accent,
                  background: `color-mix(in srgb, ${PAGE.accent} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${PAGE.accent} 22%, transparent)`,
                }}
              >
                {filteredMt5.length}
              </span>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); mt5Table.setPage(1); }}
                  placeholder="Search accounts..."
                  className="h-7 pl-7 pr-3 w-40 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
              </div>
            </div>
          </div>

          <UsersMt5Table
            tableState={mt5Table}
            onOpenUser={(nextUserId, nextTab) => navigate(`/users/${nextUserId}${nextTab ? `/${nextTab}` : ''}`)}
            onOpenMt5={(entry) => mt5Drawer.open(entry)}
          />
        </Card>

      </div>

      <Mt5AccountDrawer
        entry={mt5Drawer.value}
        onClose={mt5Drawer.close}
      />
    </PageShell>
  );
}
export default MT5QueuePage;
