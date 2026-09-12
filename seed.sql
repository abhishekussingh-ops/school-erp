INSERT INTO roles (id, label, description) VALUES
('super_admin', 'Super Admin', 'Full system access across all branches'),
('school_admin', 'School Admin', 'Manage school operations, staff & finances'),
('teacher', 'Teacher / Staff', 'Manage classes, attendance & marks'),
('parent', 'Parent', 'View child progress & pay fees'),
('student', 'Student', 'View timetable, homework & results');

INSERT INTO branches (id, name, location) VALUES
('br1', 'Lovedale Main Campus', 'MG Road, Bangalore'),
('br2', 'Lovedale North Branch', 'Hebbal, Bangalore');
