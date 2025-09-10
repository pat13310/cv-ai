import React, { useState } from 'react';
import { CVUpload } from './CVUpload';
import { AnalysisResults } from './AnalysisResults';
import { DetailedAnalysis } from './DetailedAnalysis';
import { CVOptimization } from '../CVOptimization/CVOptimization';
import { useOpenAI, CVAnalysisResponse } from '../../hooks/useOpenAI';
import { useSupabase } from '../../hooks/useSupabase';
import {  ArrowLeft } from 'lucide-react';
import GradientSpinLoader from '../loader/GradientSpinLoader';

export const CVAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CVAnalysisResponse | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { analyzeFile, error } = useOpenAI();
  const { addActivity } = useSupabase();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    try {
      console.log('Début de l\'analyse du fichier:', file.name, 'Type:', file.type);
      
      // Analyser le fichier directement avec l'IA - OBLIGATOIRE
      // L'extraction de contenu se fait dans le hook useOpenAI
      const results = await analyzeFile(file, 'Développeur Full Stack');
      
      console.log('Résultats de l\'analyse:', results);
      
      if (results) {
        console.log('Analyse réussie, affichage des résultats');
        setAnalysisResults(results);
        
        // Stocker le contenu original pour l'affichage
        setOriginalContent(`Analyse du fichier: ${file.name}`);
        
        // Ajouter l'activité à Supabase (optionnel - ne pas bloquer l'analyse si ça échoue)
        try {
          await addActivity({
            type: 'analysis',
            title: `CV Analysé - ${file.name}`,
            description: `Analyse complète avec score ATS de ${results.overallScore}%`,
            score: results.overallScore,
            status: results.overallScore >= 80 ? 'success' : results.overallScore >= 60 ? 'warning' : 'error',
            metadata: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              analysisTime: new Date().toISOString()
            }
          });
          console.log('Activité enregistrée avec succès');
        } catch (error) {
          console.warn('Impossible d\'enregistrer l\'activité (permissions Supabase):', error);
          // Ne pas bloquer l'analyse - continuer normalement
        }
        
        // Afficher automatiquement les résultats après l'analyse
        setShowResults(true);
      } else {
        // Si l'analyse échoue, afficher l'erreur - PAS DE MOCK
        console.error('Analyse IA échouée - results est null');
        console.error('Erreur détaillée:', error);
        // L'erreur sera affichée via le hook useOpenAI
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse (catch):', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResults(null);
    setShowDetailedAnalysis(false);
    setShowOptimization(false);
    setUploadedFile(null);
    setOriginalContent('');
    setShowResults(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ajouter l'activité d'optimisation
      if (analysisResults && uploadedFile) {
        const newScore = Math.min(analysisResults.overallScore + 8, 98);
        
        await addActivity({
          type: 'optimization',
          title: `CV optimisé - ${uploadedFile.name}`,
          description: `Score ATS amélioré de ${analysisResults.overallScore}% à ${newScore}%`,
          score: newScore,
          status: 'success',
          metadata: {
            fileName: uploadedFile.name,
            originalScore: analysisResults.overallScore,
            newScore: newScore,
            improvements: analysisResults.improvements.length
          }
        });
      }
      
      setShowOptimization(true);
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        <div className="relative flex items-center justify-center">
          {/* }<div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>*/}
          <GradientSpinLoader size={100} thickness={0.05} className="absolute" />
        </div>
        
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Analyse IA en cours
          </h3>
          <p className="text-gray-600 mb-6">
            Notre intelligence artificielle analyse votre CV et génère des recommandations personnalisées pour optimiser votre compatibilité ATS
          </p>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
              <span>Analyse des mots-clés, structure et optimisation ATS...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showOptimization && analysisResults && originalContent) {
    return (
      <CVOptimization
        analysisResults={analysisResults}
        originalContent={originalContent}
        fileName={uploadedFile?.name || 'CV'}
        onBack={() => setShowOptimization(false)}
      />
    );
  }

  if (showDetailedAnalysis && analysisResults) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowDetailedAnalysis(false)}
          className="rounded-lg border p-2 flex items-center space-x-2 text-violet-500 hover:text-violet-800 hover:border-violet-300 font-medium transition-colors "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux résultats</span>
        </button>
        <DetailedAnalysis results={analysisResults} />
      </div>
    );
  }

  if (analysisResults && showResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleNewAnalysis}
            className="border px-2 py-2 rounded-lg flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors hover:border-violet-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className=''>Nouvelle analyse</span>
          </button>
          
          <button
            onClick={() => setShowDetailedAnalysis(true)}
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
          >
            Analyse détaillée
          </button>
        </div>
        
        <AnalysisResults 
          results={analysisResults} 
          fileName={uploadedFile?.name || 'CV'}
          originalContent={originalContent}
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CVUpload onFileUpload={handleFileUpload} />
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="font-medium text-red-800 text-sm mb-1">Erreur d'analyse IA</h4>
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};