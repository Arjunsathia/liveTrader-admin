import React, { useState } from 'react';
import {
  Bell, Mail, Smartphone, Code, FileText, Settings, Key, Eye, Check,
  ArrowDownCircle, ArrowUpCircle, XCircle, ShieldCheck, ShieldAlert,
  AlertTriangle, Fingerprint, Award, CheckCircle2, X as CloseIcon
} from 'lucide-react';
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
  EMAIL_PROVIDERS,
  SMS_PROVIDERS,
  TEMPLATES_LIST,
} from '../configs/notification.config';

/**
 * NotificationSettingsPage — Manages email/SMS gateways, alert channels, webhook dispatches, and message templates.
 */
export function NotificationSettingsPage({
  notificationConfig,
  updateNotificationField,
  updateNotificationNestedField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('channels');

  const AlertCheck = ({ active, onChange }) => (
    <button
      type="button"
      onClick={() => onChange?.(!active)}
      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95 mx-auto ${active
        ? 'border-positive/30 bg-positive/[0.15] text-positive'
        : 'border-white/[0.08] bg-transparent text-transparent hover:border-white/[0.16]'}`}
    >
      <Check size={11} strokeWidth={3} />
    </button>
  );

  const eventIcons = {
    deposit_received: ArrowDownCircle,
    withdrawal_approved: ArrowUpCircle,
    withdrawal_rejected: XCircle,
    kyc_approved: ShieldCheck,
    kyc_rejected: ShieldAlert,
    margin_call: AlertTriangle,
    stop_out: AlertTriangle,
    password_reset: Key,
    login_alert: Fingerprint,
    prop_challenge_fail: Award,
  };

  const toggleRow = (evtKey) => {
    const channelSettings = notificationConfig.events?.[evtKey] || {};
    const allOn = channelSettings.email && channelSettings.sms && channelSettings.inApp;
    updateNotificationNestedField('events', evtKey, {
      email: !allOn,
      sms: !allOn,
      inApp: !allOn,
    });
  };

  const toggleCol = (channel) => {
    const allOn = Object.values(notificationConfig.events || {}).every(
      (ch) => ch[channel]
    );
    const updatedEvents = {};
    Object.entries(notificationConfig.events || {}).forEach(([evtKey, ch]) => {
      updatedEvents[evtKey] = {
        ...ch,
        [channel]: !allOn,
      };
    });
    updateNotificationField('events', updatedEvents);
  };

  const toggleAll = (val) => {
    const updatedEvents = {};
    Object.keys(notificationConfig.events || {}).forEach((evtKey) => {
      updatedEvents[evtKey] = {
        email: val,
        sms: val,
        inApp: val,
      };
    });
    updateNotificationField('events', updatedEvents);
  };

  const tabs = [
    { id: 'channels', label: 'Alert Channels', Icon: Bell },
    { id: 'providers', label: 'Provider Gateways', Icon: Settings },
    { id: 'templates', label: 'Email Templates', Icon: FileText },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Notification Settings"
        desc="Administer system communication rules, setup SMTP server connections, twilio sms bindings, and message templates."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'channels' && (
        <div className="space-y-5">
          <SettingsCard
            title="Communication Delivery Channels"
            desc="Specify which alert delivery pathways are enabled globally across system servers."
            Icon={Bell}
          >
            <div className="rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              <ToggleRow
                label="Email Dispatches"
                desc="Send transactional verifications and alert templates to client emails"
                val={notificationConfig.emailEnabled}
                onChange={(v) => updateNotificationField('emailEnabled', v)}
              />
              <ToggleRow
                label="SMS Messages"
                desc="Send OTP confirmations and severe warnings straight to customer mobile devices"
                val={notificationConfig.smsEnabled}
                onChange={(v) => updateNotificationField('smsEnabled', v)}
              />
              <ToggleRow
                label="In-App Notifications"
                desc="Push system logs and notices to user web dashboards"
                val={notificationConfig.inAppEnabled}
                onChange={(v) => updateNotificationField('inAppEnabled', v)}
              />
              <ToggleRow
                label="Webhook Integrations"
                desc="Dispatch JSON event payloads to developer webhook callback targets"
                val={notificationConfig.webhookEnabled}
                onChange={(v) => updateNotificationField('webhookEnabled', v)}
              />
              <ToggleRow
                label="Push Alerts"
                desc="Send active browser notifications to connected users"
                val={notificationConfig.pushEnabled}
                onChange={(v) => updateNotificationField('pushEnabled', v)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Event Alert Mappings"
            desc="Configure notification delivery behaviors on an event-by-event level."
            Icon={Settings}
            action={
              <div className="flex gap-2">
                <Btn
                  label="Grant All"
                  Icon={CheckCircle2}
                  variant="primary"
                  small
                  onClick={() => toggleAll(true)}
                />
                <Btn
                  label="Revoke All"
                  Icon={CloseIcon}
                  variant="danger"
                  small
                  onClick={() => toggleAll(false)}
                />
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border/15 text-text-muted/40 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">System Event Name</th>
                    <th className="py-2.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1.5 pb-1">
                        <span>All Channels</span>
                        <div className="h-5" />
                      </div>
                    </th>
                    {['Email', 'SMS', 'In-App'].map((channelName) => {
                      const channelKey = channelName === 'Email' ? 'email' : channelName === 'SMS' ? 'sms' : 'inApp';
                      const allOn = Object.values(notificationConfig.events || {}).every((ch) => ch[channelKey]);
                      return (
                        <th key={channelName} className="py-2.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1.5 pb-1">
                            <span>{channelName}</span>
                            <button
                              type="button"
                              onClick={() => toggleCol(channelKey)}
                              className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 active:scale-95 cursor-pointer
                                ${allOn ? 'border-cyan/30 bg-cyan/[0.12] text-cyan' : 'border-border/30 text-transparent hover:border-border/60'}`}
                            >
                              <Check size={9} strokeWidth={3} />
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 font-heading">
                  {Object.entries(notificationConfig.events || {}).map(([evtKey, channelSettings]) => {
                    const label = evtKey
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    const EvtIcon = eventIcons[evtKey] || Bell;
                    return (
                      <tr key={evtKey} className="hover:bg-border/5 transition-colors group">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] bg-bg/50 border border-border/20 text-text-muted/40 group-hover:text-brand group-hover:border-brand/30 transition-all duration-200">
                              <EvtIcon size={12} />
                            </div>
                            <span className="text-[12.5px] font-semibold text-text/80 transition-colors group-hover:text-brand">{label}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {(() => {
                            const allRowOn = channelSettings.email && channelSettings.sms && channelSettings.inApp;
                            const someRowOn = !allRowOn && (channelSettings.email || channelSettings.sms || channelSettings.inApp);
                            return (
                              <button
                                type="button"
                                onClick={() => toggleRow(evtKey)}
                                className={`mx-auto flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 active:scale-95 cursor-pointer
                                  ${allRowOn ? 'border-brand/40 bg-brand/[0.12]' : someRowOn ? 'border-warning/40 bg-warning/[0.08]' : 'border-border/30 hover:border-border/60'}`}
                              >
                                {allRowOn ? (
                                  <Check size={9} strokeWidth={3} className="text-brand" />
                                ) : someRowOn ? (
                                  <span className="h-0.5 w-2 rounded-full bg-warning" />
                                ) : null}
                              </button>
                            );
                          })()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.email}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                email: v,
                              })
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.sms}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                sms: v,
                              })
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.inApp}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                inApp: v,
                              })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Legend */}
              <div className="flex items-center gap-6 text-[10.5px] font-heading text-text-muted/50 flex-wrap mt-5 pt-4 border-t border-border/10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-positive/30 bg-positive/[0.15] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-positive" />
                  </div>
                  <span>Channel Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-white/[0.08] bg-transparent" />
                  <span>Channel Disabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-cyan/25 bg-cyan/[0.1] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-cyan" />
                  </div>
                  <span>Header Toggle — Toggles whole column</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-brand/25 bg-brand/[0.1] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-brand" />
                  </div>
                  <span>Row Toggle — Toggles whole row</span>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-5">
          <SettingsCard
            title="Email Provider Settings"
            desc="Configure integration credentials and SMTP server boundaries for outbound system emails."
            Icon={Mail}
          >
            <div className="space-y-4">
              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Third-party service or customized SMTP pipeline choice">Email Dispatch Provider</FieldLabel>
                  <TSelect
                    value={notificationConfig.emailProvider}
                    onChange={(v) => updateNotificationField('emailProvider', v)}
                    options={EMAIL_PROVIDERS}
                  />
                </div>
                <div>
                  <FieldLabel required hint="Sender email address appearing in client inboxes">Default Sender Address</FieldLabel>
                  <TInput
                    value={notificationConfig.fromEmail}
                    onChange={(v) => updateNotificationField('fromEmail', v)}
                    placeholder="noreply@live-trader.com"
                    mono
                  />
                </div>
              </FGroup>

              {notificationConfig.emailProvider === 'SMTP_CUSTOM' ? (
                <FGroup cols={2}>
                  <div>
                    <FieldLabel required hint="Host domain for connection rules">SMTP Host Address</FieldLabel>
                    <TInput
                      value={notificationConfig.smtpHost}
                      onChange={(v) => updateNotificationField('smtpHost', v)}
                      placeholder="smtp.example.com"
                      mono
                    />
                  </div>
                  <div>
                    <FieldLabel required hint="Port used for SMTP (e.g. 587 or 465)">SMTP Port</FieldLabel>
                    <TInput
                      value={notificationConfig.smtpPort}
                      onChange={(v) => updateNotificationField('smtpPort', v)}
                      placeholder="587"
                      mono
                    />
                  </div>
                </FGroup>
              ) : (
                <div>
                  <FieldLabel required hint="SendGrid integration API security key code">SendGrid API Key (Masked)</FieldLabel>
                  <TInput
                    value={notificationConfig.sendgridKey}
                    onChange={(v) => updateNotificationField('sendgridKey', v)}
                    type="password"
                    mono
                  />
                </div>
              )}

              <div>
                <FieldLabel hint="Sender name string appearing in mailbox headers">Sender Header Display Name</FieldLabel>
                <TInput
                  value={notificationConfig.fromName}
                  onChange={(v) => updateNotificationField('fromName', v)}
                  placeholder="Live-Trader Operations"
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="SMS Gateway Integration"
            desc="Setup parameters to dispatch real-time text verifications through active cellular gateways."
            Icon={Smartphone}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="Active SMS API gateway integration provider choice">SMS Gateway Provider</FieldLabel>
                <TSelect
                  value={notificationConfig.smsProvider}
                  onChange={(v) => updateNotificationField('smsProvider', v)}
                  options={SMS_PROVIDERS}
                />
              </div>

              {notificationConfig.smsProvider === 'TWILIO' && (
                <FGroup cols={2}>
                  <div>
                    <FieldLabel required hint="Twilio integration credential Account SID string">Twilio Account SID</FieldLabel>
                    <TInput
                      value={notificationConfig.twilioSid}
                      onChange={(v) => updateNotificationField('twilioSid', v)}
                      mono
                    />
                  </div>
                  <div>
                    <FieldLabel required hint="Cellular number allocated to Twilio dispatch">Twilio Dispatch Number</FieldLabel>
                    <TInput
                      value={notificationConfig.twilioFrom}
                      onChange={(v) => updateNotificationField('twilioFrom', v)}
                      placeholder="+1555000000"
                      mono
                    />
                  </div>
                </FGroup>
              )}
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-5">
          <SettingsCard
            title="Outbound HTML Templates"
            desc="Modify transactional and marketing message templates dispatched upon system events."
            Icon={FileText}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-border/15 text-text-muted/40 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Template Name</th>
                    <th className="py-2.5 px-3">Linked Event Identifier</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 font-heading">
                  {TEMPLATES_LIST.map((tpl) => (
                    <tr key={tpl.name} className="hover:bg-border/5 transition-colors">
                      <td className="py-3 px-3 font-semibold text-text/85">{tpl.name}</td>
                      <td className="py-3 px-3 text-text-muted/50 font-mono text-[11px]">{tpl.event}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider"
                          style={{
                            color: tpl.status === 'ACTIVE' ? 'var(--positive)' : 'var(--warning)',
                            background: tpl.status === 'ACTIVE' ? 'rgba(74, 225, 118, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                            border: `1px solid ${tpl.status === 'ACTIVE' ? 'rgba(74, 225, 118, 0.18)' : 'rgba(217, 119, 6, 0.18)'}`,
                          }}
                        >
                          {tpl.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Btn
                          Icon={Eye}
                          label="Preview"
                          variant="default"
                          small
                          onClick={() => alert(`Launching layout preview for template: ${tpl.name}`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save Alerts Settings"
      />
    </div>
  );
}

export default NotificationSettingsPage;
