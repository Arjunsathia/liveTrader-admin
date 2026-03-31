import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../../../services/usersService';
import { UsersKycTable } from '../components/UsersTables';
import { UsersToolbar } from '../components/UsersToolbar';

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function KycQueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');

  const filteredKyc = useMemo(
    () => {
      let rows = filterBySearch(usersService.listKyc(), search, ['id', 'user', 'tier', 'country', 'status']);
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
      <UsersToolbar
        view="kyc"
        search={search}
        onSearchChange={setSearch}
        onChangeView={(nextView) => navigate(`/users/${nextView === 'list' ? '' : nextView}`)}
        onExport={() => exportRows(filteredKyc, `kyc-queue.csv`)}
        kycFilter={kycFilter}
        onChangeKycFilter={setKycFilter}
      />

      <Card title="Compliance Queue" subtitle="Cases prioritized by risk and SLA with in-place review drawers." padding={false}>
        <UsersKycTable
          tableState={kycTable}
          onReviewUser={(nextUserId) => navigate(`/users/${nextUserId}/kyc`)}
        />
      </Card>
    </PageShell>
  );
}
