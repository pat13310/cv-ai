import React, { useState } from 'react';
import { AlertTriangle, Database, Settings, X, ExternalLink, Copy, Check } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueDemo: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onContinueDemo
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const envExample = `# Ajoutez ces variables dans votre fichier .env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configuration Supabase requise</h2>
              <p className="text-sm text-gray-600">Base de données non configurée</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Supabase non configuré</h3>
                <p className="text-sm text-amber-800">
                  Les variables d'environnement Supabase ne sont pas définies. L'application peut fonctionner 
                  en mode démo, mais vos données ne seront pas sauvegardées de manière permanente.
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-violet-600" />
              <span>Que souhaitez-vous faire ?</span>
            </h3>

            {/* Option 1: Configure Supabase */}
            <div className="border border-gray-200 rounded-xl p-4 hover:border-violet-300 transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-xs font-bold text-violet-600">1</div>
                <span>Configurer Supabase (Recommandé)</span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Configurez Supabase pour bénéficier de toutes les fonctionnalités : sauvegarde permanente, 
                synchronisation, authentification sécurisée.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    1. Créez un projet sur Supabase
                  </label>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-violet-600 hover:text-violet-700"
                  >
                    <span>Aller sur Supabase</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    2. Ajoutez ces variables dans votre fichier .env
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                      <code>{envExample}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(envExample, 'env')}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copier"
                    >
                      {copied === 'env' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    3. Appliquez les migrations
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-100 p-3 rounded-lg text-xs">
                      <code>supabase db push</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard('supabase db push', 'cmd')}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copier"
                    >
                      {copied === 'cmd' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    4. Redémarrez l'application
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-100 p-3 rounded-lg text-xs">
                      <code>npm run dev</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard('npm run dev', 'restart')}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copier"
                    >
                      {copied === 'restart' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Continue in demo mode */}
            <div className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-600">2</div>
                <span>Continuer en mode démo</span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Utilisez l'application sans configuration. Vos données seront stockées localement 
                et ne seront pas sauvegardées de manière permanente.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-amber-900 mb-1">Limitations du mode démo :</h5>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• Données stockées uniquement en local (localStorage)</li>
                  <li>• Pas de synchronisation entre appareils</li>
                  <li>• Données perdues si vous videz le cache du navigateur</li>
                  <li>• Pas d'authentification sécurisée</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-sm text-gray-600">
            Vous pourrez configurer Supabase plus tard dans les paramètres
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={onContinueDemo}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-105"
            >
              Continuer en mode démo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};