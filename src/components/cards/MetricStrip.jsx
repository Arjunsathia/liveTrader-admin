import React from 'react';
import { StatCard } from '../../components/ui/Card';

export function MetricStrip({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          subtext={metric.subtext}
          trend={metric.trend}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
