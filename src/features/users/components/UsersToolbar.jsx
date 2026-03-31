import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, Filter, Search, UserPlus, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { FUNDING_OPTIONS, KYC_OPTIONS, RISK_OPTIONS } from '../config/userFormConfig';

const viewOptions = [
  { id: 'list', label: 'User List' },
  { id: 'kyc', label: 'KYC Queue' },
  { id: 'mt5', label: 'MT5 Accounts' },
];

function FilterDropdown({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 items-center gap-2 rounded-[9px] border border-border/30 bg-bg/70 px-3 text-[12px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
      >
        {label}
        {value !== 'all' && (
          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            {selected?.label}
          </span>
        )}
        <ChevronDown size={12} className="text-text-muted/50" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-border/40 bg-surface p-1 shadow-[0_16px_40px_rgba(2,6,23,0.2)]">
          <button
            type="button"
            onClick={() => { onChange('all'); setOpen(false); }}
            className="flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[12px] text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
          >
            All
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-[12px] text-text transition-colors hover:bg-surface-elevated"
            >
              {option.label}
              {value === option.value && <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">On</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative min-w-[220px] flex-1">
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-border/30 bg-bg/70 pl-10 pr-4 text-[13px] text-text outline-none transition-all placeholder:text-text-muted/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

export function UsersToolbar({
  view,
  search,
  onSearchChange,
  onChangeView,
  onOpenAdd,
  onExport,
  kycFilter,
  onChangeKycFilter,
  riskFilter,
  onChangeRiskFilter,
  fundingFilter,
  onChangeFundingFilter,
}) {
  const activeChips = [
    kycFilter !== 'all' && { key: 'kyc', label: `KYC: ${KYC_OPTIONS.find((option) => option.value === kycFilter)?.label}`, onClear: () => onChangeKycFilter('all') },
    riskFilter !== 'all' && { key: 'risk', label: `Risk: ${RISK_OPTIONS.find((option) => option.value === riskFilter)?.label}`, onClear: () => onChangeRiskFilter('all') },
    fundingFilter !== 'all' && { key: 'funding', label: `Funding: ${FUNDING_OPTIONS.find((option) => option.value === fundingFilter)?.label}`, onClear: () => onChangeFundingFilter('all') },
  ].filter(Boolean);

  const placeholder = view === 'kyc'
    ? 'Search case ID, user, tier, or country'
    : view === 'mt5'
      ? 'Search login, user, server, or group'
      : 'Search name, UID, email, phone, or segment';

  return (
    <section className="rounded-[14px] border border-border/35 bg-surface-elevated p-4 shadow-[0_12px_32px_rgba(2,6,23,0.06)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* 
          {viewOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeView(option.id)}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${view === option.id ? 'bg-primary text-bg shadow-[0_10px_24px_rgba(255,193,7,0.22)]' : 'bg-bg/70 text-text-muted hover:bg-bg hover:text-text'}`}
            >
              {option.label}
            </button>
          ))} 
          */}
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-border/30 bg-bg/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/55 lg:flex">
            <Users size={12} />
            Operator workspace
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={onSearchChange} placeholder={placeholder} />

          {view === 'list' && (
            <Button variant="primary" onClick={onOpenAdd} icon={UserPlus}>
              Add User
            </Button>
          )}

          <Button variant="secondary" onClick={onExport} icon={Download}>
            Export
          </Button>
        </div>

        {view === 'list' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">
              <Filter size={11} />
              Filters
            </span>
            <FilterDropdown label="KYC" value={kycFilter} onChange={onChangeKycFilter} options={KYC_OPTIONS} />
            <FilterDropdown label="Risk" value={riskFilter} onChange={onChangeRiskFilter} options={RISK_OPTIONS} />
            <FilterDropdown label="Funding" value={fundingFilter} onChange={onChangeFundingFilter} options={FUNDING_OPTIONS} />
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChangeKycFilter('all');
                  onChangeRiskFilter('all');
                  onChangeFundingFilter('all');
                }}
                className="ml-1 text-[11px] font-semibold text-text-muted transition-colors hover:text-text"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {view === 'list' && activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onClear}
                className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-semibold text-primary transition-opacity hover:opacity-80"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
