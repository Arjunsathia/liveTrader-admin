import React, { useState } from 'react';
import { BarChart2, TrendingUp, Sliders, ShieldAlert, BadgePercent, Lock, Settings } from 'lucide-react';
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
  ToggleRow,
  WarnBanner,
} from '../components/SettingsForm';
import {
  LEVERAGE_OPTIONS,
  MARGIN_MODEL_OPTIONS,
  TRADE_HOURS_MODE_OPTIONS,
  PROP_PHASES_OPTIONS,
} from '../configs/trading.config';

/**
 * TradingSettingsPage — Configures leverage caps, execution boundaries, risk parameters, and prop challenges guidelines.
 */
export function TradingSettingsPage({
  tradingConfig,
  updateTradingField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('leverage');

  const tabs = [
    { id: 'leverage', label: 'Leverage & Margin', Icon: TrendingUp },
    { id: 'limits', label: 'Order Limits', Icon: Sliders },
    { id: 'risk', label: 'Risk Controls', Icon: ShieldAlert },
    { id: 'prop', label: 'Prop & Copy Trading', Icon: BarChart2 },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Trading Settings"
        desc="Setup default leverage capacities, execution bounds, risk rules, and prop firm challenge configurations."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'leverage' && (
        <div className="space-y-5">
          <SettingsCard
            title="Leverage Boundaries by Asset Class"
            desc="Specify the maximum leverage allowable to clients per asset category."
            Icon={TrendingUp}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Maximum leverage for currency pairs transactions">Forex Leverage Cap</FieldLabel>
                <TSelect
                  value={tradingConfig.forexLev}
                  onChange={(v) => updateTradingField('forexLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Maximum leverage for indices instruments">Indices Leverage Cap</FieldLabel>
                <TSelect
                  value={tradingConfig.indicesLev}
                  onChange={(v) => updateTradingField('indicesLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Maximum leverage for cryptocurrency tokens">Crypto Leverage Cap</FieldLabel>
                <TSelect
                  value={tradingConfig.cryptoLev}
                  onChange={(v) => updateTradingField('cryptoLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Maximum leverage for spot metals (Gold, Silver)">Commodity / Metals Leverage Cap</FieldLabel>
                <TSelect
                  value={tradingConfig.metalLev}
                  onChange={(v) => updateTradingField('metalLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Margin Call & Liquidation Safeguards"
            desc="Define the thresholds triggering risk liquidation events on client accounts."
            Icon={ShieldAlert}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Threshold percentage triggering margin warnings to clients">Margin Call Warning Level</FieldLabel>
                <TInput
                  value={tradingConfig.marginCallLevel}
                  onChange={(v) => updateTradingField('marginCallLevel', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Threshold triggering automated liquidations of positions">Stop Out Closeout level</FieldLabel>
                <TInput
                  value={tradingConfig.stopOutLevel}
                  onChange={(v) => updateTradingField('stopOutLevel', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Determines how margins are computed (Hedging / Netting)">Margin Accounting Model</FieldLabel>
                <TSelect
                  value={tradingConfig.marginModel}
                  onChange={(v) => updateTradingField('marginModel', v)}
                  options={MARGIN_MODEL_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-5">
          <SettingsCard
            title="Order Bounds & Exposure Caps"
            desc="Construct protective sizing limits to safeguard the clearing networks from high exposures."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Maximum volume allowed in a single transaction ticket">Max Order Size</FieldLabel>
                <TInput
                  value={tradingConfig.maxOrderSize}
                  onChange={(v) => updateTradingField('maxOrderSize', v)}
                  mono
                  suffix="LOTS"
                />
              </div>
              <div>
                <FieldLabel hint="Minimum volume allowable per ticket">Min Order Size</FieldLabel>
                <TInput
                  value={tradingConfig.minOrderSize}
                  onChange={(v) => updateTradingField('minOrderSize', v)}
                  mono
                  suffix="LOTS"
                />
              </div>
              <div>
                <FieldLabel hint="Maximum cumulative orders accepted per account in 24h">Max Daily Orders Frequency</FieldLabel>
                <TInput
                  value={tradingConfig.maxDailyOrders}
                  onChange={(v) => updateTradingField('maxDailyOrders', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Maximum concurrent open tickets allowed per client">Max Active Open Positions</FieldLabel>
                <TInput
                  value={tradingConfig.maxOpenPositions}
                  onChange={(v) => updateTradingField('maxOpenPositions', v)}
                  mono
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-5">
          <SettingsCard
            title="Execution Slippage and Risk Parameters"
            desc="Configure execution boundaries around slippage margins and order checks."
            Icon={ShieldAlert}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Standard slippage allowed on market orders execution">Standard Slippage Margin</FieldLabel>
                <TInput
                  value={tradingConfig.defaultSlippage}
                  onChange={(v) => updateTradingField('defaultSlippage', v)}
                  mono
                  suffix="PIPS"
                />
              </div>
              <div>
                <FieldLabel hint="Maximum slippage allowable before orders auto-reject">Max Slippage Threshold</FieldLabel>
                <TInput
                  value={tradingConfig.maxSlippage}
                  onChange={(v) => updateTradingField('maxSlippage', v)}
                  mono
                  suffix="PIPS"
                />
              </div>
            </FGroup>

            <div className="mt-4.5 rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              <ToggleRow
                label="Enforce Stop Loss Checks"
                desc="Mandate a valid Stop Loss price parameter on all incoming order requests"
                val={tradingConfig.stopLossRequired}
                onChange={(v) => updateTradingField('stopLossRequired', v)}
              />
              <ToggleRow
                label="Enforce Take Profit Params"
                desc="Mandate Take Profit prices on all trade entries"
                val={tradingConfig.takeProfitRequired}
                onChange={(v) => updateTradingField('takeProfitRequired', v)}
              />
              <ToggleRow
                label="Permit Weekend Trading"
                desc="Allow position entries and adjustments while physical markets are closed"
                val={tradingConfig.weekendTrading}
                onChange={(v) => updateTradingField('weekendTrading', v)}
              />
              <ToggleRow
                label="Permit News Event Trading"
                desc="Allow transaction execution during high-impact macroeconomic announcements"
                val={tradingConfig.newsTrading}
                onChange={(v) => updateTradingField('newsTrading', v)}
              />
            </div>

            <div className="mt-4.5">
              <FieldLabel hint="Minutes buffer before/after high-impact announcements blocking entries">Macro News Block Buffer</FieldLabel>
              <TInput
                value={tradingConfig.newsTradingBuffer}
                onChange={(v) => updateTradingField('newsTradingBuffer', v)}
                disabled={tradingConfig.newsTrading}
                mono
                suffix="MIN"
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Blacklisted Symbols List"
            desc="Specify explicit tickers barred from clearing network operations."
            Icon={Lock}
          >
            <FieldLabel hint="Add trading symbol keys, one ticker code per line">Banned Instruments</FieldLabel>
            <TArea
              value={tradingConfig.bannedSymbols}
              onChange={(v) => updateTradingField('bannedSymbols', v)}
              placeholder="BTCUSD&#10;ETHUSD"
              mono
              rows={3}
            />
          </SettingsCard>
        </div>
      )}

      {activeTab === 'prop' && (
        <div className="space-y-5">
          <SettingsCard
            title="Prop Challenge Parameters"
            desc="Regulate rules and boundaries governing client prop evaluation passes."
            Icon={BarChart2}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Standard levels required to pass assessment">Evaluation Phases</FieldLabel>
                <TSelect
                  value={tradingConfig.propPhases}
                  onChange={(v) => updateTradingField('propPhases', v)}
                  options={PROP_PHASES_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Percent profit gain required on base capital to pass">Profit Target Cap</FieldLabel>
                <TInput
                  value={tradingConfig.propProfitTarget}
                  onChange={(v) => updateTradingField('propProfitTarget', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Max total overall drawdown allowed before account breach">Max Overall Drawdown</FieldLabel>
                <TInput
                  value={tradingConfig.propMaxDD}
                  onChange={(v) => updateTradingField('propMaxDD', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Max drawdown permitted inside a single daily cycle">Max Daily Drawdown</FieldLabel>
                <TInput
                  value={tradingConfig.propDailyDD}
                  onChange={(v) => updateTradingField('propDailyDD', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Minimum distinct active trading days required to qualify">Min Active Trading Days</FieldLabel>
                <TInput
                  value={tradingConfig.propMinDays}
                  onChange={(v) => updateTradingField('propMinDays', v)}
                  mono
                  suffix="DAYS"
                />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Copy Trading Boundaries"
            desc="Define risk thresholds and parameters for automated leader-follower systems."
            Icon={Settings}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Max scale multiplier allowed for copied execution tickets">Max Sizing Copy Ratio</FieldLabel>
                <TInput
                  value={tradingConfig.copyMaxRatio}
                  onChange={(v) => updateTradingField('copyMaxRatio', v)}
                  mono
                  suffix="X"
                />
              </div>
              <div>
                <FieldLabel hint="Minimum account balance required to start subscribing">Min Allocation Balance</FieldLabel>
                <TInput
                  value={tradingConfig.copyMinDeposit}
                  onChange={(v) => updateTradingField('copyMinDeposit', v)}
                  mono
                  suffix="USD"
                />
              </div>
            </FGroup>

            <div className="mt-4.5">
              <ToggleRow
                label="Auto-Close on Master Margin Calls"
                desc="Instantly closeout subscriber copies if a master provider hits warning thresholds"
                val={tradingConfig.copyAutoClose}
                onChange={(v) => updateTradingField('copyAutoClose', v)}
              />
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save Trading Parameters"
      />
    </div>
  );
}

export default TradingSettingsPage;
