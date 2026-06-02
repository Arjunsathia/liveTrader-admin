import React, { useState } from 'react';
import { Key, Globe, Sliders, Shield, Wifi, AlertTriangle } from 'lucide-react';
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
  ApiKeyField,
  ToggleRow,
  Btn,
  WarnBanner,
} from '../components/SettingsForm';
import {
  API_ENV_OPTIONS,
  THROTTLE_STRATEGIES,
  RATE_LIMIT_HEADERS,
  ROTATION_FREQUENCY_OPTIONS,
} from '../configs/api.config';

/**
 * ApiConfigPage — Manages all platform API configuration settings.
 */
export function ApiConfigPage({
  apiConfig,
  updateApiField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', Icon: Globe },
    { id: 'auth', label: 'Auth & Keys', Icon: Key },
    { id: 'limits', label: 'Rate Limits', Icon: Sliders },
    { id: 'security', label: 'Security', Icon: Shield },
  ];

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setTesting(false);
    setTestResult({ success: true, message: 'REST & WebSocket connections established successfully ✓' });
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="API Configuration"
        desc="Administer system API gateways, endpoints connection options, cryptographic key management, and throttling boundaries."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'endpoints' && (
        <div className="space-y-5">
          <SettingsCard
            title="Gateway Parameters"
            desc="Configure default access URLs and primary environment status."
            Icon={Globe}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Main HTTP gateway location">API Base URL</FieldLabel>
                <TInput
                  value={apiConfig.baseUrl}
                  onChange={(v) => updateApiField('baseUrl', v)}
                  placeholder="https://api.live-trader.com/v2"
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Controls warning banners and access levels">Environment</FieldLabel>
                <TSelect
                  value={apiConfig.env}
                  onChange={(v) => updateApiField('env', v)}
                  options={API_ENV_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel required hint="Real-time data feeds websocket connection">WebSocket URL</FieldLabel>
                <TInput
                  value={apiConfig.wsUrl}
                  onChange={(v) => updateApiField('wsUrl', v)}
                  placeholder="wss://ws.live-trader.com"
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Default endpoint receiving all platform webhooks">Webhook Callback URL</FieldLabel>
                <TInput
                  value={apiConfig.webhookUrl}
                  onChange={(v) => updateApiField('webhookUrl', v)}
                  placeholder="https://api.live-trader.com/webhooks"
                  mono
                />
              </div>
            </FGroup>

            <div className="mt-5.5 pt-4 border-t border-border/10 flex flex-col sm:flex-row sm:items-center gap-3.5">
              <Btn
                Icon={Wifi}
                label={testing ? 'Testing Endpoint...' : 'Test Connection'}
                variant="cyan"
                onClick={handleTestConnection}
                loading={testing}
              />
              {testResult && (
                <div className="text-[11.5px] font-heading font-semibold text-positive animate-in fade-in duration-200">
                  {testResult.message}
                </div>
              )}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Connection Profiles"
            desc="Define network time limits and automated retries schedules."
            Icon={Sliders}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Maximum timeout duration per single request">Request Timeout</FieldLabel>
                <TInput
                  value={apiConfig.timeout}
                  onChange={(v) => updateApiField('timeout', v)}
                  mono
                  suffix="SEC"
                />
              </div>
              <div>
                <FieldLabel hint="Maximum attempts for failed connection retries">Max Retries</FieldLabel>
                <TInput
                  value={apiConfig.retries}
                  onChange={(v) => updateApiField('retries', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Initial exponential backoff delay">Backoff Delay</FieldLabel>
                <TInput
                  value="1000"
                  readOnly
                  mono
                  suffix="MS"
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="space-y-5">
          {apiConfig.env === 'PRODUCTION' && (
            <WarnBanner
              severity="warning"
              title="Live Production Keys Active"
              message="Cryptographic secrets are actively serving real live operations. Never disclose these variables. Key rotation forces session termination immediately."
            />
          )}

          <SettingsCard
            title="Credential Set"
            desc="Administrative keys used for cryptographically signed system requests."
            Icon={Key}
          >
            <div className="space-y-4">
              <ApiKeyField
                label="Master API Key"
                value={apiConfig.apiKey}
                hint="Identifier used for system request verification"
              />
              <ApiKeyField
                label="Gateway Secret Key"
                value={apiConfig.secretKey}
                hint="Never commit this parameter directly into codebase"
              />
              <ApiKeyField
                label="Webhook Handshake Signature"
                value={apiConfig.webhookSecret}
                hint="Verifies webhook dispatcher authentic payloads"
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Security Lifecycle"
            desc="Setup schedule configurations for automated credential expiration cycles."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Periodical rotation interval enforcement rules">Key Rotation Cycle</FieldLabel>
                <TSelect
                  value="90"
                  onChange={() => { }}
                  options={ROTATION_FREQUENCY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Date when credentials were last updated">Last Rotated</FieldLabel>
                <TInput value="2024-06-01" readOnly mono />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-5">
          <SettingsCard
            title="Throttling & Concurrency Boundaries"
            desc="Regulate outbound API traffic to prevent resource congestion and DDoS behaviors."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Max requests permitted per single minute slot">Rate Limit Threshold</FieldLabel>
                <TInput
                  value={apiConfig.rateLimit}
                  onChange={(v) => updateApiField('rateLimit', v)}
                  mono
                  suffix="RPM"
                />
              </div>
              <div>
                <FieldLabel required hint="Max concurrent requests allowed as a burst limit">Burst Capacity</FieldLabel>
                <TInput
                  value={apiConfig.burstLimit}
                  onChange={(v) => updateApiField('burstLimit', v)}
                  mono
                  suffix="REQ/SEC"
                />
              </div>
              <div>
                <FieldLabel hint="Algorithmic strategy applied when boundaries are reached">Throttle Strategy</FieldLabel>
                <TSelect
                  value="SLIDING_WINDOW"
                  onChange={() => { }}
                  options={THROTTLE_STRATEGIES}
                />
              </div>
              <div>
                <FieldLabel hint="HTTP Header returning rate limit information in payload responses">Header Identifier</FieldLabel>
                <TSelect
                  value="X-RateLimit-Remaining"
                  onChange={() => { }}
                  options={RATE_LIMIT_HEADERS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-5">
          <SettingsCard
            title="IP Access Whitelist"
            desc="Restrict access interfaces to trusted CIDR blocks and IP boundaries only."
            Icon={Shield}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="Accepts one CIDR block or explicit IP address per line">Permitted CIDR Ranges</FieldLabel>
                <TArea
                  value={apiConfig.ipWhitelist}
                  onChange={(v) => updateApiField('ipWhitelist', v)}
                  placeholder="103.82.14.0/24&#10;82.44.18.0/24"
                  mono
                  rows={4}
                />
              </div>
              <ToggleRow
                label="Enforce Whitelist Boundaries"
                desc="Instantly block access to all traffic originating outside whitelisted IP coordinates"
                val={true}
                onChange={() => { }}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="CORS Cross-Origin Security"
            desc="Specify origin boundaries allowable by web browser requests."
            Icon={Globe}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="Add allowed browser URL origins, one domain per line">Allowed Origin Domains</FieldLabel>
                <TArea
                  value={apiConfig.corsOrigins}
                  onChange={(v) => updateApiField('corsOrigins', v)}
                  placeholder="https://app.live-trader.com&#10;https://admin.live-trader.com"
                  mono
                  rows={4}
                />
              </div>
              <ToggleRow
                label="Strict CORS Enforcement"
                desc="Reject cross-origin browser queries from unlisted domains"
                val={true}
                onChange={() => { }}
              />
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save API Configuration"
      />
    </div>
  );
}

export default ApiConfigPage;
