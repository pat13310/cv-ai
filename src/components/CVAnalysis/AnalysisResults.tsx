import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Brain, Target, Award, Download, RefreshCw, TrendingUp, Star, Zap, Loader2 } from 'lucide-react';

interface AnalysisResultsProps {
  results: CVAnalysisResponse;
  fileName: string;
  originalContent?: string;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, fileName, originalContent, onOptimize, isOptimizing = false }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-teal-500';
    if (score >= 70) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const exportReport = () => {
    // In a real app, this would generate a PDF report
    console.log('Exporting analysis report...');
  };

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-violet-500 via-pink-500 to-blue-500 p-1.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Score ATS</div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyse Complète - {fileName}</h3>
          <p className="text-gray-600 mb-6">
            Votre CV a été analysé par notre IA OpenAI avec des recommandations précises pour optimiser votre passage des filtres ATS
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={exportReport}
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter le rapport</span>
            </button>
            
            {originalContent && onOptimize && (
              <button 
                onClick={onOptimize}
                disabled={isOptimizing}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimisation en cours...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Optimiser automatiquement</span>
                  </>
                )}
              </button>
            )}
            
            <button className="bg-white/70 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Réanalyser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(results.sections).map(([key, score]) => {
          const labels: Record<string, { title: string, description: string }> = {
            atsOptimization: {
              title: 'Optimisation ATS',
              description: 'Compatibilité avec les systèmes de tracking'
            },
            keywordMatch: {
              title: 'Correspondance Mots-clés',
              description: 'Présence des termes recherchés par les recruteurs'
            },
            structure: {
              title: 'Structure & Format',
              description: 'Organisation et présentation du contenu'
            },
            content: {
              title: 'Qualité du Contenu',
              description: 'Pertinence et impact des informations'
            }
          };
          
          return (
            <div key={key} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{labels[key].title}</h4>
                  <p className="text-sm text-gray-600">{labels[key].description}</p>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 bg-gradient-to-r ${getScoreGradient(score)} rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: `${score}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations and Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Recommandations IA</h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50/50 transition-colors">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Points Forts</h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {results.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-emerald-50/30 transition-colors">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">À Améliorer</h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {results.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-amber-50/30 transition-colors">
                <XCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-gradient-to-br from-violet-500 to-pink-500 text-white p-6 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 text-left">
          <Target className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-2">Optimiser Automatiquement</h4>
          <p className="text-sm text-white/90">Laissez l'IA appliquer les améliorations</p>
        </button>

        <button className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 text-left">
          <Brain className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-2">Coaching IA</h4>
          <p className="text-sm text-white/90">Obtenez des conseils personnalisés</p>
        </button>

        <button className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:scale-105 text-left">
          <Award className="w-8 h-8 mb-3" />
          <h4 className="font-semibold mb-2">Créer Version Optimisée</h4>
          <p className="text-sm text-white/90">Générer un nouveau CV amélioré</p>
        </button>
      </div>
    </div>
  );
};