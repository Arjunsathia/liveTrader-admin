import React from 'react';
import { Download } from 'lucide-react';
import { PageToolbar } from '../../../components/layout/PageToolbar';
import { KYC_OPTIONS } from '../../users/forms/user-form.constants';

export function KYCToolbar({
  search,
  onSearchChange,
  onExport,
  kycFilter,
  onChangeKycFilter,
}) {
  return (
    <PageToolbar
      search={search}
      onSearchChange={onSearchChange}
      placeholder="Search case ID, user, tier, or country"
      filterSets={[
        { label: 'KYC', get: kycFilter, set: onChangeKycFilter, opts: KYC_OPTIONS },
      ]}
      actions={[
        { label: 'Export', icon: Download, variant: 'secondary', onClick: onExport },
      ]}
      showFilters
    />
  );
}
