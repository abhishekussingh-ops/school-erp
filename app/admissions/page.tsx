'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserPlus, Download, Filter, Plus } from 'lucide-react';
import { getAdmissions, updateAdmissionStatus } from "./actions";
import { Enquiry, EnquiryStatus } from '@/lib/types';
import { EnquiryKanban } from '@/components/admissions/enquiry-kanban';
import { EnquiryTable } from '@/components/admissions/enquiry-table';
import { EnquiryDetail } from '@/components/admissions/enquiry-detail';
import { EnquiryForm } from '@/components/admissions/enquiry-form';

function normalizeStatus(raw: string): EnquiryStatus {
  switch (raw) {
    case 'INQUIRY':
    case 'New':
      return 'New';
    case 'CONTACTED':
    case 'Contacted':
      return 'Contacted';
    case 'SCHEDULED':
    case 'Visit Scheduled':
      return 'Visit Scheduled';
    case 'Application Submitted':
      return 'Application Submitted';
    case 'Documents Verified':
      return 'Documents Verified';
    case 'ENROLLED':
    case 'Admitted':
      return 'Admitted';
    case 'REJECTED':
    case 'Rejected':
      return 'Rejected';
    default:
      return (raw as EnquiryStatus) || 'New';
  }
}

export default function AdmissionsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await getAdmissions("greenwood");
      
      const mapped: Enquiry[] = (data || []).map((item) => ({
        id: item.id,
        studentName: item.studentName,
        parentName: item.parentName,
        phone: item.phone,
        email: '',
        classApplied: item.grade,
        status: normalizeStatus(item.status),
        source: item.source || 'Walk-in',
        date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
        followUpDate: '',
        notes: [],
        counselor: 'Admissions Desk',
      }));

      setEnquiries(mapped);
    } catch (err) {
      console.error("Failed to load admissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnquiryCreated = async (newRecord?: any) => {
    setShowForm(false);
    if (newRecord && newRecord.id) {
      const formatted: Enquiry = {
        id: newRecord.id,
        studentName: newRecord.studentName,
        parentName: newRecord.parentName,
        phone: newRecord.phone,
        email: '',
        classApplied: newRecord.grade,
        status: normalizeStatus(newRecord.status || 'New'),
        source: newRecord.source || 'Walk-in',
        date: newRecord.createdAt
          ? new Date(newRecord.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        followUpDate: '',
        notes: [],
        counselor: 'Admissions Desk',
      };
      setEnquiries((prev) => [formatted, ...prev]);
    } else {
      await loadData();
    }
  };

  // Status transition function
  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    // 1. Optimistically update local state so cards move immediately
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // 2. Persist to PostgreSQL
    try {
      await updateAdmissionStatus(enquiryId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      loadData(); // Roll back on failure
    }
  };

  const filteredEnquiries = filterClass === 'all' 
    ? enquiries 
    : enquiries.filter(e => e.classApplied === filterClass);

  const total = enquiries.length;
  const admittedCount = enquiries.filter(e => e.status === 'Admitted').length;
  const conversionRate = total > 0 ? Math.round((admittedCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading admissions from database...</p>
      </div>
    );
  }

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
            <p className="text-xl font-bold text-slate-900">{total}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">In Pipeline</p>
            <p className="text-xl font-bold text-blue-600">
              {enquiries.filter(e => !['Admitted', 'Rejected'].includes(e.status)).length}
            </p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Admitted</p>
            <p className="text-xl font-bold text-emerald-600">{admittedCount}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Rejected</p>
            <p className="text-xl font-bold text-rose-600">
              {enquiries.filter(e => e.status === 'Rejected').length}
            </p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Conversion Rate</p>
            <p className="text-xl font-bold text-slate-900">{conversionRate}%</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-slate-500">Follow-ups Due</p>
            <p className="text-xl font-bold text-amber-600">
              {enquiries.filter(e => e.followUpDate).length}
            </p>
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
          <EnquiryKanban 
            enquiries={filteredEnquiries} 
            onSelect={setSelectedEnquiry} 
            onStatusChange={handleStatusChange} 
          />
        ) : (
          <EnquiryTable 
            enquiries={filteredEnquiries} 
            onSelect={setSelectedEnquiry} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {selectedEnquiry && (
        <EnquiryDetail 
          enquiry={selectedEnquiry} 
          onClose={() => setSelectedEnquiry(null)} 
          onStatusChange={(newStatus: EnquiryStatus) => handleStatusChange(selectedEnquiry.id, newStatus)}
        />
      )}
      {showForm && (
        <EnquiryForm 
          onClose={() => setShowForm(false)} 
          onSuccess={handleEnquiryCreated}
        />
      )}
    </div>
  );
}