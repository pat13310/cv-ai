import React, { useState } from 'react';
import { Sparkles, Brain, Target, Award, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from './AuthProvider';

export const LoginPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'IA Avancée',
      description: 'Analyse powered by OpenAI pour des recommandations précises',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Optimisation ATS',
      description: 'Score de passage 94% supérieur avec nos algorithmes',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Award,
      title: 'Templates Premium',
      description: 'Modèles conçus par des experts RH et optimisés IA',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'Suivi Performance',
      description: 'Analytics détaillées de vos candidatures',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const stats = [
    { value: '94%', label: 'Taux de passage ATS' },
    { value: '2.3x', label: 'Plus de réponses' },
    { value: '48h', label: 'Délai moyen de retour' },
    { value: '15k+', label: 'CV optimisés' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-300/20 to-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-300/20 to-pink-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                    CV ATS Assistant
                  </h1>
                </div>
              </div>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-violet-600 via-rose-400 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-violet-700 hover:via-rose-500 hover:to-purple-700 transition-all duration-200 hover:scale-105"
              >
                Se connecter
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gray-200/30">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-gray-700">Powered by OpenAI</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-rose-400 to-purple-600 bg-clip-text text-transparent">
                  Optimisez votre CV
                </span>
                <br />
                <span className="text-gray-900">avec l'IA</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Notre assistant IA analyse votre CV, identifie les points d'amélioration et génère des recommandations personnalisées pour maximiser vos chances de décrocher l'emploi de vos rêves.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-violet-600 via-rose-400 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-violet-700 hover:via-rose-500 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Commencer gratuitement
                </button>
                <button className="bg-white/70 backdrop-blur-sm border border-gray-200/30 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105">
                  Voir la démo
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir notre assistant IA ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des fonctionnalités avancées pour transformer votre recherche d'emploi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-violet-600 via-rose-400 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 rounded-3xl" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Users className="w-6 h-6" />
                  <span className="text-lg font-semibold">Rejoint par 15,000+ professionnels</span>
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  Transformez votre carrière dès aujourd'hui
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {[
                    'Analyse IA en temps réel',
                    'Templates optimisés ATS',
                    'Recommandations personnalisées'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  Créer mon compte gratuitement
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200/30">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-400 bg-clip-text text-transparent">
                CV ATS Assistant
              </span>
            </div>
            <p className="text-gray-600">
              © 2024 CV ATS Assistant. Optimisé par l'intelligence artificielle.
            </p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};