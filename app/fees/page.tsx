'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { CreditCard, Download, Plus, DollarSign, TrendingUp, AlertCircle, FileText, Send } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  feeHeads, feeReceipts,
} from '@/lib/mock-data';
import { PaymentDialog } from '@/components/fees/payment-dialog';
import { getFees } from './actions';

const statusColors: Record<string, string> = {
  'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Due': 'bg-amber-100 text-amber-700 border-amber-200',
  'Overdue': 'bg-rose-100 text-rose-700 border-rose-200',
};

const modeBreakdown = [
  { mode: 'Online', amount: 845000, fill: '#10b981' },
  { mode: 'UPI', amount: 620000, fill: '#3b82f6' },
  { mode: 'Cash', amount: 380000, fill: '#f59e0b' },
  { mode: 'Card', amount: 295000, fill: '#8b5cf6' },
];

export default function FeesPage() {
  const { role, currentUser } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [tab, setTab] = useState<'collection' | 'structure' | 'ledger' | 'receipts' | 'reports'>('collection');
  
  // Real database state
  const [dbFees, setDbFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getFees("greenwood");
      setDbFees(data || []);
    } catch (e) {
      console.error("Failed to load fees:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map database rows to UI fee installment structure
  const feeInstallments = dbFees.map((f) => ({
    id: f.id,
    studentId: f.studentId,
    studentName: f.student?.name || 'Unknown Student',
    className: `${f.student?.grade || ''} ${f.student?.section || ''}`.trim(),
    headName: f.title,
    amount: Number(f.amount),
    dueDate: f.dueDate ? new Date(f.dueDate).toISOString().split('T')[0] : '',
    paidDate: f.status === 'PAID' ? new Date(f.createdAt).toISOString().split('T')[0] : undefined,
    status: f.status === 'PAID' ? 'Paid' : f.status === 'OVERDUE' ? 'Overdue' : 'Due',
  }));

  // Dynamic calculations from database records
  const totalCollected = feeInstallments.filter(fi => fi.status === 'Paid').reduce((s, fi) => s + fi.amount, 0);
  const totalDue = feeInstallments.filter(fi => fi.status === 'Due').reduce((s, fi) => s + fi.amount, 0);
  const totalOverdue = feeInstallments.filter(fi => fi.status === 'Overdue').reduce((s, fi) => s + fi.amount, 0);
  const defaulters = feeInstallments.filter(fi => fi.status === 'Overdue');

  // Head-wise income chart powered by real records
  const headWiseIncome = [
    { head: 'Tuition', amount: feeInstallments.filter(f => f.headName.toLowerCase().includes('tuition')).reduce((s, f) => s + f.amount, 0) },
    { head: 'Transport', amount: feeInstallments.filter(f => f.headName.toLowerCase().includes('transport')).reduce((s, f) => s + f.amount, 0) },
    { head: 'Exam', amount: feeInstallments.filter(f => f.headName.toLowerCase().includes('exam')).reduce((s, f) => s + f.amount, 0) },
    { head: 'Lab', amount: feeInstallments.filter(f => f.headName.toLowerCase().includes('lab')).reduce((s, f) => s + f.amount, 0) },
    { head: 'Library', amount: feeInstallments.filter(f => f.headName.toLowerCase().includes('library')).reduce((s, f) => s + f.amount, 0) },
  ];

  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isParent = role === 'parent';
  const isStudent = role === 'student';

  // For parent/student: show their own fee ledger
  const myStudentId = isParent ? (currentUser?.linkedStudentIds?.[0] || 'st1') : isStudent ? (currentUser?.linkedStudentId || 'st1') : null;
  const myFees = myStudentId ? feeInstallments.filter(fi => fi.studentId === myStudentId) : [];
  const myDue = myFees.filter(fi => fi.status !== 'Paid').reduce((s, fi) => s + fi.amount, 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading fees from database...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fees & Payments"
        description="Fee structure, student ledger, online payments, and collection reports"
        icon={CreditCard}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            {(isAdmin || isParent) && (
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedStudentId(myStudentId || (feeInstallments[0]?.studentId || '')); setShowPayment(true); }}>
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Collect / Pay Fee</span>
              </Button>
            )}
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isParent || isStudent ? 'Total Paid' : 'Total Collected'}</p>
                <p className="text-xl font-bold text-emerald-600">₹{(isParent || isStudent ? feeInstallments.filter(fi => fi.studentId === myStudentId && fi.status === 'Paid').reduce((s, fi) => s + fi.amount, 0) : totalCollected).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Due Amount</p>
                <p className="text-xl font-bold text-amber-600">₹{(isParent || isStudent ? myFees.filter(fi => fi.status === 'Due').reduce((s, fi) => s + fi.amount, 0) : totalDue).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50"><TrendingUp className="h-5 w-5 text-amber-600" /></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Overdue</p>
                <p className="text-xl font-bold text-rose-600">₹{(isParent || isStudent ? myFees.filter(fi => fi.status === 'Overdue').reduce((s, fi) => s + fi.amount, 0) : totalOverdue).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50"><AlertCircle className="h-5 w-5 text-rose-600" /></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isAdmin ? 'Defaulters' : 'Receipts'}</p>
                <p className="text-xl font-bold text-slate-900">{isAdmin ? String(defaulters.length) : String(feeReceipts.filter(r => r.studentId === myStudentId).length)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"><FileText className="h-5 w-5 text-slate-600" /></div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        {isAdmin && (
          <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {([['collection', 'Collection Dashboard'], ['structure', 'Fee Structure'], ['ledger', 'Student Ledger'], ['receipts', 'Receipts'], ['reports', 'Reports']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Admin: Collection Dashboard */}
        {isAdmin && tab === 'collection' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Payment Mode Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={modeBreakdown} dataKey="amount" nameKey="mode" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {modeBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {modeBreakdown.map(m => (
                  <div key={m.mode} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.fill }} /><span className="text-slate-600">{m.mode}</span></div>
                    <span className="font-semibold text-slate-700">₹{m.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Income by Fee Head</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={headWiseIncome} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <YAxis dataKey="head" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                  <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Defaulters List</h3>
                <Button variant="outline" size="sm" className="gap-2 text-xs"><Send className="h-3 w-3" /> Send Reminders</Button>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Class</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Fee Head</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {defaulters.slice(0, 8).map(fi => (
                      <tr key={fi.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{fi.studentName}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{fi.className}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{fi.headName}</td>
                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-800">₹{fi.amount.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">{fi.dueDate}</td>
                        <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColors[fi.status])}>{fi.status}</Badge></td>
                        <td className="px-3 py-2.5"><Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setSelectedStudentId(fi.studentId); setShowPayment(true); }}>Collect</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Admin: Fee Structure */}
        {isAdmin && tab === 'structure' && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Fee Structure Builder</h3>
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700"><Plus className="h-4 w-4" /> Add Fee Head</Button>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Fee Head</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Applies To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeHeads.map(fh => (
                    <tr key={fh.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{fh.name}</td>
                      <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', fh.type === 'one_time' ? 'border-blue-200 text-blue-600' : 'border-emerald-200 text-emerald-600')}>{fh.type === 'one_time' ? 'One-time' : 'Installment'}</Badge></td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-slate-800">₹{fh.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{fh.appliesTo.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Late Fee Rules</h4>
                <p className="text-xs text-slate-500">₹500 after due date + ₹50 per day (max ₹2,000)</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Scholarships & Discounts</h4>
                <p className="text-xs text-slate-500">Sibling discount: 10% · Merit scholarship: 25% · Staff ward: 50%</p>
              </div>
            </div>
          </Card>
        )}

        {/* Admin: Student Ledger */}
        {isAdmin && tab === 'ledger' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Student-wise Fee Ledger</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Class</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Fee Head</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeInstallments.slice(0, 20).map(fi => (
                    <tr key={fi.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-sm font-medium text-slate-800">{fi.studentName}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{fi.className}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-600">{fi.headName}</td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-slate-800">₹{fi.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-500">{fi.dueDate}</td>
                      <td className="px-3 py-2.5"><Badge variant="outline" className={cn('text-[10px]', statusColors[fi.status])}>{fi.status}</Badge></td>
                      <td className="px-3 py-2.5">{fi.status !== 'Paid' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setSelectedStudentId(fi.studentId); setShowPayment(true); }}>Collect</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Admin: Receipts */}
        {isAdmin && tab === 'receipts' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Payment Receipts</h3>
            <div className="space-y-2">
              {feeReceipts.map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50"><FileText className="h-4 w-4 text-emerald-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{r.receiptNo} · {r.studentName}</p>
                      <p className="text-xs text-slate-400">{r.date} · {r.mode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">₹{r.grandTotal.toLocaleString('en-IN')}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1"><Download className="h-3 w-3" /> PDF</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Admin: Reports */}
        {isAdmin && tab === 'reports' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Income Statement by Fee Head</h3>
              <div className="space-y-2">
                {headWiseIncome.map(h => (
                  <div key={h.head} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                    <span className="text-sm text-slate-600">{h.head} Fee</span>
                    <span className="text-sm font-semibold text-slate-800">₹{h.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-2.5">
                  <span className="text-sm font-semibold text-emerald-700">Total Income</span>
                  <span className="text-sm font-bold text-emerald-700">₹{headWiseIncome.reduce((s, h) => s + h.amount, 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">GST Report</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5"><span className="text-sm text-slate-600">Taxable Amount</span><span className="text-sm font-semibold text-slate-800">₹18,50,000</span></div>
                <div className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5"><span className="text-sm text-slate-600">GST Collected (18%)</span><span className="text-sm font-semibold text-slate-800">₹3,33,000</span></div>
                <div className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5"><span className="text-sm text-slate-600">Refunds Processed</span><span className="text-sm font-semibold text-slate-800">₹15,000</span></div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5"><span className="text-sm font-semibold text-slate-700">Net GST Payable</span><span className="text-sm font-bold text-slate-700">₹3,18,000</span></div>
              </div>
            </Card>
          </div>
        )}

        {/* Parent/Student: My Fee Ledger */}
        {(isParent || isStudent) && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">My Fee Ledger</h3>
            <div className="space-y-2">
              {myFees.map(fi => (
                <div key={fi.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{fi.headName}</p>
                    <p className="text-xs text-slate-400">Due: {fi.dueDate}{fi.paidDate && ` · Paid: ${fi.paidDate}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">₹{fi.amount.toLocaleString('en-IN')}</span>
                    <Badge variant="outline" className={cn('text-[10px]', statusColors[fi.status])}>{fi.status}</Badge>
                    {fi.status !== 'Paid' && <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedStudentId(fi.studentId); setShowPayment(true); }}>Pay Now</Button>}
                  </div>
                </div>
              ))}
            </div>
            {myDue > 0 && (
              <Button className="w-full mt-3 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedStudentId(myStudentId); setShowPayment(true); }}>
                <CreditCard className="h-4 w-4" /> Pay ₹{myDue.toLocaleString('en-IN')} Now
              </Button>
            )}
          </Card>
        )}

        {/* Payment Reminders */}
        {(isParent || isStudent) && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">Payment Reminders</h3>
            </div>
            <p className="text-xs text-slate-500">Automated reminders are sent via in-app notification, WhatsApp, SMS, and email 7 days before due date and every 3 days after overdue.</p>
          </Card>
        )}
      </div>

      {showPayment && selectedStudentId && (
        <PaymentDialog 
          studentId={selectedStudentId} 
          onClose={() => {
            setShowPayment(false);
            loadData();
          }} 
        />
      )}
    </div>
  );
}