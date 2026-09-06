'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserPlus, Download, Filter, Plus, Phone, Mail, Calendar, ChevronRight } from 'lucide-react';
import { enquiries } from '@/lib/mock-data';
import { EnquiryStatus, Enquiry } from '@/lib/types';
import { EnquiryKanban } from '@/components/admissions/enquiry-kanban';
import { EnquiryTable } from '@/components/admissions/enquiry-table';
import { EnquiryDetail } from '@/components/admissions/enquiry-detail';
import { EnquiryForm } from '@/components/admissions/enquiry-form';

const statusColors: Record<EnquiryStatus, string> = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Contacted': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Visit Scheduled': 'bg-violet-100 text-violet-700 border-violet-200',
  'Application Submitted': 'bg-amber-100 text-amber-700 border-amber-200',
  'Documents Verified': 'bg-teal-100 text-teal-700 border-teal-200',
  'Admitted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
};

const pipelineStages: EnquiryStatus[] = ['New', 'Contacted', 'Visit Scheduled', 'Application Submitted', 'Documents Verified', 'Admitted', 'Rejected'];

export default function AdmissionsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');

  const filteredEnquiries = filterClass === 'all' ? enquiries : enquiries.filter(e => e.classApplied === filterClass);
  const conversionRate = Math.round((enquiries.filter(e => e.status === 'Admitted').length / enquiries.length) * 100);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admissions CRM"
        description="Enquiry pipeline, application management, and conversion tracking"
        icon={UserPlus}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Enquiry</span>
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <Card className="p-3">
            <p className="text-xs text-slate-500">Total Enquiries</p>
            <p className="text-xl font-bold text-slate-900">{enquiries.length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">In Pipeline</p>
            <p className="text-xl font-bold text-blue-600">{enquiries.filter(e => !['Admitted', 'Rejected'].includes(e.status)).length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Admitted</p>
            <p className="text-xl font-bold text-emerald-600">{enquiries.filter(e => e.status === 'Admitted').length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Rejected</p>
            <p className="text-xl font-bold text-rose-600">{enquiries.filter(e => e.status === 'Rejected').length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Conversion Rate</p>
            <p className="text-xl font-bold text-slate-900">{conversionRate}%</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Follow-ups Due</p>
            <p className="text-xl font-bold text-amber-600">{enquiries.filter(e => e.followUpDate).length}</p>
          </Card>
        </div>

        {/* View Toggle + Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setView('kanban')}
                className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', view === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}
              >
                Kanban
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}
              >
                List
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Classes</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {view === 'kanban' ? (
          <EnquiryKanban enquiries={filteredEnquiries} onSelect={setSelectedEnquiry} />
        ) : (
          <EnquiryTable enquiries={filteredEnquiries} onSelect={setSelectedEnquiry} />
        )}

        {/* Source-wise Performance */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Source-wise Performance</h3>
            <div className="space-y-2">
              {['Walk-in', 'Website', 'Phone', 'Referral'].map(source => {
                const sourceEnquiries = enquiries.filter(e => e.source === source);
                const admitted = sourceEnquiries.filter(e => e.status === 'Admitted').length;
                const rate = sourceEnquiries.length > 0 ? Math.round((admitted / sourceEnquiries.length) * 100) : 0;
                return (
                  <div key={source} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-slate-600">{source}</div>
                    <div className="flex-1">
                      <div className="h-6 w-full rounded-full bg-slate-100">
                        <div className="flex h-6 items-center rounded-full bg-blue-500 px-2 text-[10px] font-semibold text-white" style={{ width: `${Math.max(rate, 15)}%` }}>
                          {rate > 15 && `${rate}%`}
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-xs text-slate-500">{admitted}/{sourceEnquiries.length}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Class-wise Seat Availability</h3>
            <div className="space-y-2">
              {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(cls => {
                const capacity = 35;
                const occupied = 10;
                const available = capacity - occupied;
                const pct = Math.round((occupied / capacity) * 100);
                return (
                  <div key={cls} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-slate-600">{cls}</div>
                    <div className="flex-1">
                      <div className="h-6 w-full rounded-full bg-slate-100">
                        <div className={cn('flex h-6 items-center rounded-full px-2 text-[10px] font-semibold text-white', pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${Math.max(pct, 15)}%` }}>
                          {pct > 15 && `${occupied}/${capacity}`}
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-xs text-slate-500">{available} seats</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {selectedEnquiry && (
        <EnquiryDetail enquiry={selectedEnquiry} onClose={() => setSelectedEnquiry(null)} />
      )}
      {showForm && (
        <EnquiryForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
