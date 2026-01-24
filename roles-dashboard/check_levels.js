import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'design_roles_data.json');
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

const orgLevels = new Set();
data.forEach(role => {
    if (role['org-level']) {
        orgLevels.add(`'${role['org-level']}'`);
    }
});

console.log('Unique org-levels:', Array.from(orgLevels));
