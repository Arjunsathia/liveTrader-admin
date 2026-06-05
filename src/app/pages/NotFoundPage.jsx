import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Card title="Page Not Found" subtitle="The admin route you requested does not exist.">
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => navigate('/admin')}>Go to Dashboard</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Card>
    </PageShell>
  );
}

export { NotFoundPage as NotFoundScreen };