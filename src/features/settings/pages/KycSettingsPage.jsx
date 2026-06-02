import React, { useState } from 'react';
import { ShieldCheck, FileText, Layers, ShieldAlert, Flag, RotateCcw, AlertTriangle } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TArea,
  TSelect,
  Toggle,
  ToggleRow,
  Btn,
  WarnBanner,
} from '../components/SettingsForm';
import {
  KYC_PROVIDERS,
  AML_PROVIDERS,
  RISK_TOLERANCE_OPTIONS,
  KYC_TIERS_LIST,
} from '../configs/kyc.config';

/**
 * KycSettingsPage — Manages client identity verification thresholds and risk enforcement.
 */
export function KycSettingsPage({
  kycConfig,
  updateKycField,
  updateKycNestedField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('documents');

  const tabs = [
    { id: 'documents', label: 'Documents & Provider', Icon: FileText },
    { id: 'levels', label: 'Tiers & Limits', Icon: Layers },
    { id: 'aml', label: 'AML & Risk Settings', Icon: ShieldAlert },
    { id: 'countries', label: 'Country Restraints', Icon: Flag },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="KYC & Compliance"
        desc="Administer automated client identity verifications, specify document requirements, and construct AML sanction guidelines."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'documents' && (
        <div className="space-y-5">
          <SettingsCard
            title="Verification Gateway"
            desc="Configure integration settings with your automated identity verification provider."
            Icon={ShieldCheck}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Third-party identity compliance verification partner">Identity Provider</FieldLabel>
                <TSelect
                  value={kycConfig.kycProvider}
                  onChange={(v) => updateKycField('kycProvider', v)}
                  options={KYC_PROVIDERS}
                />
              </div>
              <div>
                <FieldLabel hint="Endpoint matching verification queries">API Endpoint</FieldLabel>
                <TInput value="https://api.sumsub.com" readOnly mono />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Required Documents Setup"
            desc="Specify which verification items are mandatory for standard client verifications."
            Icon={FileText}
          >
            <div className="rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              {Object.entries(kycConfig.docs || {}).map(([docKey, enabled]) => {
                const label = docKey
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <ToggleRow
                    key={docKey}
                    label={label}
                    desc={`Mandate client upload of ${label} verification file`}
                    val={enabled}
                    onChange={(v) => updateKycNestedField('docs', docKey, v)}
                  />
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Document Resubmission Protocol"
            desc="Determine guidelines when client verifications fail and document updates are required."
            Icon={RotateCcw}
          >
            <FGroup cols={2}>
              <ToggleRow
                label="Allow Dynamic Resubmissions"
                desc="Permit user portals to automatically resubmit secondary credentials upon rejection"
                val={kycConfig.resubmissionAllowed}
                onChange={(v) => updateKycField('resubmissionAllowed', v)}
              />
              <div>
                <FieldLabel hint="Days to wait before a rejected user is allowed to retry validation">Cooldown Cooldown Interval</FieldLabel>
                <TInput
                  value={kycConfig.resubmissionDays || kycConfig.ResubmissionDays}
                  onChange={(v) => updateKycField('resubmissionDays', v)}
                  disabled={!kycConfig.resubmissionAllowed}
                  mono
                  suffix="DAYS"
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="space-y-4">
          <WarnBanner
            severity="info"
            title="Verification Limits Enforcement"
            message="Moving to higher tiers removes payout bounds. Compliance checks are strictly enforced by system trading engines."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KYC_TIERS_LIST.map((tier, idx) => {
              const colors = ['var(--cyan)', 'var(--positive)', 'var(--warning)', 'var(--brand)'];
              const c = colors[idx] || 'var(--cyan)';
              return (
                <div
                  key={tier.level}
                  className="rounded-[10px] border border-border/25 bg-surface-elevated overflow-hidden p-5 flex gap-4 relative group hover:border-border/40 transition-all duration-300"
                >
                  <div
                    className="w-1 rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(to bottom, ${c}, ${c}40)`,
                    }}
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[4px]" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)` }}>
                        {tier.level.split(':')[0]}
                      </span>
                      <h4 className="text-[13.5px] font-bold font-heading text-text/90 mt-2">
                        {tier.level.split(':')[1]?.trim() || tier.level}
                      </h4>
                      <p className="text-[11.5px] text-text-muted/50 font-heading mt-1">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/10">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted/30 font-heading">
                        Required Parameters
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.requirements.map((req) => (
                          <span
                            key={req}
                            className="text-[9.5px] font-semibold font-heading px-2 py-0.5 rounded-[4px] border border-border/30 bg-bg text-text-muted/70"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-brand pt-1.5">
                      <span>Threshold Volume</span>
                      <span>{tier.limits}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'aml' && (
        <div className="space-y-5">
          <SettingsCard
            title="Sanctions & AML Scanning"
            desc="Configure parameters for real-time verification matches against global anti-money laundering databases."
            Icon={ShieldAlert}
          >
            <div className="space-y-4">
              <ToggleRow
                label="Enforce Active AML Checks"
                desc="Intercept all high-volume accounts to check coordinates against sanctions databases"
                val={kycConfig.amlScanEnabled}
                onChange={(v) => updateKycField('amlScanEnabled', v)}
              />
              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Primary compliance verification databank">AML Databank Provider</FieldLabel>
                  <TSelect
                    value={kycConfig.amlProvider}
                    onChange={(v) => updateKycField('amlProvider', v)}
                    options={AML_PROVIDERS}
                    disabled={!kycConfig.amlScanEnabled}
                  />
                </div>
                <div>
                  <FieldLabel hint="Strictness level of spelling matches algorithms">Risk Tolerance Threshold</FieldLabel>
                  <TSelect
                    value={kycConfig.riskThreshold}
                    onChange={(v) => updateKycField('riskThreshold', v)}
                    options={RISK_TOLERANCE_OPTIONS}
                    disabled={!kycConfig.amlScanEnabled}
                  />
                </div>
              </FGroup>

              <div className="pt-2">
                <ToggleRow
                  label="Enforce Active PEP Checks"
                  desc="Identify Politically Exposed Persons (PEPs) requiring secondary compliance reviews"
                  val={kycConfig.pepScanEnabled}
                  onChange={(v) => updateKycField('pepScanEnabled', v)}
                />
                <ToggleRow
                  label="Automatic Sanctions Interceptor"
                  desc="Strictly block registration attempts directly matching active trade bans lists"
                  val={kycConfig.sanctionsScan}
                  onChange={(v) => updateKycField('sanctionsScan', v)}
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'countries' && (
        <div className="space-y-5">
          <SettingsCard
            title="Restricted Jurisdiction Lists"
            desc="Define global regions subject to absolute trade embargoes or high-risk enhanced reviews."
            Icon={Flag}
          >
            <div className="space-y-4.5">
              <div>
                <FieldLabel hint="Embargoed jurisdictions locked from access. Use ISO codes, space or comma separated.">Absolute Prohibited Jurisdictions</FieldLabel>
                <TInput
                  value={kycConfig.restrictions?.blocked?.join(', ')}
                  onChange={(v) =>
                    updateKycNestedField(
                      'restrictions',
                      'blocked',
                      v.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean)
                    )
                  }
                  mono
                />
              </div>

              <div>
                <FieldLabel hint="High-risk jurisdictions subject to secondary document verification and limits.">High-Risk Enhanced Review Regions</FieldLabel>
                <TInput
                  value={kycConfig.restrictions?.enhanced?.join(', ')}
                  onChange={(v) =>
                    updateKycNestedField(
                      'restrictions',
                      'enhanced',
                      v.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean)
                    )
                  }
                  mono
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save KYC Configuration"
      />
    </div>
  );
}

export default KycSettingsPage;
