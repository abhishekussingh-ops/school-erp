'use client';

import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from './kpi-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Clock, CalendarCheck, BookOpen, GraduationCap, FileText,
  Users, MapPin, AlertCircle,
} from 'lucide-react';
import { timetableSlots, homeworks, examTerms, staff, classSections, leaveRequests } from '@/lib/mock-data';

export function TeacherDashboard() {
  const today = new Date().toLocaleDateString('en', { weekday: 'long' });
  const teacher = staff.find(s => s.id === 's2');
  const todayClasses = timetableSlots.filter(t => t.day === today && t.teacherId === 's2');
  const pendingHomework = homeworks.filter(h => h.classSectionId === 'c1').length;
  const pendingMarks = examTerms.filter(e => e.status === 'Draft').length;
  const myLeave = leaveRequests.filter(l => l.staffId === 's2');

  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" description={`Welcome back, ${teacher?.name}`} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="Today's Classes" value={String(todayClasses.length)} change="6 periods scheduled" icon={Clock} iconColor="text-cyan-600" iconBg="bg-cyan-50" />
          <KpiCard label="Attendance Pending" value="2" change="Grade 6-A & 6-B" icon={CalendarCheck} iconColor="text-violet-600" iconBg="bg-violet-50" />
          <KpiCard label="Homework Due" value={String(pendingHomework)} change="Needs review" icon={BookOpen} iconColor="text-pink-600" iconBg="bg-pink-50" />
          <KpiCard label="Marks Entry Pending" value={String(pendingMarks)} change="Unit Test 1" icon={GraduationCap} iconColor="text-orange-600" iconBg="bg-orange-50" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Today's Timetable */}
          <Card className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Today's Timetable</h3>
                <p className="text-xs text-slate-500">{today}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{todayClasses.length} periods</Badge>
            </div>
            <div className="space-y-2">
              {todayClasses.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-slate-400">No classes scheduled today</div>
              ) : (
                todayClasses.map((slot) => {
                  const cls = classSections.find(c => c.id === slot.classSectionId);
                  return (
                    <div key={slot.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                        P{slot.period}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{slot.subject}</p>
                        <p className="text-xs text-slate-500">{cls?.className} {cls?.section} · Room {slot.room}</p>
                      </div>
                      {slot.isSpecial && (
                        <Badge variant="outline" className="text-[10px] border-cyan-200 text-cyan-600">{slot.room}</Badge>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Alerts & Leave */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Action Required</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-violet-50 p-3">
                  <AlertCircle className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Mark attendance for Grade 6-A</p>
                    <p className="text-xs text-slate-500">Due before 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3">
                  <GraduationCap className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Enter Unit Test 1 marks</p>
                    <p className="text-xs text-slate-500">Mathematics · Grade 6-A</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-pink-50 p-3">
                  <BookOpen className="h-4 w-4 text-pink-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Review homework submissions</p>
                    <p className="text-xs text-slate-500">3 submissions pending</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Leave Balance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{teacher?.leaveBalance}</p>
                  <p className="text-xs text-slate-500">days remaining</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              {myLeave.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {myLeave.map(l => (
                    <div key={l.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{l.type}</span>
                      <Badge variant="outline" className={cn(
                        'text-[10px]',
                        l.status === 'Pending' && 'border-amber-200 text-amber-600',
                        l.status === 'Approved' && 'border-emerald-200 text-emerald-600',
                        l.status === 'Rejected' && 'border-rose-200 text-rose-600',
                      )}>{l.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
