import React from 'react';
import { Table, TableRow, TableCell } from '../ui/Table';
import { EmptyState } from '../common/feedback/EmptyState';
import { renderTableCell } from './cellRenderers';

export function FeatureTable({
  columns,
  data,
  onRowClick,
  rowKey = 'id',
  emptyMsg = 'No records found',
  footer,
  rowClassName,
  cols,
  rows,
  onRow,
  emptyTitle,
}) {
  const _columns = columns ?? cols ?? [];
  const _data = data ?? rows ?? [];
  const _onClick = onRowClick ?? onRow;
  const _empty = emptyMsg !== 'No records found' ? emptyMsg : (emptyTitle ?? emptyMsg);

  if (!_data.length) {
    return (
      <div className="p-6">
        <EmptyState title={_empty} />
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    );
  }

  return (
    <>
      <Table
        headers={_columns.map((column) => column.label)}
        columns={_columns}
        data={_data}
        rowRenderer={(row, idx) => (
          <TableRow
            key={row[rowKey] ?? row._id ?? row.id ?? idx}
            className={`${_onClick ? 'cursor-pointer' : ''} ${typeof rowClassName === 'function' ? rowClassName(row, idx) : (rowClassName ?? '')}`}
            onClick={_onClick ? () => _onClick(row) : undefined}
          >
            {_columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                width={column.width}
                truncate={column.truncate}
                className={column.className ?? ''}
              >
                {renderTableCell(column, row, idx)}
              </TableCell>
            ))}
          </TableRow>
        )}
      />
      {footer && <div className="px-5 pb-5 mt-2">{footer}</div>}
    </>
  );
}
