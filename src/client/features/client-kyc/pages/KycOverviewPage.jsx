import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Clock3, History, ShieldCheck,
  CheckCircle2, RefreshCw, Sparkles, AlertCircle,
  TrendingUp, CircleDollarSign, KeyRound, Lock,
} from 'lucide-react';
import { KycStatusCard } from '../components/KycStatusCard';
import { KycRequirementsBox } from '../components/KycRequirementsBox';
import { KycHelpBox } from '../components/KycHelpBox';
import { useKyc } from '../hooks/useKyc';

export function KycOverviewPage() {
  const navigate = useNavigate();
  const { overview, loading, error } = useKyc();

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="max-w-[1220px] mx-auto space-y-5 px-4 sm:px-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-muted-surface rounded-full" />
          <div className="h-8 w-56 bg-muted-surface rounded-[9px]" />
        </div>
        <div className="h-[148px] w-full bg-surface-elevated rounded-[16px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-surface-elevated rounded-[12px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="h-80 bg-surface-elevated rounded-[12px]" />
          <div className="h-80 bg-surface-elevated rounded-[12px]" />
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="max-w-[1220px] mx-auto flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-negative/10 flex items-center justify-center mb-4">
          <ShieldCheck size={24} className="text-negative" />
        </div>
        <p className="text-[14px] font-bold text-text mb-1">Failed to load verification</p>
        <p className="text-[12.5px] text-text-muted mb-5">
          Unable to retrieve your KYC status. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  /* ── Derive step state from progress ── */
  const progress = overview?.progress ?? 0;
  const completedSteps = [
    progress >= 25,
    progress >= 50,
    progress >= 75,
    progress >= 100,
  ];

  const currentStep = Math.min(completedSteps.filter(Boolean).length + 1, 4);
  const canContinue = overview?.status !== 'verified';

  /* ── Simple, Friendly Verification Levels ── */
  const TIERS = [
    {
      level: 'Level 1 (Basic)',
      desc: 'Name, birthdate, and contact details.',
      limit: '$5,000 daily limit',
      leverage: 'Standard trading features',
      status: completedSteps[0] ? 'completed' : 'active',
      badgeCls: completedSteps[0] ? 'bg-positive/10 text-positive border-positive/20' : 'bg-brand/10 text-brand border-brand/20',
      badgeText: completedSteps[0] ? 'Completed' : 'Active',
      features: ['Basic profile', 'Standard trading'],
      icon: CircleDollarSign,
    },
    {
      level: 'Level 2 (Standard)',
      desc: 'Government-issued ID and a selfie.',
      limit: '$50,000 daily limit',
      leverage: 'Advanced trading features',
      status: (completedSteps[1] && completedSteps[2]) ? 'completed' : (!completedSteps[0] ? 'locked' : 'active'),
      badgeCls: (completedSteps[1] && completedSteps[2])
        ? 'bg-positive/10 text-positive border-positive/20'
        : (!completedSteps[0] ? 'bg-border/20 text-text-muted/65 border-border/20' : 'bg-brand/10 text-brand border-brand/20'),
      badgeText: (completedSteps[1] && completedSteps[2]) ? 'Completed' : (!completedSteps[0] ? 'Locked' : 'Available'),
      features: ['ID upload', 'Selfie verify', 'Copy trading'],
      icon: TrendingUp,
    },
    {
      level: 'Level 3 (Premium)',
      desc: 'Utility bill or bank statement.',
      limit: 'No daily limit',
      leverage: 'All features unlocked',
      status: completedSteps[3] ? 'completed' : (!(completedSteps[1] && completedSteps[2]) ? 'locked' : 'active'),
      badgeCls: completedSteps[3]
        ? 'bg-positive/10 text-positive border-positive/20'
        : (!(completedSteps[1] && completedSteps[2]) ? 'bg-border/20 text-text-muted/65 border-border/20' : 'bg-brand/10 text-brand border-brand/20'),
      badgeText: completedSteps[3] ? 'Completed' : (!(completedSteps[1] && completedSteps[2]) ? 'Locked' : 'Available'),
      features: ['Address proof', 'Priority support', 'Bank wires'],
      icon: KeyRound,
    },
  ];

  return (
    <div className="max-w-[1220px] mx-auto space-y-6 sm:px-0 px-4 text-left">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted">
            Account security
          </p>
          <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-0.5">
            Verify your identity
          </h1>
          <p className="text-[13px] text-text-muted mt-1">
            Verify who you are to increase your limits and unlock trading features.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/client/kyc/history')}
            className="h-10 px-4 rounded-[9px] border border-border/40 bg-surface-elevated text-[12px] font-bold flex items-center gap-2 hover:bg-muted-surface/50 transition-colors cursor-pointer text-text"
          >
            <History size={14} /> History
          </button>
        </div>
      </div>

      {/* ── Glassmorphic Status Hero ── */}
      <KycStatusCard overview={overview} />

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">

        {/* ── Left Column: Verification Levels ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[17px] text-text flex items-center gap-2">
              <Sparkles size={16} className="text-brand" /> Levels &amp; benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {TIERS.map((tier) => {
              const TierIcon = tier.icon;
              const isLocked = tier.status === 'locked';
              const isDone = tier.status === 'completed';

              return (
                <div
                  key={tier.level}
                  className={`relative rounded-[12px] border p-5 transition-all duration-150 ${
                    isDone
                      ? 'border-positive/20 bg-positive/[0.01]'
                      : isLocked
                        ? 'border-border/10 bg-transparent opacity-50'
                        : 'border-brand/20 bg-brand/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Level info & Features */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2.5 text-left">
                        <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-positive/10 text-positive' : isLocked ? 'bg-muted-surface text-text-muted/30' : 'bg-brand/10 text-brand'
                        }`}>
                          {isLocked ? <Lock size={12} /> : <TierIcon size={12} />}
                        </div>
                        <div>
                          <h3 className="text-[13.5px] font-bold text-text leading-none">{tier.level}</h3>
                          <p className="text-[11px] text-text-muted/75 mt-1">{tier.desc}</p>
                        </div>
                      </div>

                      {/* Clean features list */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pl-[38px] text-left">
                        {tier.features.map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-[10.5px] text-text-muted">
                            <CheckCircle2 size={10} className={isLocked ? 'text-text-muted/20' : isDone ? 'text-positive' : 'text-brand/60'} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Limits, Leverage & Status */}
                    <div className="flex items-center sm:text-right gap-5 justify-between sm:justify-end shrink-0 pl-[38px] sm:pl-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/10">
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-bold text-text">{tier.limit}</p>
                        <p className="text-[10px] text-text-muted/70">{tier.leverage}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border text-[8.5px] font-black uppercase tracking-[0.05em] shrink-0 ${tier.badgeCls}`}>
                        {tier.badgeText}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button below levels */}
          {canContinue && (
            <div className="rounded-[12px] bg-muted-surface/30 border border-border/25 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-brand shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-[12.5px] font-bold text-text">Complete verification</h4>
                  <p className="text-[11.5px] text-text-muted leading-relaxed mt-0.5">
                    Finish the next steps to unlock Level {currentStep}. This takes under 5 minutes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/client/kyc/upload')}
                className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[11.5px] font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.15)] cursor-pointer shrink-0"
              >
                {progress > 0 ? 'Continue' : 'Start'}
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ── Right Column: Checklist & FAQs ── */}
        <div className="space-y-5">
          {/* Checklist progress box */}
          <KycRequirementsBox completed={completedSteps} current={currentStep} />

          {/* Interactive FAQs Accordion */}
          <KycHelpBox />
        </div>

      </div>

    </div>
  );
}

export default KycOverviewPage;