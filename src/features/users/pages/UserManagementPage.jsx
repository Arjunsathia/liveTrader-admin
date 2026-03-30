import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ChevronRight,
  CircleAlert,
  Download,
  Filter,
  Search,
  ShieldCheck,
  ShieldEllipsis,
  TrendingUp,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableCell, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { activityFeed, kycQueue, mt5Accounts, mt5Logs, userOpsTabs, users } from '../data/userAdminData';

function WorkspaceTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2 rounded-[10px] border border-border/40 bg-surface-elevated p-2">
      {userOpsTabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`rounded-[8px] px-4 py-2 text-[12px] font-medium tracking-[-0.01em] transition-all ${
              active
                ? 'bg-primary text-text-on-accent shadow-sm'
                : 'text-text-muted hover:bg-bg/70 hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function FilterDrawer({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-[130] transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#020617]/55 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[420px] border-l border-border/40 bg-surface p-6 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/65">Filter Presets</p>
            <h3 className="mt-1 text-[24px] font-semibold tracking-[-0.05em] text-text">Admin Workflow Filters</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border/30 text-text-muted hover:bg-surface-elevated hover:text-text"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {[
            {
              title: 'KYC state',
              chips: ['Verified', 'Pending review', 'Rejected', 'Manual review'],
            },
            {
              title: 'Risk posture',
              chips: ['Low', 'Watchlist', 'Elevated', 'Restricted'],
            },
            {
              title: 'Funding profile',
              chips: ['High balance', 'Withdrawal pending', 'Dormant wallet', 'Hold applied'],
            },
          ].map((section) => (
            <Card key={section.title} title={section.title} subtitle="Quick narrowing">
              <div className="flex flex-wrap gap-2">
                {section.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full border border-border/40 bg-bg px-3 py-2 text-[12px] font-medium text-text-muted hover:border-primary/40 hover:text-text"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </aside>
    </div>
  );
}

function UserListWorkspace({ onOpenFilters }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Users" value="12,842" subtext="452 new this month" trend="up" icon={Activity} />
        <StatCard label="KYC Queue" value="154" subtext="28 above SLA" trend="warning" icon={ShieldEllipsis} />
        <StatCard label="Funded Accounts" value="8,420" subtext="65.6% funded ratio" trend="up" icon={Wallet} />
        <StatCard label="Active MT5" value="6,318" subtext="98.7% online" trend="up" icon={TrendingUp} />
        <StatCard label="Flagged Users" value="62" subtext="Risk review in progress" trend="danger" icon={CircleAlert} />
      </div>

      <div className="flex flex-col gap-4 rounded-[10px] border border-border/40 bg-surface-elevated p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" size={16} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search by name, UID, email, phone, or MT5 login"
              className="h-11 w-full rounded-[8px] border border-white/5 bg-bg pl-10 pr-4 text-[13px] text-text outline-none transition-all focus:border-primary/40"
            />
          </div>
          {['KYC status', 'Risk tier', 'Funding state'].map((label) => (
            <button
              key={label}
              type="button"
              className="flex h-11 items-center justify-between rounded-[8px] border border-white/5 bg-bg px-4 text-[12px] font-medium text-text-muted hover:text-text"
            >
              {label}
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={Filter} onClick={onOpenFilters}>Advanced Filters</Button>
          <Button variant="secondary" icon={Download}>Export</Button>
          <Button variant="primary" icon={UserPlus}>Create User</Button>
        </div>
      </div>

      <Card title="Main Working Queue" subtitle="User list with compliance, funding, and account actions" padding={false}>
        <Table
          headers={['User', 'Segment', 'KYC', 'Wallet', 'MT5', 'Risk', 'Last activity', 'Actions']}
          data={users}
          rowRenderer={(user) => (
            <TableRow key={user.id} className="cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-bg text-[14px] font-semibold text-primary">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-text">{user.name}</div>
                    <div className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.08em] text-text-muted">UID {user.uid}</div>
                    <div className="text-[11px] text-text-muted">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-text">{user.segment}</div>
                <div className="text-[11px] text-text-muted">{user.tier}</div>
              </TableCell>
              <TableCell>
                <Badge variant={user.kycStatus === 'VERIFIED' ? 'success' : user.kycStatus === 'PENDING' ? 'warning' : 'danger'} dot>
                  {user.kycStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="price-data font-medium text-text">{user.walletBalance}</div>
                <div className="text-[11px] text-text-muted">Equity {user.equity}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-text">{user.mt5Accounts} accounts</div>
                <div className="text-[11px] text-text-muted">{user.openPositions} open positions</div>
              </TableCell>
              <TableCell>
                <Badge variant={user.riskStatus === 'LOW' ? 'success' : user.riskStatus === 'WATCHLIST' ? 'warning' : 'danger'}>
                  {user.riskStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-text-muted">
                <div className="font-mono text-[12px]">{user.lastSeen}</div>
                <div className="text-[11px]">{user.source}</div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/users/${user.id}`)}>Open</Button>
                  <Button size="sm" variant="ghost">Lock</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />
        <div className="flex items-center justify-between border-t border-border/40 bg-white/2 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">
            Fast workflow: open a user record to access wallet, risk, KYC, and MT5 controls.
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled>Previous</Button>
            <Button size="sm" variant="secondary">Next</Button>
          </div>
        </div>
      </Card>
    </>
  );
}

