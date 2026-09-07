'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CreditCard, UserPlus, FileText, CalendarCheck, Bell, User, ChevronRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'payment' | 'enquiry' | 'leave' | 'attendance' | 'notice' | 'admission';
  message: string;
  time: string;
  amount?: number;
  href?: string;
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const iconMap = {
    payment: { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    enquiry: { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    leave: { icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    attendance: { icon: CalendarCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    notice: { icon: Bell, color: 'text-pink-600', bg: 'bg-pink-50' },
    admission: { icon: User, color: 'text-teal-600', bg: 'bg-teal-50' },
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Activity</h3>
      <div className="space-y-1">
        {activities.map((act) => {
          const { icon: Icon, color, bg } = iconMap[act.type];
          const inner = (
            <div className="flex items-start gap-3 rounded-lg px-2 py-2 group transition-colors hover:bg-slate-50">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', bg)}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{act.message}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">{act.time}</p>
                  {act.amount && (
                    <span className="text-xs font-semibold text-emerald-600">₹{act.amount.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
              {act.href && <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0 mt-1" />}
            </div>
          );

          if (act.href) {
            return <Link key={act.id} href={act.href}>{inner}</Link>;
          }
          return <div key={act.id}>{inner}</div>;
        })}
      </div>
    </Card>
  );
}
