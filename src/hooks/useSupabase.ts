import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Types pour les templates
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_color: string;
  ats_score: number;
  downloads: string;
  rating: number;
  tags: string[];
  word_content: string;
  html_content: string;
  is_premium: boolean;
  industry: string;
  created_at?: string;
  updated_at?: string;
}

// Types pour les activités
export interface Activity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  score?: number;
  status: 'success' | 'warning' | 'info' | 'error';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

// Initialiser Supabase seulement si les variables d'environnement sont disponibles
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Hook pour gérer les données Supabase
export const useSupabase = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les activités depuis Supabase
  const loadActivities = async () => {
    if (!supabase) {
      // Pas de données mock par défaut - liste vide si Supabase non configuré
      setActivities([]);
      setActivitiesLoading(false);
      return;
    }

    try {
      setActivitiesLoading(true);
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setActivities(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
      setError('Erreur lors du chargement des activités');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle activité
  const addActivity = async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      // Mode mock - ajouter à la liste locale
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      return newActivity;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setActivities(prev => [data, ...prev.slice(0, 9)]);
      return data;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'activité:', err);
      throw err;
    }
  };

  // Simulation des données Supabase (en attendant la vraie connexion)
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'CV Tech Senior Pro',
      category: 'Développement',
      description: 'Design moderne avec sidebar technique et projets GitHub',
      preview_color: 'bg-gradient-to-br from-slate-100 to-blue-100',
      ats_score: 96,
      downloads: '3.2k',
      rating: 4.9,
      tags: ['Senior', 'Full Stack', 'GitHub', 'Projets'],
      word_content: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: "Segoe UI", sans-serif; margin: 0; background: #f8fafc; }
