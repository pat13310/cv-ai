import React from 'react';
import { CVAnalysisResponse } from '../../hooks/useOpenAI';
import { Brain, Target, TrendingUp, AlertTriangle, CheckCircle, Star, Zap } from 'lucide-react';

interface DetailedAnalysisProps {
  results: CVAnalysisResponse;
}

export const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ results }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Target;
      case 'low': return CheckCircle;
      default: return Target;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-amber-500 to-orange-500';
      case 'low': return 'from-emerald-500 to-teal-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-gradient">
          Analyse Détaillée IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyse approfondie powered by OpenAI avec insights avancés et recommandations personnalisées
        </p>
      </div>

      {/* Keywords Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Analyse des Mots-clés</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Found Keywords */}
          <div className="bg-emerald-50/50 rounded-2xl p-4">
            <h4 className="font-semibold text-emerald-800 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Mots-clés Trouvés ({results.keywords.found.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.keywords.found.map((keyword, index) => (
                <span key={index} className="text-xs font-medium px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="bg-red-50/50 rounded-2xl p-4">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Mots-clés Manquants ({results.keywords.missing.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.keywords.missing.map((keyword, index) => (
                <span key={index} className="text-xs font-medium px-2 py-1 bg-red-200 text-red-800 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Keywords */}
          <div className="bg-violet-50/50 rounded-2xl p-4">
            <h4 className="font-semibold text-violet-800 mb-3 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Suggestions IA ({results.keywords.suggestions.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.keywords.suggestions.map((keyword, index) => (
                <span key={index} className="text-xs font-medium px-2 py-1 bg-violet-200 text-violet-800 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Improvements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Plan d'Amélioration Personnalisé</h3>
        </div>

        <div className="space-y-4">
          {results.improvements.map((improvement, index) => {
            const Icon = getPriorityIcon(improvement.priority);
            return (
              <div key={index} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-br ${getPriorityColor(improvement.priority)} rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{improvement.title}</h4>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        improvement.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : improvement.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {improvement.priority === 'high' ? 'Priorité Haute' : improvement.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{improvement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Insights OpenAI</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Recommandations Prioritaires</h4>
              <ul className="space-y-2 text-sm text-white/90">
                {results.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Score Prévu après Optimisation</h4>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.overallScore}%</div>
                  <div className="text-xs text-white/80">Actuel</div>
                </div>
                <div className="text-2xl text-white/60">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{Math.min(results.overallScore + 8, 98)}%</div>
                  <div className="text-xs text-white/80">Potentiel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};