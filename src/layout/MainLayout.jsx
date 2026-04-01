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
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
