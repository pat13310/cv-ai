# 🧪 Guide de Test de l'Authentification Supabase

## 🎯 Objectif
Tester correctement l'authentification après les corrections apportées.

## ⚠️ Important : Ordre des Tests
L'erreur "Invalid login credentials" est **normale** si vous essayez de vous connecter avant de créer un compte !

## 📋 Procédure de Test Correcte

### Étape 1 : Appliquer la Migration (Obligatoire)
Avant tout test, assurez-vous d'avoir appliqué la migration corrigée :

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `cv-ats-ai`
3. Ouvrez **SQL Editor** → **New query**
4. Copiez le contenu de `supabase/migrations/20250908122600_create_profiles_fixed.sql`
5. Exécutez la requête
6. Vérifiez le message : "Migration profiles appliquée avec succès !"

### Étape 2 : Redémarrer l'Application
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### Étape 3 : Test d'Inscription (COMMENCER PAR ÇA)
1. Ouvrez l'application : http://localhost:3000
2. Cliquez sur **"Se connecter"**
3. Dans la modal, cliquez sur **"S'inscrire"** (pas "Se connecter")
4. Remplissez le formulaire :
   - **Nom** : Votre nom complet
   - **Email** : Une adresse email valide (ex: test@example.com)
   - **Mot de passe** : Au moins 6 caractères
5. Cliquez sur **"Créer un compte"**

### Résultats Attendus pour l'Inscription :
- ✅ **Succès** : La modal se ferme, vous êtes connecté
- ✅ **Profil créé** : Un profil utilisateur est automatiquement créé
- ❌ **Échec** : Message d'erreur clair (ex: "Email déjà utilisé")

### Étape 4 : Test de Connexion (APRÈS L'INSCRIPTION)
1. Si vous êtes connecté, déconnectez-vous d'abord
2. Cliquez sur **"Se connecter"**
3. Utilisez les **mêmes identifiants** que lors de l'inscription
4. Cliquez sur **"Se connecter"**

### Résultats Attendus pour la Connexion :
- ✅ **Succès** : Connexion réussie avec les bons identifiants
- ❌ **Échec avec message clair** : "Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte si vous n'en avez pas encore."

## 🔍 Messages d'Erreur Améliorés

### Inscription :
- **"Un compte avec cette adresse email existe déjà"** → Utilisez un autre email ou connectez-vous
- **"Le mot de passe doit contenir au moins 6 caractères"** → Utilisez un mot de passe plus long
- **"Adresse email invalide"** → Vérifiez le format de l'email

### Connexion :
- **"Email ou mot de passe incorrect"** → Vérifiez vos identifiants ou créez un compte
- **"Veuillez confirmer votre email"** → Vérifiez votre boîte de réception
- **"Trop de tentatives"** → Attendez quelques minutes

## 🧪 Scénarios de Test

### Test 1 : Inscription Nouvelle
```
Email: nouveau@test.com
Mot de passe: motdepasse123
Résultat attendu: ✅ Succès
```

### Test 2 : Inscription Email Existant
```
Email: nouveau@test.com (même que Test 1)
Mot de passe: autremotdepasse
Résultat attendu: ❌ "Un compte avec cette adresse email existe déjà"
```

### Test 3 : Connexion Correcte
```
Email: nouveau@test.com
Mot de passe: motdepasse123
Résultat attendu: ✅ Succès
```

### Test 4 : Connexion Incorrecte
```
Email: nouveau@test.com
Mot de passe: mauvais_mot_de_passe
Résultat attendu: ❌ "Email ou mot de passe incorrect"
```

### Test 5 : Connexion Email Inexistant
```
Email: inexistant@test.com
Mot de passe: nimporte_quoi
Résultat attendu: ❌ "Email ou mot de passe incorrect. Créez un compte d'abord."
```

## 🔧 Vérifications Techniques

### Dans la Console du Navigateur (F12) :
- ✅ **Inscription réussie** : "Inscription réussie: {user data}"
- ✅ **Connexion réussie** : "Connexion réussie: {user data}"
- ✅ **Profil créé** : "Migration profiles appliquée avec succès !"

### Dans le Dashboard Supabase :
1. Allez dans **Authentication** → **Users**
2. Vérifiez que les nouveaux utilisateurs apparaissent
3. Allez dans **Table Editor** → **profiles**
4. Vérifiez que les profils sont créés automatiquement

## 🚨 Dépannage

### Si l'inscription échoue encore :
1. Vérifiez que la migration a été appliquée
2. Consultez les logs Supabase dans le dashboard
3. Vérifiez que les politiques RLS sont activées

### Si la connexion échoue avec de bons identifiants :
1. Vérifiez que l'utilisateur existe dans Authentication → Users
2. Vérifiez que l'email est confirmé (si confirmation requise)
3. Essayez de réinitialiser le mot de passe

## ✅ Checklist de Validation

- [ ] Migration appliquée avec succès
- [ ] Application redémarrée
- [ ] Inscription d'un nouvel utilisateur réussie
- [ ] Profil automatiquement créé dans la table `profiles`
- [ ] Connexion avec les bons identifiants réussie
- [ ] Messages d'erreur clairs pour les mauvais identifiants
- [ ] Gestion correcte des emails déjà utilisés

---

**🎉 Si tous les tests passent, l'authentification Supabase est entièrement fonctionnelle !**