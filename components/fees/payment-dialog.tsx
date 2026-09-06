'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle2, Download, Printer, CreditCard, Banknote, Building, QrCode,
  Check, Percent, AlertCircle, Receipt, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { students, classSections, getClassName, feeInstallments, feeHeads } from '@/lib/mock-data';
import { submitFeePayment } from '@/app/fees/actions';

interface PaymentDialogProps {
  studentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentDialog({ studentId, onClose, onSuccess }: PaymentDialogProps) {
  const student = students.find(s => s.id === studentId) || students[0];

  // Pending installments for this student
  const studentInstallments = feeInstallments.filter(
    fi => fi.studentId === student.id && fi.status !== 'Paid'
  );

  const [dialogMode, setDialogMode] = useState<'admin_collect' | 'online_pay'>('admin_collect');
  const [selectedInstallmentIds, setSelectedInstallmentIds] = useState<string[]>(
    studentInstallments.map(fi => fi.id)
  );

  // Payment configuration state
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'cheque' | 'netbanking'>('upi');
  const [refNo, setRefNo] = useState('');
  const [chequeBank, setChequeBank] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [discountReason, setDiscountReason] = useState('');
  const [fineAmount, setFineAmount] = useState('0');
  const [notes, setNotes] = useState('');

  // Online gateway state
  const [onlineGateway, setOnlineGateway] = useState<'razorpay' | 'payu' | 'cashfree'>('razorpay');
  const [upiVpa, setUpiVpa] = useState('');

  // Flow state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    receiptNo: string;
    amountPaid: number;
    mode: string;
    date: string;
    transactionId: string;
  } | null>(null);

  // Computed financial totals
  const baseTotal = studentInstallments
    .filter(fi => selectedInstallmentIds.includes(fi.id))
    .reduce((sum, fi) => sum + fi.amount, 0);

  const discount = Math.max(0, Number(discountAmount) || 0);
  const fine = Math.max(0, Number(fineAmount) || 0);
  const finalPayable = Math.max(0, baseTotal - discount + fine);

