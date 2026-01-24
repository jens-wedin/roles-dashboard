import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'design_roles_data.json');
const rawData = readFileSync(filePath, 'utf-8');
const data = JSON.parse(rawData);

function cleanString(str) {
    if (typeof str === 'string') {
        return str.trim();
    }
    return str;
}

const cleanedData = data.map(role => {
    const newRole = {};
    for (const key in role) {
        newRole[key] = cleanString(role[key]);
    }
    return newRole;
});

writeFileSync(filePath, JSON.stringify(cleanedData, null, 2));

console.log(`Cleaned ${cleanedData.length} records.`);
