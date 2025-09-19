#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion Supabase et les profils
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis le fichier .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Test de connexion Supabase et profils\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

console.log('✅ Variables d\'environnement configurées');
console.log('   URL:', supabaseUrl);
console.log('   Key:', supabaseKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔗 Test de connexion à Supabase...');
    
    // Test 1: Connexion de base
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      
      if (error.code === '42P01') {
        console.error('💡 La table "profiles" n\'existe pas. Exécutez les migrations Supabase.');
      } else if (error.code === 'PGRST301') {
        console.error('💡 Problème de permissions RLS. Vérifiez les politiques.');
      }
      
      return false;
    }
    
    console.log('✅ Connexion réussie à la table profiles');
    console.log(`📊 Nombre de profils: ${data || 0}\n`);
    
    // Test 2: Vérification des politiques RLS
    console.log('🔒 Test des politiques RLS...');
    
    try {
      const { data: testData, error: rlsError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (rlsError) {
        console.error('❌ Erreur RLS:', rlsError.message);
        if (rlsError.code === 'PGRST116') {
          console.log('✅ RLS fonctionne (aucune donnée accessible sans auth)');
        }
      } else {
        console.log('⚠️  RLS pourrait être désactivé (données accessibles sans auth)');
      }
    } catch (err) {
      console.error('❌ Erreur lors du test RLS:', err.message);
    }
    
    // Test 3: Test d'authentification
    console.log('\n🔐 Test d\'authentification...');
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Erreur d\'authentification:', authError.message);
    } else {
      console.log('✅ Service d\'authentification accessible');
      console.log('👤 Session actuelle:', authData.session ? 'Connecté' : 'Non connecté');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    return false;
  }
}

async function main() {
  const success = await testConnection();
  
  console.log('\n📋 Résumé:');
  if (success) {
    console.log('✅ Connexion Supabase fonctionnelle');
    console.log('💡 Pour charger un profil:');
    console.log('   1. Créez un compte utilisateur');
    console.log('   2. Connectez-vous');
    console.log('   3. Remplissez le formulaire de profil');
    console.log('   4. Le profil se chargera automatiquement');
  } else {
    console.log('❌ Problèmes de connexion détectés');
    console.log('💡 Vérifiez la configuration Supabase et les migrations');
  }
  
  process.exit(success ? 0 : 1);
}

main().catch(console.error);