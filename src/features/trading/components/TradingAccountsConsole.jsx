import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Sliders, Globe, AlertTriangle, Play, Download, Trash2, Wifi } from 'lucide-react';

const INITIAL_LOGS = [
  { ts: '2026-05-19 14:22:01', level: 'INFO',  text: 'Sync requested for Account 88100249. Handshake successful.' },
  { ts: '2026-05-19 14:22:05', level: 'INFO',  text: 'Market prices updated: 42 symbols synchronized across cluster.' },
  { ts: '2026-05-19 14:25:33', level: 'ERROR', text: 'Connection timeout on MT5-STND-04. Re-attempting handshake (1/5)...' },
  { ts: '2026-05-19 14:28:12', level: 'INFO',  text: "Admin 'sys_arch_01' modified leverage for Account 88100918: (1:100 → 1:500)" },
  { ts: '2026-05-19 14:30:45', level: 'ERROR', text: 'Trade Execution Error (499201): Order 772101 failed - Invalid S/L level.' },
  { ts: '2026-05-19 14:35:00', level: 'TRACE', text: 'Keep-alive ping received from Server MT5-PRIME-01. Latency stable at 12ms.' },
  { ts: '2026-05-19 14:38:22', level: 'INFO',  text: 'Account 88100249: Margin level critical warning suppressed by admin.' },
  { ts: '2026-05-19 14:42:10', level: 'INFO',  text: 'Log cycle complete. Heartbeat OK.' },
];

const LEVEL_COLORS = {
  INFO:  'var(--positive)',
  ERROR: 'var(--negative)',
  TRACE: 'var(--brand)',
  WARN:  'var(--warning)',
};

const LEVEL_BORDER = {
  INFO:  'border-l-positive',
  ERROR: 'border-l-negative',
  TRACE: 'border-l-brand',
  WARN:  'border-l-warning',
};

