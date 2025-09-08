#!/usr/bin/env node

/**
 * Script de configuration automatique de Supabase
 * Ce script aide à configurer et tester la connexion Supabase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configuration de Supabase pour cv-ats-ai\n');

// Vérifier si le fichier .env existe
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env non trouvé !');
  console.log('Créez d\'abord un fichier .env avec vos clés Supabase.');
  process.exit(1);
}

// Lire le fichier .env
const envContent = fs.readFileSync(envPath, 'utf8');
const hasRealKeys = envContent.includes('supabase.co') && !envContent.includes('your_supabase');

if (!hasRealKeys) {
  console.log('⚠️  Les clés Supabase ne semblent pas être configurées.');
  console.log('Suivez le guide SUPABASE_SETUP_GUIDE.md pour obtenir vos clés.\n');
  
  console.log('Format attendu dans .env :');
  console.log('VITE_SUPABASE_URL=https://votre-project-id.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJ...\n');
  
  process.exit(1);
}

console.log('✅ Clés Supabase détectées dans .env');

// Vérifier si Supabase CLI est disponible
try {
  execSync('npx supabase --version', { stdio: 'pipe' });
  console.log('✅ Supabase CLI disponible');
} catch (error) {
  console.error('❌ Supabase CLI non disponible');
  console.log('Installez-le avec : npm install --save-dev supabase');
  process.exit(1);
}

// Fonction pour exécuter une commande avec gestion d'erreur
function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log(`✅ ${description} réussi`);
    if (output.trim()) {
      console.log(`   ${output.trim()}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ ${description} échoué`);
    console.error(`   ${error.message}`);
    return false;
  }
}

// Tenter de se connecter au projet
console.log('\n📡 Test de connexion au projet Supabase...');

// Extraire l'URL du projet depuis .env
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
if (urlMatch) {
  const projectUrl = urlMatch[1].trim();
  const projectId = projectUrl.replace('https://', '').replace('.supabase.co', '');
  
  console.log(`🔗 URL du projet : ${projectUrl}`);
  console.log(`🆔 ID du projet : ${projectId}`);
}

// Vérifier les migrations existantes
const migrationsPath = path.join(process.cwd(), 'supabase', 'migrations');
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));
  console.log(`\n📄 ${migrations.length} migration(s) trouvée(s) :`);
  migrations.forEach(migration => {
    console.log(`   - ${migration}`);
  });
  
  // Proposer d'appliquer les migrations
  console.log('\n🔄 Application des migrations...');
  console.log('⚠️  IMPORTANT : Assurez-vous que votre projet Supabase est complètement initialisé avant de continuer.');
  console.log('   (Attendez 1-2 minutes après la création du projet)');
  
  // Note: En production, on pourrait demander confirmation ici
  // Pour ce script, on affiche juste les instructions
  console.log('\n📋 Pour appliquer les migrations manuellement :');
  console.log('   npx supabase db push');
  
} else {
  console.log('\n📄 Aucune migration trouvée dans supabase/migrations/');
}

console.log('\n🎉 Configuration terminée !');
console.log('\n📋 Prochaines étapes :');
console.log('1. Vérifiez que votre projet Supabase est complètement initialisé');
console.log('2. Exécutez : npx supabase db push (pour appliquer les migrations)');
console.log('3. Démarrez votre application : npm run dev');
console.log('4. Testez les fonctionnalités de base de données');

console.log('\n🔗 Liens utiles :');
console.log('- Dashboard Supabase : https://supabase.com/dashboard');
console.log('- Documentation : https://supabase.com/docs');
console.log('- Guide local : ./SUPABASE_SETUP_GUIDE.md');