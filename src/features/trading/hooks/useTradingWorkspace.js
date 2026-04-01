import { useState, useMemo, useEffect } from 'react';
import { useTableState } from '../../../hooks/useTableState';

export function useTradingWorkspace(config) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    symbol: 'all',
    side: 'all',
    server: 'all',
    severity: 'all',
    bridge: 'all',
    source: 'all',
    pnl: 'all',
  });

  const setFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const filterSets = useMemo(() => {
    const s = config;
    const sets = [];
    if (s.statusOpts) sets.push({ label: 'Status', opts: s.statusOpts, get: filters.status, set: (v) => setFilter('status', v), key: 'status' });
    if (s.typeOpts) sets.push({ label: 'Type', opts: s.typeOpts, get: filters.type, set: (v) => setFilter('type', v), key: 'type' });
    if (s.symbolOpts) sets.push({ label: 'Symbol', opts: s.symbolOpts, get: filters.symbol, set: (v) => setFilter('symbol', v), key: 'symbol' });
    if (s.sideOpts) sets.push({ label: 'Side', opts: s.sideOpts, get: filters.side, set: (v) => setFilter('side', v), key: 'side' });
    if (s.serverOpts) sets.push({ label: 'Server', opts: s.serverOpts, get: filters.server, set: (v) => setFilter('server', v), key: 'server' });
    if (s.severityOpts) sets.push({ label: 'Severity', opts: s.severityOpts, get: filters.severity, set: (v) => setFilter('severity', v), key: 'severity' });
    if (s.bridgeOpts) sets.push({ label: 'Bridge', opts: s.bridgeOpts, get: filters.bridge, set: (v) => setFilter('bridge', v), key: 'bridge' });
    if (s.resultOpts) sets.push({ label: 'Result', opts: s.resultOpts, get: filters.status, set: (v) => setFilter('status', v), key: 'status' });
    if (s.sourceOpts) sets.push({ label: 'Source', opts: s.sourceOpts, get: filters.source, set: (v) => setFilter('source', v), key: 'source' });
    if (s.profitOpts) sets.push({ label: 'P&L', opts: s.profitOpts, get: filters.pnl, set: (v) => setFilter('pnl', v), key: '_pnl' });
    return sets.slice(0, 4);
  }, [config, filters]);

  const filtered = useMemo(() => {
    let rows = config.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => config.searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(q)));
    }
    for (const fs of filterSets) {
      if (fs.get !== 'all') {
        rows = rows.filter((r) => {
          if (fs.key === '_pnl') {
            return fs.get === 'Profit' ? String(r.pnl).startsWith('+') : !String(r.pnl).startsWith('+');
          }
          return r[fs.key] === fs.get;
        });
      }
    }
    return rows;
  }, [config, search, filters]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  return {
    search,
    setSearch,
    filters,
    setFilter,
    filterSets,
    filtered,
    table,
  };
}
