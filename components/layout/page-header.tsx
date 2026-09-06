'use client';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, iconColor = 'text-slate-700', iconBg = 'bg-slate-100', actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
