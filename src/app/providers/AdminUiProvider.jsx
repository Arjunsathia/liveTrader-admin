import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AdminUiContext = createContext(null);

export function AdminUiProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = useMemo(() => ({
    collapsed,
    setCollapsed,
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
    isMobile,
  }), [collapsed, theme, isMobile]);

  return (
    <AdminUiContext.Provider value={value}>
      {children}
    </AdminUiContext.Provider>
  );
}

export function useAdminUi() {
  const context = useContext(AdminUiContext);

  if (!context) {
    throw new Error('useAdminUi must be used within AdminUiProvider');
  }

  return context;
}
