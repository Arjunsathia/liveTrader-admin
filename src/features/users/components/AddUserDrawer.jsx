import React, { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { Button } from '../../../components/ui/Button';
import {
  FUNDING_OPTIONS,
  KYC_OPTIONS,
  LEVERAGE_OPTIONS,
  RISK_OPTIONS,
  SEGMENT_OPTIONS,
  SERVER_OPTIONS,
  TIER_OPTIONS,
} from '../config/userFormConfig';

function TextField({ label, value, onChange, placeholder, type = 'text', mono = false }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${mono ? 'font-mono' : ''}`}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-[10px] border border-border/25 bg-bg px-3 pr-8 text-[12px] text-text outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            typeof option === 'string'
              ? <option key={option} value={option}>{option}</option>
              : <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/45" />
      </div>
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-[10px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function ToggleField({ label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-border/20 bg-bg/50 px-3 py-3">
      <div>
        <div className="text-[12px] font-medium text-text">{label}</div>
        {description && <div className="mt-1 text-[11px] text-text-muted/60">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{ background: checked ? 'var(--brand)' : 'var(--border)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </button>
    </div>
  );
}

function DrawerSection({ title, children, collapsible = false }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="space-y-3 border-b border-border/15 pb-5 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/55">{title}</span>
        {collapsible && (
          <ChevronDown
            size={13}
            className="text-text-muted/45 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </section>
  );
}

export function AddUserDrawer({
  open,
  mode,
  draft,
  setDraft,
  onSubmit,
  onClose,
}) {
  const isValid = draft.name.trim() && draft.email.trim() && draft.country.trim();
  const title = mode === 'edit' ? 'Edit User' : 'Create User';
  const subtitle = mode === 'edit'
    ? 'Update identity, onboarding, and account settings without leaving the users workspace.'
    : 'Onboard a new user with funding, KYC, and MT5 preferences in one place.';

  const setField = (field) => (value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <AdminDrawer
      open={open}
      title={title}
      subtitle={subtitle}
      eyebrow="User Form"
      width="max-w-[720px]"
      onClose={onClose}
      footer={(
        <div className="space-y-3">
          {!isValid && (
            <div className="flex items-center gap-2 rounded-[10px] border border-warning/30 bg-warning/8 px-3 py-2 text-warning">
              <AlertTriangle size={14} />
              <span className="text-[12px]">Full name, email, and country are required before saving.</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onSubmit} disabled={!isValid}>
              {mode === 'edit' ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Identity">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <TextField label="Full Name" value={draft.name} onChange={setField('name')} placeholder="Jane Doe" />
            <TextField label="Email" value={draft.email} onChange={setField('email')} placeholder="jane@example.com" type="email" />
            <TextField label="Phone" value={draft.phone} onChange={setField('phone')} placeholder="+1 555 120 4567" />
            <TextField label="Country" value={draft.country} onChange={setField('country')} placeholder="US" mono />
            <TextField label="Nationality" value={draft.nationality} onChange={setField('nationality')} placeholder="US" mono />
            <TextField label="Referral / IB Code" value={draft.ibCode} onChange={setField('ibCode')} placeholder="IB-1024" mono />
          </div>
          <TextareaField label="Address" value={draft.address} onChange={setField('address')} placeholder="Street, city, state, postal code" />
        </DrawerSection>

        <DrawerSection title="Account Setup">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SelectField label="Tier" value={draft.tier} onChange={setField('tier')} options={TIER_OPTIONS} />
            <SelectField label="Segment" value={draft.segment} onChange={setField('segment')} options={SEGMENT_OPTIONS} />
            <SelectField label="KYC Status" value={draft.kycStatus} onChange={setField('kycStatus')} options={KYC_OPTIONS} />
            <SelectField label="Risk Level" value={draft.riskLevel} onChange={setField('riskLevel')} options={RISK_OPTIONS} />
            <SelectField label="Funding State" value={draft.fundingState} onChange={setField('fundingState')} options={FUNDING_OPTIONS} />
            <TextField label="Initial Balance" value={draft.initialBalance} onChange={setField('initialBalance')} placeholder="1000" mono />
          </div>
          <ToggleField
            label="Auto-create wallet"
            checked={draft.autoWallet}
            onChange={setField('autoWallet')}
            description="Prepare wallet structures immediately after the record is saved."
          />
        </DrawerSection>

        <DrawerSection title="MT5 Setup" collapsible>
          <ToggleField
            label="Prepare MT5 account"
            checked={draft.createMt5}
            onChange={setField('createMt5')}
            description="Create a placeholder MT5 account setup for the dealing desk."
          />
          {draft.createMt5 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <SelectField label="Server" value={draft.mt5Server} onChange={setField('mt5Server')} options={SERVER_OPTIONS} placeholder="Select server" />
              <SelectField label="Leverage" value={draft.mt5Leverage} onChange={setField('mt5Leverage')} options={LEVERAGE_OPTIONS} placeholder="Select leverage" />
              <TextField label="Group" value={draft.mt5Group} onChange={setField('mt5Group')} placeholder="retail_usd_std" mono />
              <TextField label="Initial Deposit" value={draft.mt5Deposit} onChange={setField('mt5Deposit')} placeholder="1000" mono />
            </div>
          )}
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField label="Operator Summary" value={draft.note} onChange={setField('note')} placeholder="Add onboarding notes, exceptions, or next actions." rows={5} />
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
