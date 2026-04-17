import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { MetricGrid } from '../../../components/cards/MetricGrid';
import { PageToolbar } from '../../../components/toolbar/PageToolbar';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { supportService } from '../../../services/supportService';

function renderCell(row, column) {
  if (column.type === 'status') return <StatusBadge status={row[column.key]} dot={false} />;
  if (column.type === 'mono') return <span className="font-mono text-[12px] text-text-muted">{row[column.key]}</span>;
  return row[column.key];
}

export function SupportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split('/')[2] || 'tickets';
  const workspace = supportService.getWorkspace(slug);
  const table = useTableState(workspace.rows, {
    searchFields: ['ticket', 'user', 'subject', 'owner'],
    initialPageSize: 10,
  });

  const columns = workspace.columns.map((column) => ({
    ...column,
    render: (row) => renderCell(row, column),
  }));

  // Bridge workspace.filters → PageToolbar filterSets shape
  const filterSets = (workspace.filters ?? []).map((f) => ({
    label: f.label,
    get:   table.filters[f.key] ?? 'all',
    set:   (v) => table.setFilter(f.key, v === 'all' ? undefined : v),
    opts:  f.options,
  }));

  const actions = [
    { label: 'Export',        icon: Download, variant: 'secondary', onClick: () => exportRows(table.items, `support-${slug}.csv`) },
    { label: 'Create Ticket', icon: Eye,      variant: 'primary',   onClick: () => {} },
  ];

  return (
    <PageShell>
      <MetricGrid metrics={workspace.metrics} />

      <PageToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder={`Search ${workspace.title.toLowerCase()} records`}
        filterSets={filterSets}
        actions={actions}
        className="mb-6"
      />

      <Card title={workspace.tableTitle} subtitle={workspace.tableSubtitle} padding={false}>
        <DataTable
          columns={[
            ...columns,
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <div className="text-right">
                  <button
                    onClick={() => navigate(`/support/tickets/${row.ticket}`)}
                    className="inline-flex items-center gap-1.5 h-7 rounded-[6px] border border-border/25 bg-bg/60 px-3 text-[11px] font-semibold text-text-muted transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                  >
                    Open
                  </button>
                </div>
              ),
            },
          ]}
          data={table.items}
          rowKey="id"
        />
        <Pagination
          page={table.page}
          totalPages={table.totalPages}
          onPageChange={table.setPage}
          pageSize={table.pageSize}
          onPageSizeChange={table.setPageSize}
        />
      </Card>
    </PageShell>
  );
}
