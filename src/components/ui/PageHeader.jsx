import React from 'react';

/**
 * PageHeader — Page-level heading block used across feature pages.
 *
 * Props:
 *   eyebrow    — small uppercase label above the title
 *   title      — main page heading
 *   description — subtitle/description text
 *   actions    — JSX for right-side action buttons
 */
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/45 leading-none">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="text-[22px] font-heading font-bold tracking-[-0.035em] text-text leading-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-[13px] text-text-muted/65 leading-relaxed max-w-[600px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
