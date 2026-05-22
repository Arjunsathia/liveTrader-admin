import React, { useMemo, useState } from 'react';
import { Download, FileCheck, Layers, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/layout/PageShell';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { KYCTable } from '../components/KYCTable';
import { kycService } from '../services/kyc.service';
import { KYC_OPTIONS } from '../../users/forms/user-form.constants';

const USER_NAV_TABS = [
  { id: 'list', label: 'User Directory', path: '/users', Icon: Users },
  { id: 'kyc', label: 'KYC Requests', path: '/users/kyc', Icon: FileCheck },
  { id: 'mt5', label: 'MT5 Accounts', path: '/users/mt5', Icon: Layers },
];

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Compliance & Verification',
  title: 'KYC Requests Queue',
  description: 'Audit submitted identification documents, AML risk triggers, and KYC verification levels.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function KYCQueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');

  const filteredKyc = useMemo(
    () => {
      let rows = filterBySearch(kycService.list(), search, ['id', 'user', 'tier', 'country', 'status']);
      if (kycFilter !== 'all') {
        rows = rows.filter((r) => r.status === kycFilter);
      }
      return rows;
    },
    [search, kycFilter]
  );

  const tableState = useTableState(filteredKyc, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <div className="space-y-5">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredKyc, `kyc-queue.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Queue
            </button>
          </div>
        </header>



        {/* ── Table registry panel ── */}
        <Card padding={false}>
          {/* Custom Premium Table Header Panel */}
          <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: PAGE.accent }}
              />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                KYC Audit Queue
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border font-mono animate-fade-in"
                style={{
                  color: PAGE.accent,
                  background: `color-mix(in srgb, ${PAGE.accent} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${PAGE.accent} 22%, transparent)`,
                }}
              >
                {filteredKyc.length}
              </span>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); tableState.setPage(1); }}
                  placeholder="Search case registry..."
                  className="h-7 pl-7 pr-3 w-40 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
              </div>

              {/* KYC Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] text-text-muted/45 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={kycFilter}
                  onChange={(e) => { setKycFilter(e.target.value); tableState.setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-4 outline-none focus:border-brand/40 transition-all cursor-pointer"
                  style={{ minWidth: '76px' }}
                >
                  <option value="all">ALL</option>
                  {KYC_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <KYCTable
            tableState={tableState}
            onReviewUser={(nextUserId) => navigate(`/users/${nextUserId}/kyc`)}
          />
        </Card>

      </div>
    </PageShell>
  );
}
export default KYCQueuePage;
