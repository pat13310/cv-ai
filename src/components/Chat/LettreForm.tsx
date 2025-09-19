import React, { useState } from 'react';

interface LettreFormProps {
  onStartConversation: (prompt: string) => void;
}

export const LettreForm: React.FC<LettreFormProps> = ({ onStartConversation }) => {
  const [formData, setFormData] = useState({
    poste: '',
    entreprise: '',
    secteur: '',
    experience: '',
    motivation: '',
    competences: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contextPrompt = `Je souhaite rédiger une lettre de motivation professionnelle avec ces informations :
    
**Poste visé :** ${formData.poste}
**Entreprise :** ${formData.entreprise}  
**Secteur d'activité :** ${formData.secteur}
**Expérience pertinente :** ${formData.experience}
**Motivations principales :** ${formData.motivation}
**Compétences clés :** ${formData.competences}

Peux-tu m'aider à structurer et rédiger une lettre de motivation percutante et personnalisée ?`;
    
    onStartConversation(contextPrompt);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl border border-violet-200 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Informations pour votre lettre</h3>
        <p className="text-gray-600">Pour créer une lettre de motivation professionnelle, j'ai besoin de ces informations essentielles :</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste visé *</label>
            <input
              type="text"
              required
              value={formData.poste}
              onChange={(e) => setFormData({...formData, poste: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
              placeholder="Ex: Développeur Full Stack"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label>
            <input
              type="text"
              required
              value={formData.entreprise}
              onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
              placeholder="Ex: TechCorp Solutions"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
          <input
            type="text"
            value={formData.secteur}
            onChange={(e) => setFormData({...formData, secteur: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
            placeholder="Ex: Technologies de l'information, Finance, Santé..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expérience pertinente *</label>
          <textarea
            required
            rows={2}
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
            placeholder="Ex: 3 ans d'expérience en développement web, maîtrise de React/Node.js..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivations principales *</label>
          <textarea
            required
            rows={2}
            value={formData.motivation}
            onChange={(e) => setFormData({...formData, motivation: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
            placeholder="Ex: Passion pour l'innovation, opportunité d'évolution, mission de l'entreprise..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compétences clés *</label>
          <textarea
            required
            rows={2}
            value={formData.competences}
            onChange={(e) => setFormData({...formData, competences: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-violet-500"
            placeholder="Ex: Leadership, gestion de projet, communication, résolution de problèmes..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200"
        >
          Commencer la rédaction avec l'IA
        </button>
      </form>
    </div>
  );
};
