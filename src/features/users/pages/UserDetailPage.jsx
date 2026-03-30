import React from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CircleAlert,
  Clock3,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  UserCircle2,
  Wallet,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, StatCard } from '../../../components/ui/Card';
import { Table, TableCell, TableRow } from '../../../components/ui/Table';
import { getUserById, userDetailTabs } from '../data/userAdminData';

function DetailTabs({ userId }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2 rounded-[10px] border border-border/40 bg-surface-elevated p-2">
      {userDetailTabs.map((tab) => {
        const path = `/users/${userId}/${tab.id}`;
        const active = location.pathname === path;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(path)}
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

function SummaryStrip({ user }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Wallet Balance" value={user.walletBalance} subtext={`30d PnL ${user.pnl30d}`} trend={user.pnl30d.startsWith('+') ? 'up' : 'danger'} icon={Wallet} />
      <StatCard label="KYC Status" value={user.kycStatus} subtext={`Level ${user.kyc.level}`} trend={user.kycStatus === 'VERIFIED' ? 'up' : user.kycStatus === 'PENDING' ? 'warning' : 'danger'} icon={ShieldCheck} />
      <StatCard label="MT5 Accounts" value={String(user.mt5Accounts).padStart(2, '0')} subtext={`${user.openPositions} live positions`} trend="up" icon={TrendingUp} />
      <StatCard label="Risk Score" value={user.risk.score} subtext={user.riskStatus} trend={user.riskStatus === 'LOW' ? 'up' : user.riskStatus === 'WATCHLIST' ? 'warning' : 'danger'} icon={CircleAlert} />
    </div>
  );
}

function OverviewTab({ user }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
      <Card title="Account Summary" subtitle="Operator view">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Segment', user.segment],
            ['Tier', user.tier],
            ['Country', user.country],
            ['Source', user.source],
            ['Registered', user.registered],
            ['Last seen', user.lastSeen],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[10px] border border-border/30 bg-bg/70 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{label}</div>
              <div className="mt-1 text-[13px] text-text">{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Operator Notes" subtitle="CRM summary">
        <div className="rounded-[10px] border border-border/30 bg-bg/70 p-4 text-[14px] leading-6 text-text-muted">
          {user.notes}
        </div>
        <div className="mt-4 space-y-3">
          {user.risk.alerts.map((alert) => (
            <div key={alert} className="rounded-[8px] border border-warning/20 bg-warning/5 p-3 text-[13px] text-warning">
              {alert}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <Card title="Profile" subtitle="Primary identity and contact data">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          ['Full name', user.name],
          ['Email', user.email],
          ['Phone', user.phone],
          ['Date of birth', user.dob],
          ['Address', user.address],
          ['Jurisdiction', user.country],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[10px] border border-border/30 bg-bg/70 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{label}</div>
            <div className="mt-1 text-[14px] text-text">{value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function KycTab({ user }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
      <Card title="KYC Review" subtitle="Verification record">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Review level', user.kyc.level],
            ['Submitted', user.kyc.submittedAt],
            ['Reviewer', user.kyc.reviewer],
            ['Status', user.kycStatus],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[10px] border border-border/30 bg-bg/70 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{label}</div>
              <div className="mt-1 text-[13px] text-text">{value}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Documents" subtitle="Submitted artifacts">
        <div className="space-y-3">
          {user.kyc.documents.map((doc) => (
            <div key={doc} className="flex items-center justify-between rounded-[8px] border border-border/30 bg-bg/70 p-3">
              <span className="text-[13px] text-text">{doc}</span>
              <Badge variant="success">Received</Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[10px] border border-border/30 bg-bg/70 p-4 text-[13px] leading-6 text-text-muted">
          {user.kyc.aml}
        </div>
      </Card>
    </div>
  );
}

function WalletTab({ user }) {
  return (
    <Card title="Wallet" subtitle="Balances, availability, and holds" padding={false}>
      <Table
        headers={['Asset', 'Balance', 'Available', 'Hold']}
        data={user.wallet}
        rowRenderer={(item) => (
          <TableRow key={item.asset}>
            <TableCell className="font-medium text-text">{item.asset}</TableCell>
            <TableCell className="price-data text-text">{item.balance}</TableCell>
            <TableCell className="price-data text-text-muted">{item.available}</TableCell>
            <TableCell className="price-data text-text-muted">{item.hold}</TableCell>
          </TableRow>
        )}
      />
    </Card>
  );
}

function Mt5Tab({ user }) {
  return (
    <Card title="MT5 Accounts" subtitle="Linked accounts, leverage, and sync state" padding={false}>
      <Table
        headers={['Login', 'Server', 'Group', 'Leverage', 'Status', 'Equity', 'Margin level', 'Last sync']}
        data={user.mt5}
        rowRenderer={(account) => (
          <TableRow key={account.login}>
            <TableCell className="font-mono text-text">{account.login}</TableCell>
            <TableCell className="text-text-muted">{account.server}</TableCell>
            <TableCell className="font-mono text-[12px] text-text-muted">{account.group}</TableCell>
            <TableCell className="text-text-muted">{account.leverage}</TableCell>
            <TableCell>
              <Badge variant={account.status === 'CONNECTED' ? 'success' : account.status === 'SYNC_DELAY' ? 'warning' : 'danger'} dot>
                {account.status}
              </Badge>
            </TableCell>
            <TableCell className="price-data text-text">{account.equity}</TableCell>
            <TableCell className="text-text-muted">{account.marginLevel}</TableCell>
            <TableCell className="font-mono text-text-muted">{account.lastSync}</TableCell>
          </TableRow>
        )}
      />
    </Card>
  );
}

function TradingTab({ user }) {
  return (
    <Card title="Trading History" subtitle="Recent closed activity" padding={false}>
      <Table
        headers={['Ticket', 'Symbol', 'Side', 'Lots', 'Open', 'Close', 'PnL', 'Time']}
        data={user.tradingHistory}
        rowRenderer={(trade) => (
          <TableRow key={trade.ticket}>
            <TableCell className="font-mono text-text-muted">{trade.ticket}</TableCell>
            <TableCell className="font-medium text-text">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant={trade.side === 'BUY' ? 'success' : 'danger'}>{trade.side}</Badge>
            </TableCell>
            <TableCell className="font-mono text-text-muted">{trade.lots}</TableCell>
            <TableCell className="font-mono text-text-muted">{trade.open}</TableCell>
            <TableCell className="font-mono text-text-muted">{trade.close}</TableCell>
            <TableCell className={`${trade.pnl.startsWith('+') ? 'text-positive' : 'text-negative'} price-data font-medium`}>{trade.pnl}</TableCell>
            <TableCell className="font-mono text-text-muted">{trade.time}</TableCell>
          </TableRow>
        )}
      />
    </Card>
  );
}

function ActivityTab({ user }) {
  return (
    <Card title="Activity Logs" subtitle="System and operator events" padding={false}>
      <Table
        headers={['Time', 'Actor', 'Action', 'Channel']}
        data={user.activity}
        rowRenderer={(item) => (
          <TableRow key={`${item.time}-${item.action}`}>
            <TableCell className="font-mono text-text-muted">{item.time}</TableCell>
            <TableCell className="text-text">{item.actor}</TableCell>
            <TableCell className="text-text-muted">{item.action}</TableCell>
            <TableCell className="text-text-muted">{item.channel}</TableCell>
          </TableRow>
        )}
      />
    </Card>
  );
}

function RiskTab({ user }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
      <Card title="Risk Summary" subtitle="Exposure and concentration">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Risk score', user.risk.score],
            ['Exposure', user.risk.exposure],
            ['Concentration', user.risk.concentration],
            ['Drawdown', user.risk.drawdown],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[10px] border border-border/30 bg-bg/70 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{label}</div>
              <div className="mt-1 text-[13px] text-text">{value}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Risk Alerts" subtitle="Flags needing operator attention">
        <div className="space-y-3">
          {user.risk.alerts.map((alert) => (
            <div key={alert} className="rounded-[8px] border border-negative/20 bg-negative/5 p-4 text-[13px] text-negative">
              {alert}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function UserDetailPage() {
  const { id, tab = 'overview' } = useParams();
  const navigate = useNavigate();
  const user = getUserById(id);

  if (!user) {
    return <Navigate to="/users/list" replace />;
  }

  const validTabs = new Set(userDetailTabs.map((item) => item.id));
  const activeTab = validTabs.has(tab) ? tab : 'overview';

  let content = <OverviewTab user={user} />;
  if (activeTab === 'profile') content = <ProfileTab user={user} />;
  if (activeTab === 'kyc') content = <KycTab user={user} />;
  if (activeTab === 'wallet') content = <WalletTab user={user} />;
  if (activeTab === 'mt5') content = <Mt5Tab user={user} />;
  if (activeTab === 'trading') content = <TradingTab user={user} />;
  if (activeTab === 'activity') content = <ActivityTab user={user} />;
  if (activeTab === 'risk') content = <RiskTab user={user} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-2">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/users/list')}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-text-muted hover:text-text"
          >
            <ArrowLeft size={14} />
            Back to User List
          </button>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/30 bg-surface-elevated text-[22px] font-semibold text-primary">
              {user.name[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[34px] font-semibold tracking-[-0.06em] text-text">{user.name}</h1>
                <Badge variant={user.kycStatus === 'VERIFIED' ? 'success' : user.kycStatus === 'PENDING' ? 'warning' : 'danger'} dot>{user.kycStatus}</Badge>
                <Badge variant={user.riskStatus === 'LOW' ? 'success' : user.riskStatus === 'WATCHLIST' ? 'warning' : 'danger'}>{user.riskStatus}</Badge>
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-[13px] text-text-muted">
                <span className="inline-flex items-center gap-1.5"><UserCircle2 size={14} /> UID {user.uid}</span>
                <span className="inline-flex items-center gap-1.5"><CreditCard size={14} /> {user.tier}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> Last seen {user.lastSeen}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Freeze Wallet</Button>
          <Button variant="secondary">Manual KYC Review</Button>
          <Button variant="primary" onClick={() => navigate(`/users/${user.id}/mt5`)}>Open MT5 Controls</Button>
        </div>
      </div>

      <SummaryStrip user={user} />
      <DetailTabs userId={user.id} />
      {content}
    </div>
  );
}
