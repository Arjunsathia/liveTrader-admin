import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart2, 
  User, 
  FileCheck, 
  Wallet, 
  Monitor, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Edit2 
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
import { UserDetailContent } from '../components/UserDetailContent';
import { usersService } from '../services/users.service';
import { userDetailTabs } from '../data/userTabs';

const tabIcons = {
  overview: BarChart2,
  profile: User,
  kyc: FileCheck,
  wallet: Wallet,
  'mt5-accounts': Monitor,
  'trading-history': TrendingUp,
  'activity-logs': Activity,
  'risk-view': ShieldAlert,
  notes: Edit2,
};

function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `hsl(${seed % 360},35%,22%)`,
    color: `hsl(${seed % 360},80%,65%)`,
    border: `1px solid hsl(${seed % 360},40%,30%)`,
  };
}

export function UserDetailScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const user = useMemo(() => usersService.getById(userId), [userId]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold text-text">User Not Found</h2>
        <p className="mt-2 text-text-muted">The user with ID {userId} could not be located.</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-[40] -mx-4 md:-mx-8 mb-6 border-b border-white/[0.06] bg-bg/80 backdrop-blur-md px-4 md:px-8 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border/25 text-text-muted hover:bg-surface-bright/20 hover:text-text transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-text">{user.name}</h1>
              <p className="mt-1 text-[13px] font-medium text-text-muted/50">UID {user.uid} · {user.segment} · {user.tier}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={user.kycStatus} />
            <StatusBadge status={user.riskStatus} dot={false} />
            <Button variant="primary" icon={Edit2}>Edit User</Button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {userDetailTabs.map((tab) => {
            const Icon = tabIcons[tab.id] ?? User;
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex h-11 items-center gap-2.5 border-b-2 px-4 transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                  }`}
              >
                <Icon size={14} className={active ? 'text-primary' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                <span className="text-[12px] font-bold uppercase tracking-wider font-heading">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Card padding={true}>
          <UserDetailContent user={user} activeTab={activeTab} />
        </Card>
      </div>
    </div>
  );
}

