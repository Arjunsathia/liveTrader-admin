import React, { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  LineChart, 
  Copy, 
  Share2, 
  FileText, 
  LifeBuoy, 
  ShieldCheck,
  ChevronDown,
  LogOut
} from 'lucide-react';

const MENU_ITEMS = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <LayoutDashboard size={18} strokeWidth={2.5} />, 
    path: '/',
    subItems: [
      { id: 'db-overview', label: 'Overview', path: '/' },
      { id: 'db-analytics', label: 'Analytics Snapshot', path: '/dashboard/analytics' },
      { id: 'db-alerts', label: 'Alerts Panel', path: '/dashboard/alerts' },
      { id: 'db-activity', label: 'Recent Activity', path: '/dashboard/activity' },
    ]
  },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: <Users size={18} strokeWidth={2.5} />, 
    path: '/users',
    subItems: [
      { id: 'u-list', label: 'User List', path: '/users/list' },
      { id: 'u-kyc', label: 'KYC Requests', path: '/users/kyc' },
      { id: 'u-activity', label: 'User Activity', path: '/users/activity' },
      { id: 'u-wallet', label: 'Wallet Summary', path: '/users/wallet' },
      { id: 'u-risk', label: 'Risk View', path: '/users/risk' },
    ]
  },
  { 
    id: 'finance', 
    label: 'Finance / Treasury', 
    icon: <Wallet size={18} strokeWidth={2.5} />, 
    path: '/finance',
    subItems: [
      { id: 'f-deposits', label: 'Deposits', path: '/finance/deposits' },
      { id: 'f-withdrawals', label: 'Withdrawals', path: '/finance/withdrawals' },
      { id: 'f-transactions', label: 'Transactions', path: '/finance/transactions' },
      { id: 'f-approvals', label: 'Manual Approvals', path: '/finance/approvals' },
    ]
  },
  { 
    id: 'trading', 
    label: 'Trading Operations', 
    icon: <LineChart size={18} strokeWidth={2.5} />, 
    path: '/trading',
    subItems: [
      { id: 't-accounts', label: 'Trading Accounts', path: '/trading/accounts' },
      { id: 't-orders', label: 'Open Orders', path: '/trading/orders' },
      { id: 't-positions', label: 'Open Positions', path: '/trading/positions' },
      { id: 't-history', label: 'Trade History', path: '/trading/history' },
    ]
  },
  { 
    id: 'copy', 
    label: 'Copy Trading', 
    icon: <Copy size={18} strokeWidth={2.5} />, 
    path: '/copy-trading',
    subItems: [
      { id: 'c-strategies', label: 'Strategies', path: '/copy-trading/strategies' },
      { id: 'c-providers', label: 'Providers', path: '/copy-trading/providers' },
      { id: 'c-followers', label: 'Followers', path: '/copy-trading/followers' },
      { id: 'c-performance', label: 'Performance', path: '/copy-trading/performance' },
    ]
  },
  { 
    id: 'ib', 
    label: 'IB System', 
    icon: <Share2 size={18} strokeWidth={2.5} />, 
    path: '/ib-system',
    subItems: [
      { id: 'ib-referrals', label: 'Referrals', path: '/ib-system/referrals' },
      { id: 'ib-commissions', label: 'Commissions', path: '/ib-system/commissions' },
      { id: 'ib-payouts', label: 'Payouts', path: '/ib-system/payouts' },
    ]
  },
  { 
    id: 'reports', 
    label: 'Reports Center', 
    icon: <FileText size={18} strokeWidth={2.5} />, 
    path: '/reports',
    subItems: [
      { id: 'r-finance', label: 'Finance Reports', path: '/reports/finance' },
      { id: 'r-trading', label: 'Trading Reports', path: '/reports/trading' },
      { id: 'r-users', label: 'User Reports', path: '/reports/users' },
      { id: 'r-export', label: 'Export Center', path: '/reports/export' },
    ]
  },
  { 
    id: 'support', 
    label: 'Support Desk', 
    icon: <LifeBuoy size={18} strokeWidth={2.5} />, 
    path: '/support',
    subItems: [
      { id: 's-tickets', label: 'Ticket List', path: '/support/tickets' },
      { id: 's-open', label: 'Active Queue', path: '/support/open' },
      { id: 's-closed', label: 'Resolved Tickets', path: '/support/closed' },
    ]
  },
  { 
    id: 'admin', 
    label: 'Admin Management', 
    icon: <ShieldCheck size={18} strokeWidth={2.5} />, 
    path: '/admin-mgmt',
    subItems: [
      { id: 'a-users', label: 'Admin Users', path: '/admin-mgmt/users' },
      { id: 'a-roles', label: 'Roles / Permissions', path: '/admin-mgmt/roles' },
      { id: 'a-logs', label: 'Activity Logs', path: '/admin-mgmt/logs' },
    ]
  },
];

