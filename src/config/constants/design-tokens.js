/**
 * Design Tokens
 * 
 * Maps frontend semantic variables to actual CSS variables defined in the global stylesheet.
 * Since this is currently a frontend design section, these tokens help ensure consistent
 * theming (colors, backgrounds, text) across all components before real data integration.
 * 
 * @example
 * <div style={{ background: designTokens.bg, color: designTokens.text }} />
 */
export const designTokens = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surfaceElevated: 'var(--surface-2)',
  mutedSurface: 'var(--muted-surface)',
  surfaceBright: 'var(--surface-bright)',
  border: 'var(--border)',
  glass: 'var(--glass)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  brand: 'var(--brand)',
  brandStrong: 'var(--brand-strong)',
  primary: 'var(--brand)',
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  warning: 'var(--warning)',
  accent: 'var(--accent)',
};