.container { max-width: 210mm; margin: 0 auto; background: white; display: flex; min-height: 297mm; }
.sidebar { width: 35%; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 30px; }
.main { width: 65%; padding: 40px; }
.profile-img { width: 120px; height: 120px; border-radius: 50%; background: #3b82f6; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; }
.name { font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 10px; }
.title { font-size: 16px; text-align: center; opacity: 0.9; margin-bottom: 30px; }
.section { margin-bottom: 30px; }
.section-title { font-size: 18px; font-weight: bold; color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 8px; margin-bottom: 20px; }
.sidebar .section-title { color: white; border-bottom-color: #60a5fa; }
.contact-item { display: flex; align-items: center; margin-bottom: 15px; }
.skill-bar { margin-bottom: 15px; }
.skill-name { font-size: 14px; margin-bottom: 5px; }
.skill-progress { height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
.skill-fill { height: 100%; background: #60a5fa; border-radius: 4px; }
.job { margin-bottom: 25px; }
.job-title { font-size: 18px; font-weight: bold; color: #1e293b; }
.company { color: #3b82f6; font-weight: 600; }
.date { color: #64748b; font-size: 14px; margin-bottom: 10px; }
.achievement { margin: 8px 0; padding-left: 20px; position: relative; }
.achievement:before { content: "▶"; position: absolute; left: 0; color: #3b82f6; }
.tech-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
.tech-tag { background: #e2e8f0; color: #334155; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
</style>
</head>
<body>
<div class="container">
  <div class="sidebar">
    <div class="profile-img">AM</div>
    <div class="name">[VOTRE PRÉNOM] [NOM]</div>
    <div class="title">Lead Developer Full Stack</div>
    
    <div class="section">
      <div class="section-title">CONTACT</div>
      <div class="contact-item">📧 [votre.email@email.com]</div>
      <div class="contact-item">📱 [+33 6 XX XX XX XX]</div>
      <div class="contact-item">📍 [Votre Ville, France]</div>
      <div class="contact-item">💼 [linkedin.com/in/votre-profil]</div>
      <div class="contact-item">🔗 [github.com/votre-profil]</div>
    </div>
    
    <div class="section">
      <div class="section-title">COMPÉTENCES</div>
      <div class="skill-bar">
        <div class="skill-name">JavaScript/TypeScript</div>
        <div class="skill-progress"><div class="skill-fill" style="width: 95%"></div></div>
      </div>
      <div class="skill-bar">
        <div class="skill-name">React/Next.js</div>
        <div class="skill-progress"><div class="skill-fill" style="width: 90%"></div></div>
      </div>
      <div class="skill-bar">
        <div class="skill-name">Node.js/Express</div>
        <div class="skill-progress"><div class="skill-fill" style="width: 88%"></div></div>
      </div>
      <div class="skill-bar">
        <div class="skill-name">Docker/Kubernetes</div>
        <div class="skill-progress"><div class="skill-fill" style="width: 85%"></div></div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">LANGUES</div>
      <div style="margin-bottom: 10px;">🇫🇷 Français (Natif)</div>
      <div style="margin-bottom: 10px;">🇬🇧 Anglais (Courant)</div>
      <div>🇪🇸 Espagnol (Intermédiaire)</div>
    </div>
  </div>
  
  <div class="main">
    <div class="section">
      <div class="section-title">PROFIL PROFESSIONNEL</div>
      <p>Lead Developer Full Stack avec [X]+ années d'expérience dans le développement d'applications web modernes. Expert en JavaScript/TypeScript, React et Node.js. Passionné par l'architecture logicielle et le mentoring d'équipes techniques.</p>
    </div>
    
    <div class="section">
      <div class="section-title">EXPÉRIENCE PROFESSIONNELLE</div>
      
      <div class="job">
        <div class="job-title">Lead Developer Full Stack</div>
        <div class="company">[Nom de l'Entreprise] • <span class="date">[Date début] - Présent</span></div>
        <div class="achievement">Architecture et développement d'une plateforme SaaS générant [X]M€ de CA annuel</div>
        <div class="achievement">Management technique d'une équipe de [X] développeurs</div>
        <div class="achievement">Réduction de 40% du temps de chargement via optimisation React/Next.js</div>
        <div class="achievement">Mise en place CI/CD avec Docker/Kubernetes (99.9% uptime)</div>
        <div class="tech-stack">
          <span class="tech-tag">React</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Node.js</span>
          <span class="tech-tag">PostgreSQL</span>
          <span class="tech-tag">Docker</span>
        </div>
      </div>
      
      <div class="job">
        <div class="job-title">Senior Full Stack Developer</div>
        <div class="company">[Entreprise Précédente] • <span class="date">[Date début] - [Date fin]</span></div>
        <div class="achievement">Développement d'une API REST utilisée par [X]k+ utilisateurs quotidiens</div>
        <div class="achievement">Migration legacy vers architecture microservices</div>
        <div class="achievement">Amélioration des performances de 60% via optimisation base de données</div>
        <div class="tech-stack">
          <span class="tech-tag">Vue.js</span>
          <span class="tech-tag">Express</span>
          <span class="tech-tag">MongoDB</span>
          <span class="tech-tag">Redis</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">PROJETS OPEN SOURCE</div>
      <div class="achievement">🚀 [Nom du projet] - [Description courte] ([X]k+ stars GitHub)</div>
      <div class="achievement">⚡ [Autre projet] - [Description] (Featured sur Product Hunt)</div>
    </div>
    
    <div class="section">
      <div class="section-title">FORMATION</div>
      <div class="job-title">[Votre Diplôme] - [Spécialité]</div>
      <div class="company">[Votre École/Université] • <span class="date">[Année]</span></div>
    </div>
  </div>
</div>
</body>
</html>`,
      html_content: '<html>Tech template HTML content</html>',
      is_premium: true,
      industry: 'Tech'
    },
    {
      id: '2',
      name: 'CV Marketing Digital Elite',
      category: 'Marketing',
      description: 'Design créatif avec infographies et métriques visuelles',
      preview_color: 'bg-gradient-to-br from-pink-100 to-rose-100',
      ats_score: 94,
      downloads: '2.8k',
      rating: 4.8,
      tags: ['Marketing', 'Digital', 'ROI', 'Growth'],
      word_content: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: "Inter", sans-serif; margin: 0; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); }
.container { max-width: 210mm; margin: 0 auto; background: white; min-height: 297mm; }
.header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 40px; text-align: center; position: relative; overflow: hidden; }
.header::before { content: ""; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.profile-section { position: relative; z-index: 2; }
.name { font-size: 36px; font-weight: 800; margin-bottom: 10px; }
.tagline { font-size: 18px; opacity: 0.9; margin-bottom: 20px; }
.contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 400px; margin: 0 auto; }
.contact-item { display: flex; align-items: center; justify-content: center; }
.main-content { padding: 40px; }
.section { margin-bottom: 35px; }
.section-title { font-size: 24px; font-weight: bold; color: #be185d; margin-bottom: 20px; position: relative; }
.section-title::after { content: ""; position: absolute; bottom: -8px; left: 0; width: 60px; height: 4px; background: linear-gradient(90deg, #ec4899, #f97316); border-radius: 2px; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 25px 0; }
.metric-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #f59e0b; }
.metric-number { font-size: 28px; font-weight: bold; color: #92400e; }
.metric-label { font-size: 12px; color: #78350f; margin-top: 5px; }
.job { background: #f8fafc; padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 5px solid #ec4899; }
.job-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
.job-title { font-size: 20px; font-weight: bold; color: #1e293b; }
.company { color: #ec4899; font-weight: 600; font-size: 16px; }
.date { color: #64748b; font-size: 14px; }
.achievement { margin: 10px 0; padding-left: 25px; position: relative; }
.achievement::before { content: "📈"; position: absolute; left: 0; }
.skills-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
.skill-category { background: #f1f5f9; padding: 20px; border-radius: 15px; }
.skill-category h4 { color: #be185d; margin-bottom: 15px; font-size: 16px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { background: linear-gradient(135deg, #ec4899, #be185d); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="profile-section">
      <div class="name">[VOTRE PRÉNOM] [NOM]</div>
      <div class="tagline">Responsable Marketing Digital & Growth</div>
      <div class="contact-grid">
        <div class="contact-item">📧 [votre.email@email.com]</div>
        <div class="contact-item">📱 [+33 6 XX XX XX XX]</div>
        <div class="contact-item">📍 [Votre Ville, France]</div>
        <div class="contact-item">💼 [linkedin.com/in/profil]</div>
      </div>
    </div>
  </div>
  
  <div class="main-content">
    <div class="section">
      <div class="section-title">PROFIL MARKETING</div>
      <p>Responsable Marketing Digital avec [X]+ années d'expérience en growth marketing et acquisition multicanale. Expert en performance marketing avec un track record de croissance de +200% du trafic et ROI moyen de 4:1 sur les campagnes payantes.</p>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-number">+200%</div>
          <div class="metric-label">Croissance Trafic</div>
        </div>
        <div class="metric-card">
          <div class="metric-number">4:1</div>
          <div class="metric-label">ROI Moyen</div>
        </div>
        <div class="metric-card">
          <div class="metric-number">500k€</div>
          <div class="metric-label">Budget Géré</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">EXPÉRIENCE PROFESSIONNELLE</div>
      
      <div class="job">
        <div class="job-header">
          <div>
            <div class="job-title">Responsable Marketing Digital</div>
            <div class="company">[Nom de l'Entreprise]</div>
          </div>
          <div class="date">[Date début] - Présent</div>
        </div>
        <div class="achievement">Stratégie d'acquisition multicanale : +200% trafic organique, +150% leads qualifiés</div>
        <div class="achievement">Gestion budget Google Ads/Facebook Ads 500k€/an avec ROI moyen 4:1</div>
        <div class="achievement">Développement communauté social media : 50k+ followers, engagement rate 8%</div>
        <div class="achievement">Management équipe marketing 4 personnes (SEO, Content, Paid, CRM)</div>
        <div class="achievement">Mise en place marketing automation : +35% conversion leads vers clients</div>
      </div>
      
      <div class="job">
        <div class="job-header">
          <div>
            <div class="job-title">Chef de Projet Marketing Digital</div>
            <div class="company">[Entreprise Précédente]</div>
          </div>
          <div class="date">[Date début] - [Date fin]</div>
        </div>
        <div class="achievement">Gestion portefeuille 25 clients B2B/B2C avec budgets 10k€ à 100k€</div>
        <div class="achievement">Campagnes SEA/SEO : amélioration moyenne +180% visibilité organique</div>
        <div class="achievement">Création contenus : 200+ articles de blog, 2M+ vues cumulées</div>
        <div class="achievement">Formation clients sur outils analytics et bonnes pratiques digitales</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">COMPÉTENCES MARKETING</div>
      <div class="skills-container">
        <div class="skill-category">
          <h4>🎯 Acquisition</h4>
          <div class="skill-tags">
            <span class="skill-tag">Google Ads</span>
            <span class="skill-tag">Facebook Ads</span>
            <span class="skill-tag">SEO/SEM</span>
            <span class="skill-tag">Growth Hacking</span>
          </div>
        </div>
        <div class="skill-category">
          <h4>📊 Analytics</h4>
          <div class="skill-tags">
            <span class="skill-tag">Google Analytics</span>
            <span class="skill-tag">Google Tag Manager</span>
            <span class="skill-tag">Data Studio</span>
            <span class="skill-tag">Hotjar</span>
          </div>
        </div>
        <div class="skill-category">
          <h4>📝 Content</h4>
          <div class="skill-tags">
            <span class="skill-tag">Content Marketing</span>
            <span class="skill-tag">Social Media</span>
            <span class="skill-tag">Email Marketing</span>
            <span class="skill-tag">Copywriting</span>
          </div>
        </div>
        <div class="skill-category">
          <h4>🛠️ Outils</h4>
          <div class="skill-tags">
            <span class="skill-tag">HubSpot</span>
            <span class="skill-tag">Mailchimp</span>
            <span class="skill-tag">WordPress</span>
            <span class="skill-tag">Canva</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">FORMATION & CERTIFICATIONS</div>
      <div class="job">
        <div class="job-title">[Votre Diplôme] - [Spécialité]</div>
        <div class="company">[Votre École/Université] • [Année]</div>
      </div>
      <div style="margin-top: 15px;">
        <strong>Certifications :</strong> Google Ads, Google Analytics, Facebook Blueprint, HubSpot Marketing
      </div>
    </div>
  </div>
</div>
</body>
</html>`,
      html_content: '<html>Marketing template HTML content</html>',
      is_premium: true,
      industry: 'Marketing'
    },
    {
      id: '3',
      name: 'CV Executive Premium',
      category: 'Management',
      description: 'Design élégant et corporate pour dirigeants',
      preview_color: 'bg-gradient-to-br from-gray-100 to-slate-100',
      ats_score: 95,
      downloads: '1.9k',
      rating: 4.9,
      tags: ['Executive', 'Leadership', 'P&L', 'International'],
      word_content: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: "Times New Roman", serif; margin: 0; background: #ffffff; color: #1a1a1a; }
.container { max-width: 210mm; margin: 0 auto; background: white; min-height: 297mm; }
.header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 50px 40px; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.name-section { flex: 1; }
.name { font-size: 42px; font-weight: bold; margin-bottom: 15px; letter-spacing: 1px; }
.title { font-size: 22px; opacity: 0.9; margin-bottom: 25px; font-style: italic; }
.contact-info { font-size: 16px; line-height: 1.8; }
.executive-badge { background: rgba(255,255,255,0.15); padding: 30px; border-radius: 15px; text-align: center; min-width: 200px; }
.badge-title { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
.badge-value { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
.badge-subtitle { font-size: 12px; opacity: 0.7; }
.main-content { padding: 40px; }
.section { margin-bottom: 40px; }
.section-title { font-size: 20px; font-weight: bold; color: #1e293b; border-bottom: 3px solid #1e293b; padding-bottom: 10px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
.executive-summary { font-size: 16px; line-height: 1.8; text-align: justify; background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 5px solid #1e293b; }
.experience-item { margin-bottom: 35px; padding-bottom: 30px; border-bottom: 1px solid #e2e8f0; }
.experience-item:last-child { border-bottom: none; }
.job-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
.job-title { font-size: 22px; font-weight: bold; color: #1e293b; }
.company { font-size: 18px; color: #475569; font-style: italic; }
.tenure { color: #64748b; font-size: 16px; }
.key-achievements { margin-top: 20px; }
.achievement { margin: 12px 0; padding-left: 30px; position: relative; font-size: 16px; line-height: 1.6; }
.achievement::before { content: "■"; position: absolute; left: 0; color: #1e293b; font-size: 12px; top: 6px; }
.metrics-highlight { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #0ea5e9; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.metric { text-align: center; }
.metric-value { font-size: 24px; font-weight: bold; color: #0369a1; }
.metric-label { font-size: 12px; color: #475569; margin-top: 5px; }
.skills-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
.skill-group { background: #f8fafc; padding: 20px; border-radius: 10px; }
.skill-group h4 { color: #1e293b; margin-bottom: 15px; font-size: 16px; }
.skill-list { list-style: none; padding: 0; }
.skill-list li { padding: 5px 0; border-bottom: 1px dotted #cbd5e1; }
.skill-list li:last-child { border-bottom: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-content">
      <div class="name-section">
        <div class="name">[VOTRE PRÉNOM] [NOM]</div>
        <div class="title">Directeur Général</div>
        <div class="contact-info">
          📧 [votre.email@email.com]<br>
          📱 [+33 6 XX XX XX XX]<br>
          📍 [Votre Ville, France]<br>
          💼 [linkedin.com/in/votre-profil]
        </div>
      </div>
      <div class="executive-badge">
        <div class="badge-title">EXPÉRIENCE</div>
        <div class="badge-value">[X]+</div>
        <div class="badge-subtitle">années de leadership</div>
      </div>
    </div>
  </div>
  
  <div class="main-content">
    <div class="section">
      <div class="section-title">Profil Exécutif</div>
      <div class="executive-summary">
        Directeur Général expérimenté avec [X]+ années de leadership dans l'industrie [secteur]. Expertise en transformation digitale, développement international et gestion P&L. Track record de croissance rentable avec multiplication du CA par [X] et expansion sur [X] pays. Spécialiste de la conduite du changement et du développement d'équipes haute performance.
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Expérience de Direction</div>
      
      <div class="experience-item">
        <div class="job-header">
          <div>
            <div class="job-title">Directeur Général</div>
            <div class="company">[Nom de l'Entreprise]</div>
          </div>
          <div class="tenure">[Date début] - Présent</div>
        </div>
        
        <div class="metrics-highlight">
          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-value">[X]M€</div>
              <div class="metric-label">Chiffre d'Affaires</div>
            </div>
            <div class="metric">
              <div class="metric-value">[X]%</div>
              <div class="metric-label">Marge EBITDA</div>
            </div>
            <div class="metric">
              <div class="metric-value">[X]</div>
              <div class="metric-label">Pays d'implantation</div>
            </div>
          </div>
        </div>
        
        <div class="key-achievements">
          <div class="achievement">Croissance du CA de [X]M€ à [X]M€ en [X] ans avec marge EBITDA de [X]%</div>
          <div class="achievement">Expansion internationale : ouverture de [X] filiales en [régions]</div>
          <div class="achievement">Direction équipe de [X]+ collaborateurs répartis sur [X] pays</div>
          <div class="achievement">Levée de fonds de [X]M€ auprès d'investisseurs institutionnels</div>
          <div class="achievement">Transformation digitale complète : migration cloud, automatisation processus</div>
        </div>
      </div>
      
      <div class="experience-item">
        <div class="job-header">
          <div>
            <div class="job-title">Directeur Commercial & Marketing</div>
            <div class="company">[Entreprise Précédente]</div>
          </div>
          <div class="tenure">[Date début] - [Date fin]</div>
        </div>
        
        <div class="key-achievements">
          <div class="achievement">Développement marché [région] : [X] à [X]M€ de CA en [X] ans</div>
          <div class="achievement">Négociation contrats stratégiques (total [X]M€)</div>
          <div class="achievement">Construction équipe commerciale de [X] personnes sur [X] pays</div>
          <div class="achievement">Mise en place CRM et processus de vente standardisés</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Compétences de Direction</div>
      <div class="skills-section">
        <div class="skill-group">
          <h4>🎯 Leadership</h4>
          <ul class="skill-list">
            <li>Direction générale</li>
            <li>Transformation digitale</li>
            <li>Vision stratégique</li>
            <li>Conduite du changement</li>
          </ul>
        </div>
        <div class="skill-group">
          <h4>💼 Business</h4>
          <ul class="skill-list">
            <li>P&L Management</li>
            <li>Développement international</li>
            <li>M&A</li>
            <li>Levée de fonds</li>
          </ul>
        </div>
        <div class="skill-group">
          <h4>🤝 Commercial</h4>
          <ul class="skill-list">
            <li>Négociation</li>
            <li>Business Development</li>
            <li>Partenariats stratégiques</li>
            <li>Key Account Management</li>
          </ul>
        </div>
        <div class="skill-group">
          <h4>👥 Management</h4>
          <ul class="skill-list">
            <li>Leadership d'équipe</li>
            <li>Coaching</li>
            <li>Communication</li>
            <li>Développement talents</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Formation</div>
      <div class="experience-item">
        <div class="job-title">[Votre Diplôme]</div>
        <div class="company">[Votre École/Université] • [Année]</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Langues</div>
      <div class="skills-section">
        <div>Français (Natif) • Anglais (Courant) • Espagnol (Intermédiaire)</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`,
      html_content: '<html>Executive template HTML content</html>',
      is_premium: true,
      industry: 'Management'
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const loadTemplates = async () => {
      try {
        setLoading(true);
        
        if (!supabase) {
          // Mode mock
          await new Promise(resolve => setTimeout(resolve, 1000));
          setTemplates(mockTemplates);
        } else {
          // Charger depuis Supabase
          const { data, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          setTemplates(data || mockTemplates);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des templates:', err);
        setError('Erreur lors du chargement des templates');
        // Fallback sur les données mock
        setTemplates(mockTemplates);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
    loadActivities();
  }, []);

  return {
    templates,
    activities,
    loading,
    activitiesLoading,
    error,
    addActivity,
    refreshActivities: loadActivities
  };
};