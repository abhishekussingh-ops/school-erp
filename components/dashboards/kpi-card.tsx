'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  onClick?: () => void;
}

export function KpiCard({ label, value, change, trend = 'neutral', icon: Icon, iconColor, iconBg, onClick }: KpiCardProps) {
  return (
    <Card
      className={cn(
        'p-4 transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-slate-300'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          {change && (
            <div className="mt-1 flex items-center gap-1">
              {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
              {trend === 'down' && <TrendingDown className="h-3 w-3 text-rose-500" />}
              {trend === 'neutral' && <Minus className="h-3 w-3 text-slate-400" />}
              <span className={cn(
                'text-xs font-medium',
                trend === 'up' && 'text-emerald-600',
                trend === 'down' && 'text-rose-600',
                trend === 'neutral' && 'text-slate-500',
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </Card>
  );
}
