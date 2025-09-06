import React, { useState } from 'react';
import { ArrowLeft, User, Briefcase, GraduationCap, Award, Sparkles, Wand2 } from 'lucide-react';
import { useOpenAI } from '../../hooks/useOpenAI';

interface CVFormProps {
  onBack: () => void;
}

interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    portfolio: string;
  };
  professional: {
    title: string;
    summary: string;
    targetRole: string;
    experience: {
      company: string;
      position: string;
      duration: string;
      achievements: string[];
    }[];
  };
  education: {
    degree: string;
    school: string;
    year: string;
    details: string;
  }[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
}

export const CVForm: React.FC<CVFormProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedIn: '',
      portfolio: ''
    },
    professional: {
      title: '',
      summary: '',
      targetRole: '',
      experience: [{
        company: '',
        position: '',
        duration: '',
        achievements: ['']
      }]
    },
    education: [{
      degree: '',
      school: '',
      year: '',
      details: ''
    }],
    skills: {
      technical: [''],
      soft: [''],
      languages: ['']
    }
  });

  const { generateCVContent, isLoading } = useOpenAI();

  const steps = [
    { title: 'Informations Personnelles', icon: User },
    { title: 'Expérience Professionnelle', icon: Briefcase },
    { title: 'Formation', icon: GraduationCap },
    { title: 'Compétences', icon: Award }
  ];

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const generateWithAI = async () => {
    const results = await generateCVContent(formData);
    if (results) {
      // In real app, would show the generated CV
      console.log('CV généré:', results);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="Marie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="Dubois"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="marie.dubois@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => updatePersonalInfo('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="Paris, France"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.personalInfo.linkedIn}
                  onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="linkedin.com/in/marie-dubois"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio (optionnel)</label>
                <input
                  type="url"
                  value={formData.personalInfo.portfolio}
                  onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="marie-dubois.dev"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Cette section sera disponible prochainement.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux options</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span className="text-sm font-medium text-gray-700">Assisté par IA</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  isActive ? 'text-violet-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white scale-110' 
                      : isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="hidden md:block font-medium text-sm">{step.title}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600">Remplissez vos informations pour que l'IA optimise votre CV</p>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/30">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:text-violet-600"
          >
            Précédent
          </button>

          <div className="flex space-x-3">
            <button
              onClick={generateWithAI}
              disabled={isLoading}
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Générer avec IA</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};