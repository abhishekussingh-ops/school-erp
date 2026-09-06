import {
  Student, Staff, Enquiry, FeeHead, FeeInstallment, FeeReceipt,
  AttendanceRecord, StaffAttendance, LeaveRequest, ExamTerm, ExamSubject,
  ExamMark, ReportCard, Notice, Homework, Message, Ticket, TimetableSlot,
  SubstituteAssignment, PayrollRecord, TransportRoute, Vehicle, Activity,
  CalendarEvent, Notification, User, Branch, ClassSection, RoleInfo,
} from './types';

export const roles: RoleInfo[] = [
  { id: 'super_admin', label: 'Super Admin', description: 'Full system access across all branches' },
  { id: 'school_admin', label: 'School Admin', description: 'Manage school operations, staff & finances' },
  { id: 'teacher', label: 'Teacher / Staff', description: 'Manage classes, attendance & marks' },
  { id: 'parent', label: 'Parent', description: 'View child progress & pay fees' },
  { id: 'student', label: 'Student', description: 'View timetable, homework & results' },
];

export const branches: Branch[] = [
  { id: 'br1', name: 'Lovedale Main Campus', location: 'MG Road, Bangalore' },
  { id: 'br2', name: 'Lovedale North Branch', location: 'Hebbal, Bangalore' },
];

export const users: User[] = [
  { id: 'u1', name: 'Dr. Anita Sharma', email: 'anita.sharma@lovedale.edu', avatar: 'AS', role: 'school_admin', linkedStaffId: 's1' },
  { id: 'u2', name: 'Rajesh Kumar', email: 'rajesh.kumar@lovedale.edu', avatar: 'RK', role: 'teacher', linkedStaffId: 's2' },
  { id: 'u3', name: 'Priya Nair', email: 'priya.nair@gmail.com', avatar: 'PN', role: 'parent', linkedStudentIds: ['st1', 'st2'] },
  { id: 'u4', name: 'Arjun Nair', email: 'arjun.nair@lovedale.edu', avatar: 'AN', role: 'student', linkedStudentId: 'st1' },
  { id: 'u5', name: 'Super Admin', email: 'admin@lovedale.edu', avatar: 'SA', role: 'super_admin' },
];

export const classSections: ClassSection[] = [
  { id: 'c1', className: 'Grade 6', section: 'A', classTeacherId: 's2', capacity: 35, room: '201' },
  { id: 'c2', className: 'Grade 6', section: 'B', classTeacherId: 's3', capacity: 35, room: '202' },
  { id: 'c3', className: 'Grade 7', section: 'A', classTeacherId: 's4', capacity: 35, room: '203' },
  { id: 'c4', className: 'Grade 8', section: 'A', classTeacherId: 's5', capacity: 35, room: '301' },
  { id: 'c5', className: 'Grade 9', section: 'A', classTeacherId: 's6', capacity: 35, room: '401' },
  { id: 'c6', className: 'Grade 10', section: 'A', classTeacherId: 's7', capacity: 35, room: '501' },
];

const firstNames = ['Arjun', 'Diya', 'Kabir', 'Ananya', 'Vihaan', 'Saanvi', 'Aditya', 'Ishaan', 'Aaradhya', 'Reyansh', 'Myra', 'Krishna', 'Anika', 'Vivaan', 'Pari', 'Arnav', 'Riya', 'Dhruv', 'Sara', 'Kiaan', 'Naira', 'Reyansh', 'Tara', 'Veer', 'Aadya', 'Kiaan', 'Navya', 'Atharv', 'Zara', 'Ira'];
const lastNames = ['Nair', 'Sharma', 'Reddy', 'Iyer', 'Gupta', 'Patel', 'Singh', 'Rao', 'Menon', 'Pillai', 'Kumar', 'Das', 'Joshi', 'Nair', 'Bhat'];
const avatarColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500'];

function generateStudents(): Student[] {
  const students: Student[] = [];
  let id = 1;
  for (const cls of classSections) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const fn = firstNames[(id - 1) % firstNames.length];
      const ln = lastNames[(id - 1) % lastNames.length];
      const name = `${fn} ${ln}`;
      const gender = id % 2 === 0 ? 'Male' : 'Female';
      const routeId = id % 3 === 0 ? 'r1' : id % 3 === 1 ? 'r2' : undefined;
      students.push({
        id: `st${id}`,
        admissionNo: `LVD2026${String(id).padStart(3, '0')}`,
        name,
        avatar: `${fn[0]}${ln[0]}`,
        classSectionId: cls.id,
        rollNo: i + 1,
        gender,
        dob: `20${10 - parseInt(cls.className.replace('Grade ', ''))}-${String((id % 12) + 1).padStart(2, '0')}-15`,
        parentName: `${lastNames[(id - 1) % lastNames.length]} ${gender === 'Male' ? 'Father' : 'Mother'}`,
        parentPhone: `+91 98${String(100000 + id * 137).slice(0, 8)}`,
        parentEmail: `parent${id}@gmail.com`,
        address: `${id * 10}, ${['MG Road', 'Brigade Road', 'Indiranagar', 'Koramangala'][id % 4]}, Bangalore`,
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][id % 4],
        routeId,
        stopId: routeId ? `stop${(id % 3) + 1}` : undefined,
        status: 'Active',
        admissionDate: `2026-0${(id % 6) + 1}-15`,
      });
      id++;
    }
  }
  return students;
}

