'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export function EnquiryForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {step === 1 ? 'New Enquiry' : 'Admission Application'}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Student Name</Label>
                <Input placeholder="Full name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Parent/Guardian Name</Label>
                <Input placeholder="Parent name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Phone</Label>
                <Input placeholder="+91" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Email</Label>
                <Input placeholder="email@example.com" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Class Applying For</Label>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none">
                  <option>Grade 6</option>
                  <option>Grade 7</option>
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                </select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Source</Label>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none">
                  <option>Walk-in</option>
                  <option>Phone</option>
                  <option>Website</option>
                  <option>Referral</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(2)}>Next: Application Form</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Date of Birth</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Gender</Label>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-slate-600">Address</Label>
                <Input placeholder="Full address" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Previous School</Label>
                <Input placeholder="Previous school name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Previous Grade</Label>
                <Input placeholder="Last completed grade" className="mt-1" />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <Label className="text-sm font-semibold text-slate-700">Document Upload</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Birth Certificate', 'Previous Marksheet', 'Transfer Certificate', 'Passport Photo'].map(doc => (
                  <div key={doc} className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-600">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>Back</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>Submit Application</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
