-- Clear existing data to avoid conflicts
TRUNCATE TABLE fee_installments, fee_heads, enquiries, staff, students, class_sections, users, branches, roles RESTART IDENTITY;

INSERT INTO roles (id, label, description) VALUES
('super_admin', 'Super Admin', 'Full system access across all branches'),
('school_admin', 'School Admin', 'Manage school operations, staff & finances'),
('teacher', 'Teacher / Staff', 'Manage classes, attendance & marks'),
('parent', 'Parent', 'View child progress & pay fees'),
('student', 'Student', 'View timetable, homework & results');

INSERT INTO branches (id, name, location) VALUES
('br1', 'Lovedale Main Campus', 'MG Road, Bangalore'),
('br2', 'Lovedale North Branch', 'Hebbal, Bangalore');

INSERT INTO users (id, name, email, avatar, role, linked_staff_id) VALUES
('u1', 'Dr. Anita Sharma', 'anita.sharma@lovedale.edu', 'AS', 'school_admin', 's1'),
('u2', 'Rajesh Kumar', 'rajesh.kumar@lovedale.edu', 'RK', 'teacher', 's2'),
('u3', 'Priya Nair', 'priya.nair@gmail.com', 'PN', 'parent', NULL),
('u4', 'Arjun Nair', 'arjun.nair@lovedale.edu', 'AN', 'student', NULL),
('u5', 'Super Admin', 'admin@lovedale.edu', 'SA', 'super_admin', NULL);

INSERT INTO class_sections (id, class_name, section, class_teacher_id, capacity, room) VALUES
('c1', 'Grade 6', 'A', 's2', 35, '201'),
('c2', 'Grade 6', 'B', 's3', 35, '202'),
('c3', 'Grade 7', 'A', 's4', 35, '203'),
('c4', 'Grade 8', 'A', 's5', 35, '301'),
('c5', 'Grade 9', 'A', 's6', 35, '401'),
('c6', 'Grade 10', 'A', 's7', 35, '501');

INSERT INTO students (id, admission_no, name, avatar, class_section_id, roll_no, gender, dob, parent_name, parent_phone, parent_email, address, blood_group, route_id, stop_id, status, admission_date) VALUES
('st1', 'LVD2026001', 'Arjun Nair', 'AN', 'c1', 1, 'Female', '2004-02-15', 'Nair Mother', '+91 98100137', 'parent1@gmail.com', '10, Brigade Road, Bangalore', 'B+', 'r2', 'stop2', 'Active', '2026-02-15'),
('st2', 'LVD2026002', 'Diya Sharma', 'DS', 'c1', 2, 'Male', '2004-03-15', 'Sharma Father', '+91 98100274', 'parent2@gmail.com', '20, Indiranagar, Bangalore', 'O+', NULL, NULL, 'Active', '2026-03-15');

INSERT INTO staff (id, employee_id, name, avatar, designation, department, subjects, gender, phone, email, qualification, joining_date, employment_type, salary, leave_balance, blood_group, address) VALUES
('s1', 'EMP001', 'Dr. Anita Sharma', 'AS', 'Principal', 'Administration', '{""}', 'Female', '+91 9810012345', 'anita.sharma@lovedale.edu', 'Ph.D. Education', '2015-06-01', 'Full-time', 120000, 12, 'O+', 'Jayanagar, Bangalore'),
('s2', 'EMP002', 'Rajesh Kumar', 'RK', 'Senior Teacher', 'Mathematics', '{"Mathematics","Statistics"}', 'Male', '+91 9820023456', 'rajesh.kumar@lovedale.edu', 'M.Sc. Mathematics', '2018-06-15', 'Full-time', 65000, 8, 'A+', 'Indiranagar, Bangalore');
