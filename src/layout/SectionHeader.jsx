import React from 'react';

export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex justify-end -mb-2">
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