export const students: Student[] = generateStudents();

export const staff: Staff[] = [
  { id: 's1', employeeId: 'EMP001', name: 'Dr. Anita Sharma', avatar: 'AS', designation: 'Principal', department: 'Administration', subjects: [], gender: 'Female', phone: '+91 9810012345', email: 'anita.sharma@lovedale.edu', qualification: 'Ph.D. Education', joiningDate: '2015-06-01', employmentType: 'Full-time', salary: 120000, leaveBalance: 12, bloodGroup: 'O+', address: 'Jayanagar, Bangalore' },
  { id: 's2', employeeId: 'EMP002', name: 'Rajesh Kumar', avatar: 'RK', designation: 'Senior Teacher', department: 'Mathematics', subjects: ['Mathematics', 'Statistics'], gender: 'Male', phone: '+91 9820023456', email: 'rajesh.kumar@lovedale.edu', qualification: 'M.Sc. Mathematics', joiningDate: '2018-06-15', employmentType: 'Full-time', salary: 65000, leaveBalance: 8, bloodGroup: 'A+', address: 'Indiranagar, Bangalore' },
  { id: 's3', employeeId: 'EMP003', name: 'Meena Iyer', avatar: 'MI', designation: 'Senior Teacher', department: 'Science', subjects: ['Physics', 'Chemistry'], gender: 'Female', phone: '+91 9830034567', email: 'meena.iyer@lovedale.edu', qualification: 'M.Sc. Physics', joiningDate: '2017-07-01', employmentType: 'Full-time', salary: 62000, leaveBalance: 10, bloodGroup: 'B+', address: 'Koramangala, Bangalore' },
  { id: 's4', employeeId: 'EMP004', name: 'Sunil Reddy', avatar: 'SR', designation: 'Teacher', department: 'English', subjects: ['English', 'Literature'], gender: 'Male', phone: '+91 9840045678', email: 'sunil.reddy@lovedale.edu', qualification: 'M.A. English', joiningDate: '2019-06-01', employmentType: 'Full-time', salary: 55000, leaveBalance: 15, bloodGroup: 'AB+', address: 'HSR Layout, Bangalore' },
  { id: 's5', employeeId: 'EMP005', name: 'Lakshmi Rao', avatar: 'LR', designation: 'Teacher', department: 'Social Studies', subjects: ['History', 'Geography'], gender: 'Female', phone: '+91 9850056789', email: 'lakshmi.rao@lovedale.edu', qualification: 'M.A. History', joiningDate: '2020-06-15', employmentType: 'Full-time', salary: 52000, leaveBalance: 6, bloodGroup: 'O-', address: 'BTM Layout, Bangalore' },
  { id: 's6', employeeId: 'EMP006', name: 'Vikram Singh', avatar: 'VS', designation: 'Teacher', department: 'Science', subjects: ['Biology'], gender: 'Male', phone: '+91 9860067890', email: 'vikram.singh@lovedale.edu', qualification: 'M.Sc. Biology', joiningDate: '2021-07-01', employmentType: 'Full-time', salary: 50000, leaveBalance: 14, bloodGroup: 'A-', address: 'Whitefield, Bangalore' },
  { id: 's7', employeeId: 'EMP007', name: 'Deepa Menon', avatar: 'DM', designation: 'Senior Teacher', department: 'Computer Science', subjects: ['Computer Science'], gender: 'Female', phone: '+91 9870078901', email: 'deepa.menon@lovedale.edu', qualification: 'MCA', joiningDate: '2016-06-01', employmentType: 'Full-time', salary: 60000, leaveBalance: 9, bloodGroup: 'B-', address: 'Electronic City, Bangalore' },
  { id: 's8', employeeId: 'EMP008', name: 'Arjun Das', avatar: 'AD', designation: 'PT Instructor', department: 'Physical Education', subjects: ['Physical Education'], gender: 'Male', phone: '+91 9880089012', email: 'arjun.das@lovedale.edu', qualification: 'B.P.Ed', joiningDate: '2022-06-01', employmentType: 'Full-time', salary: 40000, leaveBalance: 18, bloodGroup: 'O+', address: 'Marathahalli, Bangalore' },
  { id: 's9', employeeId: 'EMP009', name: 'Fatima Khan', avatar: 'FK', designation: 'Librarian', department: 'Library', subjects: [], gender: 'Female', phone: '+91 9890090123', email: 'fatima.khan@lovedale.edu', qualification: 'M.Lib', joiningDate: '2018-08-01', employmentType: 'Full-time', salary: 38000, leaveBalance: 11, bloodGroup: 'A+', address: 'Frazer Town, Bangalore' },
  { id: 's10', employeeId: 'EMP010', name: 'Joseph Mathew', avatar: 'JM', designation: 'Accountant', department: 'Finance', subjects: [], gender: 'Male', phone: '+91 9900101234', email: 'joseph.mathew@lovedale.edu', qualification: 'M.Com', joiningDate: '2014-06-01', employmentType: 'Full-time', salary: 55000, leaveBalance: 7, bloodGroup: 'B+', address: 'Malleshwaram, Bangalore' },
];

