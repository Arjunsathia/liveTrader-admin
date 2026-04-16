import React from 'react';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/feedback/EmptyState';

/**
 * IBTable — canonical table using global Table/TableRow/TableCell primitives.
 * Pixel-perfect parity with Prop Trading and Copy Trading pages.
 */
export function IBTable({ cols, rows, onRow, emptyMsg = 'No records found' }) {
  if (!rows.length) {
    return <div className="p-6"><EmptyState title={emptyMsg} /></div>;
  }
  return (
    <Table
      headers={cols.map(c => c.label)}
      data={rows}
      rowRenderer={(row) => (
        <TableRow
          key={row.id ?? row._id}
          className={onRow ? 'cursor-pointer' : ''}
          onClick={onRow ? () => onRow(row) : undefined}
        >
          {cols.map(c => (
            <TableCell key={c.key}>
              {c.render ? c.render(row[c.key], row) : (
                <span className="text-[12px] text-text/70">{row[c.key] ?? '—'}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  );
}
