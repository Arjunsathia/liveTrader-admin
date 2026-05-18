import React, { createContext, useContext, useState, useCallback } from 'react';

const UniversalDrawerContext = createContext(null);

export function UniversalDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerProps, setDrawerProps] = useState({});

  const openDrawer = useCallback((Component, props = {}) => {
    setDrawerContent(() => Component);
    setDrawerProps(props);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <UniversalDrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      {children}
      {drawerContent && React.createElement(drawerContent, {
        ...drawerProps,
        open: isOpen,
        onClose: closeDrawer,
      })}
    </UniversalDrawerContext.Provider>
  );
}

export function useUniversalDrawer() {
  const context = useContext(UniversalDrawerContext);
  if (!context) {
    throw new Error('useUniversalDrawer must be used within UniversalDrawerProvider');
  }
  return context;
}
