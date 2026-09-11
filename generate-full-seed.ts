import {
    students, staff, enquiries, feeHeads, feeInstallments, classSections, users, roles, branches
} from './lib/mock-data';

function formatValue(val: any): string {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
    if (Array.isArray(val)) return `'{"${val.join('","')}"}'`;
    return val.toString();
}

function generateInsertSql(table: string, data: any[]): string {
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
