import React from 'react';
import { StatusBadge, RiskChip } from '../../../components/ui';
import { Pagination } from '../../../components/tables/Pagination';

export function KYCTable({ tableState, onReviewUser }) {
  const paged = tableState.items;

  return (
    <>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Docs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/8">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                  No KYC cases matched the current search.
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const isFlagged = ['REJECTED', 'FAILED', 'FLAGGED'].includes(row.status);
                const isPending = ['PENDING', 'NONE'].includes(row.status);

                return (
                  <tr
                    key={row.id}
                    onClick={() => onReviewUser(row.userId)}
                    className={`group cursor-pointer transition-colors border-l-2 border-transparent ${isFlagged
                      ? 'hover:bg-negative/5 hover:border-l-negative'
                      : isPending
                        ? 'hover:bg-warning/5 hover:border-l-warning'
                        : 'hover:bg-positive/5 hover:border-l-positive'
                      }`}
                  >
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-brand">{row.id}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="text-[12px] font-semibold text-text">{row.user}</div>
                        <div className="text-[10px] text-text-muted/50 font-medium">{row.country}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] font-medium text-text">{row.tier}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-text-muted font-medium">{row.docs}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <RiskChip value={row.risk} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.eta}</td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onReviewUser(row.userId)}
                        className="rounded-[6px] border border-border/25 bg-bg/50 px-2.5 py-1 text-[11px] font-bold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border/10">
        <Pagination
          page={tableState.page}
          totalPages={tableState.totalPages}
          onPageChange={tableState.setPage}
          pageSize={tableState.pageSize}
          onPageSizeChange={tableState.setPageSize}
        />
      </div>
    </>
  );
}
