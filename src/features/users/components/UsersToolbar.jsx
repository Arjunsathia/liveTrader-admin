import React from 'react';
import { Download, UserPlus } from 'lucide-react';
import { PageToolbar } from '../../../components/toolbar/PageToolbar';
import { FUNDING_OPTIONS, KYC_OPTIONS, RISK_OPTIONS } from '../data/userFormConfig';

export function UsersToolbar({
  view,
  search,
  onSearchChange,
  onChangeView,
  onOpenAdd,
  onExport,
  kycFilter,
  onChangeKycFilter,
  riskFilter,
  onChangeRiskFilter,
  fundingFilter,
  onChangeFundingFilter,
}) {
  const placeholder =
    view === 'kyc'
      ? 'Search case ID, user, tier, or country'
      : view === 'mt5'
        ? 'Search login, user, server, or group'
        : 'Search name, UID, email, phone, or segment';

  /* Only list view has filters & the Add User button */
  const filterSets =
    view === 'list'
      ? [
          { label: 'KYC',     get: kycFilter,     set: onChangeKycFilter,     opts: KYC_OPTIONS },
          { label: 'Risk',    get: riskFilter,     set: onChangeRiskFilter,    opts: RISK_OPTIONS },
          { label: 'Funding', get: fundingFilter,  set: onChangeFundingFilter, opts: FUNDING_OPTIONS },
        ]
      : [];

  const actions = [
    ...(view === 'list'
      ? [{ label: 'Add User', icon: UserPlus, variant: 'primary', onClick: onOpenAdd }]
      : []),
    { label: 'Export', icon: Download, variant: 'secondary', onClick: onExport },
  ];

  return (
    <PageToolbar
      search={search}
      onSearchChange={onSearchChange}
      placeholder={placeholder}
      filterSets={filterSets}
      actions={actions}
      showFilters={view === 'list'}
    />
  );
}
