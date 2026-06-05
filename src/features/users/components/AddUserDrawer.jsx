import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  User,
  Settings,
  Monitor,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { MainDrawer } from '../../../components/common/drawer';
import {
  FUNDING_OPTIONS,
  KYC_OPTIONS,
  LEVERAGE_OPTIONS,
  RISK_OPTIONS,
  SEGMENT_OPTIONS,
  SERVER_OPTIONS,
  TIER_OPTIONS,
} from '@/config/constants/USER_FORM';
import { isUserDraftValid } from '@/utils/validators';
import { groupService } from '@/features/group-management/services/groupService';

/* ══════════════════════════════════════════════════════════
   FORM PRIMITIVES — inline premium components
══════════════════════════════════════════════════════════ */


/* ── Text Input ── */
function PField({ label, value, onChange, placeholder, type = 'text', mono = false, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-9 rounded-[8px] border border-border/18 bg-bg/60 px-3 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all ${mono ? 'font-mono' : ''
          }`}
      />
    </div>
  );
}

/* ── Select Input ── */
function PSelect({ label, value, onChange, options = [], placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 rounded-[8px] border border-border/18 bg-bg px-3 pr-8 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all appearance-none cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled className="bg-bg text-text">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-bg text-text">
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={11}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/35 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ── Textarea ── */
function PTextarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed"
      />
    </div>
  );
}

/* ── Toggle Switch ── */
function PToggle({ label, checked, onChange, description }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-[9px] border px-4 py-3 cursor-pointer transition-all select-none ${checked
          ? 'border-brand/22 bg-brand/5'
          : 'border-border/14 bg-bg/40 hover:bg-bg/60'
        }`}
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-text leading-tight">{label}</p>
        {description && (
          <p className="text-[11px] text-text-muted/50 mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      {/* Pill Toggle */}
      <div
        className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200 ${checked ? 'bg-brand' : 'bg-border/30'
          }`}
      >
        <span
          className={`absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? 'left-[22px]' : 'left-[3px]'
            }`}
        />
      </div>
    </div>
  );
}

/* ── Two-column Form Grid ── */
function PGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {children}
    </div>
  );
}

/* ── Section Divider ── */
function PDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-0.5">
      <div className="h-px flex-1 bg-border/10" />
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/30 select-none">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/10" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION CARD
══════════════════════════════════════════════════════════ */
function Section({ step, icon, title, children, collapsible = false }) {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      {/* Section Header Row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b transition-colors select-none ${isOpen ? 'border-border/10' : 'border-transparent'
          } ${collapsible ? 'cursor-pointer hover:bg-bg/30' : 'cursor-default'}`}
        onClick={() => collapsible && setIsOpen((v) => !v)}
      >
        {/* Step Number Badge */}
        <div className="w-[26px] h-[26px] rounded-[7px] bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-brand leading-none tabular-nums">
            {String(step).padStart(2, '0')}
          </span>
        </div>

        {/* Icon */}
        <IconComponent size={13} className="text-text-muted/50 flex-shrink-0" />

        {/* Title */}
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>

        {/* Collapse Chevron */}
        {collapsible && (
          <div className="flex-shrink-0 w-5 h-5 rounded-[5px] flex items-center justify-center text-text-muted/30">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        )}
      </div>

      {/* Section Body */}
      {isOpen && (
        <div className="px-4 py-4 space-y-3.5">
          {children}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD USER DRAWER — v2 Premium Redesign
══════════════════════════════════════════════════════════ */
export function AddUserDrawer({ open, mode, draft, setDraft, onSubmit, onClose }) {
  if (!draft) return null;

  const isValid = isUserDraftValid(draft);
  const isEdit = mode === 'edit';

  const setField = (field) => (value) =>
    setDraft((curr) => ({ ...curr, [field]: value }));

  return (
    <MainDrawer open={open} width="max-w-[720px]" onClose={onClose}>
      <div className="flex h-full w-full flex-col overflow-hidden">

        {/* ════════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <div className="flex-shrink-0 border-b border-border/15">
          {/* Brand accent top bar */}
          <div
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand) 40%, transparent) 65%, transparent)',
            }}
          />

          <div className="px-6 py-5 flex items-start justify-between gap-4">
            {/* Title block */}
            <div className="min-w-0">
              {/* Mode eyebrow */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand/65 leading-none">
                  User Form · {isEdit ? 'Edit Mode' : 'Create Mode'}
                </span>
              </div>

              <h2 className="text-[22px] font-bold tracking-[-0.025em] text-text leading-none">
                {isEdit ? 'Edit User' : 'Create User'}
              </h2>
              <p className="text-[12px] text-text-muted/50 mt-2 leading-relaxed max-w-[460px]">
                {isEdit
                  ? 'Update identity, onboarding, and account settings without leaving the users workspace.'
                  : 'Onboard a new user with funding, KYC, and MT5 preferences in one place.'}
              </p>

              {/* Progress chips */}
              <div className="flex items-center gap-1.5 mt-3.5">
                {[
                  { label: 'Identity', step: 1 },
                  { label: 'Account', step: 2 },
                  { label: 'MT5', step: 3 },
                  { label: 'Notes', step: 4 },
                ].map((chip) => (
                  <span
                    key={chip.step}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border border-border/15 bg-bg/30 text-text-muted/50"
                  >
                    <span className="font-mono text-[8.5px] text-brand/60">{chip.step}</span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            BODY — scrollable
        ════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">

          {/* ── Section 1: Identity ── */}
          <Section step={1} icon={User} title="Identity">
            <PGrid>
              <PField
                label="Full Name"
                value={draft.name}
                onChange={setField('name')}
                placeholder="Jane Doe"
                required
              />
              <PField
                label="Email"
                value={draft.email}
                onChange={setField('email')}
                placeholder="jane@example.com"
                type="email"
                required
              />
              <PField
                label="Phone"
                value={draft.phone}
                onChange={setField('phone')}
                placeholder="+1 555 120 4567"
              />
              <PField
                label="Country"
                value={draft.country}
                onChange={setField('country')}
                placeholder="US"
                mono
                required
              />
              <PField
                label="Nationality"
                value={draft.nationality}
                onChange={setField('nationality')}
                placeholder="US"
                mono
              />
              <PField
                label="Referral / IB Code"
                value={draft.ibCode}
                onChange={setField('ibCode')}
                placeholder="IB-1024"
                mono
              />
            </PGrid>
            <PTextarea
              label="Address"
              value={draft.address}
              onChange={setField('address')}
              placeholder="Street, city, state, postal code"
            />
          </Section>

          {/* ── Section 2: Account Setup ── */}
          <Section step={2} icon={Settings} title="Account Setup">
            <PGrid>
              <PSelect
                label="Tier"
                value={draft.tier}
                onChange={setField('tier')}
                options={TIER_OPTIONS}
              />
              <PSelect
                label="Segment"
                value={draft.segment}
                onChange={setField('segment')}
                options={SEGMENT_OPTIONS}
              />
              <PSelect
                label="KYC Status"
                value={draft.kycStatus}
                onChange={setField('kycStatus')}
                options={KYC_OPTIONS}
              />
              <PSelect
                label="Risk Level"
                value={draft.riskLevel}
                onChange={setField('riskLevel')}
                options={RISK_OPTIONS}
              />
              <PSelect
                label="Funding State"
                value={draft.fundingState}
                onChange={setField('fundingState')}
                options={FUNDING_OPTIONS}
              />
              <PField
                label="Initial Balance"
                value={draft.initialBalance}
                onChange={setField('initialBalance')}
                placeholder="1000"
                mono
              />
            </PGrid>

            <PDivider label="Wallet Config" />

            <PToggle
              label="Auto-create wallet"
              checked={draft.autoWallet}
              onChange={setField('autoWallet')}
              description="Prepare wallet structures immediately after the record is saved."
            />
          </Section>

          {/* ── Section 3: MT5 Setup (collapsible) ── */}
          <Section step={3} icon={Monitor} title="MT5 Setup" collapsible>
            <PToggle
              label="Prepare MT5 account"
              checked={draft.createMt5}
              onChange={setField('createMt5')}
              description="Create a placeholder MT5 account setup for the dealing desk."
            />

            {draft.createMt5 && (
              <>
                <PDivider label="MT5 Configuration" />
                <PGrid>
                  <PSelect
                    label="Server"
                    value={draft.mt5Server}
                    onChange={setField('mt5Server')}
                    options={SERVER_OPTIONS}
                    placeholder="Select server"
                  />
                  <PSelect
                    label="Leverage"
                    value={draft.mt5Leverage}
                    onChange={setField('mt5Leverage')}
                    options={LEVERAGE_OPTIONS}
                    placeholder="Select leverage"
                  />
                  <PSelect
                    label="Group"
                    value={draft.mt5Group}
                    onChange={setField('mt5Group')}
                    options={groupService.list().map(g => g.name)}
                    placeholder="Select group"
                  />
                  <PField
                    label="Initial Deposit"
                    value={draft.mt5Deposit}
                    onChange={setField('mt5Deposit')}
                    placeholder="1000"
                    mono
                  />
                </PGrid>
              </>
            )}
          </Section>

          {/* ── Section 4: Internal Notes (collapsible) ── */}
          <Section step={4} icon={FileText} title="Internal Notes" collapsible>
            <PTextarea
              label="Operator Summary"
              value={draft.note}
              onChange={setField('note')}
              placeholder="Add onboarding notes, exceptions, or next actions..."
              rows={5}
            />
          </Section>

          {/* Bottom padding so last section isn't flush against footer */}
          <div className="h-2" />
        </div>

        {/* ════════════════════════════════════════
            FOOTER — sticky at bottom
        ════════════════════════════════════════ */}
        <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated">
          {/* Validation warning banner */}
          {!isValid && (
            <div className="flex items-center gap-2.5 mx-6 mt-4 rounded-[9px] border border-warning/22 bg-warning/6 px-3.5 py-2.5">
              <AlertTriangle size={13} className="text-warning flex-shrink-0" />
              <span className="text-[11.5px] font-medium text-warning leading-tight">
                Full name, email, and country are required before saving.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-6 py-4">
            {/* Required fields hint */}
            <p className="text-[10px] text-text-muted/35 font-medium">
              <span className="text-brand/60 font-black">*</span> Required fields
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/20 bg-bg/40 text-text-muted hover:text-text hover:border-border/32 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!isValid}
                className="flex items-center gap-1.5 h-9 px-5 rounded-[9px] text-[11.5px] font-black uppercase tracking-wider bg-brand text-bg hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isEdit ? (
                  <>
                    <Check size={12} /> Save Changes
                  </>
                ) : (
                  <>
                    <User size={12} /> Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </MainDrawer>
  );
}

export default AddUserDrawer;