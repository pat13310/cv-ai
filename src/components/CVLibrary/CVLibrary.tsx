import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Star, Calendar, FileText, Sparkles, TrendingUp, Award, MoreVertical } from 'lucide-react';

interface CVItem {
  id: string;
  name: string;
  type: 'analyzed' | 'created';
  atsScore: number;
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'completed' | 'optimized';
  template?: string;
  industry: string;
  isFavorite: boolean;
  fileSize: string;
  version: number;
}

export const CVLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'analyzed' | 'created'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [selectedCV, setSelectedCV] = useState<string | null>(null);

  const cvItems: CVItem[] = [
    {
      id: '1',
      name: 'CV_Marie_Dubois_DevFullStack',
      type: 'created',
      atsScore: 94,
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-16'),
      status: 'completed',
      template: 'Tech Innovant',
      industry: 'Développement',
      isFavorite: true,
      fileSize: '245 KB',
      version: 3
    },
    {
      id: '2',
      name: 'CV_Analyse_Marketing_Digital',
      type: 'analyzed',
      atsScore: 87,
      createdAt: new Date('2024-01-14'),
      lastModified: new Date('2024-01-14'),
      status: 'optimized',
      industry: 'Marketing',
      isFavorite: false,
      fileSize: '189 KB',
      version: 1
    },
    {
      id: '3',
      name: 'CV_Designer_UX_Premium',
      type: 'created',
      atsScore: 91,
      createdAt: new Date('2024-01-13'),
      lastModified: new Date('2024-01-15'),
      status: 'draft',
      template: 'Créatif Bold',
      industry: 'Design',
      isFavorite: true,
      fileSize: '312 KB',
      version: 2
    },
    {
      id: '4',
      name: 'CV_Data_Scientist_Analyse',
      type: 'analyzed',
      atsScore: 96,
      createdAt: new Date('2024-01-12'),
      lastModified: new Date('2024-01-12'),
      status: 'completed',
      industry: 'Data Science',
      isFavorite: false,
      fileSize: '278 KB',
      version: 1
    },
    {
      id: '5',
      name: 'CV_Executive_Leadership',
      type: 'created',
      atsScore: 89,
      createdAt: new Date('2024-01-11'),
      lastModified: new Date('2024-01-13'),
      status: 'completed',
      template: 'Executive Elite',
      industry: 'Management',
      isFavorite: false,
      fileSize: '198 KB',
      version: 4
    },
    {
      id: '6',
      name: 'CV_Finance_Analyst_Optimisé',
      type: 'analyzed',
      atsScore: 92,
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-11'),
      status: 'optimized',
      industry: 'Finance',
      isFavorite: true,
      fileSize: '156 KB',
      version: 2
    }
  ];

  const filteredCVs = cvItems
    .filter(cv => {
      const matchesSearch = cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cv.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || cv.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.atsScore - a.atsScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return b.lastModified.getTime() - a.lastModified.getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'optimized': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'optimized': return 'Optimisé';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const toggleFavorite = (id: string) => {
    // In real app, would update the backend
    console.log('Toggle favorite for CV:', id);
  };

  const handleAction = (action: string, cvId: string) => {
    console.log(`Action ${action} for CV ${cvId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-gradient">
          Bibliothèque de CV
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gérez tous vos CV analysés et créés avec notre IA. Suivez les performances, optimisez et téléchargez vos documents.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total CV</p>
              <p className="text-2xl font-bold text-gray-900">{cvItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score ATS Moyen</p>
              <p className="text-2xl font-bold text-emerald-600">
                {Math.round(cvItems.reduce((acc, cv) => acc + cv.atsScore, 0) / cvItems.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CV Créés</p>
              <p className="text-2xl font-bold text-blue-600">
                {cvItems.filter(cv => cv.type === 'created').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CV Analysés</p>
              <p className="text-2xl font-bold text-pink-600">
                {cvItems.filter(cv => cv.type === 'analyzed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou secteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tous les CV</option>
            <option value="created">CV Créés</option>
            <option value="analyzed">CV Analysés</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="date">Trier par date</option>
            <option value="score">Trier par score ATS</option>
            <option value="name">Trier par nom</option>
          </select>
        </div>
      </div>

      {/* CV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCVs.map((cv) => (
          <div
            key={cv.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{cv.name}</h3>
                    <button
                      onClick={() => toggleFavorite(cv.id)}
                      className={`p-1 rounded-full transition-colors ${
                        cv.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${cv.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cv.type === 'created' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {cv.type === 'created' ? 'Créé' : 'Analysé'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{cv.industry}</span>
                    {cv.template && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>{cv.template}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(cv.atsScore)}`}>
                    {cv.atsScore}%
                  </div>
                  <div className="text-xs text-gray-500">Score ATS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700">v{cv.version}</div>
                  <div className="text-xs text-gray-500">Version</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700">{cv.fileSize}</div>
                  <div className="text-xs text-gray-500">Taille</div>
                </div>
              </div>

              {/* Status and Date */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cv.status)}`}>
                  {getStatusLabel(cv.status)}
                </span>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Modifié le {cv.lastModified.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction('view', cv.id)}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir</span>
                </button>
                
                <button
                  onClick={() => handleAction('edit', cv.id)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleAction('download', cv.id)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleAction('delete', cv.id)}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar for ATS Score */}
            <div className="px-6 pb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    cv.atsScore >= 90 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : cv.atsScore >= 80
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : cv.atsScore >= 70
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${cv.atsScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCVs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun CV trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par analyser ou créer votre premier CV'
            }
          </p>
          <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105">
            Créer un nouveau CV
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-200 hover:scale-105 text-left">
              <Sparkles className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-1">Créer un nouveau CV</h4>
              <p className="text-sm text-white/80">Avec l'assistant IA</p>
            </button>
            
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-200 hover:scale-105 text-left">
              <Award className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-1">Analyser un CV</h4>
              <p className="text-sm text-white/80">Optimisation ATS</p>
            </button>
            
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-200 hover:scale-105 text-left">
              <Download className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-1">Exporter tout</h4>
              <p className="text-sm text-white/80">Archive complète</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};