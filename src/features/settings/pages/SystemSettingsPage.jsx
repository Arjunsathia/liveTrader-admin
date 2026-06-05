import React, { useState, useEffect } from 'react';
import { Settings, Shield, HardDrive, Key, Database, RefreshCw, Sliders, Palette, Sun, Moon, Check, Code, Copy } from 'lucide-react';
import { useAdminUi } from '@/app/providers/AdminUiProvider';
import { AdminModal } from '@/components/overlays/AdminModal';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
} from '../components/SettingsForm';
import {
  TIMEZONE_OPTIONS,
  LOCALE_OPTIONS,
  SYSTEM_CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  BACKUP_FREQUENCY_OPTIONS,
} from '../configs/system.config';

// 9 Premium Color Theme Presets (1 Default + 8 Premium)
const THEME_PRESETS = [
  {
    id: 'obsidian',
    name: 'Digital Obsidian',
    desc: 'Original system base. Institutional blue & deep void charcoal.',
    mood: 'Professional & Trusted',
    swatches: ['#2a4a8a', '#adc6ff', '#0b1326'],
  },
  {
    id: 'emerald',
    name: 'Emerald Horizon Premium',
    desc: 'Wealth teal and mint growth accents on a pure rainforest-void canvas.',
    mood: 'Prosperous & Growth',
    swatches: ['#0f8f82', '#2dd4bf', '#030f0d'],
  },
  {
    id: 'obsidian-luxe',
    name: 'Obsidian Luxe',
    desc: 'Sapphire corporate luxury with ice-cyan accent and silver-white backing.',
    mood: 'Prestigious & Secure',
    swatches: ['#1e3a6e', '#90b8f8', '#04080f'],
  },
  {
    id: 'indigo',
    name: 'Indigo Luxe',
    desc: 'Electric indigo with royal orchid magenta accent on deep electric void.',
    mood: 'Luxury & Innovative',
    swatches: ['#5856eb', '#a5a3ff', '#08071a'],
  },
  {
    id: 'slate',
    name: 'Graphite Steel',
    desc: 'Cold precision steel, vivid cyan accent, and steel-carbon dark canvas.',
    mood: 'Clean & Technical',
    swatches: ['#374659', '#c8d6e8', '#080d14'],
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    desc: 'Royal navy blue with sky clarity accent on a near-black navy abyss.',
    mood: 'Enterprise Elite',
    swatches: ['#1a3680', '#7db0f8', '#020712'],
  },
  {
    id: 'aurora',
    name: 'Aurora Luxe',
    desc: 'Saturated amethyst violet with aurora teal accent on a cosmos void.',
    mood: 'Premium & Visionary',
    swatches: ['#7c3aed', '#c084fc', '#060210'],
  },
  {
    id: 'amber',
    name: 'Amber Luxe',
    desc: 'Burnished bronze-gold with liquid gold accent on warm charcoal ebony.',
    mood: 'Confident & Active',
    swatches: ['#a86c18', '#f4bc41', '#0e0904'],
  },
  {
    id: 'crimson',
    name: 'Crimson Noir',
    desc: 'Deep velvet crimson with antique gold accent on garnet-charcoal noir.',
    mood: 'Authoritative & Bold',
    swatches: ['#aa1f1f', '#f87171', '#0d0404'],
  },
];