export const enquiries: Enquiry[] = [
  { id: 'e1', studentName: 'Ayaan Verma', parentName: 'Suresh Verma', phone: '+91 9911001100', email: 'suresh.v@gmail.com', classApplied: 'Grade 6', source: 'Walk-in', status: 'New', date: '2026-09-01', counselor: 'Meena Iyer', notes: [{ date: '2026-09-01', by: 'Meena Iyer', note: 'Walk-in enquiry, interested in Grade 6 admission' }] },
  { id: 'e2', studentName: 'Saanvi Agarwal', parentName: 'Rahul Agarwal', phone: '+91 9922002200', email: 'rahul.a@gmail.com', classApplied: 'Grade 7', source: 'Website', status: 'Contacted', date: '2026-08-28', counselor: 'Sunil Reddy', notes: [{ date: '2026-08-28', by: 'Sunil Reddy', note: 'Website enquiry received' }, { date: '2026-08-29', by: 'Sunil Reddy', note: 'Called parent, discussed fee structure' }], followUpDate: '2026-09-05' },
  { id: 'e3', studentName: 'Vivaan Joshi', parentName: 'Manoj Joshi', phone: '+91 9933003300', email: 'manoj.j@gmail.com', classApplied: 'Grade 8', source: 'Referral', status: 'Visit Scheduled', date: '2026-08-25', counselor: 'Lakshmi Rao', notes: [{ date: '2026-08-25', by: 'Lakshmi Rao', note: 'Referred by existing parent Mr. Nair' }, { date: '2026-08-27', by: 'Lakshmi Rao', note: 'Campus visit scheduled for Sep 5' }], followUpDate: '2026-09-05' },
  { id: 'e4', studentName: 'Pari Malhotra', parentName: 'Karan Malhotra', phone: '+91 9944004400', email: 'karan.m@gmail.com', classApplied: 'Grade 9', source: 'Phone', status: 'Application Submitted', date: '2026-08-20', counselor: 'Vikram Singh', notes: [{ date: '2026-08-20', by: 'Vikram Singh', note: 'Phone enquiry' }, { date: '2026-08-22', by: 'Vikram Singh', note: 'Application form submitted' }] },
  { id: 'e5', studentName: 'Atharv Pillai', parentName: 'Suresh Pillai', phone: '+91 9955005500', email: 'suresh.p@gmail.com', classApplied: 'Grade 6', source: 'Walk-in', status: 'Documents Verified', date: '2026-08-15', counselor: 'Meena Iyer', notes: [{ date: '2026-08-15', by: 'Meena Iyer', note: 'Walk-in' }, { date: '2026-08-18', by: 'Meena Iyer', note: 'Documents verified, birth cert + previous marksheet OK' }] },
  { id: 'e6', studentName: 'Zara Khan', parentName: 'Imran Khan', phone: '+91 9966006600', email: 'imran.k@gmail.com', classApplied: 'Grade 7', source: 'Website', status: 'Admitted', date: '2026-08-10', counselor: 'Sunil Reddy', notes: [{ date: '2026-08-10', by: 'Sunil Reddy', note: 'Website enquiry' }, { date: '2026-08-12', by: 'Sunil Reddy', note: 'Application submitted' }, { date: '2026-08-14', by: 'Sunil Reddy', note: 'Documents verified' }, { date: '2026-08-16', by: 'Sunil Reddy', note: 'Admitted! Student record created' }] },
  { id: 'e7', studentName: 'Ira Bhat', parentName: 'Ganesh Bhat', phone: '+91 9977007700', email: 'ganesh.b@gmail.com', classApplied: 'Grade 10', source: 'Referral', status: 'Rejected', date: '2026-08-05', counselor: 'Deepa Menon', notes: [{ date: '2026-08-05', by: 'Deepa Menon', note: 'Referral enquiry' }, { date: '2026-08-08', by: 'Deepa Menon', note: 'No seats available in Grade 10' }] },
  { id: 'e8', studentName: 'Reyansh Das', parentName: 'Subhash Das', phone: '+91 9988008800', email: 'subhash.d@gmail.com', classApplied: 'Grade 6', source: 'Phone', status: 'New', date: '2026-09-03', counselor: 'Meena Iyer', notes: [{ date: '2026-09-03', by: 'Meena Iyer', note: 'Phone enquiry for Grade 6' }] },
  { id: 'e9', studentName: 'Tara Shetty', parentName: 'Naveen Shetty', phone: '+91 9999009900', email: 'naveen.s@gmail.com', classApplied: 'Grade 8', source: 'Walk-in', status: 'Contacted', date: '2026-08-30', counselor: 'Lakshmi Rao', notes: [{ date: '2026-08-30', by: 'Lakshmi Rao', note: 'Walk-in, interested in Grade 8' }], followUpDate: '2026-09-06' },
  { id: 'e10', studentName: 'Veer Nair', parentName: 'Anil Nair', phone: '+91 9900110011', email: 'anil.n@gmail.com', classApplied: 'Grade 9', source: 'Website', status: 'Application Submitted', date: '2026-08-22', counselor: 'Vikram Singh', notes: [{ date: '2026-08-22', by: 'Vikram Singh', note: 'Website enquiry, application submitted' }] },
];

