import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Sync theme with document Class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen bg-bg text-text transition-colors duration-500 overflow-x-hidden ${theme}`}>
      {/* Navigation Shell */}
      <Sidebar collapsed={collapsed} />
      
      {/* Main Framework */}
        <div 
        className="flex flex-col min-h-screen"
        style={{
          paddingLeft: collapsed ? '72px' : '248px',
          transition: 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Global Toolbar */}
        <Topbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
        />
        
        {/* Page Content Viewport */}
        <main className="flex-1 p-8 max-w-[1720px] w-full mx-auto animate-fade-in relative z-10">
          <Outlet />
        </main>
        
        {/* Footer Info Bar */}
        <footer className="h-10 border-t border-white/5 px-8 flex items-center justify-between text-[10px] text-text-muted/45 font-semibold uppercase tracking-[0.14em] bg-bg/40 backdrop-blur-sm shrink-0">
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
        </footer>
      </div>

      {/* Global Background Glow Effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
    </div>
  );
}
