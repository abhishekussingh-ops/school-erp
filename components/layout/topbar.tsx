'use client';

import { useApp } from '@/lib/app-context';
import { cn } from '@/lib/utils';
import { branches, notifications, roles } from '@/lib/mock-data';
import { Bell, Search, ChevronDown, Menu, Building2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { role, setRole, currentUser, branchId, setBranchId } = useApp();
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setShowBranch(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoles(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, staff, applications..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        {/* Role switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoles(!showRoles)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <span className={cn('h-2 w-2 rounded-full', 'bg-emerald-500')} />
            {roles.find(r => r.id === role)?.label}
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          {showRoles && (
            <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Switch Role (Demo)</p>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setShowRoles(false); router.push('/'); }}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-50',
                    role === r.id && 'bg-slate-50'
                  )}
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-800">{r.label}</p>
                    <p className="text-[11px] text-slate-500">{r.description}</p>
                  </div>
                  {role === r.id && <Check className="h-4 w-4 text-slate-900 mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch switcher */}
        <div className="relative" ref={branchRef}>
          <button
            onClick={() => setShowBranch(!showBranch)}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 lg:flex"
          >
            <Building2 className="h-4 w-4 text-slate-400" />
            {branches.find(b => b.id === branchId)?.name}
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          {showBranch && (
            <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Branch</p>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setBranchId(b.id); setShowBranch(false); }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-slate-50',
                    branchId === b.id && 'bg-slate-50'
                  )}
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{b.name}</p>
                    <p className="text-[11px] text-slate-500">{b.location}</p>
                  </div>
                  {branchId === b.id && <Check className="h-4 w-4 text-slate-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="text-[11px] text-slate-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={cn('flex gap-3 border-b border-slate-50 px-4 py-3', !n.read && 'bg-blue-50/40')}>
                    <div className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      n.type === 'fee' && 'bg-emerald-100 text-emerald-600',
                      n.type === 'attendance' && 'bg-violet-100 text-violet-600',
                      n.type === 'exam' && 'bg-orange-100 text-orange-600',
                      n.type === 'notice' && 'bg-pink-100 text-pink-600',
                      n.type === 'general' && 'bg-slate-100 text-slate-600',
                    )}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500">{n.body}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {currentUser.avatar}
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{roles.find(r => r.id === role)?.label}</p>
            </div>
            <ChevronDown className="hidden h-3 w-3 text-slate-400 lg:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>
              <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">My Profile</button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">Settings</button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
