'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { CalendarCheck, Download, CheckCircle2, XCircle, Clock, AlertCircle, Fingerprint, ScanLine, Bell, FileText } from 'lucide-react';
import { students, classSections, attendanceRecords, staffAttendance, staff, leaveRequests, getClassName } from '@/lib/mock-data';

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  'Present': { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
  'Absent': { color: 'text-rose-600', bg: 'bg-rose-100', icon: XCircle },
  'Late': { color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  'Half-day': { color: 'text-blue-600', bg: 'bg-blue-100', icon: AlertCircle },
};

export default function AttendancePage() {
  const { role } = useApp();
  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const isParentOrStudent = role === 'parent' || role === 'student';
  const [selectedClass, setSelectedClass] = useState(classSections[0].id);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Half-day'>>({});
  const [tab, setTab] = useState<'mark' | 'staff' | 'reports' | 'leave'>('mark');

  const classStudents = students.filter(s => s.classSectionId === selectedClass);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAttendance = attendanceRecords.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const absentCount = todayAttendance.filter(a => a.status === 'Absent').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const schoolAttendancePct = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0;

  const toggleAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Half-day') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const all: Record<string, 'Present'> = {};
    classStudents.forEach(s => { all[s.id] = 'Present'; });
    setAttendance(all);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Smart Attendance"
        description="Daily attendance marking, leave management, and reports"
        icon={CalendarCheck}
        iconColor="text-violet-600"
        iconBg="bg-violet-50"
        actions={
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <Card className="p-3"><p className="text-xs text-slate-500">School Attendance</p><p className="text-xl font-bold text-violet-600">{schoolAttendancePct}%</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Present Today</p><p className="text-xl font-bold text-emerald-600">{presentCount}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Absent Today</p><p className="text-xl font-bold text-rose-600">{absentCount}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Late Today</p><p className="text-xl font-bold text-amber-600">{lateCount}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Staff Present</p><p className="text-xl font-bold text-slate-900">{staffAttendance.filter(s => s.status === 'Present').length}/{staff.length}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">On Leave</p><p className="text-xl font-bold text-blue-600">{leaveRequests.filter(l => l.status === 'Approved').length}</p></Card>
        </div>

        {/* Integration Placeholders */}
        {(isAdmin || isTeacher) && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><Fingerprint className="h-4 w-4 text-violet-500" /> Biometric Integration</div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><ScanLine className="h-4 w-4 text-violet-500" /> QR Code Attendance</div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><Bell className="h-4 w-4 text-violet-500" /> Auto-notify parents on absence</div>
          </div>
        )}

        {/* Tabs */}
        {(isAdmin || isTeacher) && (
          <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {([['mark', 'Mark Attendance'], ['staff', 'Staff Attendance'], ['reports', 'Reports'], ['leave', 'Leave Requests']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>{label}</button>
            ))}
          </div>
        )}

        {/* Mark Attendance */}
        {(isAdmin || isTeacher) && tab === 'mark' && (
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none">
                  {classSections.map(c => <option key={c.id} value={c.id}>{c.className} {c.section}</option>)}
                </select>
                <Badge variant="secondary" className="text-xs">{classStudents.length} students</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={markAllPresent} className="gap-2"><CheckCircle2 className="h-4 w-4" /> Mark All Present</Button>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-2"><CheckCircle2 className="h-4 w-4" /> Save Attendance</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {classStudents.map(s => {
                const status = attendance[s.id] || 'Present';
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                      <p className="text-xs text-slate-400">Roll #{s.rollNo}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {(['Present', 'Absent', 'Late', 'Half-day'] as const).map(st => {
                        const Icon = statusConfig[st].icon;
                        return (
                          <button key={st} onClick={() => toggleAttendance(s.id, st)} className={cn('rounded-md p-1.5 transition-colors', status === st ? statusConfig[st].bg : 'hover:bg-slate-100')} title={st}>
                            <Icon className={cn('h-4 w-4', status === st ? statusConfig[st].color : 'text-slate-300')} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Staff Attendance */}
        {(isAdmin || isTeacher) && tab === 'staff' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Staff Attendance - Today</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Staff</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Department</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Check In</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Check Out</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((s, i) => {
                    const sa = staffAttendance.find(a => a.staffId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{s.name}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{s.department}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{sa?.checkIn || '--'}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{sa?.checkOut || '--'}</td>
                        <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', sa?.status === 'Present' ? 'border-emerald-200 text-emerald-600' : sa?.status === 'Late' ? 'border-amber-200 text-amber-600' : 'border-slate-200 text-slate-500')}>{sa?.status || 'Absent'}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Reports */}
        {(isAdmin || isTeacher) && tab === 'reports' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Class-wise Attendance Summary</h3>
              <div className="space-y-2">
                {classSections.map(c => {
                  const cStudents = students.filter(s => s.classSectionId === c.id);
                  const cRecords = attendanceRecords.filter(a => cStudents.some(s => s.id === a.studentId) && a.date === todayStr);
                  const cPresent = cRecords.filter(a => a.status === 'Present').length;
                  const pct = cRecords.length > 0 ? Math.round((cPresent / cRecords.length) * 100) : 0;
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-slate-600">{c.className} {c.section}</div>
                      <div className="flex-1"><div className="h-6 w-full rounded-full bg-slate-100"><div className={cn('flex h-6 items-center rounded-full px-2 text-[10px] font-semibold text-white', pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${Math.max(pct, 10)}%` }}>{pct}%</div></div></div>
                      <div className="w-20 text-right text-xs text-slate-500">{cPresent}/{cRecords.length}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Monthly Calendar View</h3>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-semibold text-slate-400 pb-1">{d}</div>)}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  const isToday = day === 6;
                  const rand = (day * 7) % 10;
                  const bg = rand === 0 ? 'bg-rose-100 text-rose-600' : rand === 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-700';
                  return <div key={i} className={cn('flex h-8 items-center justify-center rounded-lg text-xs font-medium', bg, isToday && 'ring-2 ring-violet-400')}>{day}</div>;
                })}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-100" /> Present</div>
                <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-100" /> Late</div>
                <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-rose-100" /> Absent</div>
              </div>
            </Card>
          </div>
        )}

        {/* Leave Requests */}
        {(isAdmin || isTeacher) && tab === 'leave' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Staff Leave Requests</h3>
            <div className="space-y-2">
              {leaveRequests.map(lr => (
                <div key={lr.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{lr.staffName.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{lr.staffName}</p>
                      <p className="text-xs text-slate-400">{lr.type} · {lr.fromDate} to {lr.toDate} · {lr.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-[10px]', lr.status === 'Pending' ? 'border-amber-200 text-amber-600' : lr.status === 'Approved' ? 'border-emerald-200 text-emerald-600' : 'border-rose-200 text-rose-600')}>{lr.status}</Badge>
                    {lr.status === 'Pending' && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 hover:bg-emerald-50">Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 hover:bg-rose-50">Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Parent/Student View */}
        {isParentOrStudent && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">My Attendance Summary</h3>
              <div className="flex items-center justify-center py-4">
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="25.12" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">90%</span>
                    <span className="text-xs text-slate-400">Present</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="rounded-lg bg-emerald-50 p-2 text-center"><p className="text-lg font-bold text-emerald-600">18</p><p className="text-[10px] text-slate-500">Present</p></div>
                <div className="rounded-lg bg-amber-50 p-2 text-center"><p className="text-lg font-bold text-amber-600">1</p><p className="text-[10px] text-slate-500">Late</p></div>
                <div className="rounded-lg bg-rose-50 p-2 text-center"><p className="text-lg font-bold text-rose-600">1</p><p className="text-[10px] text-slate-500">Absent</p></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Monthly Calendar</h3>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-semibold text-slate-400 pb-1">{d}</div>)}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  const rand = (day * 7) % 10;
                  const bg = rand === 0 ? 'bg-rose-100 text-rose-600' : rand === 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-700';
                  return <div key={i} className={cn('flex h-8 items-center justify-center rounded-lg text-xs font-medium', bg)}>{day}</div>;
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
