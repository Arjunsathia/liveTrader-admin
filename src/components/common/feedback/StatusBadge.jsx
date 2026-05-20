/**
 * StatusBadge — backward-compatible alias for StatusChip.
 * Existing code using <StatusBadge status={x} /> continues to work.
 */
import React from 'react';
import { StatusChip } from '../../ui/StatusChip';

export function StatusBadge({ status, dot = true, className = '', size }) {
  return <StatusChip value={status} dot={dot} className={className} size={size} />;
}
