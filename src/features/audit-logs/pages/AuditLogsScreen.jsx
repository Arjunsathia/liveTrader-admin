import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/common/PageShell';
import { MetricGrid } from '../../../components/cards/MetricGrid';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerField, DrawerGrid, DrawerSection } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { auditLogsService } from '../services/audit-logs.service';

function renderCell(row, column) {
  if (column.type === 'status') return <StatusBadge status={row[column.key]} dot={false} />;
  if (column.type === 'mono') return <span className="font-mono text-[12px] text-text-muted">{row[column.key]}</span>;
  return row[column.key];
}

export function AuditLogsScreen() {
  const location = useLocation();
  const slug = location.pathname.split('/')[2] || 'access-logs';
  const workspace = auditLogsService.getWorkspace(slug);
  const drawer = useDrawerState(null);
  const table = useTableState(workspace.rows, {
    searchFields: ['id', 'event', 'action', 'admin', 'description'],
    initialPageSize: 10,
  });

  const columns = workspace.columns.map((column) => ({
    ...column,
    render: (row) => renderCell(row, column),
  }));

  const filterSets = (workspace.filters ?? []).map((filter) => ({
    label: filter.label,
    get: table.filters[filter.key] ?? 'all',
    set: (value) => table.setFilter(filter.key, value === 'all' ? undefined : value),
    opts: filter.options,
  }));

  return (
    <PageShell>
      <MetricGrid metrics={workspace.metrics} />

      <PageToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder={`Search ${workspace.title.toLowerCase()} records`}
        filterSets={filterSets}
        actions={[
          { label: 'Export', icon: Download, variant: 'secondary', onClick: () => exportRows(table.items, `audit-logs-${slug}.csv`) },
          { label: 'Open Security Review', icon: Eye, variant: 'primary', onClick: () => { } },
        ]}
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
                    type="button"
                    onClick={() => drawer.open(row)}
                    className="inline-flex h-7 items-center gap-1.5 rounded-[6px] border border-border/25 bg-bg/60 px-3 text-[11px] font-semibold text-text-muted transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
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

      <AdminDrawer
        open={drawer.isOpen}
        title={drawer.value?.id ?? 'Audit Record'}
        subtitle={drawer.value?.admin ?? drawer.value?.event ?? ''}
        eyebrow="Audit Record"
        width="max-w-[720px]"
        onClose={drawer.close}
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={drawer.close}>Close</Button>
            <Button variant="primary">Open Security Review</Button>
          </div>
        )}
      >
        {drawer.value && (
          <DrawerSection title="Record Details">
            <DrawerGrid>
              {Object.entries(drawer.value).map(([key, value]) => (
                <DrawerField
                  key={key}
                  label={key}
                  value={String(value)}
                  mono={key.toLowerCase().includes('id') || key.toLowerCase().includes('ip')}
                  copyable={key.toLowerCase().includes('id') || key.toLowerCase().includes('ip')}
                />
              ))}
            </DrawerGrid>
          </DrawerSection>
        )}
      </AdminDrawer>
    </PageShell>
  );
}
