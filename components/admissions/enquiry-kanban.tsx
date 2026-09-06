'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Enquiry, EnquiryStatus } from '@/lib/types';
import { Phone, Mail, Calendar } from 'lucide-react';

const pipelineStages: EnquiryStatus[] = ['New', 'Contacted', 'Visit Scheduled', 'Application Submitted', 'Documents Verified', 'Admitted', 'Rejected'];

const stageColors: Record<EnquiryStatus, string> = {
  'New': 'border-t-blue-400',
  'Contacted': 'border-t-indigo-400',
  'Visit Scheduled': 'border-t-violet-400',
  'Application Submitted': 'border-t-amber-400',
  'Documents Verified': 'border-t-teal-400',
  'Admitted': 'border-t-emerald-400',
  'Rejected': 'border-t-rose-400',
};

const badgeColors: Record<EnquiryStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-indigo-100 text-indigo-700',
  'Visit Scheduled': 'bg-violet-100 text-violet-700',
  'Application Submitted': 'bg-amber-100 text-amber-700',
  'Documents Verified': 'bg-teal-100 text-teal-700',
  'Admitted': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-rose-100 text-rose-700',
};

export function EnquiryKanban({ enquiries, onSelect }: { enquiries: Enquiry[]; onSelect: (e: Enquiry) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
      {pipelineStages.map(stage => {
        const stageEnquiries = enquiries.filter(e => e.status === stage);
        return (
          <div key={stage} className="w-72 shrink-0">
            <div className={cn('rounded-t-lg border-t-2 bg-slate-50 px-3 py-2', stageColors[stage])}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">{stage}</p>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-slate-600">
                  {stageEnquiries.length}
                </span>
              </div>
            </div>
            <div className="space-y-2 rounded-b-lg bg-slate-50 p-2 min-h-[100px]">
              {stageEnquiries.map(enq => (
                <button
                  key={enq.id}
                  onClick={() => onSelect(enq)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:shadow-md hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-slate-800">{enq.studentName}</p>
                    <Badge variant="outline" className={cn('text-[10px]', badgeColors[enq.status])}>{enq.source}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{enq.parentName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{enq.classApplied}</Badge>
                    {enq.followUpDate && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600">
                        <Calendar className="h-3 w-3" />
                        {enq.followUpDate}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {stageEnquiries.length === 0 && (
                <div className="flex items-center justify-center py-6 text-xs text-slate-300">No enquiries</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
