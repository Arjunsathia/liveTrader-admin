import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { settingsService } from '../../../services/settingsService';

export function SettingsPage() {
  const location = useLocation();
  const slug = location.pathname.split('/')[2] || 'api';
  const workspace = settingsService.getWorkspace(slug);

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.eyebrow}
        title={workspace.title}
        description={workspace.description}
        actions={(
          <>
            <Button variant="secondary" icon={Download}>Export Config</Button>
            <Button variant="primary" icon={Eye}>Edit Group</Button>
          </>
        )}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {workspace.groups.map((group) => (
          <Card key={group.title} title={group.title} subtitle={group.value}>
            <div className="flex items-center justify-between rounded-[10px] border border-border/30 bg-bg/70 p-4">
              <div className="text-[13px] text-text-muted">Current state</div>
              <StatusBadge status={group.status} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary">Edit Setting</Button>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
