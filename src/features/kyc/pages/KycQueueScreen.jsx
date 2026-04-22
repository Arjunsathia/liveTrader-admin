import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/common/PageShell';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { KycTable } from '../components/KycTable';
import { KycToolbar } from '../components/KycToolbar';
import { kycService } from '../services/kyc.service';

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function KycQueueScreen() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');

  const filteredKyc = useMemo(
    () => {
      let rows = filterBySearch(kycService.list(), search, ['id', 'user', 'tier', 'country', 'status']);
      if (kycFilter !== 'all') {
        rows = rows.filter((r) => r.status === kycFilter);
      }
      return rows;
    },
    [search, kycFilter]
  );

  const kycTable = useTableState(filteredKyc, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <KycToolbar
        search={search}
        onSearchChange={setSearch}
        onExport={() => exportRows(filteredKyc, `kyc-queue.csv`)}
        kycFilter={kycFilter}
        onChangeKycFilter={setKycFilter}
      />

      <Card title="Compliance Queue" subtitle="Cases prioritized by risk and SLA with in-place review drawers." padding={false}>
        <KycTable
          tableState={kycTable}
          onReviewUser={(nextUserId) => navigate(`/users/${nextUserId}/kyc`)}
        />
      </Card>
    </PageShell>
  );
}