export function TradingAccountsConsole({ onTriggerControl }) {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [haltArmed, setHaltArmed] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleClearLogs = () => setLogs([]);

  const handleExportLogs = () => {
    const csv = 'data:text/csv;charset=utf-8,'
      + logs.map((e) => `"${e.ts}","${e.level}","${e.text}"`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'system-interaction-logs.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addLog = (level, text) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setLogs((prev) => [...prev, { ts: now, level, text }]);
  };

  const handleHalt = () => {
    if (!haltArmed) {
      setHaltArmed(true);
      setTimeout(() => setHaltArmed(false), 4000);
      return;
    }
    setHaltArmed(false);
    onTriggerControl?.('Emergency: Halt Trading');
    addLog('ERROR', 'CRITICAL: EMERGENCY TRADING HALT COMMAND ISSUED BY ADMIN.');
  };

  const visibleLogs = levelFilter === 'ALL'
    ? logs
    : logs.filter((l) => l.level === levelFilter);

  const levelTabs = ['ALL', 'INFO', 'ERROR', 'TRACE'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-2">

      {/* ── Left: System Interaction Logs ── */}
      <div className="xl:col-span-8 bg-surface-elevated rounded-[12px] flex flex-col h-[440px] border border-border/20 shadow-card-subtle overflow-hidden transition-all duration-300 hover:border-brand/15">

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between bg-surface-elevated flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-brand" />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                System Interaction Logs
              </h3>
            </div>
            <span className="px-1.5 py-0.5 bg-brand/10 text-brand text-[10px] font-black rounded-[5px] border border-brand/20 font-mono">
              {visibleLogs.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleExportLogs}
              className="h-7 px-2.5 flex items-center gap-1 rounded-[6px] border border-border/20 bg-bg text-text-muted hover:text-text hover:border-border/40 text-[10px] font-bold transition-all cursor-pointer"
            >
              <Download size={10} /> CSV
            </button>
            <button
              type="button"
              onClick={handleClearLogs}
              className="h-7 px-2.5 flex items-center gap-1 rounded-[6px] border border-border/20 bg-bg text-text-muted hover:text-negative hover:border-negative/30 text-[10px] font-bold transition-all cursor-pointer"
            >
              <Trash2 size={10} /> Clear
            </button>
          </div>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-0 border-b border-border/10 bg-bg/30 px-4 flex-shrink-0">
          {levelTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setLevelFilter(tab)}
              className={`px-3 py-2 text-[9.5px] font-black uppercase tracking-[0.12em] border-b-2 transition-all duration-200 cursor-pointer ${
                levelFilter === tab
                  ? 'text-brand border-b-brand'
                  : 'text-text-muted/50 border-b-transparent hover:text-text-muted/80'
              }`}
            >
              {tab}
              {tab !== 'ALL' && (
                <span className="ml-1 text-[8px] font-black opacity-60">
                  {logs.filter((l) => l.level === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[10.5px] space-y-0.5 bg-bg/20 custom-scrollbar">
          {visibleLogs.length === 0 ? (
            <div className="text-text-muted/25 italic text-center mt-16 text-[11px]">No logs captured. Bridge active...</div>
          ) : (
            visibleLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex gap-3 border-l-2 pl-2.5 py-1 rounded-r hover:bg-surface-elevated/40 transition-colors ${LEVEL_BORDER[log.level] || 'border-l-border'}`}
              >
                <span className="text-[9.5px] text-text-muted/30 font-mono shrink-0 pt-px">{log.ts.slice(11)}</span>
                <span
                  className="text-[9.5px] font-black shrink-0 w-9 pt-px"
                  style={{ color: LEVEL_COLORS[log.level] ?? 'var(--text)' }}
                >
                  [{log.level}]
                </span>
                <span className="text-text/75 leading-snug">{log.text}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        {/* Terminal Footer */}
        <div className="px-5 py-2 bg-bg/30 border-t border-border/10 flex justify-between items-center flex-shrink-0">
          <span className="text-[9.5px] font-mono text-text-muted/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            Streaming · Port 4432
          </span>
          <button
            type="button"
            onClick={() => addLog('INFO', 'Manual bridge ping requested. Status: OK')}
            className="text-[9px] font-mono text-text-muted/40 hover:text-brand transition-colors underline cursor-pointer"
          >
            &gt;_ Ping Bridge
          </button>
        </div>
      </div>

      {/* ── Right: Controls + Health ── */}
      <div className="xl:col-span-4 flex flex-col gap-5">

        {/* Advanced Global Controls */}
        <div className="rounded-[12px] border border-border/20 bg-surface-elevated p-5 flex flex-col gap-3.5 shadow-card-subtle transition-all duration-300 hover:scale-[1.01] hover:border-brand/15 group">
          <div className="flex items-center gap-2.5 pb-1 border-b border-border/10">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <h4 className="text-[12px] font-black uppercase tracking-widest text-text/80 flex items-center gap-1.5">
              <Play size={10} className="text-brand opacity-80" />
              Advanced Controls
            </h4>
          </div>

          <div className="space-y-2">
            {/* Mass Leverage Reset */}
            <button
              type="button"
              onClick={() => {
                onTriggerControl?.('Mass Leverage Reset');
                addLog('INFO', 'Executed global leverage check and mass reset protocol.');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] border border-border/20 bg-bg text-text-muted hover:text-brand hover:border-brand/30 hover:scale-[1.01] text-[11px] font-bold transition-all duration-200 cursor-pointer group/btn"
            >
              <span>Mass Leverage Reset</span>
              <Sliders size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
            </button>

            {/* Force Server Reconnect */}
            <button
              type="button"
              onClick={() => {
                onTriggerControl?.('Force Server Reconnect');
                addLog('INFO', 'Initiated hard reconnect sequence on MT5 Cluster.');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] border border-border/20 bg-bg text-text-muted hover:text-warning hover:border-warning/30 hover:scale-[1.01] text-[11px] font-bold transition-all duration-200 cursor-pointer group/btn"
            >
              <span>Force Server Reconnect</span>
              <Globe size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
            </button>

            {/* EMERGENCY HALT — 2-click confirm */}
            <button
              type="button"
              onClick={handleHalt}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] border font-bold text-[11px] transition-all duration-300 cursor-pointer group/btn ${
                haltArmed
                  ? 'bg-negative/10 text-negative border-negative/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : 'border-negative/20 bg-bg text-text-muted hover:text-negative hover:border-negative/30 hover:scale-[1.01]'
              }`}
            >
              <span>{haltArmed ? '⚠ Click Again to CONFIRM HALT' : 'EMERGENCY: Halt Trading'}</span>
              <AlertTriangle size={12} className={haltArmed ? 'text-negative' : 'opacity-50 group-hover/btn:opacity-100 transition-opacity'} />
            </button>
          </div>
        </div>

        {/* Synchronization Health Matrix */}
        <div className="bg-surface-elevated rounded-[12px] border border-border/20 p-5 flex flex-col gap-4 shadow-card-subtle transition-all duration-300 hover:scale-[1.01] hover:border-positive/15 group">
          <div className="flex items-center justify-between pb-1 border-b border-border/10">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-positive" />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-text/80 flex items-center gap-1.5">
                <Wifi size={10} className="text-positive opacity-80 animate-pulse" />
                Sync Health
              </h4>
            </div>
            {/* Heartbeat SVG */}
            <svg viewBox="0 0 60 20" className="w-12 h-4 opacity-40 group-hover:opacity-75 transition-opacity" fill="none">
              <polyline
                points="0,10 8,10 12,3 16,17 20,10 28,10 32,5 36,15 40,10 60,10"
                stroke="var(--positive)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'DATA INTEGRITY', value: 99.8, color: 'var(--positive)' },
              { label: 'NETWORK STABILITY', value: 82, color: 'var(--brand)' },
              { label: 'API RESPONSE TIME', value: 94, color: 'var(--cyan)' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-[9.5px] font-black mb-1.5">
                  <span className="text-text-muted/60 uppercase tracking-wider">{label}</span>
                  <span className="font-mono" style={{ color }}>{value}%</span>
                </div>
                <div className="w-full h-1.5 bg-border/15 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${value}%`,
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
