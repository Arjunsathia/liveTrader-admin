import React from 'react';
import { Table, TableCell, TableRow } from '../../components/ui/Table';
import { EmptyState } from '../common/feedback/EmptyState';

export function DataTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  emptyTitle,
  emptyDescription,
}) {
  if (!data.length) {
    return (
      <div className="p-6">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <Table
      headers={columns.map((column) => column.label)}
      data={data}
      rowRenderer={(row, index) => (
        <TableRow
          key={row[rowKey] ?? index}
          className={onRowClick ? 'cursor-pointer' : ''}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
        >
          {columns.map((column) => (
            <TableCell
              key={column.key}
              className={column.className ?? ''}
            >
              {column.render ? column.render(row) : row[column.key]}
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  );
}
