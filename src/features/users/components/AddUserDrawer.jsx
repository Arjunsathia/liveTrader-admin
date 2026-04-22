import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerGrid, TextField, SelectField, TextareaField, ToggleField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import {
  FUNDING_OPTIONS,
  KYC_OPTIONS,
  LEVERAGE_OPTIONS,
  RISK_OPTIONS,
  SEGMENT_OPTIONS,
  SERVER_OPTIONS,
  TIER_OPTIONS,
} from '../config/user-form.constants';
import { isUserDraftValid } from '../config/user-form.validation';

export function AddUserDrawer({
  open,
  mode,
  draft,
  setDraft,
  onSubmit,
  onClose,
}) {
  const isValid = isUserDraftValid(draft);
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
          <DrawerGrid>
            <TextField label="Full Name" value={draft.name} onChange={setField('name')} placeholder="Jane Doe" />
            <TextField label="Email" value={draft.email} onChange={setField('email')} placeholder="jane@example.com" type="email" />
            <TextField label="Phone" value={draft.phone} onChange={setField('phone')} placeholder="+1 555 120 4567" />
            <TextField label="Country" value={draft.country} onChange={setField('country')} placeholder="US" mono />
            <TextField label="Nationality" value={draft.nationality} onChange={setField('nationality')} placeholder="US" mono />
            <TextField label="Referral / IB Code" value={draft.ibCode} onChange={setField('ibCode')} placeholder="IB-1024" mono />
          </DrawerGrid>
          <div className="mt-4">
            <TextareaField label="Address" value={draft.address} onChange={setField('address')} placeholder="Street, city, state, postal code" />
          </div>
        </DrawerSection>

        <DrawerSection title="Account Setup">
          <DrawerGrid>
            <SelectField label="Tier" value={draft.tier} onChange={setField('tier')} options={TIER_OPTIONS} />
            <SelectField label="Segment" value={draft.segment} onChange={setField('segment')} options={SEGMENT_OPTIONS} />
            <SelectField label="KYC Status" value={draft.kycStatus} onChange={setField('kycStatus')} options={KYC_OPTIONS} />
            <SelectField label="Risk Level" value={draft.riskLevel} onChange={setField('riskLevel')} options={RISK_OPTIONS} />
            <SelectField label="Funding State" value={draft.fundingState} onChange={setField('fundingState')} options={FUNDING_OPTIONS} />
            <TextField label="Initial Balance" value={draft.initialBalance} onChange={setField('initialBalance')} placeholder="1000" mono />
          </DrawerGrid>
          <div className="mt-4">
            <ToggleField
              label="Auto-create wallet"
              checked={draft.autoWallet}
              onChange={setField('autoWallet')}
              description="Prepare wallet structures immediately after the record is saved."
            />
          </div>
        </DrawerSection>

        <DrawerSection title="MT5 Setup" collapsible>
          <ToggleField
            label="Prepare MT5 account"
            checked={draft.createMt5}
            onChange={setField('createMt5')}
            description="Create a placeholder MT5 account setup for the dealing desk."
          />
          {draft.createMt5 && (
            <DrawerGrid className="mt-4">
              <SelectField label="Server" value={draft.mt5Server} onChange={setField('mt5Server')} options={SERVER_OPTIONS} placeholder="Select server" />
              <SelectField label="Leverage" value={draft.mt5Leverage} onChange={setField('mt5Leverage')} options={LEVERAGE_OPTIONS} placeholder="Select leverage" />
              <TextField label="Group" value={draft.mt5Group} onChange={setField('mt5Group')} placeholder="retail_usd_std" mono />
              <TextField label="Initial Deposit" value={draft.mt5Deposit} onChange={setField('mt5Deposit')} placeholder="1000" mono />
            </DrawerGrid>
          )}
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField label="Operator Summary" value={draft.note} onChange={setField('note')} placeholder="Add onboarding notes, exceptions, or next actions." rows={5} />
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
