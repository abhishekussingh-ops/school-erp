'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { MessageSquare, Download, Plus, Bell, BookOpen, Send, MessageCircle, Ticket, CheckCheck, Megaphone, Users } from 'lucide-react';
import { notices, homeworks, messages, tickets, classSections, students } from '@/lib/mock-data';

export default function CommunicationPage() {
  const { role } = useApp();
  const searchParams = useSearchParams();
  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isTeacher = role === 'teacher';
  const [tab, setTab] = useState<'notices' | 'homework' | 'messages' | 'tickets'>('notices');
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const qTab = searchParams.get('tab');
    const qAction = searchParams.get('action');
    if (qTab === 'notices') setTab('notices');
    else if (qTab === 'homework') setTab('homework');
    else if (qTab === 'chat' || qTab === 'messages') setTab('messages');
    else if (qTab === 'tickets') setTab('tickets');
    if (qAction === 'compose' || qAction === 'create') {
      if (qTab === 'homework') setShowHomeworkForm(true);
      else setShowNoticeForm(true);
    }
  }, [searchParams]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Parent Communication"
        description="Notices, homework, messaging, and parent-teacher communication"
        icon={MessageSquare}
        iconColor="text-pink-600"
        iconBg="bg-pink-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></Button>
            {(isAdmin || isTeacher) && tab === 'notices' && <Button size="sm" className="gap-2 bg-pink-600 hover:bg-pink-700" onClick={() => setShowNoticeForm(true)}><Plus className="h-4 w-4" /> New Notice</Button>}
            {(isAdmin || isTeacher) && tab === 'homework' && <Button size="sm" className="gap-2 bg-pink-600 hover:bg-pink-700" onClick={() => setShowHomeworkForm(true)}><Plus className="h-4 w-4" /> Assign Homework</Button>}
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* Announcement Banner */}
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 p-3">
          <Megaphone className="h-5 w-5 text-pink-600 shrink-0" />
          <p className="text-sm text-pink-700"><span className="font-semibold">Latest:</span> {notices[0].title} — {notices[0].body.slice(0, 80)}...</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {([['notices', 'Notice Board'], ['homework', 'Homework'], ['messages', 'Messages'], ['tickets', 'Tickets']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors', tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>{label}</button>
          ))}
        </div>

        {/* Notices */}
        {tab === 'notices' && (
          <div className="space-y-2">
            {notices.map(n => (
              <Card key={n.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    n.priority === 'Urgent' && 'bg-rose-50 text-rose-600',
                    n.priority === 'Important' && 'bg-amber-50 text-amber-600',
                    n.priority === 'Normal' && 'bg-blue-50 text-blue-600',
                  )}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">{n.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn('text-[10px]', n.priority === 'Urgent' ? 'border-rose-200 text-rose-600' : n.priority === 'Important' ? 'border-amber-200 text-amber-600' : 'border-slate-200 text-slate-500')}>{n.priority}</Badge>
                        {isAdmin && <Badge variant="secondary" className="text-[10px] gap-1"><CheckCheck className="h-3 w-3" /> {n.readBy.length} reads</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{n.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{n.audience === 'Class' ? `Class: ${n.targetClass}` : n.audience === 'Student' ? 'Specific Student' : 'Whole School'}</Badge>
                      <span className="text-xs text-slate-400">{n.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Homework */}
        {tab === 'homework' && (
          <div className="space-y-2">
            {homeworks.map(hw => {
              const cls = classSections.find(c => c.id === hw.classSectionId);
              return (
                <Card key={hw.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">{hw.title}</h3>
                        <Badge variant="outline" className={cn('text-[10px]', hw.submissions.submitted ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600')}>{hw.submissions.submitted ? 'Submitted' : 'Pending'}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{hw.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{hw.subject}</Badge>
                        <Badge variant="outline" className="text-[10px]">{cls?.className} {cls?.section}</Badge>
                        <span className="text-xs text-slate-400">Due: {hw.dueDate}</span>
                        {hw.attachments.length > 0 && <span className="text-xs text-blue-500">📎 {hw.attachments.length} attachment(s)</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <Card className="p-0 overflow-hidden">
            <div className="flex">
              {/* Chat list */}
              <div className="w-48 border-r border-slate-200 p-3 hidden md:block">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Conversations</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg bg-pink-50 p-2 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">RK</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">Rajesh Kumar</p>
                      <p className="text-[10px] text-slate-400">Teacher</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Chat thread */}
              <div className="flex-1 flex flex-col">
                <div className="border-b border-slate-200 p-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">RK</div>
                  <div><p className="text-sm font-semibold text-slate-800">Rajesh Kumar</p><p className="text-[10px] text-emerald-500">● Online</p></div>
                </div>
                <div className="flex-1 space-y-3 p-4 min-h-[300px]">
                  {messages.map(m => (
                    <div key={m.id} className={cn('flex', m.senderRole === 'parent' ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[70%] rounded-lg p-3', m.senderRole === 'parent' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-800')}>
                        <p className="text-sm">{m.body}</p>
                        <p className={cn('text-[10px] mt-1', m.senderRole === 'parent' ? 'text-pink-200' : 'text-slate-400')}>{m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-3 flex items-center gap-2">
                  <Input placeholder="Type a message..." value={messageText} onChange={e => setMessageText(e.target.value)} className="flex-1" />
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700 gap-2"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tickets */}
        {tab === 'tickets' && (
          <div className="space-y-2">
            {tickets.map(t => (
              <Card key={t.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    t.status === 'Open' && 'bg-rose-50 text-rose-600',
                    t.status === 'In Progress' && 'bg-amber-50 text-amber-600',
                    t.status === 'Resolved' && 'bg-emerald-50 text-emerald-600',
                  )}>
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">{t.subject}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn('text-[10px]', t.priority === 'High' ? 'border-rose-200 text-rose-600' : t.priority === 'Medium' ? 'border-amber-200 text-amber-600' : 'border-slate-200 text-slate-500')}>{t.priority}</Badge>
                        <Badge variant="outline" className={cn('text-[10px]', t.status === 'Open' ? 'border-rose-200 text-rose-600' : t.status === 'In Progress' ? 'border-amber-200 text-amber-600' : 'border-emerald-200 text-emerald-600')}>{t.status}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Raised by {t.raisedBy} ({t.raisedByRole}) · {t.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* WhatsApp Integration Placeholder */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50"><MessageCircle className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">WhatsApp Business API Integration</h3>
              <p className="text-xs text-slate-500">Auto-sends attendance alerts, fee reminders, exam results, and notices to parents via WhatsApp. Configure your WhatsApp Business account in Settings.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notice Form Modal */}
      {showNoticeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowNoticeForm(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Publish New Notice</h3>
            <div className="space-y-3">
              <div><label className="text-xs text-slate-600">Title</label><Input placeholder="Notice title" className="mt-1" /></div>
              <div><label className="text-xs text-slate-600">Body</label><Textarea placeholder="Notice content" className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-600">Audience</label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1"><option>Whole School</option><option>Specific Class</option><option>Specific Student</option></select></div>
                <div><label className="text-xs text-slate-600">Priority</label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1"><option>Normal</option><option>Important</option><option>Urgent</option></select></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowNoticeForm(false)}>Cancel</Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 gap-2" onClick={() => setShowNoticeForm(false)}><Send className="h-4 w-4" /> Publish Notice</Button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Form Modal */}
      {showHomeworkForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowHomeworkForm(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assign Homework</h3>
            <div className="space-y-3">
              <div><label className="text-xs text-slate-600">Title</label><Input placeholder="Homework title" className="mt-1" /></div>
              <div><label className="text-xs text-slate-600">Description</label><Textarea placeholder="Instructions for students" className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-600">Class</label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1">{classSections.map(c => <option key={c.id}>{c.className} {c.section}</option>)}</select></div>
                <div><label className="text-xs text-slate-600">Subject</label><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1"><option>Mathematics</option><option>Science</option><option>English</option><option>Social Studies</option><option>Computer Science</option></select></div>
              </div>
              <div><label className="text-xs text-slate-600">Due Date</label><Input type="date" className="mt-1" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowHomeworkForm(false)}>Cancel</Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 gap-2" onClick={() => setShowHomeworkForm(false)}><Send className="h-4 w-4" /> Assign</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
