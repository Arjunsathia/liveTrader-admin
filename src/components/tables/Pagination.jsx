import React from 'react';
import { Button } from '../../components/ui/Button';

export function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/40 bg-white/2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-[11px] text-text-muted">
        <span className="font-semibold uppercase tracking-[0.14em]">Rows</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-[8px] border border-white/5 bg-bg px-3 py-2 text-[12px] text-text outline-none"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">
          Page {page} / {totalPages}
        </span>
        <Button size="sm" variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
