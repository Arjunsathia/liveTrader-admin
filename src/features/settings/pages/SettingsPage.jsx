import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { 
  Settings, 
  Shield, 
  Globe, 
  CreditCard, 
  Code, 
  Server, 
  Bell, 
  Key, 
  AlertCircle 
} from 'lucide-react';

export function SettingsPage() {
  const groups = [
    { id: 'general', title: 'System Core', icon: Settings, items: ['Maintenance Mode', 'Registration Status', 'Platform Currency'] },
    { id: 'payments', title: 'Payment Gateways', icon: CreditCard, items: ['Binance Pay API', 'Stripe Connect', 'Crypto Pay (Manual)'] },
    { id: 'security', title: 'Security & 2FA', icon: Shield, items: ['Mandatory MFA', 'Admin Lockout Policy', 'Brute-force Threshold'] },
    { id: 'api', title: 'API Integration', icon: Code, items: ['Public API Keys', 'Webhooks Config', 'External LP Sync'] },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} title={group.title} subtitle={`Configure ${group.title.toLowerCase()}`} icon={group.icon} actions={
            <Button size="sm" variant="ghost">Edit Group</Button>
          }>
            <div className="space-y-4">
              {group.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-[8px] bg-white/2 border border-white/5 group-hover:bg-white/5 transition-all">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-text tracking-tight">{item}</span>
                    <span className="text-[10px] text-text-muted mt-0.5 uppercase font-semibold tracking-[0.14em] opacity-60 italic">Global System Variable</span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-negative/5 border border-negative/20 p-6 rounded-[8px] flex flex-col gap-4">
        <div className="flex items-center gap-4 text-negative">
            <Server size={24} />
            <div>
                <h4 className="font-heading font-semibold text-xl tracking-[-0.04em]">System Power Control</h4>
                <p className="text-[12px] opacity-80">Highly destructive actions. Only use during scheduled maintenance.</p>
            </div>
        </div>
        <div className="flex gap-3">
            <Button variant="danger" icon={AlertCircle}>Shutdown Platform</Button>
            <Button variant="secondary">Download System Backup</Button>
        </div>
      </div>
    </div>
  );
}
