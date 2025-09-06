import React, { useState } from 'react';
import { ArrowLeft, Bot, Shield, Bell, User, Palette, Key, Save, RefreshCw } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('ai');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState({
    ai: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      language: 'fr',
      analysisDepth: 'detailed',
      autoOptimization: true,
      keywordSuggestions: true,
      industrySpecific: true,
      apiKey: '',
      voiceRecognition: true,
      voiceSynthesis: true
    },
    notifications: {
      analysisComplete: true,
      cvGenerated: true,
      weeklyReport: false,
      marketingEmails: false
    },
    privacy: {
      dataRetention: '12months',
      shareAnalytics: false,
      cookieConsent: true
    },
    appearance: {
      theme: 'gradient',
      language: 'fr',
      animations: true,
      compactMode: false
    }
  });

  const sections = [
    { id: 'ai', label: 'Intelligence Artificielle', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'account', label: 'Compte', icon: User },
  ];

  const updateSetting = (section: string, key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    // Reset save status when settings change
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would save to backend/localStorage
      localStorage.setItem('cvAssistantSettings', JSON.stringify(settings));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const testApiKey = async (apiKey: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.ok) {
        alert('✅ Clé API OpenAI valide et connectée !');
      } else {
        alert('❌ Clé API invalide. Vérifiez votre clé.');
      }
    } catch {
      alert('❌ Erreur de connexion à OpenAI. Vérifiez votre clé et votre connexion internet.');
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      ai: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        language: 'fr',
        analysisDepth: 'detailed',
        autoOptimization: true,
        keywordSuggestions: true,
        industrySpecific: true,
        apiKey: '',
        voiceRecognition: true,
        voiceSynthesis: true
      },
      notifications: {
        analysisComplete: true,
        cvGenerated: true,
        weeklyReport: false,
        marketingEmails: false
      },
      privacy: {
        dataRetention: '12months',
        shareAnalytics: false,
        cookieConsent: true
      },
      appearance: {
        theme: 'gradient',
        language: 'fr',
        animations: true,
        compactMode: false
      }
    };
    
    setSettings(defaultSettings);
    setSaveStatus('idle');
  };

  const renderAISettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Bot className="w-5 h-5 text-violet-600" />
          <span>Configuration Intelligence Artificielle</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modèle IA</label>
            <select
              value={settings.ai.model}
              onChange={(e) => updateSetting('ai', 'model', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            >
              <optgroup label="OpenAI">
                <option value="gpt-4">GPT-4 (Recommandé)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4o">GPT-4o</option>
              </optgroup>
              <optgroup label="Anthropic">
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </optgroup>
              <optgroup label="Google">
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-pro-vision">Gemini Pro Vision</option>
              </optgroup>
              <optgroup label="Mistral">
                <option value="mistral-large">Mistral Large</option>
                <option value="mistral-medium">Mistral Medium</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue d'analyse</label>
            <select
              value={settings.ai.language}
              onChange={(e) => updateSetting('ai', 'language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Créativité (Temperature: {settings.ai.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.ai.temperature}
              onChange={(e) => updateSetting('ai', 'temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservateur</span>
              <span>Créatif</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profondeur d'analyse</label>
            <select
              value={settings.ai.analysisDepth}
              onChange={(e) => updateSetting('ai', 'analysisDepth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            >
              <option value="quick">Rapide</option>
              <option value="standard">Standard</option>
              <option value="detailed">Détaillée</option>
              <option value="comprehensive">Complète</option>
            </select>
          </div>
        </div>

        {/* API Key Configuration */}
        <div className="mt-8">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Key className="w-5 h-5 text-violet-600" />
            <span>Configuration API</span>
          </h4>
          
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6 border border-violet-200/30">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API {settings.ai.model.includes('gpt') ? 'OpenAI' : 
                          settings.ai.model.includes('claude') ? 'Anthropic' :
                          settings.ai.model.includes('gemini') ? 'Google' :
                          settings.ai.model.includes('mistral') ? 'Mistral' : 'IA'}
                </label>
                <div className="flex space-x-3">
                  <input
                    type="password"
                    value={settings.ai.apiKey}
                    onChange={(e) => updateSetting('ai', 'apiKey', e.target.value)}
                    placeholder={
                      settings.ai.model.includes('gpt') ? 'sk-...' :
                      settings.ai.model.includes('claude') ? 'sk-ant-...' :
                      settings.ai.model.includes('gemini') ? 'AIza...' :
                      settings.ai.model.includes('mistral') ? 'api_key...' : 'Clé API...'
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  />
                  <button 
                    onClick={() => {
                      if (settings.ai.apiKey) {
                        // Test the API key
                        testApiKey(settings.ai.apiKey);
                      }
                    }}
                    className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
                  >
                    Connecter
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {settings.ai.model.includes('gpt') && 'Obtenez votre clé API sur platform.openai.com'}
                  {settings.ai.model.includes('claude') && 'Obtenez votre clé API sur console.anthropic.com'}
                  {settings.ai.model.includes('gemini') && 'Obtenez votre clé API sur makersuite.google.com'}
                  {settings.ai.model.includes('mistral') && 'Obtenez votre clé API sur console.mistral.ai'}
                </p>
              </div>
              
              {settings.ai.apiKey && (
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Statut de connexion</span>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">Connecté</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Options d'optimisation</h4>
        <div className="space-y-4">
          {[
            { key: 'autoOptimization', label: 'Optimisation automatique ATS', description: 'Applique automatiquement les améliorations suggérées' },
            { key: 'keywordSuggestions', label: 'Suggestions de mots-clés', description: 'Propose des mots-clés pertinents pour votre secteur' },
            { key: 'industrySpecific', label: 'Analyse spécifique au secteur', description: 'Adapte l\'analyse selon votre domaine d\'activité' },
            { key: 'voiceRecognition', label: 'Reconnaissance vocale', description: 'Permet de dicter vos messages dans le chat IA' },
            { key: 'voiceSynthesis', label: 'Synthèse vocale', description: 'L\'IA peut lire ses réponses à voix haute' }
          ].map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div>
                <h5 className="font-medium text-gray-900">{option.label}</h5>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ai[option.key as keyof typeof settings.ai] as boolean}
                  onChange={(e) => updateSetting('ai', option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Bell className="w-5 h-5 text-violet-600" />
        <span>Préférences de notification</span>
      </h3>
      
      <div className="space-y-4">
        {[
          { key: 'analysisComplete', label: 'Analyse terminée', description: 'Notification quand l\'analyse de CV est complète' },
          { key: 'cvGenerated', label: 'CV généré', description: 'Notification quand un nouveau CV est créé' },
          { key: 'weeklyReport', label: 'Rapport hebdomadaire', description: 'Résumé de vos activités chaque semaine' },
          { key: 'marketingEmails', label: 'Emails marketing', description: 'Nouveautés et conseils carrière' }
        ].map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
            <div>
              <h5 className="font-medium text-gray-900">{option.label}</h5>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[option.key as keyof typeof settings.notifications]}
                onChange={(e) => updateSetting('notifications', option.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Shield className="w-5 h-5 text-violet-600" />
        <span>Confidentialité et sécurité</span>
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rétention des données</label>
          <select
            value={settings.privacy.dataRetention}
            onChange={(e) => updateSetting('privacy', 'dataRetention', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="12months">12 mois</option>
            <option value="indefinite">Indéfinie</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
          <div>
            <h5 className="font-medium text-gray-900">Partage des données analytiques</h5>
            <p className="text-sm text-gray-600">Aide à améliorer nos services (données anonymisées)</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy.shareAnalytics}
              onChange={(e) => updateSetting('privacy', 'shareAnalytics', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Palette className="w-5 h-5 text-violet-600" />
        <span>Apparence</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="gradient">Dégradé (Défaut)</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue de l'interface</label>
          <select
            value={settings.appearance.language}
            onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'animations', label: 'Animations', description: 'Active les animations et transitions' },
          { key: 'compactMode', label: 'Mode compact', description: 'Interface plus dense avec moins d\'espacement' }
        ].map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
            <div>
              <h5 className="font-medium text-gray-900">{option.label}</h5>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance[option.key as keyof typeof settings.appearance] as boolean}
                onChange={(e) => updateSetting('appearance', option.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <User className="w-5 h-5 text-violet-600" />
        <span>Informations du compte</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
          <input
            type="text"
            defaultValue="Marie Dubois"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            defaultValue="marie.dubois@email.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6 border border-violet-200/30">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <Key className="w-5 h-5 text-violet-600" />
          <span>Configuration API Avancée</span>
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Configurez vos clés API pour accéder aux différents modèles d'IA disponibles.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint personnalisé (optionnel)</label>
              <input
                type="url"
                placeholder="https://api.custom-endpoint.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (secondes)</label>
              <input
                type="number"
                defaultValue="30"
                min="10"
                max="120"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200">
          Supprimer le compte
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200">
          Exporter les données
        </button>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'ai':
        return renderAISettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderAISettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
              saveStatus === 'success' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : saveStatus === 'error'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700'
            } ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sauvegarde...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Save className="w-4 h-4" />
                <span>Sauvegardé ✓</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <Save className="w-4 h-4" />
                <span>Erreur</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
          <button 
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Paramètres
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Personnalisez votre expérience et configurez les options d'intelligence artificielle selon vos préférences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/30 p-4 sticky top-8 h-full">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 p-8">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};