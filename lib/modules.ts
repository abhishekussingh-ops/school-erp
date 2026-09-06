import { Role } from './types';
import {
  LayoutDashboard, UserPlus, CreditCard, CalendarCheck, GraduationCap,
  MessageSquare, CalendarDays, Users, Bus, Settings,
} from 'lucide-react';

export interface ModuleConfig {
  id: string;
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  roles: Role[];
  description: string;
}

export const modules: ModuleConfig[] = [
  {
    id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard,
    color: 'slate', bgColor: 'bg-slate-50', textColor: 'text-slate-700', borderColor: 'border-slate-200',
    roles: ['super_admin', 'school_admin', 'teacher', 'parent', 'student'],
    description: 'Role-aware overview with KPIs, charts, and quick actions',
  },
  {
    id: 'admissions', label: 'Admissions CRM', path: '/admissions', icon: UserPlus,
    color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200',
    roles: ['super_admin', 'school_admin'],
    description: 'Enquiry pipeline, application management, and conversion tracking',
  },
  {
    id: 'fees', label: 'Fees & Payments', path: '/fees', icon: CreditCard,
    color: 'green', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200',
    roles: ['super_admin', 'school_admin', 'parent', 'student'],
    description: 'Fee structure, student ledger, online payments, and collection reports',
  },
  {
    id: 'attendance', label: 'Attendance', path: '/attendance', icon: CalendarCheck,
    color: 'purple', bgColor: 'bg-violet-50', textColor: 'text-violet-700', borderColor: 'border-violet-200',
    roles: ['super_admin', 'school_admin', 'teacher', 'parent', 'student'],
    description: 'Daily attendance marking, leave management, and reports',
  },
  {
    id: 'exams', label: 'Exams & Results', path: '/exams', icon: GraduationCap,
    color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200',
    roles: ['super_admin', 'school_admin', 'teacher', 'parent', 'student'],
    description: 'Exam setup, marks entry, report cards, and performance analytics',
  },
  {
    id: 'communication', label: 'Communication', path: '/communication', icon: MessageSquare,
    color: 'pink', bgColor: 'bg-pink-50', textColor: 'text-pink-700', borderColor: 'border-pink-200',
    roles: ['super_admin', 'school_admin', 'teacher', 'parent', 'student'],
    description: 'Notices, homework, messaging, and parent-teacher communication',
  },
  {
    id: 'timetable', label: 'Timetable', path: '/timetable', icon: CalendarDays,
    color: 'cyan', bgColor: 'bg-cyan-50', textColor: 'text-cyan-700', borderColor: 'border-cyan-200',
    roles: ['super_admin', 'school_admin', 'teacher', 'parent', 'student'],
    description: 'Weekly timetable builder with conflict detection and substitutes',
  },
  {
    id: 'hr', label: 'Staff & HR', path: '/hr', icon: Users,
    color: 'indigo', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', borderColor: 'border-indigo-200',
    roles: ['super_admin', 'school_admin'],
    description: 'Staff directory, payroll, leave management, and HR reports',
  },
  {
    id: 'transport', label: 'Transport', path: '/transport', icon: Bus,
    color: 'teal', bgColor: 'bg-teal-50', textColor: 'text-teal-700', borderColor: 'border-teal-200',
    roles: ['super_admin', 'school_admin', 'parent', 'student'],
    description: 'Route management, live GPS tracking, and vehicle maintenance',
  },
  {
    id: 'settings', label: 'Settings', path: '/settings', icon: Settings,
    color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200',
    roles: ['super_admin', 'school_admin'],
    description: 'School profile, academic year, roles, and notification preferences',
  },
];

export function getModulesForRole(role: Role): ModuleConfig[] {
  return modules.filter(m => m.roles.includes(role));
}

export function getModuleById(id: string): ModuleConfig | undefined {
  return modules.find(m => m.id === id);
}
