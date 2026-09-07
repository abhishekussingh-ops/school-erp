'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, Download, Plus, FileText, Cake, Award, DollarSign, Briefcase, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { staff, payrollRecords, leaveRequests, staffAttendance } from '@/lib/mock-data';

export default function HRPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'directory' | 'payroll' | 'leave' | 'reports'>('directory');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  useEffect(() => {
    const qTab = searchParams.get('tab');
    const qStatus = searchParams.get('status');
    if (qTab === 'directory') setTab('directory');
    else if (qTab === 'payroll') setTab('payroll');
    else if (qTab === 'leaves' || qTab === 'leave') setTab('leave');
    else if (qTab === 'reports') setTab('reports');
    if (qStatus === 'pending_approval' || qStatus === 'pending') setTab('leave');
  }, [searchParams]);

  const totalSalary = staff.reduce((s, st) => s + st.salary, 0);
  const departments = Array.from(new Set(staff.map(s => s.department)));
  const deptCount = departments.map(d => ({ dept: d, count: staff.filter(s => s.department === d).length }));

  const selectedMember = staff.find(s => s.id === selectedStaff);
  const upcomingBirthdays = staff.filter(s => {
    const today = new Date();
    const dob = new Date(s.joiningDate);
    return Math.abs(dob.getDate() - today.getDate()) <= 7;
  }).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Staff & HR Management"
        description="Staff directory, payroll, leave management, and HR reports"
        icon={Users}
        iconColor="text-indigo-600"
        iconBg="bg-indigo-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></Button>
            <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700"><Plus className="h-4 w-4" /> Add Staff</Button>
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-3"><p className="text-xs text-slate-500">Total Staff</p><p className="text-xl font-bold text-indigo-600">{staff.length}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Monthly Payroll</p><p className="text-xl font-bold text-slate-900">₹{(totalSalary / 100000).toFixed(1)}L</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Departments</p><p className="text-xl font-bold text-slate-900">{departments.length}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Pending Leaves</p><p className="text-xl font-bold text-amber-600">{leaveRequests.filter(l => l.status === 'Pending').length}</p></Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {([['directory', 'Staff Directory'], ['payroll', 'Payroll'], ['leave', 'Leave Management'], ['reports', 'HR Reports']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>{label}</button>
          ))}
        </div>

        {/* Staff Directory */}
        {tab === 'directory' && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {staff.map(s => (
              <Card key={s.id} className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedStaff(s.id)}>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{s.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.designation}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[10px]">{s.department}</Badge>
                      <Badge variant="outline" className="text-[10px]">{s.employmentType}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{s.employeeId}</span>
                  <span>Joined {s.joiningDate}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Payroll */}
        {tab === 'payroll' && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Payroll - September 2026</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2 text-xs"><FileText className="h-3 w-3" /> Run Payroll</Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-xs"><DollarSign className="h-3 w-3" /> Pay All</Button>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Staff</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Basic</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Allowances</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Deductions</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Net Pay</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrollRecords.map(pr => {
                    const s = staff.find(st => st.id === pr.staffId);
                    return (
                      <tr key={pr.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{s?.name}</td>
                        <td className="px-3 py-2.5 text-right text-sm text-slate-600">₹{pr.basic.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-right text-sm text-emerald-600">+₹{pr.allowances.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-right text-sm text-rose-600">-₹{pr.deductions.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-right text-sm font-bold text-slate-800">₹{pr.net.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-center"><Badge variant="outline" className={cn('text-[10px]', pr.status === 'Paid' ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600')}>{pr.status}</Badge></td>
                        <td className="px-3 py-2.5"><Button size="sm" variant="ghost" className="h-7 text-xs gap-1"><FileText className="h-3 w-3" /> Payslip</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Leave Management */}
        {tab === 'leave' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Leave Requests</h3>
              <div className="space-y-2">
                {leaveRequests.map(lr => (
                  <div key={lr.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{lr.staffName}</p>
                      <Badge variant="outline" className={cn('text-[10px]', lr.status === 'Pending' ? 'border-amber-200 text-amber-600' : lr.status === 'Approved' ? 'border-emerald-200 text-emerald-600' : 'border-rose-200 text-rose-600')}>{lr.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{lr.type} · {lr.fromDate} to {lr.toDate}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Reason: {lr.reason}</p>
                    {lr.status === 'Pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 hover:bg-emerald-50">Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 hover:bg-rose-50">Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Leave Balances</h3>
              <div className="space-y-2">
                {staff.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                    <span className="text-sm text-slate-700">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(s.leaveBalance / 20) * 100}%` }} /></div>
                      <span className="text-sm font-semibold text-slate-800 w-8 text-right">{s.leaveBalance}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* HR Reports */}
        {tab === 'reports' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Department-wise Headcount</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptCount}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Cake className="h-4 w-4 text-pink-500" /> Upcoming Birthdays & Anniversaries</h3>
              <div className="space-y-2">
                {staff.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50"><Cake className="h-4 w-4 text-pink-500" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">Work Anniversary · {s.joiningDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Staff Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedStaff(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">{selectedMember.avatar}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{selectedMember.name}</h3>
                <p className="text-sm text-slate-500">{selectedMember.designation} · {selectedMember.department}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-[10px]">{selectedMember.employeeId}</Badge>
                  <Badge variant="outline" className="text-[10px]">{selectedMember.employmentType}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">Qualification</p><p className="font-medium text-slate-700">{selectedMember.qualification}</p></div>
              <div><p className="text-xs text-slate-400">Joining Date</p><p className="font-medium text-slate-700">{selectedMember.joiningDate}</p></div>
              <div><p className="text-xs text-slate-400">Phone</p><p className="font-medium text-slate-700">{selectedMember.phone}</p></div>
              <div><p className="text-xs text-slate-400">Email</p><p className="font-medium text-slate-700 truncate">{selectedMember.email}</p></div>
              <div><p className="text-xs text-slate-400">Blood Group</p><p className="font-medium text-slate-700">{selectedMember.bloodGroup}</p></div>
              <div><p className="text-xs text-slate-400">Address</p><p className="font-medium text-slate-700">{selectedMember.address}</p></div>
              {selectedMember.subjects.length > 0 && <div className="col-span-2"><p className="text-xs text-slate-400">Subjects</p><div className="flex flex-wrap gap-1 mt-1">{selectedMember.subjects.map(sub => <Badge key={sub} variant="secondary" className="text-[10px]">{sub}</Badge>)}</div></div>}
              <div><p className="text-xs text-slate-400">Salary</p><p className="font-medium text-slate-700">₹{selectedMember.salary.toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs text-slate-400">Leave Balance</p><p className="font-medium text-slate-700">{selectedMember.leaveBalance} days</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-2"><Briefcase className="h-4 w-4" /> Documents</Button>
              <Button size="sm" variant="outline" className="flex-1 gap-2"><Award className="h-4 w-4" /> Appraisal</Button>
              <Button size="sm" variant="outline" className="flex-1 gap-2"><GraduationCap className="h-4 w-4" /> Certificates</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