const SidebarItem = ({ 
  item, 
  collapsed, 
  activeId, 
  expandedId, 
  navigate,
  onHoverStart,
  onHoverEnd,
  hoverNode
}) => {
  const ref = useRef(null);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedId === item.id;
  const isActive = activeId === item.id || (hasSubItems && item.subItems.some(sub => activeId === sub.id));
  const isHoveredInPortal = collapsed && hoverNode?.item.id === item.id;

  const handleMainClick = () => {
    navigate(hasSubItems ? item.subItems[0].path : item.path);
  };

  const handleMouseEnter = () => {
    if (collapsed && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        onHoverStart(item, rect);
    }
  };

  return (
    <div className="flex flex-col w-full group/item px-3.5" onMouseEnter={handleMouseEnter} onMouseLeave={onHoverEnd}>
      <button
        ref={ref}
        onClick={handleMainClick}
        className={`relative flex items-center cursor-pointer outline-none whitespace-nowrap overflow-hidden transition-all duration-300 w-full px-4 py-3.5 rounded-[8px] border
          ${collapsed ? 'justify-center gap-0' : 'justify-start gap-4'}
          ${isActive 
            ? 'bg-primary/20 dark:bg-primary/10 text-text border-primary/20 dark:border-white/5' 
            : `text-text-muted/60 border-transparent hover:bg-primary/10 dark:hover:bg-white/5 hover:text-primary dark:hover:text-text ${isHoveredInPortal ? 'bg-primary/10 dark:bg-white/5 text-primary dark:text-text' : ''}`}`}
      >
        {isActive && !collapsed && (
          <div className="absolute left-[3px] top-[15%] bottom-[15%] w-[4px] bg-primary rounded-full animate-in fade-in slide-in-from-left-full duration-400" />
        )}

        <div className={`shrink-0 flex items-center justify-center transition-all duration-400 w-5 h-5 ${isActive ? 'text-primary scale-105' : 'group-hover:text-primary transition-transform group-hover:scale-110'}`}>
          {item.icon}
        </div>

        {!collapsed && (
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            <span className={`text-[13px] font-heading font-medium tracking-[-0.02em] transition-all duration-300 ${isActive ? 'text-text' : 'text-text-muted/65 group-hover:text-primary dark:group-hover:text-text/90'}`}>
              {item.label}
            </span>
            {hasSubItems && (
              <ChevronDown 
                size={14} 
                strokeWidth={3} 
                className={`ml-auto transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'rotate-180 text-primary' : 'rotate-0 text-text-muted/30'}`} 
              />
            )}
          </div>
        )}
      </button>

      {hasSubItems && !collapsed && (
        <div
          className="grid transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
          style={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            opacity: isExpanded ? 1 : 0,
            marginTop: isExpanded ? '4px' : '0'
          }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 ml-6 pl-4 border-l border-border/20 relative mb-2">
              {item.subItems.map(sub => {
                const isSubItemSelected = activeId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.path)}
                    className={`relative w-full text-left py-2 px-3 rounded-lg text-[12px] font-heading font-medium tracking-[-0.01em] transition-all duration-300 border cursor-pointer outline-none flex items-center group/sub hover:translate-x-1
                      ${isSubItemSelected
                        ? 'bg-primary/20 dark:bg-primary/20 text-primary border-primary/10'
                        : 'text-text-muted/60 border-transparent hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-text'}`}
                  >
                    <div className={`absolute -left-[18.5px] top-1/2 -translate-y-1/2 transition-all duration-400 
                      ${isSubItemSelected ? 'w-1 h-3 bg-primary rounded-full' : 'w-1 h-1 bg-border/40 rounded-full group-hover/sub:bg-primary/30'}`}
                    />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverNode, setHoverNode] = useState(null);
  const hoverTimer = useRef(null);

  const handleHoverStart = useCallback((item, rect) => {
    clearTimeout(hoverTimer.current);
    setHoverNode({ item, rect });
  }, []);

  const handleHoverEnd = useCallback(() => {
    hoverTimer.current = setTimeout(() => {
        setHoverNode(null);
    }, 150);
  }, []);

  const getActiveId = () => {
    const path = location.pathname;
    if (path === '/') return 'db-overview'; 
    
    for (const item of MENU_ITEMS) {
      if (item.path === path && (!item.subItems || item.subItems.length === 0)) return item.id;
      if (item.subItems) {
        const sub = item.subItems.find(s => s.path === path);
        if (sub) return sub.id;
      }
    }
    return null;
  };

  const activeId = getActiveId();
  const expandedId = MENU_ITEMS.find(
    (item) => item.path === location.pathname || item.subItems?.some((sub) => sub.path === location.pathname)
  )?.id;

  return (
    <aside 
      className="fixed left-0 top-0 h-screen z-[100] flex flex-col border-r border-border/10 overflow-hidden"
      style={{
        width: collapsed ? '72px' : '248px',
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        backgroundColor: 'var(--surface-2)',
      }}
    >
      <style>{`.sidebar-scroll::-webkit-scrollbar { display: none; } .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <div className={`flex items-center shrink-0 transition-all duration-400 w-full ${collapsed ? 'justify-center h-[90px]' : 'px-6 h-[90px]'}`}>
        <div className="relative w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 bg-primary cursor-pointer" onClick={() => navigate('/')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--bg)" className="relative z-10">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div className="absolute inset-0 rounded-[8px] border border-white/20 z-0"></div>
        </div>
        {!collapsed && (
          <div className="ml-3.5 flex flex-col justify-center animate-fade-in whitespace-nowrap overflow-hidden">
            <span className="font-heading font-semibold text-[18px] tracking-[-0.05em] leading-none text-text">
              LiveTrade<span className="text-primary">.</span> <span className="text-primary text-[9px] font-semibold uppercase tracking-[0.24em] mt-1.5 opacity-80">PRO</span>
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-12 sidebar-scroll flex flex-col gap-1.5">
        {MENU_ITEMS.map((item) => (
          <SidebarItem 
            key={item.id} 
            item={item} 
            collapsed={collapsed} 
            activeId={activeId}
            expandedId={expandedId}
            navigate={navigate}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            hoverNode={hoverNode}
          />
        ))}
      </nav>

      <div className="pt-4 px-4 pb-6 border-t border-border/10 shrink-0">
        <button 
          className={`flex items-center gap-4 px-4 py-3.5 rounded-[8px] transition-all duration-400 group relative w-full
            ${collapsed ? 'justify-center' : ''}
            text-text-muted/60 hover:bg-negative/10 hover:text-negative`}
        >
          <LogOut size={18} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-heading font-medium tracking-[-0.02em]">System Sign Out</span>}
        </button>
      </div>

      {collapsed && hoverNode && createPortal(
          <div 
            className={`fixed z-[99999] animate-in fade-in zoom-in-95 duration-200 flex flex-col
              bg-surface-elevated border border-border/50 rounded-[8px] py-2 min-w-[200px]
            `}
            style={{ 
              top: hoverNode.rect.top, 
              left: 74 
            }}
            onMouseEnter={() => clearTimeout(hoverTimer.current)}
            onMouseLeave={handleHoverEnd}
          >
            <div className="px-4 pb-2 mb-2 border-b border-border/30 text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">
                {hoverNode.item.label}
            </div>
            {hoverNode.item.subItems ? (
                <div className="flex flex-col px-1.5 gap-0.5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {hoverNode.item.subItems.map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => { navigate(sub.path); setHoverNode(null); }}
                            className={`relative w-full text-left py-2 px-3 rounded-lg text-[11px] font-medium tracking-[0.04em] transition-all duration-300 border-none cursor-pointer outline-none flex items-center hover:bg-primary/10 hover:text-primary ${activeId === sub.id ? 'bg-primary/20 text-primary' : 'text-text-muted/70'}`}
                        >
                            {sub.label}
                        </button>
                    ))}
                </div>
            ) : (
                <button
                    onClick={() => { navigate(hoverNode.item.path); setHoverNode(null); }}
                    className="px-4 py-1 text-[11px] font-bold text-text-muted/70 hover:text-primary w-full text-left"
                >
                    Open {hoverNode.item.label}
                </button>
            )}
          </div>,
          document.body
      )}
    </aside>
  );
}
