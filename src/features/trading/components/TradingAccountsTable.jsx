import React, { useState } from 'react';
import { RefreshCw, KeyRound, ChevronRight, Search, Copy, Check, Clock } from 'lucide-react';

export function TradingAccountsTable({
  items,
  onRowClick,
  onSync,
  onResetPassword,
  activeFilter = 'ALL',
  activeSort = 'EQUITY',
  onChangeFilter,
  onChangeSort,
}) {
  const [search, setSearch] = useState('');
  const [copiedLogin, setCopiedLogin] = useState(null);

  const filtered = search.trim()
    ? items.filter(
      (r) =>
        r.login.includes(search) ||
        r.user.toLowerCase().includes(search.toLowerCase()) ||
        r.server.toLowerCase().includes(search.toLowerCase()) ||
        (r.group || '').toLowerCase().includes(search.toLowerCase())
    )
    : items;

  const handleCopyLogin = (e, login) => {
    e.stopPropagation();
    navigator.clipboard.writeText(login);
    setCopiedLogin(login);
    setTimeout(() => setCopiedLogin(null), 1500);
  };

  return (
    <section className="bg-surface-elevated rounded-[12px] overflow-hidden shadow-card-subtle border border-border/20">
      {/* Table Toolbar */}
      <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface/30 flex-wrap">
        <div className="flex items-center gap-2.5">
          <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
            MT5 Account Inventory
          </h3>
          <span className="px-1.5 py-0.5 rounded-[5px] bg-brand/10 text-brand text-[10px] font-black border border-brand/20">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Inline Search */}
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts…"
              className="h-7 pl-7 pr-3 w-40 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-52 transition-all"
            />
          </div>

          {/* Filter Chip */}
          <button
            type="button"
            onClick={() => onChangeFilter?.(activeFilter === 'ALL' ? 'LIVE' : 'ALL')}
            className={`px-2.5 py-1 text-[10px] font-black rounded-[6px] border transition-all cursor-pointer uppercase tracking-wider ${activeFilter === 'LIVE'
                ? 'bg-positive/10 text-positive border-positive/30'
                : 'bg-surface-bright/20 text-text-muted border-border/20 hover:border-border/40'
              }`}
          >
            {activeFilter === 'LIVE' ? '● Live Only' : '○ All'}
          </button>

          {/* Sort Chip */}
          <button
            type="button"
            onClick={() => onChangeSort?.(activeSort === 'EQUITY' ? 'LOGIN' : 'EQUITY')}
            className="px-2.5 py-1 bg-surface-bright/20 hover:bg-surface-bright/35 border border-border/20 text-[10px] font-bold rounded-[6px] text-text-muted transition-all cursor-pointer uppercase tracking-wider hover:border-border/40"
          >
            ↕ {activeSort === 'EQUITY' ? 'Equity' : 'Login'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
              <th className="px-5 py-3">Account ID</th>
              <th className="px-5 py-3">Server</th>
              <th className="px-5 py-3">Group / Type</th>
              <th className="px-5 py-3">Leverage</th>
              <th className="px-5 py-3">Equity (USD)</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last Sync</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/8">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                  No accounts match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const isLive = row.status === 'LIVE' || row.status === 'ACTIVE';
                const statusColor = isLive ? 'var(--positive)' : 'var(--negative)';
                const statusText = isLive ? 'LIVE' : row.status || 'DISCONNECTED';
                const equity = parseFloat((row.equity || '$0').replace(/[$,]/g, ''));
                const balance = parseFloat((row.balance || '$0').replace(/[$,]/g, ''));
                const delta = equity - balance;
                const deltaSign = delta >= 0 ? '+' : '';

                return (
                  <tr
                    key={row.login}
                    onClick={() => onRowClick?.(row)}
                    className="relative hover:bg-brand/5 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-l-brand"
                  >
                    {/* Account ID */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[13px] text-brand">{row.login}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyLogin(e, row.login)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted/50 hover:text-brand transition-all"
                          title="Copy Login"
                        >
                          {copiedLogin === row.login ? <Check size={10} /> : <Copy size={10} />}
                        </button>
                      </div>
                      <div className="text-[9.5px] text-text-muted/40 font-mono mt-0.5">{row.uid}</div>
                    </td>

                    {/* Server */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: row.server?.includes('EU') ? 'var(--brand)' : 'var(--warning)',
                            boxShadow: `0 0 5px ${row.server?.includes('EU') ? 'var(--brand)' : 'var(--warning)'}`,
                          }}
                        />
                        <span className="text-[12px] font-semibold text-text">{row.server}</span>
                      </div>
                      <div className="text-[9.5px] text-text-muted/40 uppercase tracking-wide mt-0.5 ml-3">
                        {row.server?.includes('EU') ? 'EU Node' : row.server?.includes('US') ? 'US Node' : 'APAC Node'}
                      </div>
                    </td>

                    {/* Group */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand/8 text-brand text-[10px] font-extrabold rounded-[5px] border border-brand/18">
                        <span className="w-1 h-1 rounded-full bg-brand/60" />
                        {(row.group || 'UNKNOWN').toUpperCase()}
                      </span>
                    </td>

                    {/* Leverage */}
                    <td className="px-5 py-3.5 font-mono text-[12px] text-text-muted/70">
                      {row.leverage}
                    </td>

                    {/* Equity with delta */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold font-mono text-[13px] text-text">{row.equity}</div>
                      {!isNaN(delta) && delta !== 0 && (
                        <div
                          className="text-[9.5px] font-mono font-semibold mt-0.5"
                          style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
                        >
                          {deltaSign}${Math.abs(delta).toFixed(2)} vs bal.
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] text-[10px] font-black"
                        style={{
                          color: statusColor,
                          background: `color-mix(in srgb, ${statusColor} 10%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${statusColor} 22%, transparent)`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: statusColor,
                            boxShadow: isLive ? `0 0 6px ${statusColor}` : 'none',
                          }}
                        />
                        {statusText}
                      </span>
                    </td>

                    {/* Last Sync */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-[11px] text-text-muted/55 font-mono">
                        <Clock size={9} className="shrink-0 text-text-muted/35" />
                        {row.lastSync}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => onSync?.(row)}
                          className="h-7 w-7 flex items-center justify-center rounded-full border border-brand/20 bg-brand/5 hover:bg-brand/15 text-brand transition-all cursor-pointer"
                          title="Sync Now"
                        >
                          <RefreshCw size={11} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onResetPassword?.(row)}
                          className="h-7 w-7 flex items-center justify-center rounded-full border border-negative/20 bg-negative/5 hover:bg-negative/15 text-negative transition-all cursor-pointer"
                          title="Reset Password"
                        >
                          <KeyRound size={11} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRowClick?.(row)}
                          className="h-7 w-7 flex items-center justify-center rounded-full border border-border/20 bg-surface-elevated hover:border-brand/30 hover:text-brand text-text-muted transition-all cursor-pointer"
                          title="Open Details"
                        >
                          <ChevronRight size={11} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
