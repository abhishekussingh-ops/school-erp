'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from './kpi-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CalendarCheck, CreditCard, BookOpen, Bell, GraduationCap, Bus,
  ArrowRight, MapPin, Clock, ChevronRight,
} from 'lucide-react';
import {
  students, feeInstallments, homeworks, notices, examTerms,
  transportRoutes, attendanceRecords, classSections,
} from '@/lib/mock-data';

export function ParentDashboard() {
  const router = useRouter();
  const myChildren = students.filter(s => s.id === 'st1' || s.id === 'st2');
  const child = myChildren[0];
  const childClass = classSections.find(c => c.id === child?.classSectionId);

  const childAttendance = attendanceRecords.filter(a => a.id.startsWith('a') && a.studentId === child?.id);
  const presentCount = childAttendance.filter(a => a.status === 'Present').length;
  const attendancePct = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 0;

  const childFees = feeInstallments.filter(fi => fi.studentId === child?.id);
  const dueAmount = childFees.filter(fi => fi.status !== 'Paid').reduce((sum, fi) => sum + fi.amount, 0);

  const childHomework = homeworks.filter(h => h.classSectionId === child?.classSectionId);
  const childRoute = transportRoutes.find(r => r.id === child?.routeId);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Parent Portal"
        description={`${child?.parentName} · ${myChildren.length} children enrolled`}
        actions={
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={() => router.push('/fees?action=pay')}>
            <CreditCard className="h-4 w-4" />
            Pay Fees
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        {/* Child selector tabs */}
        {myChildren.length > 1 && (
          <div className="flex gap-2">
            {myChildren.map((c, i) => (
              <button
                key={c.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  i === 0 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold', i === 0 ? 'bg-white/20' : 'bg-slate-100')}>
                  {c.avatar}
                </div>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Attendance" value={`${attendancePct}%`} change={presentCount === childAttendance.length ? 'Perfect!' : `${childAttendance.length - presentCount} absences`} trend={attendancePct >= 90 ? 'up' : 'down'} icon={CalendarCheck} iconColor="text-violet-600" iconBg="bg-violet-50" href="/attendance?tab=students" />
          <KpiCard label="Fee Due" value={`₹${dueAmount.toLocaleString('en-IN')}`} change={dueAmount > 0 ? 'Action needed' : 'All paid'} trend={dueAmount > 0 ? 'down' : 'up'} icon={CreditCard} iconColor="text-emerald-600" iconBg="bg-emerald-50" href="/fees?tab=ledger" />
          <KpiCard label="Homework Due" value={String(childHomework.filter(h => !h.submissions.submitted).length)} change={`of ${childHomework.length} assigned`} icon={BookOpen} iconColor="text-pink-600" iconBg="bg-pink-50" href="/communication?tab=homework" />
          <KpiCard label="Upcoming Exams" value="1" change="Unit Test 1" icon={GraduationCap} iconColor="text-orange-600" iconBg="bg-orange-50" href="/exams?tab=marks" />
          <KpiCard label="Notices" value={String(notices.filter(n => !n.readBy.includes('u3')).length)} change="unread" icon={Bell} iconColor="text-blue-600" iconBg="bg-blue-50" href="/communication?tab=notices" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Fee Due Card with Pay Now */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Fee Status</h3>
              <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-600">Overdue</Badge>
            </div>
            <div className="space-y-2">
              {childFees.map(fi => (
                <div key={fi.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{fi.headName}</p>
                    <p className="text-xs text-slate-400">Due: {fi.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">₹{fi.amount.toLocaleString('en-IN')}</p>
                    <Badge variant="outline" className={cn(
                      'text-[10px]',
                      fi.status === 'Paid' && 'border-emerald-200 text-emerald-600',
                      fi.status === 'Due' && 'border-amber-200 text-amber-600',
                      fi.status === 'Overdue' && 'border-rose-200 text-rose-600',
                    )}>{fi.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            {dueAmount > 0 && (
              <Button className="w-full mt-3 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/fees?action=pay')}>
                <CreditCard className="h-4 w-4" />
                Pay ₹{dueAmount.toLocaleString('en-IN')} Now
              </Button>
            )}
          </Card>

          {/* Recent Homework */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Recent Homework</h3>
              <Link href="/communication?tab=homework" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                View all <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="space-y-2">
              {childHomework.map(hw => (
                <Link key={hw.id} href="/communication?tab=homework">
                  <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-2.5 group transition-colors hover:bg-slate-50">
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      hw.submissions.submitted ? 'bg-emerald-50' : 'bg-amber-50'
                    )}>
                      <BookOpen className={cn('h-4 w-4', hw.submissions.submitted ? 'text-emerald-600' : 'text-amber-600')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{hw.title}</p>
                      <p className="text-xs text-slate-400">{hw.subject} · Due {hw.dueDate}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      'text-[10px] shrink-0',
                      hw.submissions.submitted ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600'
                    )}>
                      {hw.submissions.submitted ? 'Done' : 'Pending'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Bus Tracking Widget */}
          {childRoute ? (
            <Link href="/transport?tab=live-map">
              <Card className="p-4 group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">Bus Tracking</h3>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px] border-teal-200 text-teal-600">
                      <span className="mr-1 flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                      Live
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
                <div className="rounded-lg bg-teal-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="h-5 w-5 text-teal-600" />
                    <p className="text-sm font-semibold text-teal-800">{childRoute.name}</p>
                  </div>
                  <p className="text-xs text-teal-600 mb-3">{childRoute.vehicleNo} · {childRoute.progress}% on route</p>
                  <div className="h-2 w-full rounded-full bg-teal-100">
                    <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${childRoute.progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-teal-700">
                    <Clock className="h-3 w-3" />
                    <span>ETA to {child?.stopId === 'stop1' ? childRoute.stops[0].name : child?.stopId === 'stop2' ? childRoute.stops[1].name : childRoute.stops[2].name}: 15 min</span>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Notices</h3>
              <div className="space-y-2">
                {notices.slice(0, 3).map(n => (
                  <Link key={n.id} href="/communication?tab=notices">
                    <div className="rounded-lg border border-slate-100 p-2.5 group transition-colors hover:bg-slate-50">
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{n.title}</p>
                      <p className="text-xs text-slate-400">{n.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Latest Notices */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Latest Notices & Circulars</h3>
            <Link href="/communication?tab=notices" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
              View all <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {notices.map(n => (
              <Link key={n.id} href="/communication?tab=notices">
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 group transition-colors">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    n.priority === 'Urgent' && 'bg-rose-50 text-rose-600',
                    n.priority === 'Important' && 'bg-amber-50 text-amber-600',
                    n.priority === 'Normal' && 'bg-blue-50 text-blue-600',
                  )}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{n.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
