
-- Template 8: CV Consultant Senior
INSERT INTO templates (
        name,
        category,
        description,
        preview_color,
        ats_score,
        downloads,
        rating,
        tags,
        word_content,
        html_content,
        is_premium,
        industry
    )
VALUES (
        'CV Consultant Senior',
        'Conseil',
        'Template premium pour consultants avec mise en avant des missions et expertises',
        'bg-gradient-to-br from-indigo-100 to-blue-100',
        94,
        '1.7k',
        4.8,
        ARRAY ['Conseil', 'Senior', 'Missions', 'Expertise'],
        NULL,
        '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: "Helvetica", sans-serif; margin: 0; background: #eff6ff; }
.container { max-width: 210mm; margin: 0 auto; background: white; min-height: 297mm; }
.header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px; }
.name { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
.title { font-size: 18px; opacity: 0.9; margin-bottom: 20px; }
.contact { display: flex; justify-content: space-between; flex-wrap: wrap; }
.main { padding: 40px; }
.section { margin-bottom: 30px; }
.section-title { font-size: 20px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 20px; }
.expertise-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
.expertise-item { background: #dbeafe; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #3b82f6; }
.mission-item { background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
.mission-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
.client-info { color: #1e40af; font-weight: 600; }
.duration { color: #64748b; font-size: 14px; }
.achievement { margin: 8px 0; padding-left: 20px; position: relative; }
.achievement::before { content: "✓"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
.methodologies { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
.method-tag { background: #1e40af; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="name">[VOTRE PRÉNOM] [NOM]</div>
    <div class="title">Consultant Senior en Transformation</div>
    <div class="contact">
      <span>📧 [votre.email@email.com]</span>
      <span>📱 [+33 6 XX XX XX XX]</span>
      <span>📍 [Votre Ville, France]</span>
      <span>💼 [linkedin.com/in/profil]</span>
    </div>
  </div>
  
  <div class="main">
    <div class="section">
      <div class="section-title">PROFIL CONSULTANT</div>
      <p>Consultant Senior avec [X]+ années d''expérience en transformation d''entreprise et conduite du changement. Expert en optimisation des processus, digitalisation et accompagnement stratégique. Intervenu auprès de [X]+ clients grands comptes et PME.</p>
    </div>
    
    <div class="section">
      <div class="section-title">DOMAINES D''EXPERTISE</div>
      <div class="expertise-grid">
        <div class="expertise-item">
          <strong>Transformation Digitale</strong><br>
          <small>Digitalisation processus, Change management</small>
        </div>
        <div class="expertise-item">
          <strong>Optimisation Opérationnelle</strong><br>
          <small>Lean, Process improvement, Efficiency</small>
        </div>
        <div class="expertise-item">
          <strong>Stratégie & Organisation</strong><br>
          <small>Restructuration, Gouvernance, KPIs</small>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">MISSIONS RÉCENTES</div>
      
      <div class="mission-item">
        <div class="mission-header">
          <div>
            <strong>Transformation Digitale</strong><br>
            <span class="client-info">Groupe industriel • [X]k collaborateurs</span>
          </div>
          <div class="duration">[X] mois</div>
        </div>
        <div class="achievement">Audit et refonte de [X] processus métiers critiques</div>
        <div class="achievement">Déploiement solution ERP sur 5 sites (2000+ utilisateurs)</div>
        <div class="achievement">Réduction des coûts opérationnels de 25% et amélioration ROI</div>
        <div class="methodologies">
          <span class="method-tag">Agile</span>
          <span class="method-tag">Lean Six Sigma</span>
          <span class="method-tag">Change Management</span>
        </div>
      </div>
      
      <div class="mission-item">
        <div class="mission-header">
          <div>
            <strong>Restructuration Organisationnelle</strong><br>
            <span class="client-info">PME Services • [X] collaborateurs</span>
          </div>
          <div class="duration">[X] mois</div>
        </div>
        <div class="achievement">Analyse organisationnelle et définition nouvelle structure</div>
        <div class="achievement">Accompagnement conduite du changement (100+ collaborateurs)</div>
        <div class="achievement">Mise en place tableaux de bord et KPIs de performance</div>
        <div class="methodologies">
          <span class="method-tag">Design Thinking</span>
          <span class="method-tag">RACI</span>
          <span class="method-tag">Balanced Scorecard</span>
        </div>
      </div>
      
      <div class="mission-item">
        <div class="mission-header">
          <div>
            <strong>Optimisation Processus</strong><br>
            <span class="client-info">Secteur Bancaire • [X]k collaborateurs</span>
          </div>
          <div class="duration">[X] mois</div>
        </div>
        <div class="achievement">Cartographie et optimisation de [X] processus back-office</div>
        <div class="achievement">Automatisation workflows et réduction délais de 40%</div>
        <div class="achievement">Formation équipes et transfert de compétences</div>
        <div class="methodologies">
          <span class="method-tag">BPMN</span>
          <span class="method-tag">RPA</span>
          <span class="method-tag">Kaizen</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">COMPÉTENCES TECHNIQUES</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <strong>Méthodologies</strong><br>
          • Lean Six Sigma (Black Belt)<br>
          • Agile/Scrum (Certified)<br>
          • Design Thinking<br>
          • Change Management (Prosci)
        </div>
        <div>
          <strong>Outils & Technologies</strong><br>
          • MS Project, Visio, PowerBI<br>
          • Tableau, Qlik Sense<br>
          • SAP, Salesforce<br>
          • Python, SQL (notions)
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">FORMATION & CERTIFICATIONS</div>
      <div style="margin-bottom: 15px;">
        <strong>[Année] • [Diplôme/École]</strong><br>
        <span style="color: #64748b;">[Spécialisation/Mention]</span>
      </div>
      <div style="margin-bottom: 15px;">
        <strong>Certifications Professionnelles</strong><br>
        • Lean Six Sigma Black Belt • PMP (Project Management) • Prosci Change Management
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">LANGUES & MOBILITÉ</div>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <strong>Langues :</strong> Français (natif), Anglais (courant), [Autre langue]
        </div>
        <div>
          <strong>Mobilité :</strong> France entière, International
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>',
        true,
        'Conseil'
    );