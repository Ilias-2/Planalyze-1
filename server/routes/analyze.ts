import { RequestHandler } from "express";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export const uploadMiddleware = upload.single('file');

export const handleAnalyze: RequestHandler = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier PDF fourni"
      });
    }

    const fileName = req.file.originalname;
    
    // Simulate intelligent analysis based on filename and generate realistic data
    const mockAnalysis = generateIntelligentMockAnalysis(fileName);
    
    // Add processing delay to simulate real analysis
    setTimeout(() => {
      res.json(mockAnalysis);
    }, 1500);
    
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'analyse du fichier"
    });
  }
};

function generateIntelligentMockAnalysis(fileName: string) {
  // Generate varied analysis based on filename patterns
  const isHotel = /hotel|riad|maison|auberge/i.test(fileName);
  const isRestaurant = /restaurant|cafe|bistro|resto/i.test(fileName);
  const isTourism = /tour|voyage|excursion|guide/i.test(fileName);
  const isEco = /eco|vert|durable|bio/i.test(fileName);
  
  let projectType = "complexe touristique";
  let baseScore = 75;
  let investmentAmount = "1,800,000";
  
  if (isHotel) {
    projectType = "hôtel boutique";
    baseScore = 82;
    investmentAmount = "2,200,000";
  } else if (isRestaurant) {
    projectType = "restaurant gastronomique";
    baseScore = 78;
    investmentAmount = "950,000";
  } else if (isTourism) {
    projectType = "agence de voyage spécialisée";
    baseScore = 71;
    investmentAmount = "650,000";
  }
  
  if (isEco) {
    baseScore += 8; // Bonus for eco projects
  }
  
  const variations = [
    {
      region: "Marrakech",
      jobs: Math.floor(Math.random() * 15) + 8,
      strengths: ["Emplacement stratégique", "Équipe expérimentée", "Concept innovant"],
    },
    {
      region: "Casablanca", 
      jobs: Math.floor(Math.random() * 20) + 12,
      strengths: ["Marché urbain dynamique", "Accessibilité internationale", "Clientèle d'affaires"],
    },
    {
      region: "Fès",
      jobs: Math.floor(Math.random() * 12) + 6,
      strengths: ["Patrimoine historique", "Artisanat traditionnel", "Tourisme culturel"],
    },
  ];
  
  const variation = variations[Math.floor(Math.random() * variations.length)];
  
  return {
    success: true,
    file_name: fileName,
    texte_extrait: `Analyse du document ${fileName}. Document de ${Math.floor(Math.random() * 20) + 15} pages contenant un business plan détaillé...`,
    objectif_du_projet: `Développement d'un ${projectType} dans la région de ${variation.region}, visant à promouvoir le tourisme ${isEco ? 'durable et responsable' : 'authentique'} tout en créant de la valeur économique locale.`,
    montant_total: `${investmentAmount} MAD`,
    date_debut: "15/06/2024",
    date_fin: `30/11/${2025 + Math.floor(Math.random() * 2)}`,
    impact_social: `Création de ${variation.jobs} emplois directs et ${Math.floor(variation.jobs * 1.8)} emplois indirects dans la région. Formation de la population locale aux métiers du tourisme. Promotion de l'artisanat local et des produits du terroir.`,
    impact_culturel: `Valorisation du patrimoine architectural local. Organisation d'ateliers culturels pour les visiteurs. Partenariat avec ${Math.floor(Math.random() * 10) + 8} artisans locaux pour l'authenticité.`,
    swot: {
      forces: [
        ...variation.strengths,
        isEco ? "Approche écologique différenciante" : "Positionnement unique sur le marché"
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
        isEco ? "Tendance vers le tourisme durable" : "Développement du tourisme de luxe"
      ],
      menaces: [
        "Instabilité économique mondiale",
        "Fluctuations des taux de change",
        "Concurrence internationale",
        "Impact des crises sanitaires"
      ]
    },
    eligibilite: {
      statut: baseScore >= 70,
      score: Math.min(baseScore + Math.floor(Math.random() * 10) - 5, 95),
      raisons: baseScore < 70 ? ["Score d'innovation insuffisant", "Impact social à renforcer"] : [],
      recommandations: [
        "Renforcer le plan marketing digital",
        "Développer des partenariats stratégiques",
        isEco ? "Obtenir des certifications écologiques" : "Intégrer des éléments de durabilité",
        "Prévoir un plan de contingence financière"
      ]
    },
    metadata: {
      pages_count: Math.floor(Math.random() * 15) + 10,
      word_count: Math.floor(Math.random() * 2000) + 1500,
      analysis_confidence: 0.75 + Math.random() * 0.2,
      source: "express_api",
      analysis_date: new Date().toISOString()
    }
  };
}
