import React, { useState, useEffect } from 'react';
import { Save, User, MapPin, Briefcase, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { UserProfile } from '../../hooks/useSupabase';

interface ProfileFormProps {
  onSave?: (profile: UserProfile) => void;
  onCancel?: () => void;
  showActions?: boolean;
  className?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onSave,
  onCancel,
  showActions = true,
  className = ''
}) => {
  const {
    profile,
    profileLoading,
    saveProfile,
    validationErrors,
    isSaving,
    saveStatus,
    clearValidationErrors,
    getCompletionPercentage
  } = useProfile();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    country: 'France',
    date_of_birth: '',
    nationality: 'Française',
    linkedin: '',
    website: '',
    profession: '',
    company: ''
  });

  // Charger les données du profil dans le formulaire
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        country: profile.country || 'France',
        date_of_birth: profile.date_of_birth || '',
        nationality: profile.nationality || 'Française',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
        profession: profile.profession || '',
        company: profile.company || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[field]) {
      clearValidationErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await saveProfile(formData);
    
    if (result.success && onSave && 'data' in result && result.data) {
      onSave(result.data as UserProfile);
    }
  };

  const completionPercentage = getCompletionPercentage();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <span className="ml-3 text-gray-600">Chargement du profil...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Indicateur de progression */}
      <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-6 border border-violet-200/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profil complété à {completionPercentage}%</h3>
          <div className="text-sm text-gray-600">{completionPercentage}/100</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-violet-600 to-pink-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6 border border-violet-200/30">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-violet-600" />
            <span>Informations personnelles</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Jean"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.first_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.first_name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Dupont"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.last_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.last_name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="06 12 34 56 78"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.date_of_birth ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.date_of_birth && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.date_of_birth}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationalité
              </label>
              <select
                value={formData.nationality || 'Française'}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
              >
                <option value="Française">Française</option>
                <option value="Belge">Belge</option>
                <option value="Suisse">Suisse</option>
                <option value="Canadienne">Canadienne</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/30">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Adresse</span>
          </h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Rue de la République"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.postal_code || ''}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="75001"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                    validationErrors.postal_code ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {validationErrors.postal_code && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.postal_code}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <select
                  value={formData.country || 'France'}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/30">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Informations professionnelles</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession actuelle
              </label>
              <input
                type="text"
                value={formData.profession || ''}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                placeholder="Développeur Full Stack"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise actuelle
              </label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Tech Solutions SARL"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Liens et réseaux sociaux */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/30">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>Liens et réseaux sociaux</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/jean-dupont"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.linkedin ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.linkedin && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.linkedin}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web / Portfolio
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://jean-dupont.dev"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-all duration-200 ${
                  validationErrors.website ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {validationErrors.website && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.website}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                saveStatus === 'success'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700'
              } ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Profil sauvegardé ✓</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Erreur de sauvegarde</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder le profil</span>
                </>
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};