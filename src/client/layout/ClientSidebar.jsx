import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, User, Lock, Bell, History, Key, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clientNavigation, clientNavigationSections } from '@/shared/config/sidebar/client-sidebar.config';
import { useAuth } from '@/shared/features/auth/AuthContext';

/* ─────────────────────────────────────────────
   CLIENT SIDEBAR ITEM
───────────────────────────────────────────── */
function ClientSidebarItem({ item, collapsed, activeId, expandedId, navigate, onToggleExpand, onHoverStart, onHoverEnd, hoverNode }) {
  const Icon        = item.icon;
  const ref         = useRef(null);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded  = expandedId === item.id;
  const isActive    = activeId === item.id || (hasSubItems && item.subItems.some((s) => activeId === s.id));
  const isHoveredPortal = collapsed && hoverNode?.item.id === item.id;

  const handleMouseEnter = () => {
    if (collapsed && ref.current) onHoverStart(item, ref.current.getBoundingClientRect());
  };

  const handleClick = () => {
    if (hasSubItems && !collapsed) onToggleExpand(item.id);
    navigate(hasSubItems ? item.subItems[0].path : item.path);
  };

  return (
    <div className="flex flex-col w-full" onMouseEnter={handleMouseEnter} onMouseLeave={onHoverEnd}>
      <button
        ref={ref}
        data-active={isActive && !hasSubItems}
        onClick={handleClick}
        className={`
          group/btn relative flex items-center outline-none cursor-pointer select-none
          transition-all duration-200
          ${collapsed
            ? 'justify-center rounded-[10px] mx-auto w-10 h-10'
            : 'px-3 py-2.5 gap-3 rounded-[8px] w-full'
          }
          ${isActive
            ? collapsed
              ? 'bg-primary/[0.14] text-primary'
              : 'bg-primary/[0.08] text-primary'
            : `text-text-muted/50 hover:bg-text/[0.04] hover:text-text/75
               ${isHoveredPortal ? 'bg-text/[0.04] text-text/75' : ''}`
          }
        `}
      >
        {isActive && !collapsed && (
          <span className="absolute left-0 top-[20%] bottom-[20%] w-[2.5px] bg-primary rounded-r-full" />
        )}

        <span
          className={`
            relative shrink-0 flex items-center justify-center transition-all duration-200
            ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}
            ${isActive ? 'text-primary' : 'text-text-muted/40 group-hover/btn:text-text/70 group-hover/btn:scale-110'}
          `}
        >
          <Icon size={16} strokeWidth={isActive ? 2.1 : 1.75} />
        </span>

        {!collapsed && (
          <span className="flex-1 flex items-center justify-between min-w-0">
            <span
              className={`
                text-[14.5px] font-heading font-medium tracking-[-0.02em] truncate
                transition-colors duration-200
                ${isActive ? 'text-text font-semibold' : 'text-text-muted/55 group-hover/btn:text-text/80'}
              `}
            >
              {item.label}
            </span>
            {hasSubItems && (
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                className={`
                  ml-2 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isExpanded ? 'rotate-180 text-primary' : 'text-text-muted/20'}
                `}
              />
            )}
          </span>
        )}

        {isActive && collapsed && (
          <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </button>

      {hasSubItems && !collapsed && (
        <div
          className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr', opacity: isExpanded ? 1 : 0 }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="relative ml-[30px] pt-1 pb-1.5 flex flex-col gap-px">
              <span className="absolute left-0 top-1.5 bottom-1.5 w-px bg-border/[0.12]" />
              {item.subItems.map((sub) => {
                const isSub = activeId === sub.id;
                return (
                  <button
                    key={sub.id}
                    data-active={isSub}
                    onClick={() => navigate(sub.path)}
                    className={`
                      group/sub relative flex items-center gap-2.5 pl-4 pr-3 py-2 rounded-[7px]
                      text-[13.5px] font-heading font-medium tracking-[-0.01em]
                      outline-none cursor-pointer transition-all duration-150
                      ${isSub
                        ? 'bg-primary/[0.08] text-primary'
                        : 'text-text-muted/45 hover:bg-text/[0.04] hover:text-text/70'
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-[10px] h-px
                        transition-colors duration-150
                        ${isSub ? 'bg-primary/60' : 'bg-border/20 group-hover/sub:bg-border/35'}
                      `}
                    />
                    {isSub && <span className="w-1 h-1 rounded-full bg-primary shrink-0 -ml-0.5" />}
                    <span className={isSub ? '-ml-0.5' : ''}>{sub.label}</span>
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

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function NavSection({ label, collapsed }) {
  if (collapsed) return <div className="w-5 h-px mx-auto my-3" style={{ background: 'var(--border)' }} />;
  return (
    <div className="flex items-center gap-3 px-3 pt-7 pb-2.5">
      <span className="text-[10.5px] font-black tracking-[0.22em] uppercase text-text-muted/25 select-none whitespace-nowrap">
        {label}
      </span>
      <span className="flex-1 h-px bg-border/20" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLIENT SIDEBAR
───────────────────────────────────────────── */
export function ClientSidebar({ collapsed, isMobile }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  
  const [profileMenuExpanded, setProfileMenuExpanded] = useState(false);

  const profileSubTabs = useMemo(() => [
    { id: 'overview', label: 'Overview', path: '/client/account/overview', icon: ShieldCheck },
    { id: 'profile', label: 'Profile Details', path: '/client/account/profile', icon: User },
    { id: 'security', label: 'Security & 2FA', path: '/client/account/security', icon: Lock },
    { id: 'notifications', label: 'Notifications', path: '/client/account/notifications', icon: Bell },
    { id: 'activity', label: 'Activity Log', path: '/client/account/activity', icon: History },
    { id: 'api-keys', label: 'API Keys', path: '/client/account/api-keys', icon: Key },
  ], []);

  const profileItem = useMemo(() => ({
    id: 'account',
    label: 'My Account',
    icon: User,
    subItems: profileSubTabs.map(sub => ({
      id: sub.id,
      label: sub.label,
      path: sub.path
    }))
  }), [profileSubTabs]);

  const [hoverNode,        setHoverNode]        = useState(null);
  const [manualExpandedId, setManualExpandedId] = useState(null);
  const [manualExpandedPath, setManualExpandedPath] = useState(null);
  const hoverTimer = useRef(null);
  const navRef     = useRef(null);

  /* ── Active ID ── */
  const getActiveId = () => {
    const { pathname } = location;
    if (pathname === '/client' || pathname === '/client/') return 'client-dashboard';
    for (const item of clientNavigation) {
      // Check sub-items first — sub-item exact match wins over parent
      if (item.subItems) {
        const sub = item.subItems.find((s) => s.path === pathname);
        if (sub) return sub.id;
      }
      if (item.path === pathname && (!item.subItems || item.subItems.length === 0)) return item.id;
      if (item.subItems?.some((s) => pathname.startsWith(s.path))) return item.id;
    }
    return null;
  };
  const activeId = getActiveId();

  /* ── Expanded section ── */
  const routeExpandedId = useMemo(() => {
    return clientNavigation.find(
      (item) =>
        item.path === location.pathname ||
        item.subItems?.some((s) => s.path === location.pathname),
    )?.id ?? null;
  }, [location.pathname]);

  const expandedId = manualExpandedPath === location.pathname ? manualExpandedId : routeExpandedId;

  const toggleExpand = (id) => {
    setManualExpandedPath(location.pathname);
    setManualExpandedId(expandedId === id ? null : id);
  };

  /* ── Hover portal ── */
  const handleHoverStart = (item, rect) => {
    if (isMobile) return;
    clearTimeout(hoverTimer.current);
    setHoverNode({ item, rect });
  };
  const handleHoverEnd = () => {
    if (isMobile) return;
    hoverTimer.current = window.setTimeout(() => setHoverNode(null), 220);
  };

  /* ── Grouped nav ── */
  const groupedItems = useMemo(
    () => clientNavigationSections.map((section) => ({
      ...section,
      items: clientNavigation.filter((item) => item.navSection === section.id),
    })),
    [],
  );

  const sidebarWidth = isMobile ? '272px' : collapsed ? '68px' : '248px';
  const sidebarLeft  = isMobile && collapsed ? '-272px' : '0';

  return (
    <aside
      className="fixed top-0 h-screen z-[100] flex flex-col overflow-hidden"
      style={{
        width:           sidebarWidth,
        left:            sidebarLeft,
        transition:      'all 0.38s cubic-bezier(0.16,1,0.3,1)',
        backgroundColor: 'var(--surface-2)',
        borderRight:     '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className={`relative flex items-center shrink-0 h-16 transition-all duration-400 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => navigate('/client')}
          className="relative shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center bg-primary cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 0 14px color-mix(in srgb, var(--primary) 30%, transparent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="1"  y="1"  width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.55)" />
            <rect x="11" y="1"  width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="1"  y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.15)" />
          </svg>
        </button>

        {!collapsed && (
          <div className="flex flex-col gap-0.5 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-250">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading font-bold text-[16px] tracking-[-0.05em] text-text">
                LiveTrade<span className="text-primary">.</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.22em] uppercase text-primary/65 px-1.5 py-0.5 rounded-[3px] bg-primary/[0.08] border border-primary/[0.15] leading-none">
                PRO
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-text-muted/30 leading-none mt-px select-none">
              Client Portal
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav ref={navRef} className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className={`flex flex-col pt-2 pb-8 ${collapsed ? 'items-center gap-1 px-[14px]' : 'gap-px px-2.5'}`}>
          {groupedItems.map((section) =>
            section.items.length > 0 ? (
              <React.Fragment key={section.id}>
                <NavSection label={section.label} collapsed={collapsed} />
                {section.items.map((item) => (
                  <ClientSidebarItem
                    key={item.id}
                    item={item}
                    collapsed={collapsed}
                    activeId={activeId}
                    expandedId={expandedId}
                    navigate={navigate}
                    onToggleExpand={toggleExpand}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    hoverNode={hoverNode}
                  />
                ))}
              </React.Fragment>
            ) : null,
          )}
        </div>
      </nav>

      {/* Collapsed hover portal */}
      {collapsed && hoverNode &&
        createPortal(
          <div
            className="fixed z-[99999]"
            style={{
              top:    hoverNode.rect.top > window.innerHeight - 200 ? 'auto' : hoverNode.rect.top,
              bottom: hoverNode.rect.top > window.innerHeight - 200 ? window.innerHeight - hoverNode.rect.bottom : 'auto',
              left:   76,
            }}
            onMouseEnter={() => clearTimeout(hoverTimer.current)}
            onMouseLeave={handleHoverEnd}
          >
            <div
              className="flex flex-col rounded-[10px] overflow-hidden min-w-[200px]"
              style={{
                backgroundColor: 'var(--surface-2)',
                border:     '1px solid var(--border)',
                boxShadow:  '0 16px 40px rgba(0,0,0,0.55)',
                animation:  'sideTooltip 0.17s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div
                className="flex items-center gap-2.5 px-3.5 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {hoverNode.item.icon && (
                  <span
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center text-primary shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}
                  >
                    <hoverNode.item.icon size={13} strokeWidth={2} />
                  </span>
                )}
                <span className="text-[14px] font-heading font-semibold tracking-[-0.025em] text-text leading-none">
                  {hoverNode.item.label}
                </span>
              </div>
              <div className="p-1.5">
                {hoverNode.item.subItems?.length > 0 ? (
                  hoverNode.item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => { navigate(sub.path); setHoverNode(null); }}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2 rounded-[7px]
                        text-[13.5px] font-heading font-medium tracking-[-0.01em]
                        transition-all duration-130 cursor-pointer outline-none text-left
                        ${activeId === sub.id
                          ? 'bg-primary/[0.10] text-primary'
                          : 'text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80'
                        }
                      `}
                    >
                      {activeId === sub.id
                        ? <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        : <span className="w-1.5 h-1.5 rounded-full bg-border/30 shrink-0" />
                      }
                      {sub.label}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => { navigate(hoverNode.item.path); setHoverNode(null); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[7px] text-[13px] font-heading font-medium text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80 transition-all duration-130 cursor-pointer outline-none text-left"
                  >
                    Go to {hoverNode.item.label}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      }
      {/* Sticky Bottom My Account Profile Card */}
      <div
        className="shrink-0 p-3 border-t bg-surface-elevated flex flex-col gap-1.5"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        {/* Accordion Submenu (Slides Upward) */}
        {!collapsed && (
          <div
            className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              gridTemplateRows: profileMenuExpanded ? '1fr' : '0fr',
              opacity: profileMenuExpanded ? 1 : 0,
            }}
          >
            <div className="overflow-hidden min-h-0">
              <div className="flex flex-col gap-0.5 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {profileSubTabs.map((sub) => {
                  const isSubActive = location.pathname === sub.path || (location.pathname === '/client/settings' && sub.id === 'profile');
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => navigate(sub.path)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px]
                        text-[13px] font-heading font-medium tracking-[-0.01em]
                        outline-none cursor-pointer transition-all duration-150 text-left
                        ${isSubActive
                          ? 'bg-primary/[0.08] text-primary font-bold'
                          : 'text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80'
                        }
                      `}
                    >
                      <SubIcon size={12} className={isSubActive ? 'text-primary' : 'text-text-muted/30'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (collapsed) {
              navigate('/client/account/overview');
            } else {
              setProfileMenuExpanded(!profileMenuExpanded);
            }
          }}
          onMouseEnter={(e) => {
            if (collapsed) {
              const rect = e.currentTarget.getBoundingClientRect();
              handleHoverStart(profileItem, rect);
            }
          }}
          onMouseLeave={handleHoverEnd}
          className={`
            flex items-center gap-3 w-full rounded-[8px] transition-all duration-200 cursor-pointer outline-none text-left
            ${collapsed ? 'justify-center p-1.5' : 'p-2 hover:bg-text/[0.04]'}
            ${location.pathname.startsWith('/client/account') || location.pathname === '/client/settings' || (collapsed && hoverNode?.item.id === 'account') ? 'bg-primary/[0.08] text-primary font-bold' : 'text-text-muted/65'}
          `}
        >
          {/* Initials Avatar */}
          <div
            className={`
              w-7.5 h-7.5 rounded-[7px] flex items-center justify-center font-heading font-black text-[10px] tracking-tight shrink-0 transition-all
              ${location.pathname.startsWith('/client/account') 
                ? 'bg-primary text-bg' 
                : 'bg-primary/[0.12] text-primary border border-primary/20'
              }
            `}
          >
            {user?.initials ?? 'U'}
          </div>
          
          {/* Expanded text info & Chevron toggle */}
          {!collapsed && (
            <>
              <div className="flex-1 flex flex-col items-start gap-0.5 text-left min-w-0 animate-in fade-in slide-in-from-left-1 duration-200">
                <span className="text-[12.5px] font-heading font-bold text-text truncate w-full leading-tight">
                  {user?.name ?? 'User'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-text-muted/45 leading-none">
                  Client Account
                </span>
              </div>
              
              <div className="w-6.5 h-6.5 flex items-center justify-center text-text-muted/40 shrink-0 transition-transform">
                <ChevronUp size={13} className={`transition-transform duration-350 ${profileMenuExpanded ? 'rotate-180 text-primary' : 'rotate-0'}`} />
              </div>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
