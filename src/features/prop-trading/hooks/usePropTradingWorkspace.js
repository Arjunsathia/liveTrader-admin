import { useState } from 'react';

export function usePropTradingWorkspace() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const closeDrawer = () => setDrawer(null);

  return {
    activeTab, setActiveTab,
    search, setSearch,
    filter, setFilter,
    drawer, setDrawer, closeDrawer,
    toast, showToast
  };
}
