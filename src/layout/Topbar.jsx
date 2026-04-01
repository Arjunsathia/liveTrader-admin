import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Search,
  Sun,
  Plus,
  Zap,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useRouteMeta } from '../hooks/useRouteMeta';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../hooks/useClickOutside';

export function Topbar({ collapsed, setCollapsed, theme, toggleTheme, onOpenCommand }) {
  const routeMeta = useRouteMeta();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setIsProfileOpen(false));

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center px-4 gap-3 bg-surface-elevated dark:bg-bg border-b border-border/40 dark:border-border/10 shadow-card-subtle transition-all duration-300">

      {/* ── LEFT ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Sidebar toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
          className="group relative w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated/40 border border-border/40 dark:border-white/[0.05] hover:bg-surface-elevated/80 transition-all duration-200 cursor-pointer"
        >
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 ${collapsed ? '-rotate-180' : 'rotate-0'
              }`}
          >
            <ChevronLeft
              size={12}
              strokeWidth={3}
              className={`relative right-px transition-colors duration-200 ${collapsed ? 'text-primary' : 'text-text-muted group-hover:text-text'
                }`}
            />
          </div>
          {/* Active glow when collapsed */}
          {collapsed && (
            <span className="absolute inset-0 rounded-lg ring-1 ring-primary/20 pointer-events-none" />
          )}
        </button>

        {/* Page title + breadcrumb */}
        <div className="hidden sm:flex flex-col justify-center gap-0.5 min-w-0">
          {/* Breadcrumb trail */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-text-muted/40 leading-none">
            <span className="hover:text-primary/70 transition-colors cursor-default uppercase tracking-[0.1em]">LiveTrade.PRO</span>
            <ChevronRight size={8} strokeWidth={3} className="shrink-0 opacity-40" />
            <span className="text-text-muted/80 uppercase tracking-[0.1em]">{routeMeta.section}</span>
          </div>
          {/* Page title */}
          <h1 className="font-heading font-semibold text-[18px] leading-none tracking-[-0.04em] text-text truncate max-w-[200px]">
            {routeMeta.title}
          </h1>
        </div>
      </div>

      {/* ── DIVIDER ──────────────────────────────────────── */}
      <div className="hidden sm:block w-px h-5 bg-border/20 dark:bg-white/[0.08] shrink-0" />

      {/* ── CENTER — Search ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-2 min-w-0">
        <button
          onClick={onOpenCommand}
          className="group relative flex items-center w-full max-w-[400px] h-9 rounded-lg bg-surface-elevated/30 border border-border/30 shadow-card-subtle hover:bg-surface-elevated/50 transition-all duration-200 cursor-pointer outline-none overflow-hidden"
        >
          {/* Icon */}
          <span className="pl-3 pr-2 flex items-center text-text-muted/40 group-hover:text-primary transition-colors duration-200">
            <Search size={13} strokeWidth={2.5} />
          </span>

          {/* Placeholder */}
          <span className="flex-1 text-left text-[12.5px] font-medium text-text-muted/40 group-hover:text-text-muted/60 transition-colors duration-200 truncate">
            Search users, deals, contacts…
          </span>

          {/* Keyboard shortcut */}
          <span className="pr-3 flex items-center gap-1 shrink-0">
            <kbd className="inline-flex items-center px-1.5 h-[18px] rounded-[4px] bg-bg border border-white/[0.08] text-[10px] font-mono font-bold text-text-muted/40 tracking-widest leading-none">
              Ctrl
            </kbd>
            <kbd className="inline-flex items-center px-1.5 h-[18px] rounded-[4px] bg-bg border border-white/[0.08] text-[10px] font-mono font-bold text-text-muted/40 tracking-widest leading-none">
              K
            </kbd>
          </span>

        </button>
      </div>

      {/* ── RIGHT ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* System health — compact pill */}
        <div className="hidden xl:flex items-center gap-3 h-8 px-3 rounded-lg bg-surface-elevated/40 border border-border/40 dark:border-white/[0.06] text-[10px] font-bold tracking-widest shrink-0">
          <span className="flex items-center gap-1.5 text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            <span>
              HEALTH{' '}
              <span className="text-text">99.94%</span>
            </span>
          </span>
          <span className="w-px h-3 bg-border/20 dark:bg-white/10" />
          <span className="text-text-muted">
            LAT{' '}
            <span className="text-primary font-mono">12ms</span>
          </span>
        </div>

        {/* Quick-add CTA — CRM staple */}
        <button
          onClick={onOpenCommand}
          className="hidden md:flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[12px] font-semibold tracking-wide hover:bg-primary/15 hover:border-primary/30 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus size={13} strokeWidth={3} />
          New
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative w-[52px] h-8 rounded-full bg-surface-elevated/60 border border-border/40 dark:border-white/[0.06] p-[3px] flex items-center hover:border-border/60 transition-all duration-200 cursor-pointer group shrink-0"
        >
          {/* Track icons */}
          <span className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none text-text-muted/25 group-hover:text-text-muted/40 transition-colors">
            <Moon size={10} strokeWidth={2.5} />
            <Sun size={10} strokeWidth={2.5} />
          </span>
          {/* Thumb */}
          <span
            className={`relative z-10 w-[20px] h-[20px] rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${theme === 'dark'
              ? 'translate-x-[22px] bg-surface-bright border border-primary/20'
              : 'translate-x-0 bg-white border border-border/20 shadow-sm'
              }`}
          >
            {theme === 'dark' ? (
              <Moon size={11} strokeWidth={2.5} className="text-primary" />
            ) : (
              <Sun size={11} strokeWidth={2.5} className="text-yellow-500" />
            )}
          </span>
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="group relative w-9 h-9 flex items-center justify-center rounded-[10px] bg-transparent hover:bg-surface-elevated/80 text-text-muted hover:text-primary transition-all duration-300 cursor-pointer"
        >
          <Bell
            size={18}
            strokeWidth={2}
            className="group-hover:[transform:rotate(12deg)] transition-all duration-300"
          />
          {/* Unread badge with count */}
          <span className="absolute top-[6px] right-[6px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-negative text-[8.5px] font-bold text-white flex items-center justify-center ring-2 ring-bg leading-none">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-border/20 dark:bg-white/[0.08]" />

        {/* User profile with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`group flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg border transition-all duration-300 cursor-pointer ${isProfileOpen ? 'bg-surface-bright border-primary/30 ring-1 ring-primary/10' : 'border-transparent hover:bg-surface-elevated/70 hover:border-border/20'}`}
          >
            {/* Avatar container - Slightly smaller */}
            <div className="relative shrink-0">
              <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center font-heading text-[10px] font-bold tracking-tight overflow-hidden transition-all duration-300 ${isProfileOpen ? 'bg-primary text-bg' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
                AR
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-bg rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-positive" />
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-start -gap-0.5 max-w-[110px]">
              <span className="text-[11.5px] font-semibold text-text tracking-tight truncate leading-tight transition-colors group-hover:text-primary">Arjun Sathia</span>
              <span className="text-[8px] font-bold text-text-muted/40 tracking-[0.06em] uppercase leading-none truncate pr-1">SR. ADMINISTRATOR</span>
            </div>

            <ChevronDown
              size={11}
              strokeWidth={3}
              className={`text-text-muted/30 transition-all duration-500 hidden lg:block ml-0.5 ${isProfileOpen ? 'rotate-180 text-primary' : 'rotate-0'}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-surface border border-border/40 rounded-xl shadow-card-subtle animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-[100] p-1.5">
              <div className="px-3 py-2 mb-1 border-b border-white/5">
                <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.12em]">Administration</p>
                <p className="text-[12px] font-semibold text-text truncate">Arjun Sathia</p>
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-200 text-left group/item"
                >
                  <User size={14} className="group-hover/item:scale-110 transition-transform" />
                  <span className="text-[13px] font-medium">Account Profile</span>
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/settings/system'); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-200 text-left group/item"
                >
                  <Settings size={14} className="group-hover/item:scale-110 transition-transform" />
                  <span className="text-[13px] font-medium">System Settings</span>
                </button>
              </div>

              <div className="h-px bg-white/5 my-1.5" />

              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-negative hover:bg-negative/10 transition-all duration-200 text-left group/item"
              >
                <LogOut size={14} className="group-hover/item:translate-x-0.5 transition-transform" />
                <span className="text-[13px] font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
