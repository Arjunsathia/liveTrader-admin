import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { OVERVIEW_KPIS, INTEGRATIONS_LIST, QUICK_LINKS } from '../configs/overview.config';

import { KpiCard } from '../../../components/cards';

/**
 * PlatformOverviewPage — High-level dashboard of platform health, integrations, and quick navigation.
 */
export function PlatformOverviewPage({ setSection }) {
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'OK':
      case 'CONNECTED':
      case 'HEALTHY':
        return 'var(--positive)';
      case 'WARN':
      case 'DEGRADED':
        return 'var(--warning)';
      case 'ERROR':
      case 'OFFLINE':
        return 'var(--negative)';
      default:
        return 'var(--cyan)';
    }
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Platform Overview"
        desc="A real-time snapshot of system statuses, integration health, and rapid-access configuration areas."
      />

      {/* KPI strip */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {OVERVIEW_KPIS.map(({ label, value, color, Icon, sub }) => (
          <KpiCard
            key={label}
            label={label}
            value={value}
            accent={color}
            Icon={Icon}
            sub={sub}
          />
        ))}
      </section>

      {/* Integrations Grid */}
      <SettingsCard
        title="Active System Integrations"
        desc="Real-time operational metrics and latencies across connected service channels."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {INTEGRATIONS_LIST.map(({ name, status, uptime, latency, icon: IconComponent }) => {
            const dotColor = getStatusDotColor(status);
            return (
              <div
                key={name}
                className="flex flex-col gap-3 p-4 rounded-[10px] border border-border/20 bg-bg/40 hover:border-border/30 hover:bg-surface-elevated/45 hover:scale-[1.02] transition-all duration-300 group/integration"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    {IconComponent && (
                      <div className="w-8 h-8 rounded-[8px] bg-muted-surface border border-border/30 flex items-center justify-center text-text-muted/50 group-hover/integration:text-primary transition-colors">
                        <IconComponent size={13} />
                      </div>
                    )}
                    <span className="text-[12.5px] font-semibold text-text-muted group-hover/integration:text-text transition-colors leading-tight">
                      {name}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider"
                    style={{
                      color: dotColor,
                      background: `color-mix(in srgb, ${dotColor} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${dotColor} 20%, transparent)`,
                    }}
                  >
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: dotColor }} />
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10.5px] font-heading text-text-muted/40 mt-1">
                  <span>
                    Uptime <strong className="text-text/60 font-semibold">{uptime}</strong>
                  </span>
                  <span>
                    Latency <strong className="text-text/60 font-semibold">{latency}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SettingsCard>

      {/* Navigation Quick Links */}
      <SettingsCard
        title="Settings Categories"
        desc="Jump directly to any modular configuration partition below."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {QUICK_LINKS.map(({ id, label, Icon, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className="flex flex-col items-start gap-2.5 p-4 rounded-[10px] border border-border/20 bg-bg/40 hover:border-border/30 hover:bg-surface-elevated/45 hover:scale-[1.02] transition-all duration-300 group/btn cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-[8px] bg-muted-surface border border-border/30 flex items-center justify-center text-text-muted/50 group-hover/btn:bg-brand/10 group-hover/btn:border-brand/30 group-hover/btn:text-brand transition-all duration-300">
                {Icon && <Icon size={14} className="group-hover/btn:animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-text-muted group-hover/btn:text-text transition-colors leading-tight">
                  {label}
                </div>
                <p className="text-[10px] text-text-muted/35 font-heading mt-0.5 leading-snug">
                  {desc}
                </p>
              </div>
              <ArrowRight
                size={12}
                className="text-text-muted/20 group-hover/btn:text-brand transition-colors mt-auto self-end"
              />
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

export default PlatformOverviewPage;
