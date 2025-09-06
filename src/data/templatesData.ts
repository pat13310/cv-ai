export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  atsScore: number;
  downloads: string;
  rating: number;
  tags: string[];
  wordFile: string;
  isPremium: boolean;
  industry: string;
}

export const templatesData: Template[] = [
  {
    id: '1',
    name: 'CV Tech Senior Pro',
    category: 'Développement',
    description: 'Template optimisé pour les développeurs seniors avec sections dédiées aux projets techniques',
    preview: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    atsScore: 96,
    downloads: '3.2k',
    rating: 4.9,
    tags: ['Senior', 'Full Stack', 'ATS Optimisé', 'Projets'],
    wordFile: 'cv-tech-senior-pro.docx',
    isPremium: true,
    industry: 'Tech'
  },
  {
    id: '2',
    name: 'CV Marketing Digital Elite',
    category: 'Marketing',
    description: 'Design moderne pour les professionnels du marketing digital avec focus sur les KPIs',
    preview: 'bg-gradient-to-br from-pink-100 to-rose-100',
    atsScore: 94,
    downloads: '2.8k',
    rating: 4.8,
    tags: ['Marketing', 'Digital', 'KPIs', 'Créatif'],
    wordFile: 'cv-marketing-digital-elite.docx',
    isPremium: true,
    industry: 'Marketing'
  },
  {
    id: '3',
    name: 'CV Executive Premium',
    category: 'Management',
    description: 'Template élégant pour postes de direction avec mise en avant du leadership',
    preview: 'bg-gradient-to-br from-gray-100 to-slate-100',
    atsScore: 95,
    downloads: '1.9k',
    rating: 4.9,
    tags: ['Executive', 'Leadership', 'Premium', 'Direction'],
    wordFile: 'cv-executive-premium.docx',
    isPremium: true,
    industry: 'Management'
  },
  {
    id: '4',
    name: 'CV Designer UX/UI',
    category: 'Design',
    description: 'Template créatif pour designers avec espace portfolio et projets visuels',
    preview: 'bg-gradient-to-br from-violet-100 to-purple-100',
    atsScore: 91,
    downloads: '4.1k',
    rating: 4.7,
    tags: ['UX/UI', 'Portfolio', 'Créatif', 'Projets'],
    wordFile: 'cv-designer-ux-ui.docx',
    isPremium: false,
    industry: 'Design'
  },
  {
    id: '5',
    name: 'CV Data Scientist',
    category: 'Data Science',
    description: 'Optimisé pour les data scientists avec sections techniques et certifications',
    preview: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    atsScore: 97,
    downloads: '1.5k',
    rating: 4.8,
    tags: ['Data Science', 'Analytics', 'Python', 'ML'],
    wordFile: 'cv-data-scientist.docx',
    isPremium: true,
    industry: 'Data'
  },
  {
    id: '6',
    name: 'CV Finance Corporate',
    category: 'Finance',
    description: 'Template professionnel pour le secteur financier avec focus sur les résultats',
    preview: 'bg-gradient-to-br from-amber-100 to-orange-100',
    atsScore: 93,
    downloads: '2.1k',
    rating: 4.6,
    tags: ['Finance', 'Corporate', 'Analyse', 'Budget'],
    wordFile: 'cv-finance-corporate.docx',
    isPremium: false,
    industry: 'Finance'
  },
  {
    id: '7',
    name: 'CV Commercial B2B',
    category: 'Commercial',
    description: 'Template spécialisé pour les commerciaux B2B avec focus sur les résultats de vente',
    preview: 'bg-gradient-to-br from-green-100 to-emerald-100',
    atsScore: 92,
    downloads: '2.3k',
    rating: 4.7,
    tags: ['Commercial', 'B2B', 'Vente', 'Négociation'],
    wordFile: 'cv-commercial-b2b.docx',
    isPremium: false,
    industry: 'Commercial'
  },
  {
    id: '8',
    name: 'CV Consultant Senior',
    category: 'Conseil',
    description: 'Template premium pour consultants avec mise en avant des missions et expertises',
    preview: 'bg-gradient-to-br from-indigo-100 to-blue-100',
    atsScore: 94,
    downloads: '1.7k',
    rating: 4.8,
    tags: ['Conseil', 'Senior', 'Missions', 'Expertise'],
    wordFile: 'cv-consultant-senior.docx',
    isPremium: true,
    industry: 'Conseil'
  }
];

export const categories = [
  'Tous',
  'Développement',
  'Marketing',
  'Management',
  'Design',
  'Data Science',
  'Finance',
  'Commercial',
  'Conseil'
];