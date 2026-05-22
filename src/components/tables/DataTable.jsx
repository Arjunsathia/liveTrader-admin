/**
 * DataTable — THE single table component for the entire app.
 *
 * Merged from: DataTable (shim), FeatureTable (renderer), Table/TableRow/TableCell (HTML primitives).
 *
 * Supports both the original DataTable API and the FeatureTable API:
 *   - columns / cols
 *   - data / rows
 *   - onRowClick / onRow
 *   - rowKey, emptyMsg, emptyTitle, footer, rowClassName
 */
import React from 'react';
import { EmptyState } from '@components/feedback/EmptyState';
import { renderTableCell } from './CellRenderers';

/* ── HTML Primitives (inlined from ui/Table.jsx) ── */

function alignmentClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

function TableBase({ headers, columns, data, rowRenderer, className = '', ...props }) {
  const columnMeta = columns ?? headers.map((header) => ({ label: header }));
  return (
    <div className={`overflow-x-auto custom-scrollbar ${className}`} {...props}>
      <table className="w-full border-separate [border-spacing:0_10px] text-left">
        <thead>
          <tr>
            {columnMeta.map((column, idx) => (
              <th
                key={column.key ?? column.label ?? idx}
                className={`py-1 px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted opacity-60 ${alignmentClass(column.align)}`}
                style={{ width: column.width }}
              >
                {column.label ?? headers[idx]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[13px]">
          {data.map((item, idx) => rowRenderer(item, idx))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ children, className = '', ...props }) {
  const hasHoverClass = className.includes('hover:');
  const baseClasses = 'bg-surface-elevated/55 shadow-card-subtle transition-colors duration-200 group';
  const hoverClass = hasHoverClass ? '' : 'hover:bg-surface-bright/35';
  return (
    <tr className={`${baseClasses} ${hoverClass} ${className}`} {...props}>
      {children}
    </tr>
  );
}

function TableCell({ children, className = '', align, width, truncate = false, ...props }) {
  return (
    <td
      className={`py-4 px-6 first:rounded-l-[10px] last:rounded-r-[10px] ${alignmentClass(align)} ${truncate ? 'max-w-[260px] truncate' : ''} ${className}`}
      style={{ width }}
      {...props}
    >
      {children}
    </td>
  );
}

/* ── DataTable — unified public API ── */

function DataTableBase({
  /* FeatureTable / primary API */
  columns,
  cols,
  data,
  rows,
  onRowClick,
  onRow,
  rowKey = 'id',
  emptyMsg = 'No records found',
  emptyTitle,
  footer,
  rowClassName,
  /* Legacy DataTable API compat */
  emptyDescription,
  isLegacy = false,
}) {
  const _columns = columns ?? cols ?? [];
  const _data = data ?? rows ?? [];
  const _onClick = onRowClick ?? onRow;
  const _empty = emptyMsg !== 'No records found'
    ? emptyMsg
    : (emptyTitle ?? emptyDescription ?? emptyMsg);

  // Remap legacy DataTable render(row, index) -> FeatureTable render(value, row, index)
  const adaptedColumns = _columns.map((column) => ({
    ...column,
    render: column.render
      ? (value, row, index) => {
        if (isLegacy) {
          return column.render(row, index);
        }
        return column.render(value, row, index);
      }
      : undefined,
  }));

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
      <TableBase
        headers={adaptedColumns.map((column) => column.label)}
        columns={adaptedColumns}
        data={_data}
        rowRenderer={(row, idx) => (
          <TableRow
            key={row[rowKey] ?? row._id ?? row.id ?? idx}
            className={`${_onClick ? 'cursor-pointer' : ''} ${typeof rowClassName === 'function' ? rowClassName(row, idx) : (rowClassName ?? '')}`}
            onClick={_onClick ? () => _onClick(row) : undefined}
          >
            {adaptedColumns.map((column) => (
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

export function DataTable(props) {
  return <DataTableBase isLegacy={true} {...props} />;
}

export function FeatureTable(props) {
  return <DataTableBase isLegacy={false} {...props} />;
}
