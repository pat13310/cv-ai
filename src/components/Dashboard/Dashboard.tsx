import React from 'react';
import { FileText, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { useSupabase } from '../../hooks/useSupabase';
import { MetricCard } from './MetricCard';
import { RecentActivity } from './RecentActivity';
interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { activities, loading } = useSupabase();

  // Calculer les métriques depuis les données Supabase
  const calculateMetrics = () => {
    if (loading || activities.length === 0) {
      return {
        totalAnalyzed: 0,
        averageScore: 0,
        qualifiedCandidates: 0,
        matchRate: 0,
        trends: {
          totalAnalyzedTrend: null,
          averageScoreTrend: null,
          qualifiedCandidatesTrend: null,
          matchRateTrend: null
        }
      };
    }

    const analysisActivities = activities.filter(a => a.type === 'analysis' && a.score);
    const totalAnalyzed = analysisActivities.length;
    const averageScore = totalAnalyzed > 0 
      ? Math.round(analysisActivities.reduce((sum, a) => sum + (a.score || 0), 0) / totalAnalyzed)
      : 0;
    
    const qualifiedCandidates = analysisActivities.filter(a => (a.score || 0) >= 80).length;
    const matchRate = totalAnalyzed > 0 
      ? Math.round((qualifiedCandidates / totalAnalyzed) * 100)
      : 0;

    // Calculer les tendances seulement s'il y a assez de données (au moins 5 analyses)
    let trends: {
      totalAnalyzedTrend: string | null;
      averageScoreTrend: string | null;
      qualifiedCandidatesTrend: string | null;
      matchRateTrend: string | null;
    } = {
      totalAnalyzedTrend: null,
      averageScoreTrend: null,
      qualifiedCandidatesTrend: null,
      matchRateTrend: null
    };

    if (totalAnalyzed >= 5) {
      // Comparer les 30 derniers jours vs les 30 jours précédents
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentActivities = analysisActivities.filter(a =>
        new Date(a.created_at) >= thirtyDaysAgo
      );
      const previousActivities = analysisActivities.filter(a =>
        new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo
      );

      if (recentActivities.length > 0 && previousActivities.length > 0) {
        const recentAvgScore = recentActivities.reduce((sum, a) => sum + (a.score || 0), 0) / recentActivities.length;
        const previousAvgScore = previousActivities.reduce((sum, a) => sum + (a.score || 0), 0) / previousActivities.length;
        
        const recentQualified = recentActivities.filter(a => (a.score || 0) >= 80).length;
        const previousQualified = previousActivities.filter(a => (a.score || 0) >= 80).length;
        
        const recentMatchRate = (recentQualified / recentActivities.length) * 100;
        const previousMatchRate = (previousQualified / previousActivities.length) * 100;

        trends = {
          totalAnalyzedTrend: recentActivities.length > previousActivities.length ? '+' : '-',
          averageScoreTrend: recentAvgScore > previousAvgScore ?
            `+${Math.round(((recentAvgScore - previousAvgScore) / previousAvgScore) * 100)}%` :
            `-${Math.round(((previousAvgScore - recentAvgScore) / previousAvgScore) * 100)}%`,
          qualifiedCandidatesTrend: recentQualified > previousQualified ? '+' : '-',
          matchRateTrend: recentMatchRate > previousMatchRate ?
            `+${Math.round(recentMatchRate - previousMatchRate)}%` :
            `-${Math.round(previousMatchRate - recentMatchRate)}%`
        };
      }
    }
    return {
      totalAnalyzed,
      averageScore,
      qualifiedCandidates,
      matchRate,
      trends
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: 'CV Analysés',
      value: loading ? '...' : metrics.totalAnalyzed.toString(),
      change: metrics.trends.totalAnalyzedTrend || '',
      icon: FileText,
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      title: 'Score ATS Moyen',
      value: loading ? '...' : `${metrics.averageScore}%`,
      change: metrics.trends.averageScoreTrend || '',
      icon: TrendingUp,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Candidats Qualifiés',
      value: loading ? '...' : metrics.qualifiedCandidates.toString(),
      change: metrics.trends.qualifiedCandidatesTrend || '',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Taux de Match',
      value: loading ? '...' : `${metrics.matchRate}%`,
      change: metrics.trends.matchRateTrend || '',
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bienvenue {user?.name} ! 👋</h1>
          <p className="text-white/90 text-sm mb-6">
            Optimisez vos CV avec notre IA avancée et maximisez vos chances de succès.
          </p>
          <button 
            onClick={() => onNavigate?.('analyze')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            Analyser un nouveau CV
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {metricCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="flex justify-center">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};