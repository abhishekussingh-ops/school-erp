'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Settings, Building2, Calendar, Shield, Bell, Save, GraduationCap } from 'lucide-react';
import { branches, roles } from '@/lib/mock-data';

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'academic' | 'roles' | 'notifications'>('profile');
  const [notifPrefs, setNotifPrefs] = useState({
    feeReminders: true,
    attendanceAlerts: true,
    examResults: true,
    noticeBoard: true,
    whatsapp: false,
    sms: true,
    email: true,
    push: true,
  });

  const toggleNotif = (key: keyof typeof notifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        description="School profile, academic year, roles, and notification preferences"
        icon={Settings}
        iconColor="text-slate-600"
        iconBg="bg-slate-100"
        actions={
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Changes</span>
          </Button>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {([['profile', 'School Profile', Building2], ['academic', 'Academic Year', Calendar], ['roles', 'Roles & Permissions', Shield], ['notifications', 'Notifications', Bell]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} className={cn('flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* School Profile */}
        {tab === 'profile' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" /> School Information</h3>
              <div className="space-y-3">
                <div><Label className="text-xs text-slate-600">School Name</Label><Input defaultValue="Lovedale School" className="mt-1" /></div>
                <div><Label className="text-xs text-slate-600">Affiliation Board</Label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none"><option>CBSE</option><option>ICSE</option><option>State Board</option><option>IB</option></select></div>
                <div><Label className="text-xs text-slate-600">School Code</Label><Input defaultValue="LVD2026" className="mt-1" /></div>
                <div><Label className="text-xs text-slate-600">Phone</Label><Input defaultValue="+91 80 2345 6789" className="mt-1" /></div>
                <div><Label className="text-xs text-slate-600">Email</Label><Input defaultValue="info@lovedale.edu" className="mt-1" /></div>
                <div><Label className="text-xs text-slate-600">Website</Label><Input defaultValue="www.lovedale.edu" className="mt-1" /></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" /> Branches</h3>
              <div className="space-y-2">
                {branches.map(b => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-500">{b.location}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full gap-2 mt-2"><Building2 className="h-4 w-4" /> Add Branch</Button>
              </div>
              <div className="mt-4 space-y-3">
                <div><Label className="text-xs text-slate-600">Address</Label><Input defaultValue="MG Road, Bangalore, Karnataka 560001" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-600">City</Label><Input defaultValue="Bangalore" className="mt-1" /></div>
                  <div><Label className="text-xs text-slate-600">PIN Code</Label><Input defaultValue="560001" className="mt-1" /></div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Academic Year */}
        {tab === 'academic' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> Academic Year Setup</h3>
              <div className="space-y-3">
                <div><Label className="text-xs text-slate-600">Academic Year</Label><Input defaultValue="2026-2027" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-600">Start Date</Label><Input type="date" defaultValue="2026-06-01" className="mt-1" /></div>
                  <div><Label className="text-xs text-slate-600">End Date</Label><Input type="date" defaultValue="2027-03-31" className="mt-1" /></div>
                </div>
                <div><Label className="text-xs text-slate-600">Current Term</Label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none"><option>Term 1</option><option>Term 2</option><option>Term 3</option></select></div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-600">Terms & Exams</p>
                {[
                  { name: 'Term 1 (Jun-Sep)', exams: 'Unit Test 1, Mid-Term' },
                  { name: 'Term 2 (Oct-Dec)', exams: 'Unit Test 2' },
                  { name: 'Term 3 (Jan-Mar)', exams: 'Final Exam' },
                ].map(t => (
                  <div key={t.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                    <div><p className="text-sm font-medium text-slate-700">{t.name}</p><p className="text-xs text-slate-400">Exams: {t.exams}</p></div>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-slate-500" /> Grading System</h3>
              <div className="space-y-2">
                {[
                  { grade: 'A+', range: '90-100%', color: 'border-emerald-200 text-emerald-600' },
                  { grade: 'A', range: '80-89%', color: 'border-emerald-200 text-emerald-600' },
                  { grade: 'B+', range: '70-79%', color: 'border-blue-200 text-blue-600' },
                  { grade: 'B', range: '60-69%', color: 'border-blue-200 text-blue-600' },
                  { grade: 'C', range: '50-59%', color: 'border-amber-200 text-amber-600' },
                  { grade: 'D', range: 'Below 50%', color: 'border-rose-200 text-rose-600' },
                ].map(g => (
                  <div key={g.grade} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                    <span className="text-sm font-medium text-slate-700">Grade {g.grade}</span>
                    <Badge variant="outline" className={cn('text-[10px]', g.color)}>{g.range}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div><Label className="text-xs text-slate-600">Passing Percentage</Label><Input type="number" defaultValue="40" className="mt-1" /></div>
                <div><Label className="text-xs text-slate-600">Max Marks (Default)</Label><Input type="number" defaultValue="50" className="mt-1" /></div>
              </div>
            </Card>
          </div>
        )}

        {/* Roles & Permissions */}
        {tab === 'roles' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-slate-500" /> Role-Based Access Control</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Description</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Dashboard</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Admissions</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Fees</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Attendance</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Exams</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">HR</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Transport</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map(r => {
                    const perms: Record<string, Record<string, boolean>> = {
                      super_admin: { Dashboard: true, Admissions: true, Fees: true, Attendance: true, Exams: true, HR: true, Transport: true, Settings: true },
                      school_admin: { Dashboard: true, Admissions: true, Fees: true, Attendance: true, Exams: true, HR: true, Transport: true, Settings: true },
                      teacher: { Dashboard: true, Admissions: false, Fees: false, Attendance: true, Exams: true, HR: false, Transport: false, Settings: false },
                      parent: { Dashboard: true, Admissions: false, Fees: true, Attendance: true, Exams: true, HR: false, Transport: true, Settings: false },
                      student: { Dashboard: true, Admissions: false, Fees: true, Attendance: true, Exams: true, HR: false, Transport: true, Settings: false },
                    };
                    const p = perms[r.id];
                    return (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-800">{r.label}</td>
                        <td className="px-3 py-2.5 text-xs text-slate-500">{r.description}</td>
                        {Object.keys(p).map(key => (
                          <td key={key} className="px-3 py-2.5 text-center">
                            {p[key] ? (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs">&#10003;</span>
                            ) : (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-300 text-xs">&#10005;</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Notifications */}
        {tab === 'notifications' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Bell className="h-4 w-4 text-slate-500" /> Notification Types</h3>
              <div className="space-y-3">
                {([
                  ['feeReminders', 'Fee Reminders', 'Send reminders for upcoming and overdue fees'],
                  ['attendanceAlerts', 'Attendance Alerts', 'Notify parents when student is marked absent'],
                  ['examResults', 'Exam Results', 'Notify when exam results are published'],
                  ['noticeBoard', 'Notice Board', 'Send new notices and circulars'],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div><p className="text-sm font-medium text-slate-800">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
                    <Switch checked={notifPrefs[key]} onCheckedChange={() => toggleNotif(key)} />
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Bell className="h-4 w-4 text-slate-500" /> Delivery Channels</h3>
              <div className="space-y-3">
                {([
                  ['push', 'Push Notifications', 'In-app push notifications'],
                  ['email', 'Email', 'Send notifications via email'],
                  ['sms', 'SMS', 'Send text message alerts'],
                  ['whatsapp', 'WhatsApp Business', 'Send via WhatsApp Business API'],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div><p className="text-sm font-medium text-slate-800">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
                    <Switch checked={notifPrefs[key]} onCheckedChange={() => toggleNotif(key)} />
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700"><span className="font-semibold">Note:</span> WhatsApp Business API requires account setup. SMS credits are consumed per message sent. Configure API keys in the integration settings.</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
