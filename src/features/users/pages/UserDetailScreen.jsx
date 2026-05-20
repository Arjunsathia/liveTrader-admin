import React, { useState } from 'react';
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
  Edit2,
  Copy,
  Check,
  Ban,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PageShell } from '../../../components/common/PageShell';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
import { UserDetailContent } from '../components/UserDetailContent';
import { usersService } from '../services/users.service';
import { userDetailTabs } from '../data/userTabs';
import { AddUserDrawer } from '../components/AddUserDrawer';
import { buildUserDraft, applyDraftToUser } from '../config/user-draft.utils';

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
    background: `linear-gradient(135deg, hsl(${seed % 360},45%,28%), hsl(${(seed + 60) % 360},45%,15%))`,
    color: `hsl(${seed % 360},90%,70%)`,
    boxShadow: `0 0 15px color-mix(in srgb, hsl(${seed % 360},90%,70%) 25%, transparent)`,
    border: `1px solid color-mix(in srgb, hsl(${seed % 360},90%,70%) 30%, transparent)`,
  };
}

export function UserDetailScreen() {
  const { userId, tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'overview';
  
  const [user, setUser] = useState(() => usersService.getById(userId));
  const [formOpen, setFormOpen] = useState(false);
  const [userDraft, setUserDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleOpenEdit = () => {
    if (!user) return;
    setUserDraft(buildUserDraft(user));
    setFormOpen(true);
  };

  const handleSaveUser = () => {
    const target = usersService.getById(userId);
    if (target) {
      const updated = applyDraftToUser(target, userDraft);
      Object.assign(target, updated);
      setUser({ ...target });
    }
    setFormOpen(false);
  };

  const handleToggleSuspension = () => {
    const target = usersService.getById(userId);
    if (target) {
      target.suspended = !target.suspended;
      setUser({ ...target });
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Filter profile tab out from right-side deck since its details are sticky in the sidebar
  const filteredTabs = userDetailTabs.filter(t => t.id !== 'profile');

  return (
    <PageShell>
      <div className="space-y-6">
        
        {/* Navigation Breadcrumb Strip */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/users')}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/20 text-text-muted bg-surface-elevated/40 hover:text-text hover:border-border/40 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40">
              User Management <span className="mx-1 text-text-muted/20">/</span> Dossier
            </div>
          </div>
        </div>

        {/* 2-Column Split Dossier Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT COLUMN: Profile Dossier Sidebar (Sticky) ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-5 space-y-5">
            <div className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
              
              {/* Profile Card Header (Seeded HSL Gradient) */}
              <div className="p-6 flex flex-col items-center text-center border-b border-border/12 bg-bg/10 relative">
                
                {/* Seeded HSL Avatar */}
                <div 
                  className="flex h-20 w-20 items-center justify-center rounded-full text-[26px] font-black font-heading select-none transition-transform duration-300 hover:scale-105"
                  style={getAvatarStyle(user.name)}
                >
                  {user.name?.[0] ?? '?'}
                </div>

                <h1 className="text-[20px] font-black tracking-[-0.04em] text-text mt-4 leading-tight">
                  {user.name}
                </h1>
                
                <p className="mt-1 text-[11px] font-mono font-bold uppercase tracking-[0.1em] text-brand leading-none">
                  UID {user.uid}
                </p>

                {/* Badges deck */}
                <div className="flex flex-wrap justify-center items-center gap-1.5 mt-3.5">
                  <StatusBadge status={user.kycStatus} />
                  <StatusBadge status={user.riskStatus} dot={false} />
                  {user.suspended && (
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold border border-negative/25 bg-negative/10 text-negative flex items-center gap-1">
                      <Ban size={9} /> SUSPENDED
                    </span>
                  )}
                </div>
              </div>

              {/* Identity & Metadata quick registry */}
              <div className="p-5 space-y-4 text-[12px]">
                
                {/* Contact items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <Mail size={11} className="text-text-muted/30" /> Email
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-text truncate font-mono text-[11px]">{user.email}</span>
                      <button 
                        onClick={() => handleCopyEmail(user.email)}
                        className="p-1 rounded-[5px] border border-border/20 bg-bg text-text-muted/50 hover:text-text transition-all cursor-pointer shrink-0"
                      >
                        {copied ? <Check size={10} className="text-positive" /> : <Copy size={10} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <Phone size={11} className="text-text-muted/30" /> Phone
                    </span>
                    <span className="font-semibold text-text font-mono text-[11px]">{user.phone || '—'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <Globe size={11} className="text-text-muted/30" /> Country
                    </span>
                    <span className="font-semibold text-text font-mono text-[11px]">{user.country || '—'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <User size={11} className="text-text-muted/30" /> Classification
                    </span>
                    <span className="font-semibold text-text font-heading text-[11px]">{user.segment} · <span className="text-brand font-bold">{user.tier}</span></span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <ExternalLink size={11} className="text-text-muted/30" /> Source
                    </span>
                    <span className="font-semibold text-text-muted text-[11px]">{user.source || 'Direct signup'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <Calendar size={11} className="text-text-muted/30" /> Registered
                    </span>
                    <span className="font-semibold text-text-muted/80 font-mono text-[11px]">{user.registered || '—'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1">
                    <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0">
                      <Clock size={11} className="text-text-muted/30" /> Last Active
                    </span>
                    <span className="font-semibold text-text-muted/80 font-mono text-[11px]">{user.lastSeen || '—'}</span>
                  </div>

                  {user.address && (
                    <div className="flex items-start justify-between gap-3 py-1 border-t border-border/12 pt-3 mt-1">
                      <span className="text-text-muted/40 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5 shrink-0 mt-0.5">
                        <MapPin size={11} className="text-text-muted/30" /> Address
                      </span>
                      <span className="font-medium text-text-muted/80 text-right leading-snug break-words max-w-[200px]">{user.address}</span>
                    </div>
                  )}
                </div>

                {/* Quick Action Button deck */}
                <div className="flex gap-2 border-t border-border/12 pt-4 mt-2">
                  
                  <button 
                    onClick={handleOpenEdit}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    <Edit2 size={11} /> Edit Profile
                  </button>

                  <button 
                    onClick={handleToggleSuspension}
                    className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[8px] text-[11px] font-bold cursor-pointer border transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97]
                      ${user.suspended
                        ? 'border-positive/20 bg-positive/[0.04] text-positive'
                        : 'border-negative/20 bg-negative/[0.04] text-negative'
                      }`}
                  >
                    {user.suspended ? (
                      <>
                        <ShieldCheck size={11} /> Unsuspend
                      </>
                    ) : (
                      <>
                        <Ban size={11} /> Suspend
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN: Content Tabs & Data Panels ── */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Modular Tab Navigation Deck */}
            <div className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle px-4 overflow-hidden">
              <div className="flex gap-1 overflow-x-auto no-scrollbar pt-1.5 pb-0.5">
                {filteredTabs.map((t) => {
                  const Icon = tabIcons[t.id] ?? User;
                  const active = t.id === activeTab;

                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate(`/users/${userId}/${t.id}`)}
                      className={`group relative flex h-11 items-center gap-2 border-b-2 px-3.5 transition-all duration-200 cursor-pointer whitespace-nowrap
                        ${active
                          ? 'border-brand text-brand font-bold'
                          : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                        }`}
                    >
                      <Icon size={13} className={active ? 'text-brand' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                      <span className="text-[11px] font-bold uppercase tracking-wider font-heading">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Dossier Details Display Card */}
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              <Card padding={true}>
                <UserDetailContent user={user} activeTab={activeTab} />
              </Card>
            </div>

          </div>

        </div>

      </div>

      {/* Profile Edit Modal Drawer */}
      <AddUserDrawer
        open={formOpen}
        mode="edit"
        draft={userDraft}
        setDraft={setUserDraft}
        onSubmit={handleSaveUser}
        onClose={() => setFormOpen(false)}
      />
    </PageShell>
  );
}
