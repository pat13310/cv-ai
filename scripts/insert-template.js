import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier SQL
const sqlContent = fs.readFileSync(path.join(__dirname, '../supabase/insert_new_templates.sql'), 'utf8');

console.log('Contenu SQL à exécuter:');
console.log('='.repeat(50));
console.log(sqlContent);
console.log('='.repeat(50));

console.log('\nLe template CV Consultant Senior est prêt à être inséré.');
console.log('Vous pouvez copier cette requête SQL et l\'exécuter dans votre interface Supabase.');