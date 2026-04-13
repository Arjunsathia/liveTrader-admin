import { useMemo, useState } from 'react';
import { useTableState } from '../../../hooks/useTableState';

/**
 * useCopyTradingWorkspace — mirrors useTradingWorkspace exactly.
 * Accepts a config object, manages search + filter state, applies
 * them to config.rows, and feeds the result into useTableState.
 */
export function useCopyTradingWorkspace(config) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status:   'all',
    risk:     'all',
    approval: 'all',
    region:   'all',
    plan:     'all',
    trend:    'all',
    severity: 'all',
    type:     'all',
  });

  const setFilter = (key, val) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  /* Build filterSets dynamically from config opts */
  const filterSets = useMemo(() => {
    const sets = [];
    if (config.statusOpts)   sets.push({ label: 'Status',   opts: config.statusOpts,   get: filters.status,   set: (v) => setFilter('status',   v), key: 'status'   });
    if (config.riskOpts)     sets.push({ label: 'Risk',     opts: config.riskOpts,     get: filters.risk,     set: (v) => setFilter('risk',     v), key: 'risk'     });
    if (config.approvalOpts) sets.push({ label: 'Approval', opts: config.approvalOpts, get: filters.approval, set: (v) => setFilter('approval', v), key: 'approval' });
    if (config.regionOpts)   sets.push({ label: 'Region',   opts: config.regionOpts,   get: filters.region,   set: (v) => setFilter('region',   v), key: 'region'   });
    if (config.planOpts)     sets.push({ label: 'Plan',     opts: config.planOpts,     get: filters.plan,     set: (v) => setFilter('plan',     v), key: 'plan'     });
    if (config.trendOpts)    sets.push({ label: 'Trend',    opts: config.trendOpts,    get: filters.trend,    set: (v) => setFilter('trend',    v), key: 'trend'    });
    if (config.severityOpts) sets.push({ label: 'Severity', opts: config.severityOpts, get: filters.severity, set: (v) => setFilter('severity', v), key: 'severity' });
    if (config.typeOpts)     sets.push({ label: 'Type',     opts: config.typeOpts,     get: filters.type,     set: (v) => setFilter('type',     v), key: 'type'     });
    return sets.slice(0, 4);
  }, [config, filters]);

  /* Apply search + filters to rows */
  const filtered = useMemo(() => {
    let rows = config.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        config.searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(q))
      );
    }
    for (const fs of filterSets) {
      if (fs.get !== 'all') rows = rows.filter((r) => r[fs.key] === fs.get);
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
