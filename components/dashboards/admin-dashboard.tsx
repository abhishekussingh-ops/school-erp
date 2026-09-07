'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from './kpi-card';
import { QuickActions, QuickAction } from './quick-actions';
import { ActivityFeed } from './activity-feed';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Users, UserCheck, CreditCard, UserPlus, GraduationCap, Bus,
  Plus, Send, DollarSign, CalendarCheck, Download, Calendar as CalIcon,
  TrendingUp, ChevronRight,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts';
import {
  students, staff, feeInstallments, enquiries, activities,
  feeCollectionTrend, attendanceTrend, admissionFunnel, classStrength,
  calendarEvents, notices,
} from '@/lib/mock-data';

const stageParamMap: Record<string, string> = {
  'New': 'new',
  'Contacted': 'contacted',
  'Visit': 'visit',
  'Applied': 'applied',
  'Verified': 'verified',
  'Admitted': 'admitted',
};

export function AdminDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = students.filter(s => {
    const seed = (s.id.charCodeAt(2)) % 10;
    return seed !== 0;
  }).length;
  const attendancePct = Math.round((presentToday / students.length) * 100);

  const collectedThisMonth = feeInstallments
    .filter(fi => fi.status === 'Paid' && fi.paidDate?.startsWith('2026-09'))
    .reduce((sum, fi) => sum + fi.amount, 0);
  const target = 2200000;

  const pendingEnquiries = enquiries.filter(e => !['Admitted', 'Rejected'].includes(e.status)).length;
  const busesRunning = 3;

  const activitiesWithHrefs = activities.map(a => {
    let href: string | undefined;
    if (a.type === 'payment') href = '/fees?tab=receipts';
    if (a.type === 'enquiry') href = '/admissions?tab=pipeline';
    if (a.type === 'leave') href = '/hr?tab=leaves';
    if (a.type === 'attendance') href = '/attendance?tab=students';
    if (a.type === 'notice') href = '/communication?tab=notices';
    if (a.type === 'admission') href = '/admissions?tab=list';
    return { ...a, href };
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="School overview and key metrics"
        actions={
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <KpiCard label="Total Students" value={String(students.length)} change="+8 this term" trend="up" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" href="/admissions?tab=list" />
          <KpiCard label="Total Staff" value={String(staff.length)} change="2 new hires" trend="up" icon={UserCheck} iconColor="text-indigo-600" iconBg="bg-indigo-50" href="/hr?tab=directory" />
          <KpiCard label="Attendance Today" value={`${attendancePct}%`} change={`${presentToday} present`} trend="up" icon={CalendarCheck} iconColor="text-violet-600" iconBg="bg-violet-50" href="/attendance?tab=students&date=today" />
          <KpiCard label="Fee Collected (Sep)" value={`₹${(collectedThisMonth / 100000).toFixed(1)}L`} change={`${Math.round((collectedThisMonth / target) * 100)}% of target`} trend="neutral" icon={CreditCard} iconColor="text-emerald-600" iconBg="bg-emerald-50" href="/fees?tab=receipts&filter=today" />
          <KpiCard label="Pending Enquiries" value={String(pendingEnquiries)} change="3 need follow-up" trend="down" icon={UserPlus} iconColor="text-blue-600" iconBg="bg-blue-50" href="/admissions?tab=pipeline" />
          <KpiCard label="Buses Running" value={`${busesRunning}/3`} change="All on time" trend="up" icon={Bus} iconColor="text-teal-600" iconBg="bg-teal-50" href="/transport?tab=live-map" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Fee Collection Trend */}
          <Card className="p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Fee Collection Trend</h3>
                <p className="text-xs text-slate-500">Monthly collection vs target</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600">+12% YoY</span>
                </Badge>
                <Link href="/fees?tab=reports" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                  View Report <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={feeCollectionTrend}>
                <defs>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#feeGrad)" name="Collected" />
                <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5 5" name="Target" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Class-wise Strength Donut */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-800">Class-wise Strength</h3>
              <Link href="/admissions?tab=list" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-2">Student distribution by grade</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={classStrength} dataKey="students" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {classStrength.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Attendance Trend */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-800">Attendance Trend</h3>
              <Link href="/attendance?tab=students" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-2">Present vs absent this week</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="present" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} name="Present" />
                <Bar dataKey="absent" stackId="a" fill="#fde68a" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Admission Funnel */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-800">Admission Funnel</h3>
              <Link href="/admissions?tab=pipeline" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-2">Enquiry to admission conversion</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={admissionFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Enquiries" cursor="pointer">
                  {admissionFunnel.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Calendar Widget */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalIcon className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-800">Upcoming Events</h3>
            </div>
            <div className="space-y-2">
              {calendarEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                  <div className={cn(
                    'flex h-9 w-9 flex-col items-center justify-center rounded-lg text-center',
                    ev.type === 'Holiday' && 'bg-rose-50 text-rose-600',
                    ev.type === 'Exam' && 'bg-orange-50 text-orange-600',
                    ev.type === 'Event' && 'bg-blue-50 text-blue-600',
                  )}>
                    <span className="text-[9px] font-medium uppercase">{new Date(ev.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="text-sm font-bold leading-none">{new Date(ev.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{ev.title}</p>
                    <Badge variant="outline" className={cn(
                      'mt-0.5 text-[10px]',
                      ev.type === 'Holiday' && 'border-rose-200 text-rose-600',
                      ev.type === 'Exam' && 'border-orange-200 text-orange-600',
                      ev.type === 'Event' && 'border-blue-200 text-blue-600',
                    )}>
                      {ev.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row: Activity + Quick Actions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed activities={activitiesWithHrefs} />
          </div>
          <div className="space-y-4">
            <QuickActions>
              <QuickAction label="Add Student" icon={Plus} iconColor="text-blue-600" iconBg="bg-blue-50" href="/admissions?action=new-enquiry" />
              <QuickAction label="Send Notice" icon={Send} iconColor="text-pink-600" iconBg="bg-pink-50" href="/communication?tab=notices&action=create" />
              <QuickAction label="Collect Fee" icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-50" href="/fees?tab=ledger&action=collect" />
              <QuickAction label="Mark Attendance" icon={CalendarCheck} iconColor="text-violet-600" iconBg="bg-violet-50" href="/attendance?tab=students" />
            </QuickActions>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Latest Notices</h3>
                <Link href="/communication?tab=notices" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 group">
                  View all <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="space-y-2">
                {notices.slice(0, 3).map(n => (
                  <Link key={n.id} href="/communication?tab=notices">
                    <div className="rounded-lg border border-slate-100 p-2.5 group transition-colors hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700 line-clamp-1">{n.title}</p>
                        <Badge variant="outline" className={cn(
                          'text-[10px] ml-2 shrink-0',
                          n.priority === 'Urgent' && 'border-rose-200 text-rose-600',
                          n.priority === 'Important' && 'border-amber-200 text-amber-600',
                          n.priority === 'Normal' && 'border-slate-200 text-slate-500',
                        )}>
                          {n.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{n.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
