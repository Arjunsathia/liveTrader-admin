import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminUi } from '../app/providers/AdminUiProvider';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../components/overlays/CommandPalette';
import { useEffect, useState } from 'react';
export function MainLayout() {
  const { collapsed, isMobile, setCollapsed, theme, toggleTheme } = useAdminUi();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className={`min-h-screen bg-bg text-text transition-colors duration-500 overflow-x-clip ${theme}`}>
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sidebar collapsed={collapsed} isMobile={isMobile} />

      <div
        className="flex flex-col min-h-screen relative"
        style={{
          paddingLeft: isMobile ? '0' : (collapsed ? '72px' : '248px'),
          transition: 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Topbar
          theme={theme}
          toggleTheme={toggleTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenCommand={() => setCmdOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-[1720px] w-full mx-auto animate-fade-in relative z-10">
          <Outlet />
        </main>

        {/* <footer className="h-10 border-t border-white/5 px-8 flex items-center justify-between text-[10px] text-text-muted/45 font-semibold uppercase tracking-[0.14em] bg-bg/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <span>© 2026 LIVE-TRADER. PRO</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span>VERSION 4.2.1-BETA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-positive">LOCAL CLOUD SERVER: ACTIVE</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span>LATENCY: 12ms</span>
          </div>
        </footer> */}
      </div>



      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
