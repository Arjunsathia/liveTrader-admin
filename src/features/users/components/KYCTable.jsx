import React from 'react';
import { StatusBadge, RiskChip } from '../../../components/ui';
import { MainTable } from '../../../components/common/table';

export function KYCTable({ tableState, onReviewUser }) {
  const columns = [
    { key: 'id', label: 'Case ID', render: (val) => <span className="font-mono text-[11px] font-bold text-brand">{val}</span> },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div>
          <div className="text-[12px] font-semibold text-text">{row.user}</div>
          <div className="text-[10px] text-text-muted/50 font-medium">{row.country}</div>
        </div>
      ),
    },
    { key: 'tier', label: 'Tier', render: (val) => <span className="text-[12px] font-medium text-text">{val}</span> },
    { key: 'docs', label: 'Docs', render: (val) => <span className="text-[12px] text-text-muted font-medium">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'risk', label: 'Risk', render: (val) => <RiskChip value={val} /> },
    { key: 'eta', label: 'ETA', render: (val) => <span className="font-mono text-[11px] text-text-muted/50">{val}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReviewUser(row.userId); }}
          className="rounded-[6px] border border-border/25 bg-bg/50 px-2.5 py-1 text-[11px] font-bold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onReviewUser(row.userId)}
      emptyTitle="No KYC cases matched the current search."
      pagination={tableState}
      rowClassName={(row) => {
        const isFlagged = ['REJECTED', 'FAILED', 'FLAGGED'].includes(row.status);
        const isPending = ['PENDING', 'NONE'].includes(row.status);
        if (isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
        if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
        return 'hover:bg-positive/5 hover:border-l-positive';
      }}
    />
  );
}
