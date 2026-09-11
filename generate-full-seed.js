// To seed all data, I will read the structure from lib/mock-data.ts
// and generate INSERT statements for all tables.
// Since I have mock-data.ts with all the data, I will write a script to
// generate the full seed.sql directly.

const mockData = require('./lib/mock-data');

// Since mock-data.ts export objects directly, this should be accessible via require if I structure it properly.
// Wait, mock-data.ts is TS. I need to run this with tsx.

// I will write a script that converts the objects to SQL and runs it via exec.

const { students, staff, enquiries, feeHeads, feeInstallments, classSections, users, roles, branches } = require('./lib/mock-data');

function formatValue(val) {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
    if (Array.isArray(val)) return `'{"${val.join('","')}"}'`;
    return val;
}

function generateInsertSql(table, data) {
    if (data.length === 0) return '';
    const columns = Object.keys(data[0]).join(', ');
    const values = data.map(item => {
        return '(' + Object.values(item).map(formatValue).join(', ') + ')';
    }).join(',\n');
    return `INSERT INTO ${table} (${columns}) VALUES \n${values};\n`;
}

// Generate all SQL
const sql = [
    generateInsertSql('roles', roles),
    generateInsertSql('branches', branches),
    generateInsertSql('users', users),
    generateInsertSql('class_sections', classSections),
    generateInsertSql('students', students),
    generateInsertSql('staff', staff),
    generateInsertSql('enquiries', enquiries),
    generateInsertSql('fee_heads', feeHeads),
    generateInsertSql('fee_installments', feeInstallments)
].join('\n');

console.log(sql);
