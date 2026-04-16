import { useState, useCallback } from 'react';

/**
 * Common workspace state for IB System module:
 * - Manages active drawer configuration and data
 * - Handles simple toast notification flashes
 */
export function useIBWorkspace() {
  const [drawer, setDrawer] = useState({ open: false, type: null, data: null });
  const [toast, setToast] = useState(null);

  const openDrawer = useCallback((type, data) => {
    setDrawer({ open: true, type, data });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(prev => ({ ...prev, open: false }));
  }, []);

  const notify = useCallback((msg, id = '') => {
    setToast(id ? `${msg}: ${id}` : msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return {
    drawer,
    openDrawer,
    closeDrawer,
    toast,
    notify,
  };
}
