-- Core structural tables
CREATE TABLE branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL
);

CREATE TABLE class_sections (
    id TEXT PRIMARY KEY,
    class_name TEXT NOT NULL,
    section TEXT NOT NULL,
    class_teacher_id TEXT,
    capacity INTEGER NOT NULL,
    room TEXT NOT NULL
);

-- Users & Role definitions
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    role TEXT REFERENCES roles(id),
    linked_student_ids TEXT[],
    linked_staff_id TEXT,
    linked_student_id TEXT
);

-- Main entities
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    admission_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    class_section_id TEXT REFERENCES class_sections(id),
    roll_no INTEGER,
    gender TEXT,
    dob DATE,
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    address TEXT,
    blood_group TEXT,
    route_id TEXT,
    stop_id TEXT,
    status TEXT,
    admission_date DATE
);

CREATE TABLE staff (
    id TEXT PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    designation TEXT,
    department TEXT,
    subjects TEXT[],
    gender TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    qualification TEXT,
    joining_date DATE,
    employment_type TEXT,
    salary NUMERIC,
    leave_balance INTEGER,
    blood_group TEXT,
    address TEXT
);

-- Enquiries
CREATE TABLE enquiries (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    class_applied TEXT,
    source TEXT,
    status TEXT,
    date DATE,
    counselor TEXT,
    notes JSONB, -- Storing timeline entries as JSON
    follow_up_date DATE
);

-- Fees
CREATE TABLE fee_heads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    applies_to TEXT[] -- class names
);

CREATE TABLE fee_installments (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id),
    head_name TEXT,
    amount NUMERIC NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status TEXT,
    payment_mode TEXT,
    receipt_no TEXT
);

-- Attendance (Needs indexes for performance)
CREATE TABLE attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id),
    date DATE NOT NULL,
    status TEXT,
    marked_by TEXT
);

-- Exams
CREATE TABLE exam_terms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT
);

CREATE TABLE exam_subjects (
    id TEXT PRIMARY KEY,
    term_id TEXT REFERENCES exam_terms(id),
    subject TEXT,
    class_section_id TEXT REFERENCES class_sections(id),
    date DATE,
    max_marks INTEGER,
    weightage INTEGER
);

CREATE TABLE exam_marks (
    id TEXT PRIMARY KEY,
    term_id TEXT REFERENCES exam_terms(id),
    subject_id TEXT REFERENCES exam_subjects(id),
    student_id TEXT REFERENCES students(id),
    marks INTEGER,
    grade TEXT
);