const THEME_CSS_VARIABLES = {
  obsidian: {
    light: `  /* Digital Obsidian Light */
  --bg: #f8fafc;
  --white-dynamic: #0b1326;
  --surface: #ffffff;
  --surface-2: #f1f5f9;
  --muted-surface: #e2e8f0;
  --surface-bright: #cbd5e1;
  --text: #0b1326;
  --text-muted: #424754;
  --brand: #2a4a8a;
  --brand-strong: #1e3a8a;
  --accent: #2a4a8a;
  --border: rgba(66, 71, 84, 0.15);
  --glass: rgba(255, 255, 255, 0.1);
  --text-on-accent: #ffffff;
  --scrollbar-thumb: rgba(66, 71, 84, 0.1);
  --primary-rgb: 42, 74, 138;
  --shadow-dynamic: 0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);`,
    dark: `  /* Digital Obsidian Dark */
  --bg: #0b1326;
  --white-dynamic: #ffffff;
  --surface: #060e20;
  --surface-2: #131b2e;
  --muted-surface: #1a2540;
  --surface-bright: #31394d;
  --text: #dae2fd;
  --text-muted: #c2c6d6;
  --brand: #adc6ff;
  --brand-strong: #2a4a8a;
  --accent: #adc6ff;
  --border: rgba(66, 71, 84, 0.15);
  --glass: rgba(34, 47, 74, 0.15);
  --text-on-accent: #0b1326;
  --scrollbar-thumb: rgba(173, 198, 255, 0.1);
  --primary-rgb: 173, 198, 255;
  --cyan: #22d3ee;
  --purple: #a78bfa;
  --positive: #4ae176;
  --shadow-dynamic: 0 4px 16px -2px rgba(0, 0, 0, 0.45), 0 3px 6px -2px rgba(0, 0, 0, 0.35);`
  },
  emerald: {
    light: `  /* Emerald Horizon Light Override */
  [data-theme="emerald"] {
    --bg: #f2fdfb;
    --white-dynamic: #052220;
    --surface: #ffffff;
    --surface-2: #e4f7f2;
    --muted-surface: #c6ede4;
    --surface-bright: #a8dfd4;
    --brand: #0f8f82;
    --brand-strong: #0d766c;
    --accent: #16c784;
    --text: #052220;
    --text-muted: #3d6460;
    --border: rgba(15, 143, 130, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(15, 143, 130, 0.15);
    --primary-rgb: 15, 143, 130;
    --glass: rgba(15, 143, 130, 0.08);
    --shadow-dynamic: 0 4px 12px -2px rgba(15, 143, 130, 0.08), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Emerald Horizon Dark Override */
  .dark[data-theme="emerald"] {
    --bg: #030f0d;
    --white-dynamic: #e9fbf8;
    --surface: #091e1a;
    --surface-2: #102e29;
    --muted-surface: #184038;
    --surface-bright: #1f5249;
    --brand: #2dd4bf;
    --brand-strong: #0f8f82;
    --accent: #34d399;
    --text: #e9fbf8;
    --text-muted: #8ec9c1;
    --border: rgba(45, 212, 191, 0.13);
    --text-on-accent: #030f0d;
    --scrollbar-thumb: rgba(45, 212, 191, 0.12);
    --primary-rgb: 45, 212, 191;
    --glass: rgba(45, 212, 191, 0.07);
    --shadow-dynamic: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(45, 212, 191, 0.06);
  }`
  },
  'obsidian-luxe': {
    light: `  /* Obsidian Luxe Light Override */
  [data-theme="obsidian-luxe"] {
    --bg: #f5f7fc;
    --white-dynamic: #090f20;
    --surface: #ffffff;
    --surface-2: #ebf0fa;
    --muted-surface: #d8e2f5;
    --surface-bright: #c0d0ec;
    --brand: #1e3a6e;
    --brand-strong: #152d58;
    --accent: #00b4d8;
    --text: #090f20;
    --text-muted: #3d4d68;
    --border: rgba(30, 58, 110, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(30, 58, 110, 0.14);
    --primary-rgb: 30, 58, 110;
    --glass: rgba(30, 58, 110, 0.08);
    --shadow-dynamic: 0 4px 14px -2px rgba(30, 58, 110, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Obsidian Luxe Dark Override */
  .dark[data-theme="obsidian-luxe"] {
    --bg: #04080f;
    --white-dynamic: #eaf2ff;
    --surface: #0a1220;
    --surface-2: #111d31;
    --muted-surface: #192a47;
    --surface-bright: #22395e;
    --brand: #90b8f8;
    --brand-strong: #1e3a6e;
    --accent: #00d4f5;
    --text: #eaf2ff;
    --text-muted: #8aa4c8;
    --border: rgba(144, 184, 248, 0.12);
    --text-on-accent: #04080f;
    --scrollbar-thumb: rgba(144, 184, 248, 0.1);
    --primary-rgb: 144, 184, 248;
    --glass: rgba(144, 184, 248, 0.07);
    --shadow-dynamic: 0 4px 22px -2px rgba(0, 0, 0, 0.7), 0 2px 10px -2px rgba(144, 184, 248, 0.06);
  }`
  },
  indigo: {
    light: `  /* Indigo Luxe Light Override */
  [data-theme="indigo"] {
    --bg: #fafaff;
    --white-dynamic: #0e0c28;
    --surface: #ffffff;
    --surface-2: #f0effd;
    --muted-surface: #e0dffb;
    --surface-bright: #ccc9f7;
    --brand: #5856eb;
    --brand-strong: #4543d4;
    --accent: #c026d3;
    --text: #0e0c28;
    --text-muted: #4e4c72;
    --border: rgba(88, 86, 235, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(88, 86, 235, 0.14);
    --primary-rgb: 88, 86, 235;
    --glass: rgba(88, 86, 235, 0.08);
    --shadow-dynamic: 0 4px 14px -2px rgba(88, 86, 235, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Indigo Luxe Dark Override */
  .dark[data-theme="indigo"] {
    --bg: #08071a;
    --white-dynamic: #ededff;
    --surface: #100f2e;
    --surface-2: #191844;
    --muted-surface: #23225a;
    --surface-bright: #2f2e73;
    --brand: #a5a3ff;
    --brand-strong: #5856eb;
    --accent: #e879f9;
    --text: #ededff;
    --text-muted: #9d9bbf;
    --border: rgba(165, 163, 255, 0.12);
    --text-on-accent: #08071a;
    --scrollbar-thumb: rgba(165, 163, 255, 0.1);
    --primary-rgb: 165, 163, 255;
    --glass: rgba(165, 163, 255, 0.07);
    --shadow-dynamic: 0 4px 22px -2px rgba(0, 0, 0, 0.65), 0 2px 10px -2px rgba(165, 163, 255, 0.08);
  }`
  },
  slate: {
    light: `  /* Graphite Steel Light Override */
  [data-theme="slate"] {
    --bg: #f6f7f9;
    --white-dynamic: #111827;
    --surface: #ffffff;
    --surface-2: #edf0f4;
    --muted-surface: #dde2ea;
    --surface-bright: #c8d0dc;
    --brand: #374659;
    --brand-strong: #28364a;
    --accent: #0891b2;
    --text: #111827;
    --text-muted: #4b5a6e;
    --border: rgba(55, 70, 89, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(55, 70, 89, 0.13);
    --primary-rgb: 55, 70, 89;
    --glass: rgba(55, 70, 89, 0.07);
    --shadow-dynamic: 0 4px 12px -2px rgba(55, 70, 89, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Graphite Steel Dark Override */
  .dark[data-theme="slate"] {
    --bg: #080d14;
    --white-dynamic: #f1f5f9;
    --surface: #0f1620;
    --surface-2: #182130;
    --muted-surface: #222d3f;
    --surface-bright: #2d3c52;
    --brand: #c8d6e8;
    --brand-strong: #374659;
    --accent: #0ea5e9;
    --text: #f1f5f9;
    --text-muted: #8a99ad;
    --border: rgba(200, 214, 232, 0.11);
    --text-on-accent: #080d14;
    --scrollbar-thumb: rgba(200, 214, 232, 0.1);
    --primary-rgb: 200, 214, 232;
    --glass: rgba(200, 214, 232, 0.06);
    --shadow-dynamic: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(200, 214, 232, 0.05);
  }`
  },
  navy: {
    light: `  /* Midnight Navy Light Override */
  [data-theme="navy"] {
    --bg: #f4f8ff;
    --white-dynamic: #070f24;
    --surface: #ffffff;
    --surface-2: #e6eeff;
    --muted-surface: #cfdaf8;
    --surface-bright: #b2c5f0;
    --brand: #1a3680;
    --brand-strong: #122868;
    --accent: #0ea5e9;
    --text: #070f24;
    --text-muted: #3a4c6a;
    --border: rgba(26, 54, 128, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(26, 54, 128, 0.14);
    --primary-rgb: 26, 54, 128;
    --glass: rgba(26, 54, 128, 0.08);
    --shadow-dynamic: 0 4px 14px -2px rgba(26, 54, 128, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Midnight Navy Dark Override */
  .dark[data-theme="navy"] {
    --bg: #020712;
    --white-dynamic: #e8f0ff;
    --surface: #080f22;
    --surface-2: #0e1936;
    --muted-surface: #16254e;
    --surface-bright: #1f3368;
    --brand: #7db0f8;
    --brand-strong: #1a3680;
    --accent: #38bdf8;
    --text: #e8f0ff;
    --text-muted: #7a96c2;
    --border: rgba(125, 176, 248, 0.12);
    --text-on-accent: #020712;
    --scrollbar-thumb: rgba(125, 176, 248, 0.1);
    --primary-rgb: 125, 176, 248;
    --glass: rgba(125, 176, 248, 0.07);
    --shadow-dynamic: 0 4px 22px -2px rgba(0, 0, 0, 0.72), 0 2px 10px -2px rgba(125, 176, 248, 0.06);
  }`
  },
  aurora: {
    light: `  /* Aurora Luxe Light Override */
  [data-theme="aurora"] {
    --bg: #faf7ff;
    --white-dynamic: #160826;
    --surface: #ffffff;
    --surface-2: #f0e8ff;
    --muted-surface: #e2d1ff;
    --surface-bright: #ccb4ff;
    --brand: #7c3aed;
    --brand-strong: #6824d4;
    --accent: #14b8a6;
    --text: #160826;
    --text-muted: #563e72;
    --border: rgba(124, 58, 237, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(124, 58, 237, 0.13);
    --primary-rgb: 124, 58, 237;
    --glass: rgba(124, 58, 237, 0.08);
    --shadow-dynamic: 0 4px 14px -2px rgba(124, 58, 237, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Aurora Luxe Dark Override */
  .dark[data-theme="aurora"] {
    --bg: #060210;
    --white-dynamic: #f2ecff;
    --surface: #0e0820;
    --surface-2: #160f35;
    --muted-surface: #20174a;
    --surface-bright: #2c2060;
    --brand: #c084fc;
    --brand-strong: #7c3aed;
    --accent: #2dd4bf;
    --text: #f2ecff;
    --text-muted: #aa90cc;
    --border: rgba(192, 132, 252, 0.12);
    --text-on-accent: #060210;
    --scrollbar-thumb: rgba(192, 132, 252, 0.11);
    --primary-rgb: 192, 132, 252;
    --glass: rgba(192, 132, 252, 0.07);
    --shadow-dynamic: 0 4px 22px -2px rgba(0, 0, 0, 0.72), 0 2px 10px -2px rgba(192, 132, 252, 0.07);
  }`
  },
  amber: {
    light: `  /* Amber Luxe Light Override */
  [data-theme="amber"] {
    --bg: #fefcf5;
    --white-dynamic: #1e1204;
    --surface: #fffdf5;
    --surface-2: #f8edcf;
    --muted-surface: #f0dca8;
    --surface-bright: #e8cd90;
    --brand: #a86c18;
    --brand-strong: #8a5610;
    --accent: #d4a017;
    --text: #1e1204;
    --text-muted: #614e30;
    --border: rgba(168, 108, 24, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(168, 108, 24, 0.14);
    --primary-rgb: 168, 108, 24;
    --glass: rgba(168, 108, 24, 0.08);
    --shadow-dynamic: 0 4px 12px -2px rgba(168, 108, 24, 0.1), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Amber Luxe Dark Override */
  .dark[data-theme="amber"] {
    --bg: #0e0904;
    --white-dynamic: #fff8e8;
    --surface: #18100a;
    --surface-2: #261a0d;
    --muted-surface: #352310;
    --surface-bright: #462f14;
    --brand: #f4bc41;
    --brand-strong: #a86c18;
    --accent: #ffce47;
    --text: #fff8e8;
    --text-muted: #c9b68a;
    --border: rgba(244, 188, 65, 0.13);
    --text-on-accent: #0e0904;
    --scrollbar-thumb: rgba(244, 188, 65, 0.11);
    --primary-rgb: 244, 188, 65;
    --glass: rgba(244, 188, 65, 0.07);
    --shadow-dynamic: 0 4px 20px -2px rgba(0, 0, 0, 0.65), 0 2px 10px -2px rgba(244, 188, 65, 0.07);
  }`
  },
  crimson: {
    light: `  /* Crimson Noir Light Override */
  [data-theme="crimson"] {
    --bg: #fdf8f5;
    --white-dynamic: #1f0808;
    --surface: #ffffff;
    --surface-2: #f7eeea;
    --muted-surface: #eeddd8;
    --surface-bright: #e2c8c2;
    --brand: #aa1f1f;
    --brand-strong: #8b1717;
    --accent: #c4922a;
    --text: #1f0808;
    --text-muted: #614444;
    --border: rgba(170, 31, 31, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(170, 31, 31, 0.13);
    --primary-rgb: 170, 31, 31;
    --glass: rgba(170, 31, 31, 0.07);
    --shadow-dynamic: 0 4px 12px -2px rgba(170, 31, 31, 0.08), 0 2px 6px -1px rgba(0,0,0,0.04);
  }`,
    dark: `  /* Crimson Noir Dark Override */
  .dark[data-theme="crimson"] {
    --bg: #0d0404;
    --white-dynamic: #fff3f0;
    --surface: #170808;
    --surface-2: #231010;
    --muted-surface: #321616;
    --surface-bright: #421e1e;
    --brand: #f87171;
    --brand-strong: #aa1f1f;
    --accent: #e2a832;
    --text: #fff3f0;
    --text-muted: #c4a4a4;
    --border: rgba(248, 113, 113, 0.12);
    --text-on-accent: #0d0404;
    --scrollbar-thumb: rgba(248, 113, 113, 0.1);
    --primary-rgb: 248, 113, 113;
    --glass: rgba(248, 113, 113, 0.06);
    --shadow-dynamic: 0 4px 22px -2px rgba(0, 0, 0, 0.72), 0 2px 10px -2px rgba(248, 113, 113, 0.06);
  }`
  }
};

