'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  href?: string;
  onClick?: () => void;
}

export function QuickAction({ label, icon: Icon, iconColor, iconBg, href, onClick }: QuickActionProps) {
  const className = 'flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm group';

  const content = (
    <>
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </>
  );

  if (href) {
    return <Link href={href} className={className}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className={className}>{content}</button>
  );
}

export function QuickActions({ children }: { children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {children}
      </div>
    </Card>
  );
}
