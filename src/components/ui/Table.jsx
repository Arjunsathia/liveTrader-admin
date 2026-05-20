import React from 'react';

function alignmentClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

export function Table({
  headers,
  columns,
  data,
  rowRenderer,
  className = '',
  ...props
}) {
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

export function TableRow({ children, className = '', ...props }) {
  const hasHoverClass = className.includes('hover:');
  const baseClasses = 'bg-surface-elevated/55 shadow-card-subtle transition-colors duration-200 group';
  const hoverClass = hasHoverClass ? '' : 'hover:bg-surface-bright/35';

  return (
    <tr
      className={`${baseClasses} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', align, width, truncate = false, ...props }) {
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
