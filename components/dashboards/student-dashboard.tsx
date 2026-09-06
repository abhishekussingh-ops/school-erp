'use client';

import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from './kpi-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CalendarCheck, BookOpen, GraduationCap, Bus, Clock, MapPin,
} from 'lucide-react';
import {
  students, homeworks, examTerms, transportRoutes, attendanceRecords,
  classSections, timetableSlots,
} from '@/lib/mock-data';

export function StudentDashboard() {
  const student = students.find(s => s.id === 'st1');
  const cls = classSections.find(c => c.id === student?.classSectionId);
  const today = new Date().toLocaleDateString('en', { weekday: 'long' });
  const todayTimetable = timetableSlots.filter(t => t.classSectionId === student?.classSectionId && t.day === today);

  const myAttendance = attendanceRecords.filter(a => a.studentId === student?.id);
  const presentCount = myAttendance.filter(a => a.status === 'Present').length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const myHomework = homeworks.filter(h => h.classSectionId === student?.classSectionId);
  const pendingHomework = myHomework.filter(h => !h.submissions.submitted);
  const myRoute = transportRoutes.find(r => r.id === student?.routeId);

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Dashboard" description={`${student?.name} · ${cls?.className} ${cls?.section} · Roll No ${student?.rollNo}`} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="My Attendance" value={`${attendancePct}%`} change={`${presentCount}/${myAttendance.length} days present`} trend={attendancePct >= 90 ? 'up' : 'down'} icon={CalendarCheck} iconColor="text-violet-600" iconBg="bg-violet-50" />
          <KpiCard label="Homework Due" value={String(pendingHomework.length)} change={`of ${myHomework.length} assigned`} icon={BookOpen} iconColor="text-pink-600" iconBg="bg-pink-50" />
          <KpiCard label="Upcoming Exams" value="1" change="Unit Test 1 · Sep 20" icon={GraduationCap} iconColor="text-orange-600" iconBg="bg-orange-50" />
          <KpiCard label="Bus Status" value={myRoute ? 'On Time' : 'N/A'} change={myRoute ? `${myRoute.progress}% on route` : 'Not assigned'} trend={myRoute ? 'up' : 'neutral'} icon={Bus} iconColor="text-teal-600" iconBg="bg-teal-50" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Today's Timetable */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Today's Schedule</h3>
              <Badge variant="secondary" className="text-xs">{today}</Badge>
            </div>
            <div className="space-y-2">
              {todayTimetable.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-slate-400">No classes today</div>
              ) : (
                todayTimetable.map(slot => (
                  <div key={slot.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                      P{slot.period}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{slot.subject}</p>
                      <p className="text-xs text-slate-500">Room {slot.room}</p>
                    </div>
                    {slot.isSpecial && (
                      <Badge variant="outline" className="text-[10px] border-cyan-200 text-cyan-600">{slot.room}</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Homework */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">My Homework</h3>
            <div className="space-y-2">
              {myHomework.map(hw => (
                <div key={hw.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    hw.submissions.submitted ? 'bg-emerald-50' : 'bg-amber-50'
                  )}>
                    <BookOpen className={cn('h-4 w-4', hw.submissions.submitted ? 'text-emerald-600' : 'text-amber-600')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{hw.title}</p>
                    <p className="text-xs text-slate-400">{hw.subject} · Due {hw.dueDate}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    'text-[10px] shrink-0',
                    hw.submissions.submitted ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600'
                  )}>
                    {hw.submissions.submitted ? 'Done' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bus tracking */}
        {myRoute && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">My Bus Tracking</h3>
              <Badge variant="outline" className="text-[10px] border-teal-200 text-teal-600">
                <span className="mr-1 flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                Live
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-teal-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bus className="h-4 w-4 text-teal-600" />
                  <p className="text-sm font-semibold text-teal-800">{myRoute.name}</p>
                </div>
                <p className="text-xs text-teal-600">{myRoute.vehicleNo}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-700">ETA: 15 min</p>
                </div>
                <p className="text-xs text-slate-500">To your stop</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-700">{myRoute.progress}%</p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-teal-500" style={{ width: `${myRoute.progress}%` }} />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