/**
 * SystemSettingsPage — Regulates general brand locale settings, session timeout levels, password policies, and database backup routines.
 */
export function SystemSettingsPage({
  systemConfig,
  updateSystemField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [backingUp, setBackingUp] = useState(false);

  const { theme: currentTheme, setTheme, colorTheme: currentColorTheme, setColorTheme } = useAdminUi();
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [localColorTheme, setLocalColorTheme] = useState(currentColorTheme);

  const [prevTheme, setPrevTheme] = useState(currentTheme);
  const [prevColorTheme, setPrevColorTheme] = useState(currentColorTheme);

  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('css-vars'); // 'css-vars', 'presets-json', 'all-css'
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (currentTheme !== prevTheme) {
    setPrevTheme(currentTheme);
    setLocalTheme(currentTheme);
  }
  if (currentColorTheme !== prevColorTheme) {
    setPrevColorTheme(currentColorTheme);
    setLocalColorTheme(currentColorTheme);
  }

  const isAppearanceDirty = localTheme !== currentTheme || localColorTheme !== currentColorTheme;

  // Cleanup on unmount: if we have unsaved changes, revert them on the DOM
  useEffect(() => {
    return () => {
      const root = window.document.documentElement;
      const savedTheme = localStorage.getItem('app-theme') || 'dark';
      const savedColorTheme = localStorage.getItem('app-color-theme') || 'obsidian';
      root.classList.remove('light', 'dark');
      root.classList.add(savedTheme);
      root.setAttribute('data-theme', savedColorTheme);
    };
  }, []);

  const handleSaveAll = async () => {
    if (isAppearanceDirty) {
      setTheme(localTheme);
      setColorTheme(localColorTheme);
    }
    if (isDirty) {
      await saveCurrentSection();
    }
  };

  const handleResetAll = () => {
    if (isAppearanceDirty) {
      setLocalTheme(currentTheme);
      setLocalColorTheme(currentColorTheme);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
      root.setAttribute('data-theme', currentColorTheme);
    }
    if (isDirty) {
      resetCurrentSection();
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Region', Icon: Settings },
    { id: 'security', label: 'Security & Access', Icon: Shield },
    { id: 'appearance', label: 'Appearance & Themes', Icon: Palette },
    { id: 'backup', label: 'Maintenance & Backups', Icon: HardDrive },
  ];

  const handleLaunchBackup = async () => {
    setBackingUp(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBackingUp(false);
    alert('System database backup snapshot created successfully ✓');
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="System Settings"
        desc="Setup localized parameters, configure session controls, dictate security policies, and manage database maintenance."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'general' && (
        <div className="space-y-5">
          <SettingsCard
            title="General Branding Information"
            desc="Configure brand labels and primary support contacts."
            Icon={Settings}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Display label for system interfaces">Brand Name</FieldLabel>
                <TInput
                  value={systemConfig.brandName}
                  onChange={(v) => updateSystemField('brandName', v)}
                  placeholder="Live-Trader"
                />
              </div>
              <div>
                <FieldLabel required hint="Root internet domain identifier">Brand Domain</FieldLabel>
                <TInput
                  value={systemConfig.brandDomain}
                  onChange={(v) => updateSystemField('brandDomain', v)}
                  placeholder="live-trader.com"
                  mono
                />
              </div>
            </FGroup>
            <div className="mt-4">
              <FieldLabel required hint="Default destination for support tickets dispatches">Primary Support Email</FieldLabel>
              <TInput
                value={systemConfig.supportEmail}
                onChange={(v) => updateSystemField('supportEmail', v)}
                placeholder="support@live-trader.com"
                mono
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Regional Locale Coordinates"
            desc="Specify system dates formatting, primary language, and clearing currencies."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Primary timezone coordinates governing daily schedules">Platform Timezone</FieldLabel>
                <TSelect
                  value={systemConfig.timezone}
                  onChange={(v) => updateSystemField('timezone', v)}
                  options={TIMEZONE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Default language selection applied on client portals">Primary Locale Language</FieldLabel>
                <TSelect
                  value={systemConfig.locale}
                  onChange={(v) => updateSystemField('locale', v)}
                  options={LOCALE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Primary currency of all fee estimations">Default System Currency</FieldLabel>
                <TSelect
                  value={systemConfig.currency}
                  onChange={(v) => updateSystemField('currency', v)}
                  options={SYSTEM_CURRENCY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Visual arrangement of dates displayed in tables and ledgers">Date Format Layout</FieldLabel>
                <TSelect
                  value={systemConfig.dateFormat}
                  onChange={(v) => updateSystemField('dateFormat', v)}
                  options={DATE_FORMAT_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-5">
          <SettingsCard
            title="Session Access Controls"
            desc="Regulate concurrent access variables and idle session limits."
            Icon={Shield}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Minutes of inactivity before automatic session logouts">Session Idle Timeout</FieldLabel>
                <TInput
                  value={systemConfig.sessionTimeout}
                  onChange={(v) => updateSystemField('sessionTimeout', v)}
                  mono
                  suffix="MIN"
                />
              </div>
              <div>
                <FieldLabel required hint="Max parallel active sessions per single operator">Max Concurrent Sessions</FieldLabel>
                <TInput
                  value={systemConfig.maxSessions}
                  onChange={(v) => updateSystemField('maxSessions', v)}
                  mono
                />
              </div>
            </FGroup>

            <div className="mt-4">
              <ToggleRow
                label="Enforce Multi-Factor Authentication"
                desc="Mandate MFA validation using Google Authenticator or SMS codes on all administrator accounts"
                val={systemConfig.mfaRequired}
                onChange={(v) => updateSystemField('mfaRequired', v)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Password Security Policy"
            desc="Setup strength guidelines and expiration boundaries for administrative credentials."
            Icon={Key}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Min characters required for passwords creation">Minimum Password Length</FieldLabel>
                <TInput
                  value={systemConfig.passwordMinLength}
                  onChange={(v) => updateSystemField('passwordMinLength', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Days passwords remain valid before rotation prompt">Credentials Expiry Interval</FieldLabel>
                <TInput
                  value={systemConfig.passwordExpiry}
                  onChange={(v) => updateSystemField('passwordExpiry', v)}
                  mono
                  suffix="DAYS"
                />
              </div>
              <div>
                <FieldLabel hint="Maximum failed password retries before IP block triggers">Max Login Attempts</FieldLabel>
                <TInput
                  value={systemConfig.loginAttempts}
                  onChange={(v) => updateSystemField('loginAttempts', v)}
                  mono
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-5">
          <SettingsCard
            title="Database Snapshots & Maintenance"
            desc="Configure database backup schedules to safeguard system recovery pipelines."
            Icon={HardDrive}
          >
            <div className="space-y-4">
              <ToggleRow
                label="Automated Daily Backups"
                desc="Commit cold snapshot backups of all clearing parameters daily"
                val={systemConfig.backupEnabled}
                onChange={(v) => updateSystemField('backupEnabled', v)}
              />

              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Periodical scheduling coordinator rules for backups">Backups Frequencies</FieldLabel>
                  <TSelect
                    value={systemConfig.backupFrequency}
                    onChange={(v) => updateSystemField('backupFrequency', v)}
                    options={BACKUP_FREQUENCY_OPTIONS}
                    disabled={!systemConfig.backupEnabled}
                  />
                </div>
                <div>
                  <FieldLabel hint="Days backup snapshots are retained in secure cloud nodes">Backups Retentions Duration</FieldLabel>
                  <TInput
                    value={systemConfig.backupRetention}
                    onChange={(v) => updateSystemField('backupRetention', v)}
                    disabled={!systemConfig.backupEnabled}
                    mono
                    suffix="DAYS"
                  />
                </div>
              </FGroup>

              <div className="pt-2">
                <ToggleRow
                  label="Enforce Audit Logging"
                  desc="Log all administrative session events, modifications, and query updates"
                  val={systemConfig.auditLogEnabled}
                  onChange={(v) => updateSystemField('auditLogEnabled', v)}
                />
                <FGroup cols={2}>
                  <div>
                    <FieldLabel hint="Days to retain audit logs in data lakes">Audit Logs Retentions</FieldLabel>
                    <TInput
                      value={systemConfig.auditLogRetention}
                      onChange={(v) => updateSystemField('auditLogRetention', v)}
                      disabled={!systemConfig.auditLogEnabled}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                  <div>
                    <FieldLabel hint="General client transaction logs storage duration bounds">General Transaction Retentions</FieldLabel>
                    <TInput
                      value={systemConfig.dataRetention}
                      onChange={(v) => updateSystemField('dataRetention', v)}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                </FGroup>
              </div>

              <div className="pt-4 border-t border-border/10">
                <Btn
                  Icon={Database}
                  label={backingUp ? 'Creating Snapshot...' : 'Create Backup Snapshot Now'}
                  variant="cyan"
                  onClick={handleLaunchBackup}
                  loading={backingUp}
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-5 animate-fade-in">
          {/* Interface Mode Card */}
          <SettingsCard
            title="Interface Mode"
            desc="Toggle between standard light theme and bioluminescent dark theme environments."
            Icon={localTheme === 'dark' ? Moon : Sun}
          >
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLocalTheme('light');
                  const root = window.document.documentElement;
                  root.classList.remove('dark');
                  root.classList.add('light');
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4.5 px-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  localTheme === 'light'
                    ? 'border-brand bg-brand-muted text-brand ring-2 ring-brand/10'
                    : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted'
                }`}
              >
                <Sun size={18} className={localTheme === 'light' ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
                <div className="text-left">
                  <p className="text-[13px] font-bold leading-tight">Light Mode</p>
                  <p className="text-[10px] text-text-muted/60 mt-0.5 leading-none">Clean & readable in sunlight</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalTheme('dark');
                  const root = window.document.documentElement;
                  root.classList.remove('light');
                  root.classList.add('dark');
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4.5 px-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  localTheme === 'dark'
                    ? 'border-brand bg-brand-muted text-brand ring-2 ring-brand/10'
                    : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted'
                }`}
              >
                <Moon size={18} />
                <div className="text-left">
                  <p className="text-[13px] font-bold leading-tight">Dark Mode</p>
                  <p className="text-[10px] text-text-muted/60 mt-0.5 leading-none">Low eye-strain void environment</p>
                </div>
              </button>
            </div>
          </SettingsCard>

          {/* Preset Themes Card */}
          <SettingsCard
            title="Brand Color Presets"
            desc="Select from our curated list of professional, high-contrast visual systems."
            Icon={Palette}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {THEME_PRESETS.map((preset) => {
                const isActive = localColorTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setLocalColorTheme(preset.id);
                      const root = window.document.documentElement;
                      root.setAttribute('data-theme', preset.id);
                    }}
                    className={`relative p-4.5 rounded-xl border text-left transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? 'border-brand bg-brand-muted ring-2 ring-brand/10'
                        : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/25'
                    }`}
                  >
                    {/* Swatches rendering */}
                    <div className="flex gap-1.5 mb-3.5">
                      {preset.swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <h4 className="text-[13px] font-bold text-text leading-tight flex items-center gap-1.5">
                      {preset.name}
                      {isActive && (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand text-text-on-accent">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </h4>
                    <p className="text-[11.5px] text-text-muted/80 mt-1">{preset.desc}</p>
                    <p className="text-[9.5px] font-bold uppercase tracking-wider text-brand/75 mt-3">{preset.mood}</p>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-border/10 mt-4">
              <button
                type="button"
                onClick={() => setIsDeveloperModalOpen(true)}
                className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-brand/80 hover:text-brand transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Code size={13} />
                Get Theme Codes (Copy-Paste)
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalTheme('dark');
                  setLocalColorTheme('obsidian');
                  const root = window.document.documentElement;
                  root.classList.remove('light');
                  root.classList.add('dark');
                  root.setAttribute('data-theme', 'obsidian');
                }}
                className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-text-muted/65 hover:text-brand transition-colors flex items-center gap-1 cursor-pointer"
              >
                Reset to Default Preset
              </button>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty || isAppearanceDirty}
        onSave={handleSaveAll}
        onReset={handleResetAll}
        label="Save System Rules"
      />

      {/* Developer Reference Copy-Paste Modal */}
      <AdminModal
        open={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        title="Theme Code Reference"
        subtitle="Quickly copy custom properties and JavaScript schemas to integrate colors across your platform."
        actionLabel="Developer Reference"
        maxWidth="max-w-[720px]"
      >
        <div className="space-y-4">
          {/* Modal Tabs */}
          <div className="flex border-b border-border/10">
            <button
              type="button"
              onClick={() => setModalTab('css-vars')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'css-vars'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              Active Preset CSS
            </button>
            <button
              type="button"
              onClick={() => setModalTab('all-css')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'all-css'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              Full CSS Bundle
            </button>
            <button
              type="button"
              onClick={() => setModalTab('presets-json')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'presets-json'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              JS Config Array
            </button>
          </div>

          {/* Preset selector for CSS-vars */}
          {modalTab === 'css-vars' && (
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs text-text-muted/80 mr-1 font-semibold">Select Theme Preset:</span>
              <select
                value={localColorTheme}
                onChange={(e) => {
                  setLocalColorTheme(e.target.value);
                  const root = window.document.documentElement;
                  root.setAttribute('data-theme', e.target.value);
                }}
                className="bg-surface-elevated text-text border border-border/30 rounded-lg px-2 py-1 text-xs font-semibold outline-none focus:border-brand/40"
              >
                {THEME_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Code Viewer Container */}
          <div className="relative group">
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {copied && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  Copied!
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  let text = '';
                  if (modalTab === 'css-vars') {
                    const preset = THEME_CSS_VARIABLES[localColorTheme] || THEME_CSS_VARIABLES.obsidian;
                    text = `${preset.light}\n\n${preset.dark}`;
                  } else if (modalTab === 'all-css') {
                    text = Object.keys(THEME_CSS_VARIABLES)
                      .map((key) => {
                        const preset = THEME_CSS_VARIABLES[key];
                        return `/* === Theme: ${key} === */\n${preset.light}\n\n${preset.dark}`;
                      })
                      .join('\n\n');
                  } else if (modalTab === 'presets-json') {
                    text = `export const THEME_PRESETS = ${JSON.stringify(THEME_PRESETS, null, 2)};`;
                  }
                  handleCopyCode(text);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-border/30 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Copy size={12} />
                Copy Snippet
              </button>
            </div>

            <pre className="bg-[#0b1326] border border-border/20 text-slate-300 p-5 pt-12 rounded-xl font-mono text-[11px] leading-relaxed overflow-auto max-h-[380px] w-full select-all">
              {(() => {
                if (modalTab === 'css-vars') {
                  const preset = THEME_CSS_VARIABLES[localColorTheme] || THEME_CSS_VARIABLES.obsidian;
                  return `${preset.light}\n\n${preset.dark}`;
                } else if (modalTab === 'all-css') {
                  return Object.keys(THEME_CSS_VARIABLES)
                    .map((key) => {
                      const preset = THEME_CSS_VARIABLES[key];
                      return `/* === Theme: ${key} === */\n${preset.light}\n\n${preset.dark}`;
                    })
                    .join('\n\n');
                } else if (modalTab === 'presets-json') {
                  return `export const THEME_PRESETS = ${JSON.stringify(THEME_PRESETS, null, 2)};`;
                }
                return '';
              })()}
            </pre>
          </div>

          <p className="text-[10px] text-text-muted/60 leading-normal">
            * Note: Map the custom properties to your CSS variables layer. In Tailwind CSS, map them to your colors config (e.g. <code>--color-brand: var(--brand)</code>).
          </p>
        </div>
      </AdminModal>
    </div>
  );
}

export default SystemSettingsPage;
