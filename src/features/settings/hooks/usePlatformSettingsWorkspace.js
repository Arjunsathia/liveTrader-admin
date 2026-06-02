import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { INITIAL_API_CONFIG } from '../configs/api.config';
import { INITIAL_GATEWAYS, INITIAL_GLOBAL_FEES } from '../configs/payment.config';
import { INITIAL_KYC_CONFIG } from '../configs/kyc.config';
import { INITIAL_TRADING_CONFIG } from '../configs/trading.config';
import { INITIAL_NOTIFICATION_CONFIG } from '../configs/notification.config';
import { INITIAL_SYSTEM_CONFIG } from '../configs/system.config';

// Simple deep equality checker helper
function isDeepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

const pathToSection = {
  '/settings/overview': 'overview',
  '/settings/api': 'api',
  '/settings/payment-gateway': 'gateways',
  '/settings/kyc': 'kyc',
  '/settings/trading': 'trading',
  '/settings/notifications': 'notifications',
  '/settings/system': 'system',
};

const sectionToPath = {
  'overview': '/settings/overview',
  'api': '/settings/api',
  'gateways': '/settings/payment-gateway',
  'kyc': '/settings/kyc',
  'trading': '/settings/trading',
  'notifications': '/settings/notifications',
  'system': '/settings/system',
};

export function usePlatformSettingsWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  // Active section derived from URL path (single source of truth)
  const section = pathToSection[location.pathname] || 'overview';

  // Form states
  const [apiConfig, setApiConfig] = useState(INITIAL_API_CONFIG);
  const [gateways, setGateways] = useState(INITIAL_GATEWAYS);
  const [globalFees, setGlobalFees] = useState(INITIAL_GLOBAL_FEES);
  const [kycConfig, setKycConfig] = useState(INITIAL_KYC_CONFIG);
  const [tradingConfig, setTradingConfig] = useState(INITIAL_TRADING_CONFIG);
  const [notificationConfig, setNotificationConfig] = useState(INITIAL_NOTIFICATION_CONFIG);
  const [systemConfig, setSystemConfig] = useState(INITIAL_SYSTEM_CONFIG);

  // Wrapper setSection to navigate between routes when clicked
  const setSection = useCallback((newSection) => {
    const targetPath = sectionToPath[newSection];
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [navigate, location.pathname]);

  // Update primitive field helper
  const updateField = useCallback((configSetter, key, value) => {
    configSetter(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update nested field helper
  const updateNestedField = useCallback((configSetter, parentKey, childKey, value) => {
    configSetter(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  }, []);

  // Section level Dirty States tracking using deep equality
  const isDirty = useCallback((sect) => {
    switch (sect) {
      case 'api':
        return !isDeepEqual(apiConfig, INITIAL_API_CONFIG);
      case 'gateways':
        return !isDeepEqual(gateways, INITIAL_GATEWAYS) || !isDeepEqual(globalFees, INITIAL_GLOBAL_FEES);
      case 'kyc':
        return !isDeepEqual(kycConfig, INITIAL_KYC_CONFIG);
      case 'trading':
        return !isDeepEqual(tradingConfig, INITIAL_TRADING_CONFIG);
      case 'notifications':
        return !isDeepEqual(notificationConfig, INITIAL_NOTIFICATION_CONFIG);
      case 'system':
        return !isDeepEqual(systemConfig, INITIAL_SYSTEM_CONFIG);
      default:
        return false;
    }
  }, [apiConfig, gateways, globalFees, kycConfig, tradingConfig, notificationConfig, systemConfig]);

  // Save changes handler (Mocking API commit)
  const saveSection = useCallback(async (sect) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // standard save delay
    console.log(`[Platform Settings] Saved config for section: ${sect}`);
  }, []);

  // Reset section back to initial config defaults
  const resetSection = useCallback((sect) => {
    switch (sect) {
      case 'api':
        setApiConfig(INITIAL_API_CONFIG);
        break;
      case 'gateways':
        setGateways(INITIAL_GATEWAYS);
        setGlobalFees(INITIAL_GLOBAL_FEES);
        break;
      case 'kyc':
        setKycConfig(INITIAL_KYC_CONFIG);
        break;
      case 'trading':
        setTradingConfig(INITIAL_TRADING_CONFIG);
        break;
      case 'notifications':
        setNotificationConfig(INITIAL_NOTIFICATION_CONFIG);
        break;
      case 'system':
        setSystemConfig(INITIAL_SYSTEM_CONFIG);
        break;
      default:
        break;
    }
  }, []);

  return {
    section,
    setSection,
    apiConfig,
    updateApiField: (k, v) => updateField(setApiConfig, k, v),
    gateways,
    setGateways,
    globalFees,
    updateGlobalFeesField: (k, v) => updateField(setGlobalFees, k, v),
    kycConfig,
    updateKycField: (k, v) => updateField(setKycConfig, k, v),
    updateKycNestedField: (p, c, v) => updateNestedField(setKycConfig, p, c, v),
    tradingConfig,
    updateTradingField: (k, v) => updateField(setTradingConfig, k, v),
    notificationConfig,
    updateNotificationField: (k, v) => updateField(setNotificationConfig, k, v),
    updateNotificationNestedField: (p, c, v) => updateNestedField(setNotificationConfig, p, c, v),
    systemConfig,
    updateSystemField: (k, v) => updateField(setSystemConfig, k, v),
    isDirty: isDirty(section),
    saveCurrentSection: () => saveSection(section),
    resetCurrentSection: () => resetSection(section),
  };
}

export default usePlatformSettingsWorkspace;
