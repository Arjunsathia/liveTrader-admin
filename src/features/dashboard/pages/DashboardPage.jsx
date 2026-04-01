import React from 'react';
import { PageShell } from '../../../layout/PageShell';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { DashboardKpis } from '../components/DashboardKpis';
import { DashboardChart } from '../components/DashboardChart';
import { DashboardAlerts } from '../components/DashboardAlerts';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { DashboardStream } from '../components/DashboardStream';
import { DashboardMarket } from '../components/DashboardMarket';
import { DashboardHealth } from '../components/DashboardHealth';

export function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Main Dashboard"
        title="Command Center Overview"
        description="Monitor platform health, financial flows, and active trading operations in real-time."
      />

      {/* ── ROW 1: KPIs ───────────────────────────────── */}
      <DashboardKpis />

      {/* ── ROW 2: Chart + Ops Queue + Quick Actions ─── */}
      <section className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <DashboardChart />
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <DashboardAlerts />
          <DashboardQuickActions />
        </div>
      </section>

      {/* ── ROW 3: Activity Ledger + Market + Health ─── */}
      <section className="grid grid-cols-12 gap-5 items-start">
        <div className="col-span-12 xl:col-span-8">
          <DashboardStream />
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <DashboardMarket />
          <DashboardHealth />
        </div>
      </section>
    </PageShell>
  );
}
