import React from 'react';
import { KpiCard } from '../../../components/cards/KpiCard';

export function TradingStatsCards({ kpis }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      {kpis.map((k) => (
        <KpiCard 
          key={k.label} 
          label={k.label}
          value={k.value}
          sub={k.sub}
          Icon={k.Icon}
          accent={k.accent}
          // Mapping any potential trend data if available in config
          trend={k.trend}
          trendUp={k.trendUp}
        />
      ))}
    </section>
  );
}
