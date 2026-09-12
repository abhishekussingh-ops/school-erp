// This script will extract mock data and format as SQL INSERTs.
// I will log the SQL to the console, and then you can copy it to a seed.sql file or I can write it directly if I can execute it.

const mockData = require('./lib/mock-data');

function generateInsertSql(table, data) {
    if (data.length === 0) return '';
    const columns = Object.keys(data[0]).join(', ');
    const values = data.map(item => {
        return '(' + Object.values(item).map(val => {
            if (val === undefined || val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (Array.isArray(val)) return `'{"${val.join('","')}"}'`;
            return val;
        }).join(', ') + ')';
    }).join(',\n');
    return `INSERT INTO ${table} (${columns}) VALUES \n${values};\n`;
}

// Map mock structures to table names as defined in schema.sql
const mapping = [
    { table: 'roles', data: mockData.roles },
    { table: 'branches', data: mockData.branches },
    { table: 'users', data: mockData.users },
    { table: 'class_sections', data: mockData.classSections },
    { table: 'students', data: mockData.students },
    { table: 'staff', data: mockData.staff },
    { table: 'enquiries', data: mockData.enquiries },
    { table: 'fee_heads', data: mockData.feeHeads },
    { table: 'fee_installments', data: mockData.feeInstallments },
    { table: 'attendance_records', data: mockData.attendanceRecords }
];

mapping.forEach(m => console.log(generateInsertSql(m.table, m.data)));
