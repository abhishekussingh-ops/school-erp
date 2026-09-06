'use client';

import { useApp } from '@/lib/app-context';
import { AppShell } from '@/components/layout/app-shell';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
import { ParentDashboard } from '@/components/dashboards/parent-dashboard';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';

export default function HomePage() {
  const { role } = useApp();

  return (
    <AppShell>
      {role === 'school_admin' || role === 'super_admin' ? <AdminDashboard /> : null}
      {role === 'teacher' ? <TeacherDashboard /> : null}
      {role === 'parent' ? <ParentDashboard /> : null}
      {role === 'student' ? <StudentDashboard /> : null}
    </AppShell>
  );
}
