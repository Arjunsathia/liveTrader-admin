import React, { useState } from 'react';
import { Settings, Shield, HardDrive, Key, Database, RefreshCw, Sliders } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
} from '../components/SettingsForm';
import {
  TIMEZONE_OPTIONS,
  LOCALE_OPTIONS,
  SYSTEM_CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  BACKUP_FREQUENCY_OPTIONS,
} from '../configs/system.config';

/**
 * SystemSettingsPage — Regulates general brand locale settings, session timeout levels, password policies, and database backup routines.
 */
export function SystemSettingsPage({
  systemConfig,
  updateSystemField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [backingUp, setBackingUp] = useState(false);

  const tabs = [
    { id: 'general', label: 'General & Region', Icon: Settings },
    { id: 'security', label: 'Security & Access', Icon: Shield },
    { id: 'backup', label: 'Maintenance & Backups', Icon: HardDrive },
  ];

  const handleLaunchBackup = async () => {
    setBackingUp(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBackingUp(false);
    alert('System database backup snapshot created successfully ✓');
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="System Settings"
        desc="Setup localized parameters, configure session controls, dictate security policies, and manage database maintenance."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'general' && (
        <div className="space-y-5">
          <SettingsCard
            title="General Branding Information"
            desc="Configure brand labels and primary support contacts."
            Icon={Settings}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Display label for system interfaces">Brand Name</FieldLabel>
                <TInput
                  value={systemConfig.brandName}
                  onChange={(v) => updateSystemField('brandName', v)}
                  placeholder="Live-Trader"
                />
              </div>
              <div>
                <FieldLabel required hint="Root internet domain identifier">Brand Domain</FieldLabel>
                <TInput
                  value={systemConfig.brandDomain}
                  onChange={(v) => updateSystemField('brandDomain', v)}
                  placeholder="live-trader.com"
                  mono
                />
              </div>
            </FGroup>
            <div className="mt-4">
              <FieldLabel required hint="Default destination for support tickets dispatches">Primary Support Email</FieldLabel>
              <TInput
                value={systemConfig.supportEmail}
                onChange={(v) => updateSystemField('supportEmail', v)}
                placeholder="support@live-trader.com"
                mono
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Regional Locale Coordinates"
            desc="Specify system dates formatting, primary language, and clearing currencies."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Primary timezone coordinates governing daily schedules">Platform Timezone</FieldLabel>
                <TSelect
                  value={systemConfig.timezone}
                  onChange={(v) => updateSystemField('timezone', v)}
                  options={TIMEZONE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Default language selection applied on client portals">Primary Locale Language</FieldLabel>
                <TSelect
                  value={systemConfig.locale}
                  onChange={(v) => updateSystemField('locale', v)}
                  options={LOCALE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Primary currency of all fee estimations">Default System Currency</FieldLabel>
                <TSelect
                  value={systemConfig.currency}
                  onChange={(v) => updateSystemField('currency', v)}
                  options={SYSTEM_CURRENCY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Visual arrangement of dates displayed in tables and ledgers">Date Format Layout</FieldLabel>
                <TSelect
                  value={systemConfig.dateFormat}
                  onChange={(v) => updateSystemField('dateFormat', v)}
                  options={DATE_FORMAT_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-5">
          <SettingsCard
            title="Session Access Controls"
            desc="Regulate concurrent access variables and idle session limits."
            Icon={Shield}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Minutes of inactivity before automatic session logouts">Session Idle Timeout</FieldLabel>
                <TInput
                  value={systemConfig.sessionTimeout}
                  onChange={(v) => updateSystemField('sessionTimeout', v)}
                  mono
                  suffix="MIN"
                />
              </div>
              <div>
                <FieldLabel required hint="Max parallel active sessions per single operator">Max Concurrent Sessions</FieldLabel>
                <TInput
                  value={systemConfig.maxSessions}
                  onChange={(v) => updateSystemField('maxSessions', v)}
                  mono
                />
              </div>
            </FGroup>

            <div className="mt-4">
              <ToggleRow
                label="Enforce Multi-Factor Authentication"
                desc="Mandate MFA validation using Google Authenticator or SMS codes on all administrator accounts"
                val={systemConfig.mfaRequired}
                onChange={(v) => updateSystemField('mfaRequired', v)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Password Security Policy"
            desc="Setup strength guidelines and expiration boundaries for administrative credentials."
            Icon={Key}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Min characters required for passwords creation">Minimum Password Length</FieldLabel>
                <TInput
                  value={systemConfig.passwordMinLength}
                  onChange={(v) => updateSystemField('passwordMinLength', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Days passwords remain valid before rotation prompt">Credentials Expiry Interval</FieldLabel>
                <TInput
                  value={systemConfig.passwordExpiry}
                  onChange={(v) => updateSystemField('passwordExpiry', v)}
                  mono
                  suffix="DAYS"
                />
              </div>
              <div>
                <FieldLabel hint="Maximum failed password retries before IP block triggers">Max Login Attempts</FieldLabel>
                <TInput
                  value={systemConfig.loginAttempts}
                  onChange={(v) => updateSystemField('loginAttempts', v)}
                  mono
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-5">
          <SettingsCard
            title="Database Snapshots & Maintenance"
            desc="Configure database backup schedules to safeguard system recovery pipelines."
            Icon={HardDrive}
          >
            <div className="space-y-4">
              <ToggleRow
                label="Automated Daily Backups"
                desc="Commit cold snapshot backups of all clearing parameters daily"
                val={systemConfig.backupEnabled}
                onChange={(v) => updateSystemField('backupEnabled', v)}
              />

              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Periodical scheduling coordinator rules for backups">Backups Frequencies</FieldLabel>
                  <TSelect
                    value={systemConfig.backupFrequency}
                    onChange={(v) => updateSystemField('backupFrequency', v)}
                    options={BACKUP_FREQUENCY_OPTIONS}
                    disabled={!systemConfig.backupEnabled}
                  />
                </div>
                <div>
                  <FieldLabel hint="Days backup snapshots are retained in secure cloud nodes">Backups Retentions Duration</FieldLabel>
                  <TInput
                    value={systemConfig.backupRetention}
                    onChange={(v) => updateSystemField('backupRetention', v)}
                    disabled={!systemConfig.backupEnabled}
                    mono
                    suffix="DAYS"
                  />
                </div>
              </FGroup>

              <div className="pt-2">
                <ToggleRow
                  label="Enforce Audit Logging"
                  desc="Log all administrative session events, modifications, and query updates"
                  val={systemConfig.auditLogEnabled}
                  onChange={(v) => updateSystemField('auditLogEnabled', v)}
                />
                <FGroup cols={2}>
                  <div>
                    <FieldLabel hint="Days to retain audit logs in data lakes">Audit Logs Retentions</FieldLabel>
                    <TInput
                      value={systemConfig.auditLogRetention}
                      onChange={(v) => updateSystemField('auditLogRetention', v)}
                      disabled={!systemConfig.auditLogEnabled}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                  <div>
                    <FieldLabel hint="General client transaction logs storage duration bounds">General Transaction Retentions</FieldLabel>
                    <TInput
                      value={systemConfig.dataRetention}
                      onChange={(v) => updateSystemField('dataRetention', v)}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                </FGroup>
              </div>

              <div className="pt-4 border-t border-border/10">
                <Btn
                  Icon={Database}
                  label={backingUp ? 'Creating Snapshot...' : 'Create Backup Snapshot Now'}
                  variant="cyan"
                  onClick={handleLaunchBackup}
                  loading={backingUp}
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
        label="Save System Rules"
      />
    </div>
  );
}

export default SystemSettingsPage;