function KycWorkspace() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
      <Card title="KYC Requests" subtitle="Compliance queue prioritized by risk and SLA" padding={false}>
        <Table
          headers={['Case ID', 'User', 'Tier', 'Documents', 'Status', 'Risk', 'ETA', 'Action']}
          data={kycQueue}
          rowRenderer={(item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-[12px] text-text-muted">{item.id}</TableCell>
              <TableCell>
                <div className="font-medium text-text">{item.user}</div>
                <div className="text-[11px] text-text-muted">{item.country}</div>
              </TableCell>
              <TableCell className="text-text-muted">{item.tier}</TableCell>
              <TableCell className="text-text-muted">{item.docs}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Verified' ? 'success' : item.status === 'Pending Review' ? 'warning' : 'danger'} dot>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.risk === 'Low' ? 'success' : item.risk === 'Medium' ? 'warning' : 'danger'}>
                  {item.risk}
                </Badge>
              </TableCell>
              <TableCell className="text-text-muted">{item.eta}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="secondary" onClick={() => navigate(`/users/${item.userId}`)}>Review</Button>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>

      <Card title="Queue Guidance" subtitle="Reviewer playbook">
        <div className="space-y-3">
          {[
            'Route high-risk rejections to Risk Desk before wallet release.',
            'Approve POA refreshes within 30 minutes during market hours.',
            'Use user detail tabs for historical activity before KYC escalation.',
          ].map((item) => (
            <div key={item} className="rounded-[8px] border border-border/30 bg-bg/70 p-4 text-[13px] text-text-muted">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ActivityWorkspace() {
  const navigate = useNavigate();

  return (
    <Card title="User Activity" subtitle="Cross-channel operational audit log" padding={false}>
      <Table
        headers={['Event', 'User', 'Source', 'Severity', 'Owner', 'Time', 'Open']}
        data={activityFeed}
        rowRenderer={(item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium text-text">{item.event}</div>
              <div className="text-[11px] font-mono text-text-muted">{item.id}</div>
            </TableCell>
            <TableCell className="text-text-muted">{item.user}</TableCell>
            <TableCell className="text-text-muted">{item.source}</TableCell>
            <TableCell>
              <Badge variant={item.severity === 'Info' ? 'info' : item.severity === 'Review' ? 'warning' : 'danger'}>
                {item.severity}
              </Badge>
            </TableCell>
            <TableCell className="text-text-muted">{item.owner}</TableCell>
            <TableCell className="font-mono text-text-muted">{item.time}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="secondary" onClick={() => navigate(`/users/${item.userId}`)}>Open User</Button>
            </TableCell>
          </TableRow>
        )}
      />
    </Card>
  );
}

function Mt5Workspace() {
  const [selectedLogin, setSelectedLogin] = useState(mt5Accounts[0]?.login ?? null);
  const navigate = useNavigate();

  const selectedAccount = useMemo(
    () => mt5Accounts.find((account) => account.login === selectedLogin) ?? mt5Accounts[0],
    [selectedLogin],
  );
  const selectedLogs = mt5Logs[selectedAccount.login] ?? [];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Connected" value="96.8%" subtext="Bridge uptime across MT5 cluster" trend="up" icon={TrendingUp} />
        <StatCard label="Sync Delay" value="12" subtext="Accounts over 60s latency" trend="warning" icon={Activity} />
        <StatCard label="Restricted" value="08" subtext="Close-only or disabled" trend="danger" icon={CircleAlert} />
        <StatCard label="New Accounts" value="42" subtext="Provisioned today" trend="up" icon={ShieldCheck} />
      </div>

      <Card title="MT5 Account Management" subtitle="Account list, status, and operational controls" padding={false}>
        <Table
          headers={['Login', 'User', 'Server', 'Connection', 'Group', 'Balance', 'Last sync', 'Action']}
          data={mt5Accounts}
          rowRenderer={(account) => (
            <TableRow key={account.login}>
              <TableCell>
                <div className="font-mono text-text">{account.login}</div>
                <div className="text-[11px] text-text-muted">{account.leverage}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-text">{account.user}</div>
                <button
                  type="button"
                  onClick={() => navigate(`/users/${account.userId}`)}
                  className="text-[11px] text-primary hover:underline"
                >
                  Open user dossier
                </button>
              </TableCell>
              <TableCell className="text-text-muted">{account.server}</TableCell>
              <TableCell>
                <Badge variant={account.status === 'CONNECTED' ? 'success' : account.status === 'SYNC_DELAY' ? 'warning' : 'danger'} dot>
                  {account.status}
                </Badge>
                <div className="mt-1 text-[11px] text-text-muted">{account.connection}</div>
              </TableCell>
              <TableCell className="font-mono text-[12px] text-text-muted">{account.group}</TableCell>
              <TableCell className="price-data font-medium text-text">{account.balance}</TableCell>
              <TableCell className="font-mono text-text-muted">{account.lastSync}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="secondary" onClick={() => setSelectedLogin(account.login)}>Open drawer</Button>
              </TableCell>
            </TableRow>
          )}
        />
      </Card>

      <div className="fixed bottom-6 right-6 z-[120] w-full max-w-[420px] rounded-[14px] border border-border/40 bg-surface shadow-[0_16px_60px_rgba(2,6,23,0.45)]">
        <div className="flex items-start justify-between border-b border-border/30 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">Account Details</p>
            <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-text">MT5 {selectedAccount.login}</h3>
          </div>
          <Badge variant={selectedAccount.status === 'CONNECTED' ? 'success' : selectedAccount.status === 'SYNC_DELAY' ? 'warning' : 'danger'} dot>
            {selectedAccount.status}
          </Badge>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Owner', selectedAccount.user],
              ['Server', selectedAccount.server],
              ['Group', selectedAccount.group],
              ['Leverage', selectedAccount.leverage],
              ['Connection', selectedAccount.connection],
              ['Last sync', selectedAccount.lastSync],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[10px] border border-border/30 bg-bg/70 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</div>
                <div className="mt-1 text-[13px] text-text">{value}</div>
              </div>
            ))}
          </div>

          <Card title="Connection Logs" subtitle="Latest bridge events">
            <div className="space-y-3">
              {selectedLogs.map((log) => (
                <div key={`${selectedAccount.login}-${log.time}-${log.event}`} className="rounded-[8px] border border-border/30 bg-bg/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-medium text-text">{log.event}</div>
                    <Badge variant={log.level === 'Info' ? 'info' : log.level === 'Warning' || log.level === 'Review' ? 'warning' : 'danger'}>
                      {log.level}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-text-muted">{log.source}</div>
                  <div className="mt-1 font-mono text-[11px] text-text-muted/80">{log.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export function UserManagementPage() {
  const location = useLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  let content = <UserListWorkspace onOpenFilters={() => setFiltersOpen(true)} />;

  if (location.pathname === '/users/kyc') {
    content = <KycWorkspace />;
  } else if (location.pathname === '/users/activity') {
    content = <ActivityWorkspace />;
  } else if (location.pathname === '/users/mt5') {
    content = <Mt5Workspace />;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-2">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-[780px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">User Operations</p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.06em] text-text">Clean fintech workflow for onboarding, compliance, activity, and MT5 account control</h1>
          <p className="mt-3 text-[14px] leading-6 text-text-muted">
            The sidebar stays global. This workspace handles all user operations, while account-level data lives inside each user dossier for faster review and fewer navigation hops.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-border/40 bg-surface-elevated p-4 text-[12px] xl:min-w-[360px]">
          <div>
            <div className="text-text-muted">Primary queue</div>
            <div className="mt-1 font-medium text-text">User List</div>
          </div>
          <div>
            <div className="text-text-muted">Deep record</div>
            <div className="mt-1 font-medium text-text">User Detail Tabs</div>
          </div>
          <div>
            <div className="text-text-muted">MT5 workflow</div>
            <div className="mt-1 font-medium text-text">Table + account drawer</div>
          </div>
          <div>
            <div className="text-text-muted">Sidebar policy</div>
            <div className="mt-1 font-medium text-text">Global pages only</div>
          </div>
        </div>
      </div>

      <WorkspaceTabs />
      {content}
      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
