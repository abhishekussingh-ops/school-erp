export type Role = 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student';

export interface RoleInfo {
  id: Role;
  label: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  linkedStudentIds?: string[]; // for parents
  linkedStaffId?: string;
  linkedStudentId?: string; // for student
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface ClassSection {
  id: string;
  className: string;
  section: string;
  classTeacherId: string;
  capacity: number;
  room: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  avatar: string;
  classSectionId: string;
  rollNo: number;
  gender: 'Male' | 'Female';
  dob: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  bloodGroup: string;
  routeId?: string;
  stopId?: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  admissionDate: string;
}

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  subjects: string[];
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  qualification: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  salary: number;
  leaveBalance: number;
  bloodGroup: string;
  address: string;
}

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Visit Scheduled'
  | 'Application Submitted'
  | 'Documents Verified'
  | 'Admitted'
  | 'Rejected';

export type EnquirySource = 'Walk-in' | 'Phone' | 'Website' | 'Referral';

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  classApplied: string;
  source: EnquirySource;
  status: EnquiryStatus;
  date: string;
  counselor: string;
  notes: TimelineEntry[];
  followUpDate?: string;
}

export interface TimelineEntry {
  date: string;
  by: string;
  note: string;
}

export interface FeeHead {
  id: string;
  name: string;
  type: 'one_time' | 'installment';
  amount: number;
  appliesTo: string[]; // class names
}

export interface FeeInstallment {
  id: string;
  studentId: string;
  headName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Due' | 'Overdue';
  paymentMode?: 'Cash' | 'Online' | 'Cheque' | 'UPI' | 'Card';
  receiptNo?: string;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  mode: string;
  heads: { name: string; amount: number; gst: number }[];
  totalGst: number;
  grandTotal: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-day';
  markedBy: string;
}

export interface StaffAttendance {
  id: string;
  staffId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export interface ExamTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Published';
}

export interface ExamSubject {
  id: string;
  termId: string;
  subject: string;
  classSectionId: string;
  date: string;
  maxMarks: number;
  weightage: number;
}

export interface ExamMark {
  id: string;
  termId: string;
  subjectId: string;
  studentId: string;
  marks: number;
  grade: string;
}

export interface ReportCard {
  id: string;
  termId: string;
  studentId: string;
  status: 'Draft' | 'Published';
  totalMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  result: 'Pass' | 'Fail';
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  audience: 'Whole School' | 'Class' | 'Student';
  targetClass?: string;
  targetStudentId?: string;
  readBy: string[];
  priority: 'Normal' | 'Important' | 'Urgent';
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  classSectionId: string;
  assignedBy: string;
  assignedOn: string;
  dueDate: string;
  attachments: string[];
  submissions: { studentId: string; submitted: boolean; submittedOn?: string };
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  body: string;
  date: string;
  senderRole: 'teacher' | 'parent';
}

export interface Ticket {
  id: string;
  subject: string;
  raisedBy: string;
  raisedByRole: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
}

export interface TimetableSlot {
  id: string;
  classSectionId: string;
  day: string;
  period: number;
  subject: string;
  teacherId: string;
  room: string;
  isSpecial?: boolean;
}

export interface SubstituteAssignment {
  id: string;
  date: string;
  classSectionId: string;
  period: number;
  originalTeacherId: string;
  substituteTeacherId: string;
  subject: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
  status: 'Paid' | 'Pending';
  payslipNo?: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  vehicleNo: string;
  driverId: string;
  capacity: number;
  occupied: number;
  stops: TransportStop[];
  liveLat: number;
  liveLng: number;
  progress: number; // 0-100
}

export interface TransportStop {
  id: string;
  name: string;
  pickupTime: string;
  dropTime: string;
  fare: number;
}

export interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  licenseExpiry: string;
  insuranceExpiry: string;
  maintenanceDue: string;
}

export interface Activity {
  id: string;
  type: 'payment' | 'enquiry' | 'leave' | 'attendance' | 'notice' | 'admission';
  message: string;
  time: string;
  amount?: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'Holiday' | 'Exam' | 'Event';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'fee' | 'attendance' | 'exam' | 'notice' | 'general';
}

export interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  icon: string;
}
