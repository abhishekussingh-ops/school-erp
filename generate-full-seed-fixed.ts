import {
    students, staff, enquiries, feeHeads, feeInstallments, classSections, users, roles, branches
} from './lib/mock-data';

function formatValue(val: any): string {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
    if (Array.isArray(val)) return `'{"${val.join('","')}"}'`;
    return val.toString();
}

// Helper to map camelCase (TypeScript) to snake_case (SQL)
function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function generateInsertSql(table: string, data: any[]): string {
    if (data.length === 0) return '';

    // Map keys to snake_case
    const keys = Object.keys(data[0]);
    const columns = keys.map(toSnakeCase).join(', ');

    const values = data.map(item => {
        return '(' + keys.map(k => formatValue(item[k])).join(', ') + ')';
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
