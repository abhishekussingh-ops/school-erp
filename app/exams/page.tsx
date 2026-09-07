'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { GraduationCap, Download, Plus, FileText, Eye, EyeOff, Award, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { examTerms, examSubjects, examMarks, reportCards, students, classSections, getClassName } from '@/lib/mock-data';

export default function ExamsPage() {
  const { role } = useApp();
  const searchParams = useSearchParams();
  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const isParentOrStudent = role === 'parent' || role === 'student';
  const [tab, setTab] = useState<'setup' | 'marks' | 'results' | 'analytics'>('setup');
  const [selectedTerm, setSelectedTerm] = useState(examTerms[0].id);
  const [selectedClass, setSelectedClass] = useState(classSections[0].id);

  useEffect(() => {
    const qTab = searchParams.get('tab');
    const qExam = searchParams.get('exam');
    if (qTab === 'marks') setTab('marks');
    else if (qTab === 'datesheet' || qTab === 'setup') setTab('setup');
    else if (qTab === 'reports' || qTab === 'results') setTab('results');
    else if (qTab === 'analytics') setTab('analytics');
    if (qExam) {
      const match = examTerms.find(t => t.id === qExam || t.name === qExam);
      if (match) setSelectedTerm(match.id);
    }
  }, [searchParams]);

  const termSubjects = examSubjects.filter(es => es.termId === selectedTerm && es.classSectionId === selectedClass);
  const classStudents = students.filter(s => s.classSectionId === selectedClass);

  const subjectAverages = termSubjects.map(sub => {
    const marks = examMarks.filter(m => m.subjectId === sub.id);
    const avg = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + m.marks, 0) / marks.length) : 0;
    return { subject: sub.subject, average: avg, max: sub.maxMarks };
  });

  const progressData = [
    { term: 'UT1', percentage: 72 },
    { term: 'Mid-Term', percentage: 78 },
    { term: 'Final', percentage: 85 },
  ];

  const topPerformers = [...classStudents].map((s, i) => {
    const marks = examMarks.filter(m => m.studentId === s.id);
    const total = marks.reduce((sum, m) => sum + m.marks, 0);
    return { name: s.name, total, percentage: Math.round((total / (marks.length * 50)) * 100) };
  }).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Exams & Results"
        description="Exam setup, marks entry, report cards, and performance analytics"
        icon={GraduationCap}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></Button>
            {isAdmin && <Button size="sm" className="gap-2 bg-orange-600 hover:bg-orange-700"><Plus className="h-4 w-4" /> New Exam</Button>}
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* Exam Terms */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {examTerms.map(term => (
            <Card key={term.id} className={cn('p-4 cursor-pointer transition-all', selectedTerm === term.id ? 'border-orange-400 ring-1 ring-orange-200' : 'hover:border-slate-300')} onClick={() => setSelectedTerm(term.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{term.name}</p>
                  <p className="text-xs text-slate-500">{term.startDate} → {term.endDate}</p>
                </div>
                <Badge variant="outline" className={cn('text-[10px]', term.status === 'Draft' ? 'border-amber-200 text-amber-600' : 'border-emerald-200 text-emerald-600')}>{term.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                <span>{examSubjects.filter(es => es.termId === term.id).length} subjects scheduled</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        {(isAdmin || isTeacher) && (
          <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {([['setup', 'Exam Setup'], ['marks', 'Marks Entry'], ['results', 'Report Cards'], ['analytics', 'Analytics']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>{label}</button>
            ))}
          </div>
        )}

        {/* Exam Setup / Datesheet */}
        {((isAdmin || isTeacher) && tab === 'setup') || isParentOrStudent ? (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Exam Schedule / Datesheet</h3>
              {(isAdmin || isTeacher) && <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none">
                {classSections.map(c => <option key={c.id} value={c.id}>{c.className} {c.section}</option>)}
              </select>}
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Max Marks</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Weightage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {termSubjects.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{sub.subject}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{sub.date}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{sub.maxMarks}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{sub.weightage}%</td>
                    </tr>
                  ))}
                  {termSubjects.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-sm text-slate-400">No subjects scheduled for this class yet</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        ) : null}

        {/* Marks Entry */}
        {(isAdmin || isTeacher) && tab === 'marks' && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Marks Entry</h3>
              <div className="flex items-center gap-2">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none">
                  {classSections.map(c => <option key={c.id} value={c.id}>{c.className} {c.section}</option>)}
                </select>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Save Marks</Button>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                    {termSubjects.map(sub => <th key={sub.id} className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">{sub.subject.slice(0, 4)}<br /><span className="text-[9px] font-normal text-slate-400">/{sub.maxMarks}</span></th>)}
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Total</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map(s => {
                    const marks = examMarks.filter(m => m.studentId === s.id);
                    const total = marks.reduce((sum, m) => sum + m.marks, 0);
                    const maxTotal = termSubjects.reduce((sum, sub) => sum + sub.maxMarks, 0) || 250;
                    const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
                    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'D';
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-sm font-medium text-slate-800">{s.name}</td>
                        {termSubjects.map(sub => {
                          const mark = marks.find(m => m.subjectId === sub.id);
                          return <td key={sub.id} className="px-3 py-2 text-center"><input type="number" defaultValue={mark?.marks || ''} max={sub.maxMarks} className="w-12 rounded border border-slate-200 px-1 py-0.5 text-center text-sm focus:border-orange-400 focus:outline-none" /></td>;
                        })}
                        <td className="px-3 py-2 text-center text-sm font-semibold text-slate-800">{total}/{maxTotal}</td>
                        <td className="px-3 py-2 text-center"><Badge variant="outline" className={cn('text-[10px]', pct >= 60 ? 'border-emerald-200 text-emerald-600' : 'border-rose-200 text-rose-600')}>{grade}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Report Cards */}
        {(isAdmin || isTeacher) && tab === 'results' && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Report Cards & Publishing Control</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2 text-xs"><EyeOff className="h-3 w-3" /> Unpublish All</Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 gap-2"><Eye className="h-3 w-3" /> Publish Results</Button>
              </div>
            </div>
            <div className="space-y-2">
              {reportCards.map(rc => {
                const student = students.find(s => s.id === rc.studentId);
                return (
                  <div key={rc.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{student?.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{student?.name}</p>
                        <p className="text-xs text-slate-400">{student ? getClassName(student.classSectionId) : ''} · Rank #{rc.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{rc.percentage}%</p>
                        <p className="text-xs text-slate-400">Grade: {rc.grade} · {rc.result}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px]', rc.status === 'Draft' ? 'border-amber-200 text-amber-600' : 'border-emerald-200 text-emerald-600')}>{rc.status}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1"><FileText className="h-3 w-3" /> PDF</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Analytics */}
        {(isAdmin || isTeacher) && tab === 'analytics' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Subject-wise Class Average</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="average" fill="#f97316" radius={[4, 4, 0, 0]} name="Average Marks" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Term-over-Term Progress</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="term" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Line type="monotone" dataKey="percentage" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /> Top Performers</h3>
              <div className="space-y-2">
                {topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500')}>{i + 1}</div>
                    <span className="flex-1 text-sm font-medium text-slate-800">{p.name}</span>
                    <span className="text-sm font-semibold text-slate-700">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-rose-500" /> Weak Area Analysis</h3>
              <div className="space-y-2">
                {subjectAverages.sort((a, b) => a.average - b.average).slice(0, 3).map(sub => (
                  <div key={sub.subject} className="flex items-center gap-3">
                    <span className="w-28 text-sm text-slate-600">{sub.subject}</span>
                    <div className="flex-1"><div className="h-6 w-full rounded-full bg-slate-100"><div className={cn('flex h-6 items-center rounded-full px-2 text-[10px] font-semibold text-white', sub.average < 40 ? 'bg-rose-500' : 'bg-amber-500')} style={{ width: `${Math.max((sub.average / sub.max) * 100, 15)}%` }}>{sub.average}/{sub.max}</div></div></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Parent/Student: My Results */}
        {isParentOrStudent && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">My Performance</h3>
              <div className="space-y-2">
                {examMarks.filter(m => m.studentId === 'st1').map(m => {
                  const sub = examSubjects.find(es => es.id === m.subjectId);
                  return (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                      <span className="text-sm text-slate-700">{sub?.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{m.marks}/{sub?.maxMarks}</span>
                        <Badge variant="outline" className={cn('text-[10px]', m.grade === 'A' ? 'border-emerald-200 text-emerald-600' : m.grade === 'B' ? 'border-amber-200 text-amber-600' : 'border-rose-200 text-rose-600')}>{m.grade}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Progress Over Terms</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="term" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Line type="monotone" dataKey="percentage" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Digital Report Card</h3>
                <Button size="sm" variant="outline" className="gap-2"><Download className="h-3 w-3" /> Download PDF</Button>
              </div>
              <div className="rounded-lg border-2 border-slate-200 p-4">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h2 className="text-lg font-bold text-slate-900">Lovedale School</h2>
                  <p className="text-xs text-slate-500">Unit Test 1 · Academic Year 2026-2027</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">Arjun Nair</span></div>
                  <div><span className="text-slate-500">Class:</span> <span className="font-semibold text-slate-800">Grade 6 A</span></div>
                  <div><span className="text-slate-500">Roll No:</span> <span className="font-semibold text-slate-800">1</span></div>
                  <div><span className="text-slate-500">Attendance:</span> <span className="font-semibold text-slate-800">90%</span></div>
                </div>
                <div className="mt-3 space-y-1">
                  {examMarks.filter(m => m.studentId === 'st1').map(m => {
                    const sub = examSubjects.find(es => es.id === m.subjectId);
                    return <div key={m.id} className="flex justify-between text-sm border-b border-slate-100 py-1"><span className="text-slate-600">{sub?.subject}</span><span className="font-semibold text-slate-800">{m.marks}/{sub?.maxMarks} ({m.grade})</span></div>;
                  })}
                </div>
                <div className="mt-3 flex justify-between text-sm font-bold"><span>Total: 165/250 (66%)</span><span>Grade: B · Pass</span></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
