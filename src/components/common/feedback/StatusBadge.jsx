import React from 'react';
import { Badge } from '../../ui/Badge';
import { getStatusVariant } from '@config/constants/status.constants';

export function StatusBadge({ status, dot = true, className = '' }) {
  return (
    <Badge variant={getStatusVariant(status)} dot={dot} className={className}>
      {status}
    </Badge>
  );
}
