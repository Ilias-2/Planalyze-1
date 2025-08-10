import { RequestHandler } from "express";

export const handleAnalyzeSimple: RequestHandler = (req, res) => {
  try {
    // For demonstration, we'll generate realistic mock data
    // In a real scenario, this would process the uploaded file
    
    const mockAnalysisData = generateIntelligentAnalysis();
    
    // Simulate processing time
    setTimeout(() => {
      res.json(mockAnalysisData);
    }, 1500);
    
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'analyse du fichier"
    });
  }
};

function generateIntelligentAnalysis() {
  const projectTypes = [
    {
      type: "hôtel boutique",
      region: "Marrakech",
      investment: "2,200,000",
      jobs: 18,
      score: 82
    },
    {
      type: "restaurant gastronomique",
      region: "Casablanca", 
      investment: "950,000",
      jobs: 12,
      score: 78
    },
    {
      type: "complexe éco-touristique",
      region: "Fès",
      investment: "1,800,000",
      jobs: 15,
      score: 85
    }
  ];
  
  const randomProject = projectTypes[Math.floor(Math.random() * projectTypes.length)];
  
  return {
    success: true,
    file_name: "business-plan-analyzed.pdf",
    texte_extrait: `Analyse du business plan de ${randomProject.type}. Document de ${Math.floor(Math.random() * 10) + 15} pages contenant un plan détaillé...`,
    objectif_du_projet: `Développement d'un ${randomProject.type} dans la région de ${randomProject.region}, visant à promouvoir le tourisme authentique et durable tout en créant de la valeur économique locale.`,
    montant_total: `${randomProject.investment} MAD`,
    date_debut: "15/06/2024",
    date_fin: `30/11/${2025 + Math.floor(Math.random() * 2)}`,
    impact_social: `Création de ${randomProject.jobs} emplois directs et ${Math.floor(randomProject.jobs * 1.8)} emplois indirects dans la région. Formation de la population locale aux métiers du tourisme. Promotion de l'artisanat local et des produits du terroir.`,
    impact_culturel: `Valorisation du patrimoine architectural local. Organisation d'ateliers culturels pour les visiteurs. Partenariat avec ${Math.floor(Math.random() * 10) + 8} artisans locaux pour l'authenticité.`,
    swot: {
      forces: [
        "Emplacement stratégique dans la région",
        "Équipe expérimentée en hôtellerie",
        "Concept innovant et différenciant",
        "Partenariats établis avec artisans locaux"
      ],
      faiblesses: [
        "Investissement initial important",
        "Dépendance à la saisonnalité touristique",
        "Concurrence établie dans la région"
      ],
      opportunites: [
        "Croissance du tourisme au Maroc",
        "Soutien gouvernemental au secteur",
        "Demande croissante pour l'authenticité",
        "Tendance vers le tourisme durable"
      ],
      menaces: [
        "Instabilité économique mondiale",
        "Fluctuations des taux de change",
        "Concurrence internationale",
        "Impact des crises sanitaires"
      ]
    },
    eligibilite: {
      statut: randomProject.score >= 70,
      score: randomProject.score + Math.floor(Math.random() * 8) - 4,
      raisons: randomProject.score < 70 ? ["Score d'innovation insuffisant", "Impact social à renforcer"] : [],
      recommandations: [
        "Renforcer le plan marketing digital",
        "Développer des partenariats stratégiques",
        "Obtenir des certifications de qualité",
        "Prévoir un plan de contingence financière"
      ]
    },
    metadata: {
      pages_count: Math.floor(Math.random() * 15) + 10,
      word_count: Math.floor(Math.random() * 2000) + 1500,
      analysis_confidence: 0.75 + Math.random() * 0.2,
      source: "express_api_simple",
      analysis_date: new Date().toISOString()
    }
  };
}
