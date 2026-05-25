import React, { useMemo, useState } from 'react';
import { Download, FileCheck, Layers, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/layout/PageShell';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { TableToolbar } from '../../../components/common/table';
import { KYCTable } from '../components/KYCTable';
import { kycService } from '../services/kycService';
import { KYC_OPTIONS } from "@/config/constants/USER_FORM";

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

function KYCQueuePage() {
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
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="KYC Audit Queue"
            count={filteredKyc.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); tableState.setPage(1); }}
            searchPlaceholder="Search case registry..."
            filters={
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
            }
          />

          <KYCTable
            tableState={tableState}
            onReviewUser={(nextUserId) => navigate(`/users/${nextUserId}/kyc`)}
          />
        </section>

      </div>
    </PageShell>
  );
}
export default KYCQueuePage;
