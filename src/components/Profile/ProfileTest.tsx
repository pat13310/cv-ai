import React, { useState } from 'react';
import { User, Database, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useSupabaseConfig } from '../../hooks/useSupabaseConfig';
import { ProfileForm } from './ProfileForm';

export const ProfileTest: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const {
    profile,
    profileLoading,
    error,
    validationErrors,
    getInitials,
    getFullName,
    isProfileComplete,
    getCompletionPercentage,
    getFormattedAddress,
    loadProfile,
    validateProfile
  } = useProfile();
  
  const { isConfigured, hasKeys } = useSupabaseConfig();

  const runTests = async () => {
    setIsRunningTests(true);
    const results: Record<string, boolean> = {};

    try {
      // Test 1: Configuration Supabase
      results.supabaseConfig = isConfigured && hasKeys;

      // Test 2: Chargement du profil
      try {
        await loadProfile();
        results.profileLoad = !profileLoading && !error;
      } catch {
        results.profileLoad = false;
      }

      // Test 3: Fonctions utilitaires
      results.utilityFunctions = true;
      try {
        getInitials();
        getFullName();
        isProfileComplete();
        getCompletionPercentage();
        getFormattedAddress();
      } catch {
        results.utilityFunctions = false;
      }

      // Test 4: Validation
      results.validation = true;
      try {
        const testData = {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone: '0612345678',
          postal_code: '75001'
        };
        const validation = validateProfile(testData);
        results.validation = validation.isValid;
      } catch {
        results.validation = false;
      }

      // Test 5: Gestion des erreurs
      results.errorHandling = true;
      try {
        const invalidData = {
          first_name: '',
          email: 'invalid-email'
        };
        const validation = validateProfile(invalidData);
        results.errorHandling = !validation.isValid && Object.keys(validation.errors).length > 0;
      } catch {
        results.errorHandling = false;
      }

      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getTestStatus = (testName: string) => {
    if (isRunningTests) return 'running';
    if (testName in testResults) {
      return testResults[testName] ? 'success' : 'error';
    }
    return 'pending';
  };

  const TestItem: React.FC<{ name: string; description: string; testKey: string }> = ({ 
    name, 
    description, 
    testKey 
  }) => {
    const status = getTestStatus(testKey);
    
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'running' && (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          {status === 'pending' && (
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
          Test d'Intégration des Profils
        </h2>
        <p className="text-gray-600 mt-2">
          Vérification du bon fonctionnement de l'intégration Supabase et des profils utilisateur
        </p>
      </div>

      {/* Configuration Status */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5 text-violet-600" />
          <span>État de la Configuration</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {isConfigured ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                Supabase {isConfigured ? 'Configuré' : 'Non Configuré'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            hasKeys 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-2">
              {hasKeys ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                Clés API {hasKeys ? 'Présentes' : 'Manquantes'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-violet-600" />
            <span>Tests d'Intégration</span>
          </h3>
          
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              isRunningTests
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700'
            }`}
          >
            {isRunningTests ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Tests en cours...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Lancer les tests</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <TestItem
            name="Configuration Supabase"
            description="Vérification de la configuration et des clés API"
            testKey="supabaseConfig"
          />
          
          <TestItem
            name="Chargement du profil"
            description="Test de récupération des données de profil"
            testKey="profileLoad"
          />
          
          <TestItem
            name="Fonctions utilitaires"
            description="Test des fonctions d'aide (initiales, nom complet, etc.)"
            testKey="utilityFunctions"
          />
          
          <TestItem
            name="Validation des données"
            description="Test de la validation des champs de profil"
            testKey="validation"
          />
          
          <TestItem
            name="Gestion des erreurs"
            description="Test de la détection et gestion des erreurs"
            testKey="errorHandling"
          />
        </div>

        {/* Résultats détaillés */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showDetails ? 'Masquer' : 'Afficher'} les détails</span>
            </button>
            
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">Résultats détaillés :</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(testResults).map(([key, success]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700">{key}</span>
                      <span className={success ? 'text-emerald-600' : 'text-red-600'}>
                        {success ? '✓ Réussi' : '✗ Échoué'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profil actuel */}
      {profile && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Actuel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informations de base</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Nom complet :</strong> {getFullName() || 'Non défini'}</div>
                <div><strong>Initiales :</strong> {getInitials() || 'N/A'}</div>
                <div><strong>Email :</strong> {profile.email || 'Non défini'}</div>
                <div><strong>Téléphone :</strong> {profile.phone || 'Non défini'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Profil complet :</strong> {isProfileComplete() ? 'Oui' : 'Non'}</div>
                <div><strong>Completion :</strong> {getCompletionPercentage()}%</div>
                <div><strong>Adresse :</strong> {getFormattedAddress() || 'Non définie'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erreurs de validation */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Erreurs de Validation</span>
          </h3>
          
          <div className="space-y-2">
            {Object.entries(validationErrors).map(([field, error]) => (
              <div key={field} className="text-sm text-red-700">
                <strong>{field} :</strong> {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire de test */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test du Formulaire</h3>
        <ProfileForm />
      </div>
    </div>
  );
};