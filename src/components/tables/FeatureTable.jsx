import React from 'react';
import { Table, TableRow, TableCell } from '../ui/Table';
import { EmptyState } from '../feedback/EmptyState';

/**
 * FeatureTable — canonical table wrapper for all feature sub-pages.
 *
 * Replaces the near-identical PropTable and IBTable that existed in
 * each feature's /components/ folder. Uses the same Table/TableRow/TableCell
 * primitives and supports clickable rows, custom cell renderers, and an
 * empty state.
 *
 * API:
 *   cols     — [{ key, label, render? }]  column definitions
 *   rows     — data array
 *   onRow    — (row) => void  optional click handler (makes rows clickable)
 *   emptyMsg — string  text shown when rows is empty
 *   rowKey   — string  key to use for React key prop (default: 'id')
 */
export function FeatureTable({
  cols,
  rows,
  onRow,
  emptyMsg = 'No records found',
  rowKey = 'id',
}) {
  if (!rows?.length) {
    return (
      <div className="p-6">
        <EmptyState title={emptyMsg} />
      </div>
    );
  }

  return (
    <Table
      headers={cols.map((c) => c.label)}
      data={rows}
      rowRenderer={(row) => (
        <TableRow
          key={row[rowKey] ?? row._id ?? row.id}
          className={onRow ? 'cursor-pointer' : ''}
          onClick={onRow ? () => onRow(row) : undefined}
        >
          {cols.map((c) => (
            <TableCell key={c.key}>
              {c.render
                ? c.render(row[c.key], row)
                : <span className="text-[12px] text-text/70">{row[c.key] ?? '—'}</span>
              }
            </TableCell>
          ))}
        </TableRow>
      )}
    />
  );
}
