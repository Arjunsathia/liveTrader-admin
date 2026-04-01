import React from 'react';

export function Table({ 
  headers, 
  data, 
  rowRenderer, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`overflow-x-auto custom-scrollbar ${className}`} {...props}>
      <table className="w-full border-separate [border-spacing:0_10px] text-left">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="py-1 px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted opacity-60"
              >
                {header}
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
  return (
    <tr 
      className={`bg-surface-elevated/55 shadow-card-subtle hover:bg-surface-bright/35 transition-colors duration-200 group ${className}`} 
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`py-4 px-6 first:rounded-l-[10px] last:rounded-r-[10px] ${className}`} {...props}>
      {children}
    </td>
  );
}
