import React from 'react';
import { User, LogOut, Settings, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  onSettingsClick: () => void;
  onLogout: () => void;
  apiKeyStatus?: 'valid' | 'invalid' | 'missing';
}

export const Header: React.FC<HeaderProps> = ({ user, onSettingsClick, onLogout, apiKeyStatus = 'valid' }) => {
  const getApiKeyIndicator = () => {
    if (apiKeyStatus === 'missing') {
      return {
        text: 'Clé IA manquante',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        iconColor: 'text-red-600'
      };
    } else if (apiKeyStatus === 'invalid') {
      return {
        text: 'Clé IA invalide',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        iconColor: 'text-amber-600'
      };
    }
    return null;
  };

  const indicator = getApiKeyIndicator();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className=" w-8 h-8 bg-gradient-to-br from-violet-500 via-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
               <span style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
                CV ATS Assistant
               </span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {indicator && (
              <button
                onClick={onSettingsClick}
                className={`flex items-center space-x-2 px-3 py-2 ${indicator.bgColor} border ${indicator.borderColor} rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105`}
                title="Cliquez pour configurer votre clé API"
              >
                <AlertTriangle className={`w-4 h-4 ${indicator.iconColor}`} />
                <span className={`text-sm ${indicator.textColor} font-medium`}>{indicator.text}</span>
              </button>
            )}
            
            <div className="flex items-center space-x-3 bg-gray-50/80 rounded-full px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
