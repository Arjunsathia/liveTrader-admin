import React from 'react';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';

export function KycTable({ tableState, onReviewUser }) {
  const columns = [
    { key: 'id', label: 'Case ID', render: (item) => <span className="font-mono text-[11px] text-text-muted/75">{item.id}</span> },
    {
      key: 'user',
      label: 'User',
      render: (item) => (
        <div>
          <div className="text-[12px] font-medium text-text">{item.user}</div>
          <div className="text-[11px] text-text-muted/60">{item.country}</div>
        </div>
      ),
    },
    { key: 'tier', label: 'Tier', render: (item) => <span className="text-[12px] text-text">{item.tier}</span> },
    { key: 'docs', label: 'Docs', render: (item) => <span className="text-[12px] text-text-muted">{item.docs}</span> },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'risk', label: 'Risk', render: (item) => <StatusBadge status={item.risk} dot={false} /> },
    { key: 'eta', label: 'ETA', render: (item) => <span className="font-mono text-[11px] text-text-muted/75">{item.eta}</span> },
    {
      key: 'action',
      label: '',
      render: (item) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => onReviewUser(item.userId)}
            className="rounded-[8px] border border-border/25 px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
          >
            Review
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={tableState.items} rowKey="id" emptyTitle="No KYC cases matched the current search" />
      <Pagination
        page={tableState.page}
        totalPages={tableState.totalPages}
        onPageChange={tableState.setPage}
        pageSize={tableState.pageSize}
        onPageSizeChange={tableState.setPageSize}
      />
    </>
  );
}
