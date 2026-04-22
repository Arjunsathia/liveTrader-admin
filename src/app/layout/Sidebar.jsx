import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminNavigation, adminNavigationSections } from '../../config/sidebar/admin-sidebar.config';
import { hasPermission } from '../../config/permissions/permissions';
import { useAdminSession } from '../providers/AdminSessionProvider';

function SidebarItem({
  item,
  collapsed,
  activeId,
  expandedId,
  navigate,
  onHoverStart,
  onHoverEnd,
  hoverNode,
  onToggleExpand,
}) {
  const Icon = item.icon;
  const ref = useRef(null);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedId === item.id;
  const isActive =
    activeId === item.id ||
    (hasSubItems && item.subItems.some((s) => activeId === s.id));
  const isHoveredPortal = collapsed && hoverNode?.item.id === item.id;

  const handleMouseEnter = () => {
    if (collapsed && ref.current) onHoverStart(item, ref.current.getBoundingClientRect());
  };

  const handleClick = () => {
    if (hasSubItems && !collapsed) onToggleExpand(item.id);
    navigate(hasSubItems ? item.subItems[0].path : item.path);
  };

  return (
    <div
      className="flex flex-col w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
    >
      <button
        ref={ref}
        onClick={handleClick}
        className={`
          group/btn relative flex items-center outline-none cursor-pointer select-none
          transition-all duration-200 rounded-[10px] w-full
          ${collapsed ? 'justify-center px-0 py-3 mx-auto w-11 h-11' : 'px-3.5 py-2.5 gap-3'}
          ${isActive
            ? 'bg-primary/[0.12] text-primary'
            : `text-text-muted/55 hover:bg-white/[0.04] hover:text-text/80
               ${isHoveredPortal ? 'bg-white/[0.04] text-text/80' : ''}`
          }
        `}
      >
        {/* Active left accent bar */}
        {isActive && !collapsed && (
          <span className="absolute left-0 top-[18%] bottom-[18%] w-[3px] bg-primary rounded-r-full" />
        )}



        {/* Icon */}
        <span
          className={`shrink-0 flex items-center justify-center w-[18px] h-[18px] transition-all duration-200
            ${isActive
              ? 'text-primary'
              : 'group-hover/btn:text-text/80 group-hover/btn:scale-110'
            }`}
        >
          <Icon size={17} strokeWidth={isActive ? 2 : 1.8} />
        </span>

        {/* Label + chevron */}
        {!collapsed && (
          <span className="flex-1 flex items-center justify-between min-w-0">
            <span
              className={`text-[13px] font-heading font-medium tracking-[-0.025em] truncate transition-colors duration-200
                ${isActive ? 'text-text' : 'text-text-muted/60 group-hover/btn:text-text/80'}`}
            >
              {item.label}
            </span>
            {hasSubItems && (
              <ChevronDown
                size={13}
                strokeWidth={2.5}
                className={`ml-2 shrink-0 transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isExpanded ? 'rotate-180 text-primary' : 'text-text-muted/25'}`}
              />
            )}
          </span>
        )}

        {/* Collapsed active dot */}
        {isActive && collapsed && (
          <span className="absolute right-1.5 top-1.5 w-1 h-1 rounded-full bg-primary" />
        )}
      </button>

      {/* Sub-items */}
      {hasSubItems && !collapsed && (
        <div
          className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="relative ml-[29px] pt-1 pb-2 flex flex-col gap-0.5">
              {/* Connector line */}
              <span className="absolute left-0 top-2 bottom-2 w-px bg-border/[0.15]" />

              {item.subItems.map((sub) => {
                const isSub = activeId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.path)}
                    className={`group/sub relative flex items-center gap-2.5 pl-4 pr-3 py-[7px] rounded-[8px]
                      text-[12px] font-heading font-medium tracking-[-0.01em]
                      outline-none cursor-pointer transition-all duration-200
                      hover:translate-x-0.5
                      ${isSub
                        ? 'bg-primary/[0.1] text-primary'
                        : 'text-text-muted/50 hover:bg-white/[0.04] hover:text-text/75'
                      }`}
                  >
                    {/* Connector tick */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2
                        w-[11px] h-px transition-all duration-200
                        ${isSub ? 'bg-primary' : 'bg-border/25 group-hover/sub:bg-border/40'}`}
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
}

/* ─────────────────────────────────────────────────────────────
   SECTION LABEL (groups nav items visually)
───────────────────────────────────────────────────────────── */
function NavSection({ label, collapsed }) {
  if (collapsed) {
    return <div className="w-6 h-px bg-border/[0.12] mx-auto my-2" />;
  }
  return (
    <div className="px-4 pt-5 pb-1.5">
      <span className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-text-muted/25 font-heading select-none">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
export function Sidebar({ collapsed, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useAdminSession();
  const [hoverNode, setHoverNode] = useState(null);
  const hoverTimer = useRef(null);
  const [manualExpandedId, setManualExpandedId] = useState(null);
  const [manualExpandedPath, setManualExpandedPath] = useState(null);

  const allowedItems = useMemo(
    () =>
      adminNavigation
        .filter((item) => hasPermission(permissions, item.permission))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((s) => hasPermission(permissions, s.permission)),
        })),
    [permissions],
  );

  const getUsersActiveId = () => {
    if (location.state?.usersView === 'kyc') return 'users-kyc';
    if (location.state?.usersView === 'mt5') return 'users-mt5';
    return 'users-list';
  };

  const getFinanceActiveId = (pathname) => {
    if (pathname.includes('/finance/deposits')) return 'finance-deposits';
    if (pathname.includes('/finance/withdrawals')) return 'finance-withdrawals';
    if (pathname.includes('/finance/transactions')) return 'finance-transactions';
    if (pathname.includes('/finance/failed')) return 'finance-failed';
    if (pathname.includes('/finance/approvals')) return 'finance-approvals';
    return 'finance-deposits';
  };

  const getActiveId = () => {
    const { pathname } = location;
    if (pathname === '/') return 'dashboard';
    for (const item of allowedItems) {
      if (item.path === pathname && (!item.subItems || item.subItems.length === 0)) return item.id;
      if (item.subItems) {
        const sub = item.subItems.find((c) => c.path === pathname);
        if (sub) return sub.id;
      }
      if (pathname.startsWith('/users/') && item.id === 'users') return getUsersActiveId();
      if (pathname.startsWith('/finance/') && item.id === 'finance') return getFinanceActiveId(pathname);
      if (pathname.startsWith('/support/tickets/') && item.id === 'support') return 'support-tickets';
      if (pathname.startsWith('/copy-trading/') && item.id === 'copy-trading') {
        const slug = pathname.split('/')[2];
        return slug ? `copy-${slug}` : 'copy-strategies';
      }
    }
    return null;
  };

  const activeId = getActiveId();

  const routeExpandedId = useMemo(
    () => allowedItems.find(
      (item) =>
        item.path === location.pathname ||
        item.subItems?.some((subItem) => subItem.path === location.pathname) ||
        (location.pathname.startsWith('/users/') && item.id === 'users') ||
        (location.pathname.startsWith('/finance/') && item.id === 'finance') ||
        (location.pathname.startsWith('/support/tickets/') && item.id === 'support') ||
        (location.pathname.startsWith('/copy-trading/') && item.id === 'copy-trading'),
    )?.id ?? null,
    [allowedItems, location.pathname],
  );

  const expandedId = manualExpandedPath === location.pathname
    ? manualExpandedId
    : routeExpandedId;

  const toggleExpand = (id) => {
    setManualExpandedPath(location.pathname);
    setManualExpandedId(expandedId === id ? null : id);
  };

  const handleHoverStart = (item, rect) => {
    if (isMobile) return;
    clearTimeout(hoverTimer.current);
    setHoverNode({ item, rect });
  };

  const handleHoverEnd = () => {
    if (isMobile) return;
    hoverTimer.current = window.setTimeout(() => setHoverNode(null), 250);
  };

  const sidebarWidth = isMobile ? '280px' : collapsed ? '72px' : '252px';
  const sidebarLeft = isMobile && collapsed ? '-280px' : '0';

  const groupedItems = useMemo(
    () =>
      adminNavigationSections.map((section) => ({
        ...section,
        items: allowedItems.filter((item) => item.navSection === section.id),
      })),
    [allowedItems],
  );

  return (
    <aside
      className="fixed top-0 h-screen z-[100] flex flex-col overflow-hidden"
      style={{
        width: sidebarWidth,
        left: sidebarLeft,
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        backgroundColor: 'var(--surface-2)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'none',
      }}
    >
      {/* Scrollbar suppression */}
      <style>{`
        .sb-scroll::-webkit-scrollbar { display: none; }
        .sb-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── LOGO ─────────────────────────────────────────── */}
      <div
        className={`flex items-center shrink-0 h-[68px] transition-all duration-400
          ${collapsed ? 'justify-center px-0' : 'px-5 gap-3.5'}`}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Mark */}
        <button
          onClick={() => navigate('/')}
          className="relative shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center bg-primary cursor-pointer group/logo transition-all duration-300 active:scale-95"
        >
          {/* Grid mark */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.55)" />
            <rect x="11" y="1" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="1" y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.15)" />
          </svg>
        </button>

        {/* Wordmark */}
        {!collapsed && (
          <div className="flex flex-col gap-0.5 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-heading font-bold text-[17px] tracking-[-0.05em] text-text">
                LiveTrade<span className="text-primary">.</span>
              </span>
              <span className="text-[8.5px] font-bold tracking-[0.22em] uppercase text-primary/70 px-1 py-0.5 rounded-[4px] bg-primary/[0.1] border border-primary/[0.2] leading-none">
                PRO
              </span>
            </div>
            <span className="text-[9.5px] font-medium text-text-muted/30 tracking-[0.04em]">
              Admin Console
            </span>
          </div>
        )}
      </div>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden sb-scroll relative">
        <div className={`flex flex-col pt-3 pb-8 ${collapsed ? 'items-center gap-1 px-2' : 'gap-0.5 px-3'}`}>

          {groupedItems.map((section) => (
            section.items.length > 0 ? (
              <React.Fragment key={section.id}>
                <NavSection label={section.label} collapsed={collapsed} />
                {section.items.map((item) => (
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
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </React.Fragment>
            ) : null
          ))}
        </div>
      </nav>




      {collapsed && hoverNode &&
        createPortal(
          <div
            className="fixed z-[99999]"
            style={{ top: hoverNode.rect.top, left: 76 }}
            onMouseEnter={() => clearTimeout(hoverTimer.current)}
            onMouseLeave={handleHoverEnd}
          >
            {/* Arrow connector */}
            <div
              className="absolute left-0 top-4 w-2 h-2 rotate-45 -translate-x-1 border-l border-b border-border/30"
              style={{ backgroundColor: 'var(--surface-2)' }}
            />

              <div
              className="flex flex-col rounded-[12px] overflow-hidden min-w-[210px] border border-border/60 shadow-card-subtle"
              style={{
                backgroundColor: 'var(--surface-2)',
                animation: 'sideTooltip 0.18s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {hoverNode.item.icon && (
                  <span className="w-7 h-7 rounded-[8px] bg-primary/[0.12] border border-primary/[0.18] flex items-center justify-center text-primary shrink-0">
                    <hoverNode.item.icon size={14} strokeWidth={2} />
                  </span>
                )}
                <span className="text-[13px] font-heading font-semibold tracking-[-0.02em] text-text">
                  {hoverNode.item.label}
                </span>
              </div>

              {/* Sub-items or direct link */}
              <div className="p-2">
                {hoverNode.item.subItems?.length > 0 ? (
                  hoverNode.item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => { navigate(sub.path); setHoverNode(null); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-[12px] font-heading font-medium tracking-[-0.01em]
                        transition-all duration-150 cursor-pointer outline-none text-left
                        hover:bg-primary/[0.08] hover:text-primary
                        ${activeId === sub.id ? 'bg-primary/[0.12] text-primary' : 'text-text-muted/60'}`}
                    >
                      {activeId === sub.id && (
                        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      )}
                      {sub.label}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => { navigate(hoverNode.item.path); setHoverNode(null); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-[12px] font-heading font-medium text-text-muted/60 hover:bg-primary/[0.08] hover:text-primary transition-all duration-150 cursor-pointer outline-none text-left"
                  >
                    <ChevronRight size={12} strokeWidth={2.5} className="text-primary/40" />
                    Open {hoverNode.item.label}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      }

      {/* Portal animation keyframes */}
      <style>{`
        @keyframes sideTooltip {
          from { opacity: 0; transform: translateX(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
      `}</style>
    </aside>
  );
}
