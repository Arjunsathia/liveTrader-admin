import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { SectionHeader } from '../../../layout/SectionHeader';
import { MetricStrip } from '../../../components/cards/MetricStrip';
import { TableToolbar } from '../../../components/tables/TableToolbar';
import { FilterBar } from '../../../components/filters/FilterBar';
import { FilterChips } from '../../../components/filters/FilterChips';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { reportsService } from '../../../services/reportsService';

function renderCell(row, column) {
  if (column.type === 'status') return <StatusBadge status={row[column.key]} dot={false} />;
  if (column.type === 'amount') return <span className="price-data font-medium text-text">{row[column.key]}</span>;
  if (column.type === 'mono') return <span className="font-mono text-[12px] text-text-muted">{row[column.key]}</span>;
  return row[column.key];
}

export function ReportsPage() {
  const location = useLocation();
  const slug = location.pathname.split('/')[2] || 'finance';
  const workspace = reportsService.getWorkspace(slug);
  const drawer = useDrawerState(null);
  const table = useTableState(workspace.rows, {
    searchFields: ['id', 'name', 'owner', 'job'],
    initialPageSize: 10,
  });

  const columns = workspace.columns.map((column) => ({
    ...column,
    render: (row) => renderCell(row, column),
  }));

  return (
    <PageShell>
      <SectionHeader
        eyebrow={workspace.eyebrow}
        title={workspace.title}
        description={workspace.description}
        actions={(
          <>
            <Button variant="secondary" icon={Download} onClick={() => exportRows(table.items, `reports-${slug}.csv`)}>Export</Button>
            <Button variant="primary" icon={Eye}>Generate Report</Button>
          </>
        )}
      />

      <MetricStrip metrics={workspace.metrics} />

      <TableToolbar searchValue={table.search} onSearchChange={table.setSearch} searchPlaceholder={`Search ${workspace.title.toLowerCase()} reports`}>
        <FilterBar filters={workspace.filters} values={table.filters} onChange={table.setFilter} />
      </TableToolbar>

      <FilterChips filters={table.filters} onClear={(key) => table.setFilter(key, 'all')} />

      <Card title={workspace.tableTitle} subtitle={workspace.tableSubtitle} padding={false}>
        <DataTable
          columns={[
            ...columns,
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <div className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => drawer.open(row)}>Open</Button>
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

      <AdminDrawer open={drawer.isOpen} title={drawer.value?.id ?? 'Report'} subtitle={drawer.value?.name ?? ''} onClose={drawer.close}>
        {drawer.value && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(drawer.value).map(([key, value]) => (
              <div key={key} className="rounded-[10px] border border-border/30 bg-bg/70 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{key}</div>
                <div className="mt-1 text-[13px] text-text">{String(value)}</div>
              </div>
            ))}
          </div>
        )}
      </AdminDrawer>
    </PageShell>
  );
}