export const feeHeads: FeeHead[] = [
  { id: 'fh1', name: 'Tuition Fee', type: 'installment', amount: 25000, appliesTo: ['Grade 6', 'Grade 7', 'Grade 8'] },
  { id: 'fh2', name: 'Tuition Fee', type: 'installment', amount: 30000, appliesTo: ['Grade 9', 'Grade 10'] },
  { id: 'fh3', name: 'Transport Fee', type: 'installment', amount: 8000, appliesTo: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'] },
  { id: 'fh4', name: 'Lab Fee', type: 'one_time', amount: 5000, appliesTo: ['Grade 9', 'Grade 10'] },
  { id: 'fh5', name: 'Library Fee', type: 'one_time', amount: 2000, appliesTo: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'] },
  { id: 'fh6', name: 'Exam Fee', type: 'one_time', amount: 3000, appliesTo: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'] },
];

function generateFeeInstallments(): FeeInstallment[] {
  const installments: FeeInstallment[] = [];
  let id = 1;
  for (const student of students) {
    const cls = classSections.find(c => c.id === student.classSectionId);
    if (!cls) continue;
    const tuitionHead = feeHeads.find(fh => fh.name === 'Tuition Fee' && fh.appliesTo.includes(cls.className));
    if (!tuitionHead) continue;
    // Q1 installment
    const q1Paid = id % 3 !== 0;
    installments.push({
      id: `fi${id}`, studentId: student.id, headName: 'Tuition Fee Q1', amount: tuitionHead.amount / 2,
      dueDate: '2026-07-15', paidDate: q1Paid ? '2026-07-10' : undefined,
      status: q1Paid ? 'Paid' : 'Overdue', paymentMode: q1Paid ? 'Online' : undefined, receiptNo: q1Paid ? `RCP${String(id).padStart(4, '0')}` : undefined,
    });
    id++;
    // Q2 installment
    const q2Paid = id % 4 === 0;
    installments.push({
      id: `fi${id}`, studentId: student.id, headName: 'Tuition Fee Q2', amount: tuitionHead.amount / 2,
      dueDate: '2026-10-15', paidDate: q2Paid ? '2026-09-01' : undefined,
      status: q2Paid ? 'Paid' : 'Due', paymentMode: q2Paid ? 'UPI' : undefined, receiptNo: q2Paid ? `RCP${String(id).padStart(4, '0')}` : undefined,
    });
    id++;
    // Transport
    if (student.routeId) {
      const tPaid = id % 2 === 0;
      installments.push({
        id: `fi${id}`, studentId: student.id, headName: 'Transport Fee', amount: 8000,
        dueDate: '2026-08-15', paidDate: tPaid ? '2026-08-10' : undefined,
        status: tPaid ? 'Paid' : 'Overdue', paymentMode: tPaid ? 'Cash' : undefined, receiptNo: tPaid ? `RCP${String(id).padStart(4, '0')}` : undefined,
      });
      id++;
    }
    // Exam fee
    const ePaid = true;
    installments.push({
      id: `fi${id}`, studentId: student.id, headName: 'Exam Fee', amount: 3000,
      dueDate: '2026-09-30', paidDate: ePaid ? '2026-09-01' : undefined,
      status: ePaid ? 'Paid' : 'Due', paymentMode: ePaid ? 'Online' : undefined, receiptNo: ePaid ? `RCP${String(id).padStart(4, '0')}` : undefined,
    });
    id++;
  }
  return installments;
}

export const feeInstallments: FeeInstallment[] = generateFeeInstallments();

export const feeReceipts: FeeReceipt[] = [
  { id: 'r1', receiptNo: 'RCP0001', studentId: 'st1', studentName: 'Arjun Nair', date: '2026-07-10', amount: 12500, mode: 'Online', heads: [{ name: 'Tuition Fee Q1', amount: 12500, gst: 2250 }], totalGst: 2250, grandTotal: 14750 },
  { id: 'r2', receiptNo: 'RCP0002', studentId: 'st2', studentName: 'Diya Nair', date: '2026-07-12', amount: 12500, mode: 'UPI', heads: [{ name: 'Tuition Fee Q1', amount: 12500, gst: 2250 }], totalGst: 2250, grandTotal: 14750 },
  { id: 'r3', receiptNo: 'RCP0003', studentId: 'st3', studentName: 'Kabir Sharma', date: '2026-07-15', amount: 15500, mode: 'Card', heads: [{ name: 'Tuition Fee Q1', amount: 12500, gst: 2250 }, { name: 'Transport Fee', amount: 3000, gst: 540 }], totalGst: 2790, grandTotal: 18290 },
];

function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let id = 1;
  const today = new Date();
  for (let d = 0; d < 5; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    for (const student of students) {
      const rand = (student.id.charCodeAt(2) + d) % 10;
      let status: 'Present' | 'Absent' | 'Late' | 'Half-day' = 'Present';
      if (rand === 0) status = 'Absent';
      else if (rand === 1) status = 'Late';
      else if (rand === 2) status = 'Half-day';
      records.push({ id: `a${id}`, studentId: student.id, date: dateStr, status, markedBy: 's2' });
      id++;
    }
  }
  return records;
}

export const attendanceRecords: AttendanceRecord[] = generateAttendance();

export const staffAttendance: StaffAttendance[] = staff.slice(0, 8).map((s, i) => ({
  id: `sa${i + 1}`, staffId: s.id, date: new Date().toISOString().split('T')[0],
  checkIn: i % 3 === 0 ? '09:15' : '08:45', checkOut: '16:30',
  status: i % 4 === 0 ? 'Late' : 'Present',
}));

export const leaveRequests: LeaveRequest[] = [
  { id: 'lr1', staffId: 's3', staffName: 'Meena Iyer', type: 'Casual Leave', fromDate: '2026-09-10', toDate: '2026-09-11', reason: 'Personal work', status: 'Pending', appliedOn: '2026-09-05' },
  { id: 'lr2', staffId: 's5', staffName: 'Lakshmi Rao', type: 'Sick Leave', fromDate: '2026-09-03', toDate: '2026-09-04', reason: 'Fever', status: 'Approved', appliedOn: '2026-09-02' },
  { id: 'lr3', staffId: 's8', staffName: 'Arjun Das', type: 'Earned Leave', fromDate: '2026-09-15', toDate: '2026-09-18', reason: 'Family vacation', status: 'Pending', appliedOn: '2026-09-04' },
  { id: 'lr4', staffId: 's6', staffName: 'Vikram Singh', type: 'Casual Leave', fromDate: '2026-09-08', toDate: '2026-09-08', reason: 'Medical appointment', status: 'Rejected', appliedOn: '2026-09-01' },
];

export const examTerms: ExamTerm[] = [
  { id: 'et1', name: 'Unit Test 1', startDate: '2026-09-20', endDate: '2026-09-28', status: 'Draft' },
  { id: 'et2', name: 'Mid-Term Exam', startDate: '2026-10-15', endDate: '2026-10-25', status: 'Draft' },
  { id: 'et3', name: 'Final Exam', startDate: '2027-02-10', endDate: '2027-02-20', status: 'Draft' },
];

export const examSubjects: ExamSubject[] = [
  { id: 'es1', termId: 'et1', subject: 'Mathematics', classSectionId: 'c1', date: '2026-09-20', maxMarks: 50, weightage: 20 },
  { id: 'es2', termId: 'et1', subject: 'Science', classSectionId: 'c1', date: '2026-09-22', maxMarks: 50, weightage: 20 },
  { id: 'es3', termId: 'et1', subject: 'English', classSectionId: 'c1', date: '2026-09-24', maxMarks: 50, weightage: 20 },
  { id: 'es4', termId: 'et1', subject: 'Social Studies', classSectionId: 'c1', date: '2026-09-26', maxMarks: 50, weightage: 20 },
  { id: 'es5', termId: 'et1', subject: 'Computer Science', classSectionId: 'c1', date: '2026-09-28', maxMarks: 50, weightage: 20 },
];

export const examMarks: ExamMark[] = students.filter(s => s.classSectionId === 'c1').map((s, i) => {
  const subjects = ['es1', 'es2', 'es3', 'es4', 'es5'];
  return subjects.map((subId, j) => {
    const marks = 30 + ((i + j) % 20);
    return { id: `em${s.id}${subId}`, termId: 'et1', subjectId: subId, studentId: s.id, marks, grade: marks >= 40 ? 'A' : marks >= 30 ? 'B' : 'C' };
  });
}).flat();

export const reportCards: ReportCard[] = students.filter(s => s.classSectionId === 'c1').map((s, i) => ({
  id: `rc${s.id}`, termId: 'et1', studentId: s.id, status: 'Draft',
  totalMarks: 150 + (i % 50), percentage: 60 + (i % 30), grade: 'B', rank: i + 1, result: 'Pass' as const,
}));

export const notices: Notice[] = [
  { id: 'n1', title: 'Mid-Term Exam Schedule Released', body: 'The mid-term examination schedule has been published. Please check the exam timetable section for details.', date: '2026-09-05', audience: 'Whole School', readBy: ['u3'], priority: 'Important' },
  { id: 'n2', title: 'School Holiday - Onam Celebration', body: 'School will remain closed on September 8th for Onam. Wishing all families a joyful festival!', date: '2026-09-04', audience: 'Whole School', readBy: ['u3', 'u4'], priority: 'Normal' },
  { id: 'n3', title: 'Parent-Teacher Meeting', body: 'PTM for Grade 6 is scheduled for September 12th, 10:00 AM to 1:00 PM. Please confirm your attendance.', date: '2026-09-03', audience: 'Class', targetClass: 'Grade 6', readBy: [], priority: 'Important' },
  { id: 'n4', title: 'Bus Route Change - Route 2', body: 'Due to road construction, Bus Route 2 will take a diversion via Church Street from September 7th. Pickup times may shift by 5 minutes.', date: '2026-09-02', audience: 'Whole School', readBy: ['u3'], priority: 'Urgent' },
  { id: 'n5', title: 'Science Exhibition Registration', body: 'Students interested in the inter-school science exhibition should register with their science teacher by September 15th.', date: '2026-09-01', audience: 'Whole School', readBy: [], priority: 'Normal' },
];

export const homeworks: Homework[] = [
  { id: 'hw1', title: 'Algebra Worksheet - Chapter 3', description: 'Complete problems 1-15 from the worksheet. Focus on solving linear equations.', subject: 'Mathematics', classSectionId: 'c1', assignedBy: 'Rajesh Kumar', assignedOn: '2026-09-05', dueDate: '2026-09-08', attachments: ['algebra-worksheet.pdf'], submissions: { studentId: 'st1', submitted: true, submittedOn: '2026-09-06' } },
  { id: 'hw2', title: 'Lab Report - Plant Cell Observation', description: 'Write a detailed lab report on the plant cell observation from today\'s lab session.', subject: 'Science', classSectionId: 'c1', assignedBy: 'Meena Iyer', assignedOn: '2026-09-04', dueDate: '2026-09-09', attachments: ['lab-template.docx'], submissions: { studentId: 'st1', submitted: false } },
  { id: 'hw3', title: 'Essay - My Favorite Festival', description: 'Write a 500-word essay about your favorite festival. Use descriptive language.', subject: 'English', classSectionId: 'c1', assignedBy: 'Sunil Reddy', assignedOn: '2026-09-03', dueDate: '2026-09-07', attachments: [], submissions: { studentId: 'st1', submitted: true, submittedOn: '2026-09-05' } },
  { id: 'hw4', title: 'Map Work - Indian Rivers', description: 'Mark all major rivers of India on the outline map provided.', subject: 'Social Studies', classSectionId: 'c1', assignedBy: 'Lakshmi Rao', assignedOn: '2026-09-02', dueDate: '2026-09-06', attachments: ['india-outline-map.pdf'], submissions: { studentId: 'st1', submitted: false } },
];

export const messages: Message[] = [
  { id: 'm1', fromId: 's2', toId: 'u3', fromName: 'Rajesh Kumar', toName: 'Priya Nair', body: 'Arjun has been performing well in Mathematics. Keep encouraging him to practice daily!', date: '2026-09-04 10:30', senderRole: 'teacher' },
  { id: 'm2', fromId: 'u3', toId: 's2', fromName: 'Priya Nair', toName: 'Rajesh Kumar', body: 'Thank you sir! We will make sure he practices every evening.', date: '2026-09-04 11:15', senderRole: 'parent' },
  { id: 'm3', fromId: 's2', toId: 'u3', fromName: 'Rajesh Kumar', toName: 'Priya Nair', body: 'Also, please check the algebra worksheet due on Monday.', date: '2026-09-04 11:20', senderRole: 'teacher' },
];

export const tickets: Ticket[] = [
  { id: 't1', subject: 'Bus arrived late 3 days in a row', raisedBy: 'Priya Nair', raisedByRole: 'Parent', date: '2026-09-04', status: 'Open', priority: 'High' },
  { id: 't2', subject: 'Request for extra math coaching', raisedBy: 'Suresh Verma', raisedByRole: 'Parent', date: '2026-09-02', status: 'In Progress', priority: 'Medium' },
  { id: 't3', subject: 'Canteen food quality feedback', raisedBy: 'Karan Malhotra', raisedByRole: 'Parent', date: '2026-08-30', status: 'Resolved', priority: 'Low' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physical Education', 'Library'];
const teacherMap: Record<string, string> = { 'Mathematics': 's2', 'Science': 's3', 'English': 's4', 'Social Studies': 's5', 'Computer Science': 's7', 'Physical Education': 's8', 'Library': 's9' };

export const timetableSlots: TimetableSlot[] = [];
let ttId = 1;
for (const cls of classSections) {
  for (const day of days) {
    for (let period = 1; period <= 6; period++) {
      const subj = subjects[(period + days.indexOf(day) + parseInt(cls.className.replace('Grade ', ''))) % subjects.length];
      timetableSlots.push({
        id: `tt${ttId}`, classSectionId: cls.id, day, period, subject: subj,
        teacherId: teacherMap[subj] || 's2', room: subj === 'Computer Science' ? 'Lab 1' : subj === 'Physical Education' ? 'Ground' : cls.room,
        isSpecial: subj === 'Computer Science' || subj === 'Physical Education' || subj === 'Library',
      });
      ttId++;
    }
  }
}

export const substitutes: SubstituteAssignment[] = [
  { id: 'sub1', date: '2026-09-06', classSectionId: 'c1', period: 2, originalTeacherId: 's3', substituteTeacherId: 's6', subject: 'Science' },
];

export const payrollRecords: PayrollRecord[] = staff.map((s, i) => ({
  id: `pr${i + 1}`, staffId: s.id, month: 'September 2026', basic: Math.round(s.salary * 0.6),
  allowances: Math.round(s.salary * 0.3), deductions: Math.round(s.salary * 0.1),
  net: s.salary, status: i % 3 === 0 ? 'Pending' : 'Paid', payslipNo: i % 3 === 0 ? undefined : `PSL${String(i + 1).padStart(3, '0')}`,
}));

export const transportRoutes: TransportRoute[] = [
  { id: 'r1', name: 'Route 1 - North Bangalore', vehicleNo: 'KA01 AB 1234', driverId: 'd1', capacity: 30, occupied: 22, liveLat: 12.9716, liveLng: 77.5946, progress: 65, stops: [
    { id: 'stop1', name: 'MG Road', pickupTime: '07:15', dropTime: '15:45', fare: 8000 },
    { id: 'stop2', name: 'Brigade Road', pickupTime: '07:25', dropTime: '15:35', fare: 8000 },
    { id: 'stop3', name: 'Indiranagar', pickupTime: '07:35', dropTime: '15:25', fare: 8000 },
  ]},
  { id: 'r2', name: 'Route 2 - South Bangalore', vehicleNo: 'KA02 CD 5678', driverId: 'd2', capacity: 30, occupied: 18, liveLat: 12.9141, liveLng: 77.6102, progress: 40, stops: [
    { id: 'stop1', name: 'Jayanagar', pickupTime: '07:10', dropTime: '15:50', fare: 8000 },
    { id: 'stop2', name: 'BTM Layout', pickupTime: '07:20', dropTime: '15:40', fare: 8000 },
    { id: 'stop3', name: 'HSR Layout', pickupTime: '07:30', dropTime: '15:30', fare: 8000 },
  ]},
  { id: 'r3', name: 'Route 3 - East Bangalore', vehicleNo: 'KA03 EF 9012', driverId: 'd3', capacity: 25, occupied: 15, liveLat: 12.9698, liveLng: 77.7500, progress: 80, stops: [
    { id: 'stop1', name: 'Whitefield', pickupTime: '07:00', dropTime: '16:00', fare: 9000 },
    { id: 'stop2', name: 'Marathahalli', pickupTime: '07:15', dropTime: '15:45', fare: 8500 },
  ]},
];

export const vehicles: Vehicle[] = [
  { id: 'v1', number: 'KA01 AB 1234', type: 'Bus 42-seater', capacity: 42, driverName: 'Ramesh', driverPhone: '+91 9110011223', licenseExpiry: '2027-03-15', insuranceExpiry: '2026-12-20', maintenanceDue: '2026-10-15' },
  { id: 'v2', number: 'KA02 CD 5678', type: 'Bus 42-seater', capacity: 42, driverName: 'Mahesh', driverPhone: '+91 9220022334', licenseExpiry: '2026-11-10', insuranceExpiry: '2026-09-30', maintenanceDue: '2026-09-20' },
  { id: 'v3', number: 'KA03 EF 9012', type: 'Mini Bus 25-seater', capacity: 25, driverName: 'Suresh', driverPhone: '+91 9330033445', licenseExpiry: '2028-01-05', insuranceExpiry: '2027-02-28', maintenanceDue: '2026-11-10' },
];

export const activities: Activity[] = [
  { id: 'act1', type: 'payment', message: 'Fee payment received from Diya Nair', time: '10 min ago', amount: 12500 },
  { id: 'act2', type: 'enquiry', message: 'New enquiry from Reyansh Das (Grade 6)', time: '25 min ago' },
  { id: 'act3', type: 'leave', message: 'Meena Iyer applied for Casual Leave', time: '1 hour ago' },
  { id: 'act4', type: 'attendance', message: 'Attendance marked for Grade 6-A', time: '2 hours ago' },
  { id: 'act5', type: 'notice', message: 'Notice published: Mid-Term Exam Schedule', time: '3 hours ago' },
  { id: 'act6', type: 'admission', message: 'Zara Khan admitted to Grade 7', time: '5 hours ago' },
  { id: 'act7', type: 'payment', message: 'Fee payment received from Kabir Sharma', time: '6 hours ago', amount: 15500 },
  { id: 'act8', type: 'enquiry', message: 'New enquiry from Ayaan Verma (Grade 6)', time: '8 hours ago' },
];

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce1', date: '2026-09-08', title: 'Onam Holiday', type: 'Holiday' },
  { id: 'ce2', date: '2026-09-12', title: 'Parent-Teacher Meeting', type: 'Event' },
  { id: 'ce3', date: '2026-09-20', title: 'Unit Test 1 Begins', type: 'Exam' },
  { id: 'ce4', date: '2026-09-28', title: 'Unit Test 1 Ends', type: 'Exam' },
  { id: 'ce5', date: '2026-09-15', title: 'Science Exhibition Registration Deadline', type: 'Event' },
  { id: 'ce6', date: '2026-10-02', title: 'Gandhi Jayanti Holiday', type: 'Holiday' },
];

export const notifications: Notification[] = [
  { id: 'nt1', title: 'Fee Overdue', body: 'Arjun Nair\'s transport fee is overdue. Due date was Aug 15.', time: '5 min ago', read: false, type: 'fee' },
  { id: 'nt2', title: 'New Enquiry', body: 'A new enquiry was received from Reyansh Das for Grade 6.', time: '30 min ago', read: false, type: 'general' },
  { id: 'nt3', title: 'Leave Request', body: 'Meena Iyer has applied for Casual Leave on Sep 10-11.', time: '1 hour ago', read: false, type: 'general' },
  { id: 'nt4', title: 'Exam Schedule', body: 'Unit Test 1 schedule has been released.', time: '3 hours ago', read: true, type: 'exam' },
  { id: 'nt5', title: 'Absent Alert', body: 'Diya Nair was marked absent today.', time: '4 hours ago', read: true, type: 'attendance' },
];

export const feeCollectionTrend = [
  { month: 'Apr', amount: 1850000, target: 2000000 },
  { month: 'May', amount: 2100000, target: 2000000 },
  { month: 'Jun', amount: 1950000, target: 2000000 },
  { month: 'Jul', amount: 2350000, target: 2200000 },
  { month: 'Aug', amount: 2180000, target: 2200000 },
  { month: 'Sep', amount: 1620000, target: 2200000 },
];

export const attendanceTrend = [
  { day: 'Mon', present: 28, absent: 2 },
  { day: 'Tue', present: 29, absent: 1 },
  { day: 'Wed', present: 27, absent: 3 },
  { day: 'Thu', present: 30, absent: 0 },
  { day: 'Fri', present: 26, absent: 4 },
];

export const admissionFunnel = [
  { stage: 'New', count: 12, fill: '#3b82f6' },
  { stage: 'Contacted', count: 8, fill: '#6366f1' },
  { stage: 'Visit', count: 5, fill: '#8b5cf6' },
  { stage: 'Applied', count: 4, fill: '#a855f7' },
  { stage: 'Verified', count: 3, fill: '#d946ef' },
  { stage: 'Admitted', count: 2, fill: '#22c55e' },
];

export const classStrength = [
  { name: 'Grade 6', students: 10, fill: '#3b82f6' },
  { name: 'Grade 7', students: 5, fill: '#22c55e' },
  { name: 'Grade 8', students: 5, fill: '#8b5cf6' },
  { name: 'Grade 9', students: 5, fill: '#f97316' },
  { name: 'Grade 10', students: 5, fill: '#14b8a6' },
];

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getStaffById(id: string): Staff | undefined {
  return staff.find(s => s.id === id);
}

export function getClassById(id: string): ClassSection | undefined {
  return classSections.find(c => c.id === id);
}

export function getClassName(id: string): string {
  const c = classSections.find(c => c.id === id);
  return c ? `${c.className} ${c.section}` : 'Unknown';
}
