import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { MetricGrid } from '../../../components/cards/MetricGrid';
import { TableToolbar } from '../../../components/tables/TableToolbar';
import { FilterBar } from '../../../components/filters/FilterBar';
import { FilterChips } from '../../../components/filters/FilterChips';
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

  return (
    <PageShell>
      <MetricGrid metrics={workspace.metrics} />

      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder={`Search ${workspace.title.toLowerCase()} records`}
        actions={(
          <>
            <Button variant="secondary" icon={Download} onClick={() => exportRows(table.items, `support-${slug}.csv`)}>Export</Button>
            <Button variant="primary" icon={Eye}>Create Ticket</Button>
          </>
        )}
      >
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
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/support/tickets/${row.ticket}`)}>Open</Button>
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
