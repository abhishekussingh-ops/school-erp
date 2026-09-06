'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { CalendarDays, Download, AlertTriangle, UserCheck, Plus, RefreshCw } from 'lucide-react';
import { timetableSlots, classSections, staff, substitutes, getClassName } from '@/lib/mock-data';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = [1, 2, 3, 4, 5, 6];

export default function TimetablePage() {
  const { role } = useApp();
  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const [view, setView] = useState<'class' | 'teacher'>('class');
  const [selectedClass, setSelectedClass] = useState(classSections[0].id);
  const [selectedTeacher, setSelectedTeacher] = useState(staff[1].id);

  const classSlots = timetableSlots.filter(t => t.classSectionId === selectedClass);
  const teacherSlots = timetableSlots.filter(t => t.teacherId === selectedTeacher);

  // Conflict detection
  const conflicts: { day: string; period: number; teacherId: string; classes: string[] }[] = [];
  days.forEach(day => {
    periods.forEach(period => {
      const slots = timetableSlots.filter(t => t.day === day && t.period === period);
      const teacherSlots = slots.reduce((acc, s) => {
        if (!acc[s.teacherId]) acc[s.teacherId] = [];
        acc[s.teacherId].push(getClassName(s.classSectionId));
        return acc;
      }, {} as Record<string, string[]>);
      Object.entries(teacherSlots).forEach(([tid, classes]) => {
        if (classes.length > 1) conflicts.push({ day, period, teacherId: tid, classes });
      });
    });
  });

  const getSlot = (day: string, period: number, slots: typeof timetableSlots) => {
    return slots.find(s => s.day === day && s.period === period);
  };

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || '';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Timetable Builder"
        description="Weekly timetable with conflict detection and substitute management"
        icon={CalendarDays}
        iconColor="text-cyan-600"
        iconBg="bg-cyan-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></Button>
            {isAdmin && <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700"><Plus className="h-4 w-4" /> Add Slot</Button>}
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button onClick={() => setView('class')} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', view === 'class' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>Class View</button>
              <button onClick={() => setView('teacher')} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', view === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>Teacher View</button>
            </div>
            {view === 'class' ? (
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none">
                {classSections.map(c => <option key={c.id} value={c.id}>{c.className} {c.section}</option>)}
              </select>
            ) : (
              <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none">
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              {conflicts.length > 0 && (
                <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-600 gap-1">
                  <AlertTriangle className="h-3 w-3" /> {conflicts.length} conflicts detected
                </Badge>
              )}
              <Button size="sm" variant="outline" className="gap-2 text-xs"><RefreshCw className="h-3 w-3" /> Auto-generate</Button>
            </div>
          )}
        </div>

        {/* Timetable Grid */}
        <Card className="p-4 overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-slate-500 uppercase w-20">Period</th>
                {days.map(day => <th key={day} className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase">{day.slice(0, 3)}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period}>
                  <td className="px-2 py-2 text-xs font-semibold text-slate-400">P{period}</td>
                  {days.map(day => {
                    const slot = getSlot(day, period, view === 'class' ? classSlots : teacherSlots);
                    const hasConflict = conflicts.some(c => c.day === day && c.period === period && (view === 'teacher' ? c.teacherId === selectedTeacher : c.teacherId === slot?.teacherId));
                    return (
                      <td key={day} className="px-1 py-1">
                        {slot ? (
                          <div className={cn(
                            'rounded-lg p-2 text-center transition-all',
                            slot.isSpecial ? 'bg-cyan-50 border border-cyan-200' : 'bg-slate-50 border border-slate-200',
                            hasConflict && 'ring-2 ring-rose-400',
                            isAdmin && 'cursor-move hover:shadow-md'
                          )}>
                            <p className="text-xs font-semibold text-slate-800">{slot.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{view === 'class' ? getStaffName(slot.teacherId).split(' ')[0] : getClassName(slot.classSectionId)}</p>
                            <p className="text-[9px] text-slate-400">{slot.room}</p>
                            {hasConflict && <AlertTriangle className="h-3 w-3 text-rose-500 mx-auto mt-0.5" />}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-200 p-2 text-center text-xs text-slate-300 min-h-[56px] flex items-center justify-center">
                            {isAdmin ? '+ Add' : '—'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Substitute Assignments */}
        {isAdmin && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><UserCheck className="h-4 w-4 text-cyan-600" /> Substitute Teacher Assignments</h3>
            <div className="space-y-2">
              {substitutes.map(sub => {
                const cls = classSections.find(c => c.id === sub.classSectionId);
                const orig = staff.find(s => s.id === sub.originalTeacherId);
                const subst = staff.find(s => s.id === sub.substituteTeacherId);
                return (
                  <div key={sub.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><RefreshCw className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{sub.subject} · P{sub.period}</p>
                        <p className="text-xs text-slate-400">{cls?.className} {cls?.section} · {sub.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 line-through">{orig?.name}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-semibold text-cyan-600">{subst?.name}</span>
                    </div>
                  </div>
                );
              })}
              {substitutes.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No substitute assignments</p>}
            </div>
          </Card>
        )}

        {/* Conflict Details */}
        {isAdmin && conflicts.length > 0 && (
          <Card className="p-4 border-rose-200">
            <h3 className="text-sm font-semibold text-rose-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Conflict Warnings</h3>
            <div className="space-y-2">
              {conflicts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-rose-50 p-2.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                  <p className="text-sm text-rose-700"><span className="font-semibold">{getStaffName(c.teacherId)}</span> is double-booked on <span className="font-semibold">{c.day} P{c.period}</span> — teaching {c.classes.join(' & ')}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
