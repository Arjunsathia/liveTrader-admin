import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { getStatusVariant } from '../../utils/statusMaps';

export function StatusBadge({ status, dot = true, className = '' }) {
  return (
    <Badge variant={getStatusVariant(status)} dot={dot} className={className}>
      {status}
    </Badge>
  );
}
