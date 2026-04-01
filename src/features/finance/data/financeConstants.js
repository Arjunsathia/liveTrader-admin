/**
 * Finance color maps — shared between FinancePage, FinanceDetailPage,
 * and any Finance sub-components.
 *
 * Each entry: { c: color, bg: background, border?: borderColor }
 */

export const STATUS_COLOR = {
  PENDING:    { c: 'var(--warning)',     bg: 'color-mix(in srgb, var(--warning) 10%, transparent)',     border: 'color-mix(in srgb, var(--warning) 25%, transparent)' },
  CONFIRMED:  { c: 'var(--positive)',    bg: 'color-mix(in srgb, var(--positive) 10%, transparent)',    border: 'color-mix(in srgb, var(--positive) 25%, transparent)' },
  COMPLETED:  { c: 'var(--positive)',    bg: 'color-mix(in srgb, var(--positive) 10%, transparent)',    border: 'color-mix(in srgb, var(--positive) 25%, transparent)' },
  REVIEWING:  { c: 'var(--cyan)',        bg: 'color-mix(in srgb, var(--cyan) 10%, transparent)',        border: 'color-mix(in srgb, var(--cyan) 25%, transparent)' },
  CONFIRMING: { c: 'var(--cyan)',        bg: 'color-mix(in srgb, var(--cyan) 10%, transparent)',        border: 'color-mix(in srgb, var(--cyan) 25%, transparent)' },
  FAILED:     { c: 'var(--negative)',    bg: 'color-mix(in srgb, var(--negative) 10%, transparent)',    border: 'color-mix(in srgb, var(--negative) 25%, transparent)' },
  FLAGGED:    { c: 'var(--negative)',    bg: 'color-mix(in srgb, var(--negative) 10%, transparent)',    border: 'color-mix(in srgb, var(--negative) 25%, transparent)' },
  SCANNING:   { c: 'var(--purple)',      bg: 'color-mix(in srgb, var(--purple) 10%, transparent)',      border: 'color-mix(in srgb, var(--purple) 25%, transparent)' },
  CREATED:    { c: 'var(--text-muted)',  bg: 'transparent',                                             border: 'var(--border)' },
};

export const RISK_COLOR = {
  LOW:        { c: 'var(--positive)',    bg: 'color-mix(in srgb, var(--positive) 10%, transparent)',   border: 'color-mix(in srgb, var(--positive) 25%, transparent)' },
  WATCHLIST:  { c: 'var(--warning)',     bg: 'color-mix(in srgb, var(--warning) 10%, transparent)',    border: 'color-mix(in srgb, var(--warning) 25%, transparent)' },
  ELEVATED:   { c: 'var(--negative)',    bg: 'color-mix(in srgb, var(--negative) 10%, transparent)',   border: 'color-mix(in srgb, var(--negative) 25%, transparent)' },
  'HIGH RISK':{ c: 'var(--negative)',    bg: 'color-mix(in srgb, var(--negative) 10%, transparent)',   border: 'color-mix(in srgb, var(--negative) 25%, transparent)' },
};

export const SCAN_COLOR = {
  PASSED: { c: 'var(--positive)' },
  CLEAR:  { c: 'var(--positive)' },
  REVIEW: { c: 'var(--warning)' },
  FAIL:   { c: 'var(--negative)' },
};
