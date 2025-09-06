import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { LoginPage } from './components/Auth/LoginPage';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CVAnalysis } from './components/CVAnalysis/CVAnalysis';
import { CVCreator } from './components/CVCreator/CVCreator';
import { CVLibrary } from './components/CVLibrary/CVLibrary';
import { Models } from './components/Models/Models';
import { Templates } from './components/Templates/Templates';
import { Settings } from './components/Settings/Settings';
import { Coaching } from './components/Coaching/Coaching';
import { AIChat } from './components/Chat/AIChat';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [voiceEnabled] = useState(true); // This would come from settings

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg">CV</span>
          </div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} />;
      case 'analyze':
        return <CVAnalysis />;
      case 'creator':
        return <CVCreator />;
      case 'templates':
        return <Templates />;
      case 'coaching':
        return <Coaching onNavigate={handleTabChange} />;
      case 'library':
        return <CVLibrary />;
      case 'models':
        return <Models />;
      case 'settings':
        return <Settings onBack={handleBackToDashboard} />;
      case 'chat':
        return <AIChat onBack={handleBackToDashboard} voiceEnabled={voiceEnabled} onSettingsClick={handleSettingsClick} fromCoaching={true} />;
      default:
        return <Dashboard />;
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setActiveTab('settings');
  };

  const handleTabChange = (tab: string) => {
    if (tab !== 'settings') {
      setShowSettings(false);
    }
    if (tab === 'chat') {
      setShowChat(true);
    } else {
      setShowChat(false);
    }
    setActiveTab(tab);
  };

  const handleBackToDashboard = () => {
    setShowChat(false);
    setShowSettings(false);
    setActiveTab('dashboard');
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-300/20 to-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-300/20 to-pink-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header 
          user={user!} 
          onSettingsClick={handleSettingsClick} 
          onLogout={handleLogout}
        />
        {!showSettings && !showChat && <Navigation activeTab={activeTab} onTabChange={handleTabChange} />}
        
        <main className="flex justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-8xl w-full">
          {renderActiveTab()}
        </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;