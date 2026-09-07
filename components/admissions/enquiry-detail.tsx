'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Enquiry, EnquiryStatus } from '@/lib/types';
import { Phone, Mail, Calendar, User, FileText, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const statusColors: Record<EnquiryStatus, string> = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Contacted': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Visit Scheduled': 'bg-violet-100 text-violet-700 border-violet-200',
  'Application Submitted': 'bg-amber-100 text-amber-700 border-amber-200',
  'Documents Verified': 'bg-teal-100 text-teal-700 border-teal-200',
  'Admitted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
};

const documentChecklist = [
  { name: 'Birth Certificate', required: true },
  { name: 'Previous Marksheet', required: true },
  { name: 'Transfer Certificate', required: true },
  { name: 'Passport Photo', required: true },
  { name: 'Aadhaar Card', required: false },
];

export function EnquiryDetail({ enquiry, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const showDocuments = ['Application Submitted', 'Documents Verified', 'Admitted'].includes(enquiry.status);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">{enquiry.studentName}</DialogTitle>
              <p className="text-sm text-slate-500">{enquiry.parentName} · {enquiry.classApplied}</p>
            </div>
            <Badge variant="outline" className={cn('text-xs', statusColors[enquiry.status])}>{enquiry.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-3">
              <Phone className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm text-slate-700">{enquiry.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm text-slate-700 truncate">{enquiry.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-3">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Counselor</p>
                <p className="text-sm text-slate-700">{enquiry.counselor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-3">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Enquiry Date</p>
                <p className="text-sm text-slate-700">{enquiry.date}</p>
              </div>
            </div>
          </div>

          {/* Follow-up */}
          {enquiry.followUpDate && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3">
              <Calendar className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-700">Follow-up scheduled for <span className="font-semibold">{enquiry.followUpDate}</span></p>
            </div>
          )}

          {/* Document Checklist */}
          {showDocuments && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Document Verification</h4>
              <div className="space-y-2">
                {documentChecklist.map(doc => {
                  const verified = enquiry.status === 'Documents Verified' || enquiry.status === 'Admitted';
                  return (
                    <div key={doc.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{doc.name}</span>
                        {doc.required && <Badge variant="outline" className="text-[9px] border-slate-200 text-slate-400">Required</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="rounded p-1 text-emerald-600 hover:bg-emerald-50" title="Approve">
                          <CheckCircle2 className={cn('h-4 w-4', verified ? 'fill-emerald-100' : '')} />
                        </button>
                        <button className="rounded p-1 text-rose-600 hover:bg-rose-50" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1 text-amber-600 hover:bg-amber-50" title="Request resubmission">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Timeline</h4>
            <div className="space-y-3">
              {enquiry.notes.map((note, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
                      {note.by.split(' ').map(n => n[0]).join('')}
                    </div>
                    {i < enquiry.notes.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm text-slate-700">{note.note}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{note.date} · {note.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <Button size="sm" variant="outline" className="gap-2">
              <Phone className="h-4 w-4" /> Log Call
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> Schedule Visit
            </Button>
            {enquiry.status === 'Documents Verified' && (
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Admit Student
              </Button>
            )}
            {enquiry.status !== 'Rejected' && enquiry.status !== 'Admitted' && (
              <Button size="sm" variant="outline" className="gap-2 text-rose-600 hover:bg-rose-50">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
