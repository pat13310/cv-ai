import React, { useState } from "react";
import {
  Search,
  Eye,
  Star,
  Calendar,
  
} from "lucide-react";

import { QuickActions } from "./QuickActions"; 

// ----------------------
// Types
// ----------------------
type DocumentType = "cv" | "letter";
type SourceType = "analyzed" | "created";
type Status = "draft" | "completed" | "optimized";
type FilterType = "all" | "analyzed" | "created";
type SortBy = "date" | "score" | "name";

interface DocumentItem {
  id: string;
  docType: DocumentType;
  name: string;
  type: SourceType;
  atsScore: number;
  createdAt: Date;
  lastModified: Date;
  status: Status;
  template?: string;
  industry: string;
  isFavorite: boolean;
  fileSize: string;
  version: number;
}



// ----------------------
// Composant
// ----------------------
export const CVLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");

  // ----------------------
  // Données
  // ----------------------
  const documents: DocumentItem[] = [
    {
      id: "1",
      docType: "cv",
      name: "CV_Marie_Dubois_DevFullStack",
      type: "created",
      atsScore: 94,
      createdAt: new Date("2024-01-15"),
      lastModified: new Date("2024-01-16"),
      status: "completed",
      template: "Tech Innovant",
      industry: "Développement",
      isFavorite: true,
      fileSize: "245 KB",
      version: 3,
    },
    {
      id: "2",
      docType: "cv",
      name: "CV_Data_Scientist_Analyse",
      type: "analyzed",
      atsScore: 96,
      createdAt: new Date("2024-01-12"),
      lastModified: new Date("2024-01-12"),
      status: "completed",
      industry: "Data Science",
      isFavorite: false,
      fileSize: "278 KB",
      version: 1,
    },
    {
      id: "3",
      docType: "letter",
      name: "Lettre_Motivation_Designer_UX",
      type: "created",
      atsScore: 90,
      createdAt: new Date("2024-02-01"),
      lastModified: new Date("2024-02-02"),
      status: "draft",
      template: "Créatif Premium",
      industry: "Design",
      isFavorite: true,
      fileSize: "120 KB",
      version: 1,
    },
    {
      id: "4",
      docType: "letter",
      name: "Lettre_Analyse_Finance",
      type: "analyzed",
      atsScore: 88,
      createdAt: new Date("2024-02-03"),
      lastModified: new Date("2024-02-03"),
      status: "optimized",
      industry: "Finance",
      isFavorite: false,
      fileSize: "98 KB",
      version: 1,
    },
  ];

  // ----------------------
  // Filtres et Tri
  // ----------------------
  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "all" || doc.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.atsScore - a.atsScore;
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
        default:
          return b.lastModified.getTime() - a.lastModified.getTime();
      }
    });

  // ----------------------
  // Actions
  // ----------------------
  const toggleFavorite = (id: string) => {
    console.log("Toggle favorite for:", id);
  };

  const handleAction = (action: string, docId: string) => {
    console.log(`Action ${action} for document ${docId}`);
  };

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-gradient">Bibliothèque</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gérez vos CV et lettres de motivation (créés ou analysés).
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/70 rounded-2xl p-6 border border-gray-200/30">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou secteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 transition-all outline-violet-500 hover:border-violet-400"
            />
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="all">Tous les documents</option>
            <option value="created">Créés</option>
            <option value="analyzed">Analysés</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="date">Trier par date</option>
            <option value="score">Trier par score ATS</option>
            <option value="name">Trier par nom</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="w-80 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {doc.name}
                </h3>
                <button
                  onClick={() => toggleFavorite(doc.id)}
                  className={`p-1 rounded-full transition-colors ${doc.isFavorite
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-yellow-500"
                    }`}
                >
                  <Star
                    className={`w-5 h-5 ${doc.isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {/* Infos */}
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium uppercase">
                  {doc.docType === "cv" ? "CV" : "Lettre"}
                </span>{" "}
                • {doc.type === "created" ? "Créé" : "Analysé"} • {doc.industry}
              </div>

              {/* Score */}
              <div className="text-xl font-bold text-gray-900 mb-2">
                {doc.atsScore}%
              </div>

              {/* Date */}
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  Modifié le {doc.lastModified.toLocaleDateString("fr-FR")}
                </span>
              </div>

              {/* Bouton Voir */}
              <button
                onClick={() => handleAction("view", doc.id)}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-pink-700 transition-all"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      
      <QuickActions/>  
    </div>
  );
};
