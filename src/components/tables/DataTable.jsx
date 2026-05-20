/**
 * DataTable — backward-compatible shim.
 * All new code should import FeatureTable directly.
 * This wrapper remaps DataTable's API to FeatureTable's unified API.
 */
import React from 'react';
import { FeatureTable } from './FeatureTable';

export function DataTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  emptyTitle,
  emptyDescription,
  rowClassName,
}) {
  const adaptedColumns = columns?.map((column) => ({
    ...column,
    render: column.render
      ? (_value, row, index) => column.render(row, index)
      : undefined,
  }));

  return (
    <FeatureTable
      columns={adaptedColumns}
      data={data}
      rowKey={rowKey}
      onRowClick={onRowClick}
      emptyMsg={emptyTitle ?? emptyDescription ?? 'No records found'}
      rowClassName={rowClassName}
    />
  );
}
