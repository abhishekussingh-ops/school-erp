'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Enquiry, EnquiryStatus } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

const statusColors: Record<EnquiryStatus, string> = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Contacted': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Visit Scheduled': 'bg-violet-100 text-violet-700 border-violet-200',
  'Application Submitted': 'bg-amber-100 text-amber-700 border-amber-200',
  'Documents Verified': 'bg-teal-100 text-teal-700 border-teal-200',
  'Admitted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
};

export function EnquiryTable({ enquiries, onSelect }: { enquiries: Enquiry[]; onSelect: (e: Enquiry) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Parent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Counselor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.map(enq => (
              <tr key={enq.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelect(enq)}>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">{enq.studentName}</p>
                  <p className="text-xs text-slate-400">{enq.phone}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.parentName}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.classApplied}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.source}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cn('text-[10px]', statusColors[enq.status])}>{enq.status}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{enq.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.counselor}</td>
                <td className="px-4 py-3">
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
