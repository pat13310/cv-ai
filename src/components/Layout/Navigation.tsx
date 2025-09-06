import React from 'react';
import { BarChart3, FileText, Zap, BookOpen, FolderOpen, Brain, MessageSquare } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { id: 'analyze', label: 'Analyse CV', icon: Zap },
  { id: 'creator', label: 'Créateur CV', icon: FileText },
  { id: 'templates', label: 'Templates Word', icon: FileText },
  { id: 'coaching', label: 'Coaching IA', icon: Brain },
  { id: 'chat', label: 'Chat IA', icon: MessageSquare },
  { id: 'library', label: 'Bibliothèque', icon: FolderOpen },
  { id: 'models', label: 'Modèles', icon: BookOpen },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white/60 backdrop-blur-md border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center space-x-2 px-4 py-4 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-violet-600 border-b-2 border-violet-500'
                    : 'text-gray-500 hover:text-violet-600'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-violet-600' : ''
                }`} />
                <span>{item.label}</span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};