  const toggleInstallment = (id: string) => {
    setSelectedInstallmentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleProcessPayment = async () => {
    if (finalPayable <= 0) return;
    setLoading(true);

    try {
      const primaryFeeId = selectedInstallmentIds[0] || student.id;
      await submitFeePayment(primaryFeeId, paymentMode);

      const generatedReceipt = {
        receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        amountPaid: finalPayable,
        mode: dialogMode === 'online_pay' ? `${onlineGateway.toUpperCase()} (${paymentMode.toUpperCase()})` : paymentMode.toUpperCase(),
        date: new Date().toISOString().split('T')[0],
        transactionId: refNo || `TXN${Date.now().toString().slice(-8)}`,
      };

      setReceiptData(generatedReceipt);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto p-0 gap-0">
        {/* Modal Header & Navigation Tabs */}
        <div className="p-5 border-b border-slate-100 pb-3">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>{success ? 'Payment Receipt & Confirmation' : 'Fee Payment Portal'}</span>
              {!success && (
                <Badge variant="outline" className="font-mono text-[10px] text-slate-500 font-normal">
                  Academic Yr: 2026-27
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {!success && (
            <div className="flex gap-2 mt-3 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDialogMode('admin_collect')}
                className={cn(
                  'flex-1 text-xs py-1.5 font-medium rounded-md transition-all',
                  dialogMode === 'admin_collect'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Collect Fee (Admin Desk)
              </button>
              <button
                type="button"
                onClick={() => setDialogMode('online_pay')}
                className={cn(
                  'flex-1 text-xs py-1.5 font-medium rounded-md transition-all',
                  dialogMode === 'online_pay'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Online Payment (Parent Gateway)
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {success && receiptData ? (
            /* Success Screen & Formal Receipt */
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-emerald-900">Payment Processed Successfully</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Official invoice has been saved and reconciled in the database.
                </p>
              </div>

              {/* Receipt Preview */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Greenwood International School</h4>
                    <p className="text-[11px] text-slate-400">Affiliated to CBSE · Code: 1030492</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {receiptData.receiptNo}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{receiptData.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs py-1">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Student Name</p>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-slate-500 text-[11px]">Roll: {student.rollNumber} · {getClassName(student.classSectionId)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Payment Channel</p>
                    <p className="font-semibold text-slate-800">{receiptData.mode}</p>
                    <p className="font-mono text-slate-500 text-[11px]">Ref: {receiptData.transactionId}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Amount (Selected Heads)</span>
                    <span>₹{baseTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount / Waiver</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {fine > 0 && (
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Late Fine Surcharge</span>
                      <span>+₹{fine.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                    <span>Grand Total Paid</span>
                    <span className="text-base text-emerald-600">₹{receiptData.amountPaid.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 gap-2 text-xs h-9" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5" /> Print Receipt
                </Button>
                <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9" onClick={onClose}>
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          ) : (
            /* Active Form Mode */
            <>
              {/* Student Summary Card */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{student.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Roll No: <span className="font-medium text-slate-700">{student.rollNumber}</span> · {getClassName(student.classSectionId)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-[11px]">
                  Active Student
                </Badge>
              </div>

              {/* Fee Head Breakdown Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 uppercase tracking-wide">Select Fee Installments</span>
                  <span className="text-slate-400">{selectedInstallmentIds.length} heads selected</span>
                </div>
                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {studentInstallments.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No outstanding fees pending for this student.
                    </div>
                  ) : (
                    studentInstallments.map((fi) => {
                      const isSelected = selectedInstallmentIds.includes(fi.id);
                      return (
                        <div
                          key={fi.id}
                          onClick={() => toggleInstallment(fi.id)}
                          className={cn(
                            'flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors',
                            isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">{fi.headName}</p>
                              <p className="text-[10px] text-slate-400">Due Date: {fi.dueDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-slate-900">₹{fi.amount.toLocaleString('en-IN')}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'block mt-0.5 text-[9px] px-1 py-0',
                                fi.status === 'Overdue'
                                  ? 'border-rose-200 text-rose-600 bg-rose-50'
                                  : 'border-amber-200 text-amber-600 bg-amber-50'
                              )}
                            >
                              {fi.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* View 1: Admin Collect Desk */}
              {dialogMode === 'admin_collect' ? (
                <div className="space-y-3.5">
                  {/* Payment Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Collection Mode</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: 'upi', label: 'UPI / QR', icon: QrCode },
                        { key: 'cash', label: 'Cash', icon: Banknote },
                        { key: 'card', label: 'POS Card', icon: CreditCard },
                        { key: 'cheque', label: 'Cheque / DD', icon: Building },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPaymentMode(key as any)}
                          className={cn(
                            'flex flex-col items-center gap-1 rounded-lg border p-2 text-xs font-medium transition-all',
                            paymentMode === key
                              ? 'border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Specific Inputs */}
                  {paymentMode === 'upi' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">UPI Ref / UTR Number</label>
                      <Input
                        placeholder="e.g. 423987123456"
                        value={refNo}
                        onChange={e => setRefNo(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  )}

                  {paymentMode === 'cheque' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">Cheque No.</label>
                        <Input
                          placeholder="e.g. 000214"
                          value={refNo}
                          onChange={e => setRefNo(e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">Bank Name</label>
                        <Input
                          placeholder="e.g. HDFC Bank"
                          value={chequeBank}
                          onChange={e => setChequeBank(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">Cheque Date</label>
                        <Input
                          type="date"
                          value={chequeDate}
                          onChange={e => setChequeDate(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMode === 'card' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">POS Machine Transaction Ref</label>
                      <Input
                        placeholder="e.g. POS-88912"
                        value={refNo}
                        onChange={e => setRefNo(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  )}

                  {/* Adjustment Fields: Discounts and Late Fines */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                        <Percent className="h-3 w-3 text-slate-400" /> Sibling / Concession Discount (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={discountAmount}
                        onChange={e => setDiscountAmount(e.target.value)}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-slate-400" /> Late Fine / Penalty (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={fineAmount}
                        onChange={e => setFineAmount(e.target.value)}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* View 2: Parent Online Gateway */
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Select Gateway</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'razorpay', label: 'Razorpay', tag: 'Standard' },
                        { id: 'payu', label: 'PayU Money', tag: 'Instant' },
                        { id: 'cashfree', label: 'Cashfree', tag: 'Auto' },
                      ].map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setOnlineGateway(gw.id as any)}
                          className={cn(
                            'flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all',
                            onlineGateway === gw.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          )}
                        >
                          <span>{gw.label}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{gw.tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      256-Bit SSL Encrypted Transaction
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Supports all major Indian Cards, NetBanking (54+ Banks), and direct UPI auto-redirects.
                    </p>
                  </div>
                </div>
              )}

              {/* Total Summary Footer */}
              <div className="rounded-xl bg-slate-900 text-white p-3.5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Total Net Amount</p>
                  <p className="text-xl font-bold">₹{finalPayable.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-8"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-1.5 text-xs h-8"
                    disabled={loading || finalPayable <= 0}
                    onClick={handleProcessPayment}
                  >
                    {loading ? 'Reconciling...' : 'Confirm & Collect'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}