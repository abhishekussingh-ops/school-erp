import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Using a pool is better for handling multiple requests
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:postgrespassword@localhost:5432/school_erp_dev',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, parentName, phone, email, classApplied, source, status, date } = body;

    const query = `INSERT INTO enquiries (id, student_name, parent_name, phone, email, class_applied, source, status, date, counselor, notes)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                   RETURNING *`;
    const values = [
      `e${Date.now()}`,
      studentName,
      parentName,
      phone,
      email,
      classApplied,
      source,
      status || 'New',
      date || new Date().toISOString().split('T')[0],
      'System Admin',
      JSON.stringify([]) // Starting with empty notes
    ];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query('SELECT id, student_name as "studentName", parent_name as "parentName", phone, email, class_applied as "classApplied", source, status, date, counselor, notes, follow_up_date as "followUpDate" FROM enquiries');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
