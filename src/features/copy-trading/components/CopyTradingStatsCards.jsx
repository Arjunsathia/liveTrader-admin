import React from 'react';
import { KpiCard } from '../../../components/cards/KpiCard';

/**
 * CopyTradingStatsCards — mirrors TradingStatsCards.
 * Renders a 6-column KPI grid from the config's kpis array.
 */
export function CopyTradingStatsCards({ kpis }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k) => (
        <KpiCard
          key={k.label}
          label={k.label}
          value={k.value}
          sub={k.sub}
          Icon={k.Icon}
          accent={k.accent}
        />
      ))}
    </section>
  );
}
