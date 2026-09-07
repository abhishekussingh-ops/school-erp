'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, CreditCard, Smartphone, Building2, Wallet, FileText, Download } from 'lucide-react';
import { students, feeInstallments, getClassName } from '@/lib/mock-data';

const paymentModes = [
  { id: 'upi', label: 'UPI', icon: Smartphone, color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export function PaymentDialog({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const student = students.find(s => s.id === studentId);
  const dueFees = feeInstallments.filter(fi => fi.studentId === studentId && fi.status !== 'Paid');
  const totalDue = dueFees.reduce((s, fi) => s + fi.amount, 0);
  const [step, setStep] = useState<'select' | 'method' | 'processing' | 'success'>('select');
  const [selectedFees, setSelectedFees] = useState<Set<string>>(new Set(dueFees.map(f => f.id)));
  const [mode, setMode] = useState<string>('upi');

  const selectedAmount = dueFees.filter(f => selectedFees.has(f.id)).reduce((s, f) => s + f.amount, 0);
  const gstAmount = Math.round(selectedAmount * 0.18);
  const grandTotal = selectedAmount + gstAmount;

  const toggleFee = (id: string) => {
    const next = new Set(selectedFees);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedFees(next);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">Online Fee Payment</DialogTitle>
          <p className="text-sm text-slate-500">{student?.name} · {student ? getClassName(student.classSectionId) : ''}</p>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {dueFees.map(fi => (
                <button key={fi.id} onClick={() => toggleFee(fi.id)} className={cn('flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors', selectedFees.has(fi.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50')}>
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded border-2', selectedFees.has(fi.id) ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300')}>
                      {selectedFees.has(fi.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{fi.headName}</p>
                      <p className="text-xs text-slate-400">Due: {fi.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">₹{fi.amount.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-slate-50 p-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>₹{selectedAmount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-xs text-slate-500"><span>GST (18%)</span><span>₹{gstAmount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm font-bold text-slate-800 pt-1 border-t border-slate-200"><span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={selectedAmount === 0} onClick={() => setStep('method')}>Proceed to Pay</Button>
          </div>
        )}

        {step === 'method' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Select payment method:</p>
            <div className="grid grid-cols-2 gap-2">
              {paymentModes.map(pm => {
                const Icon = pm.icon;
                return (
                  <button key={pm.id} onClick={() => setMode(pm.id)} className={cn('flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors', mode === pm.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50')}>
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', pm.bg)}><Icon className={cn('h-5 w-5', pm.color)} /></div>
                    <span className="text-sm font-medium text-slate-700">{pm.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="rounded-lg bg-slate-50 p-3 flex justify-between text-sm font-bold text-slate-800"><span>Amount Payable</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>Back</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setStep('processing'); setTimeout(() => setStep('success'), 2000); }}>Pay ₹{grandTotal.toLocaleString('en-IN')}</Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            <p className="mt-4 text-sm text-slate-600">Processing payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Successful!</h3>
            <p className="text-sm text-slate-500">₹{grandTotal.toLocaleString('en-IN')} paid for {student?.name}</p>
            <div className="mt-4 w-full rounded-lg border border-slate-200 p-3 space-y-1">
              <div className="flex justify-between text-xs"><span className="text-slate-400">Receipt No</span><span className="font-semibold text-slate-700">RCP{Date.now().toString().slice(-6)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Date</span><span className="font-semibold text-slate-700">{new Date().toISOString().split('T')[0]}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Mode</span><span className="font-semibold text-slate-700 capitalize">{mode}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">GST (18%)</span><span className="font-semibold text-slate-700">₹{gstAmount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-100"><span className="text-slate-700">Total Paid</span><span className="text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="flex gap-2 mt-4 w-full">
              <Button variant="outline" className="flex-1 gap-2"><Download className="h-4 w-4" /> Receipt</Button>
              <Button className="flex-1 bg-slate-900 hover:bg-slate-800" onClick={onClose}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
