'use client';

import { useApp } from '@/lib/app-context';
import { getModulesForRole } from '@/lib/modules';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useApp();
  const pathname = usePathname();
  const moduleList = getModulesForRole(role);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-900">Lovedale ERP</p>
          <p className="text-[11px] text-slate-500">School Management Suite</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Modules</p>
        <ul className="space-y-0.5">
          {moduleList.map((mod) => {
            const Icon = mod.icon;
            const active = pathname === mod.path || (mod.path !== '/' && pathname.startsWith(mod.path));
            return (
              <li key={mod.id}>
                <Link
                  href={mod.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                  {mod.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 px-5 py-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">Academic Year</p>
          <p className="text-xs text-slate-500">2026-2027 · Term 1</p>
        </div>
      </div>
    </div>
  );
}
