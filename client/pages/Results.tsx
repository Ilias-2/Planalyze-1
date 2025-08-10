import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  Edit3, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  FileDown,
  Share
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

interface ExtractedData {
  projectObjective: string;
  investmentAmount: string;
  startDate: string;
  endDate: string;
  socialImpact: string;
  culturalImpact: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  eligibilityScore: number;
  recommendations: string[];
}

export default function Results() {
  const location = useLocation();
  const fileName = location.state?.fileName || "business-plan.pdf";
  const analysisData = location.state?.analysisData;

  const [editing, setEditing] = useState(false);

  // Utiliser les données réelles de l'analyse ou des données par défaut
  const [data, setData] = useState<ExtractedData>(() => {
    if (analysisData) {
      return {
        projectObjective: analysisData.objectif_du_projet || "Objectif non identifié",
        investmentAmount: analysisData.montant_total || "Montant non spécifié",
        startDate: analysisData.date_debut || "",
        endDate: analysisData.date_fin || "",
        socialImpact: analysisData.impact_social || "Impact social non spécifié",
        culturalImpact: analysisData.impact_culturel || "Impact culturel non spécifié",
        swot: {
          strengths: analysisData.swot?.forces || [],
          weaknesses: analysisData.swot?.faiblesses || [],
          opportunities: analysisData.swot?.opportunites || [],
          threats: analysisData.swot?.menaces || []
        },
        eligibilityScore: analysisData.eligibilite?.score || 0,
        recommendations: analysisData.eligibilite?.recommandations || []
      };
    }

    // Données par défaut si pas d'analyse
    return {
      projectObjective: "Développement d'un complexe éco-touristique dans la région de Marrakech, incluant hébergement authentique, activités culturelles et circuits gastronomiques pour promouvoir le tourisme durable.",
      investmentAmount: "2,500,000 MAD",
      startDate: "2024-06-01",
      endDate: "2026-12-31",
      socialImpact: "Création de 45 emplois directs et 120 emplois indirects dans la région. Formation de la population locale aux métiers du tourisme. Promotion de l'artisanat local et des produits du terroir.",
      culturalImpact: "Valorisation du patrimoine architectural berbère. Organisation d'ateliers de cuisine traditionnelle. Partenariat avec des artisans locaux pour la décoration et l'ameublement.",
      swot: {
        strengths: [
          "Emplacement stratégique près de Marrakech",
          "Équipe expérimentée en hôtellerie",
          "Concept innovant de tourisme durable",
          "Partenariats établis avec artisans locaux"
        ],
        weaknesses: [
          "Investissement initial important",
          "Dépendance à la saisonnalité touristique",
          "Besoin de formation du personnel local"
        ],
        opportunities: [
          "Croissance du tourisme responsable au Maroc",
          "Soutien gouvernemental au secteur touristique",
          "Demande croissante pour l'authenticité",
          "Développement de l'écotourisme"
        ],
        threats: [
          "Concurrence des grandes chaînes hôtelières",
          "Instabilité économique mondiale",
          "Changements climatiques affectant le tourisme",
          "Réglementations environnementales strictes"
        ]
      },
      eligibilityScore: 85,
      recommendations: [
        "Renforcer le plan de formation du personnel local",
        "Développer des partenariats avec les tour-opérateurs",
        "Intégrer davantage de mesures de développement durable",
        "Prévoir un plan de contingence pour la saisonnalité"
      ]
    };
  });

  const exportData = async (format: 'json' | 'pdf') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'analyse-candidature.json';
      link.click();
    } else {
      await generatePDF();
    }
  };

  const generatePDF = async () => {
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();

      // Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }

        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

        // Check if we need a new page
        if (yPosition + (lines.length * fontSize * 0.3) > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        doc.text(lines, margin, yPosition);
        yPosition += lines.length * fontSize * 0.4 + 5;
      };

      // Header
      doc.setFillColor(13, 148, 136); // Primary color
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('Planalyze - Rapport d\'Analyse', margin, 25);

      yPosition = 60;
      doc.setTextColor(0, 0, 0);

      // File info
      addText(`Fichier analysé: ${fileName}`, 14, true);
      addText(`Date d'analyse: ${new Date().toLocaleDateString('fr-FR')}`, 12);
      yPosition += 10;

      // Eligibility Score
      addText('Score d\'Éligibilité Maroc PME', 18, true);
      addText(`${data.eligibilityScore}% - ${data.eligibilityScore >= 80 ? 'Éligibilité élevée' :
                data.eligibilityScore >= 60 ? 'Éligibilité modérée' : 'Éligibilité faible'}`, 14, true);
      yPosition += 10;

      // Project Objective
      addText('Objectif du Projet', 16, true);
      addText(data.projectObjective, 12);
      yPosition += 5;

      // Investment Amount
      addText('Montant d\'Investissement', 16, true);
      addText(data.investmentAmount, 12);
      yPosition += 5;

      // Timeline
      if (data.startDate && data.endDate) {
        addText('Planning du Projet', 16, true);
        addText(`Début: ${new Date(data.startDate).toLocaleDateString('fr-FR')}`, 12);
        addText(`Fin: ${new Date(data.endDate).toLocaleDateString('fr-FR')}`, 12);
        yPosition += 5;
      }

      // Social Impact
      addText('Impact Social', 16, true);
      addText(data.socialImpact, 12);
      yPosition += 5;

      // Cultural Impact
      addText('Impact Culturel', 16, true);
      addText(data.culturalImpact, 12);
      yPosition += 5;

      // SWOT Analysis
      addText('Analyse SWOT', 16, true);

      if (data.swot.strengths.length > 0) {
        addText('Forces:', 14, true);
        data.swot.strengths.forEach((strength, index) => {
          addText(`• ${strength}`, 11);
        });
      }

      if (data.swot.weaknesses.length > 0) {
        addText('Faiblesses:', 14, true);
        data.swot.weaknesses.forEach((weakness, index) => {
          addText(`• ${weakness}`, 11);
        });
      }

      if (data.swot.opportunities.length > 0) {
        addText('Opportunités:', 14, true);
        data.swot.opportunities.forEach((opportunity, index) => {
          addText(`• ${opportunity}`, 11);
        });
      }

      if (data.swot.threats.length > 0) {
        addText('Menaces:', 14, true);
        data.swot.threats.forEach((threat, index) => {
          addText(`• ${threat}`, 11);
        });
      }

      // Recommendations
      if (data.recommendations.length > 0) {
        addText('Recommandations', 16, true);
        data.recommendations.forEach((recommendation, index) => {
          addText(`${index + 1}. ${recommendation}`, 11);
        });
      }

      // Footer
      const footerY = pageHeight - 20;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Généré par Planalyze - Plateforme d\'analyse de candidatures Maroc PME',
               margin, footerY);

      // Save the PDF
      doc.save(`analyse-${fileName.replace('.pdf', '')}-${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  const handleSave = () => {
    setEditing(false);
  };

  const getEligibilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getEligibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const rightAction = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => exportData('json')}>
        <Download className="mr-2 h-4 w-4" />
        JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => exportData('pdf')}>
        <FileDown className="mr-2 h-4 w-4" />
        PDF
      </Button>
      <Button variant="outline" asChild>
        <Link to="/upload">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Nouvelle analyse
        </Link>
      </Button>
    </div>
  );

  return (
    <Layout rightAction={rightAction}>
      <div className="container py-8">
        {/* Analysis Source Alert */}
        {!analysisData && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Utilisation des données de démonstration. Uploadez un fichier pour une analyse réelle.
            </AlertDescription>
          </Alert>
        )}

        {analysisData && analysisData.metadata?.source === "demo" && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Analyse simulée complétée. Les données sont générées pour démonstration.
            </AlertDescription>
          </Alert>
        )}

        {analysisData && (analysisData.metadata?.source === "express_api" || analysisData.metadata?.source === "express_api_simple" || analysisData.metadata?.source === "enhanced_express_api" || analysisData.metadata?.source === "intelligent_express_api") && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Analyse intelligente complétée par l'API Planalyze intégrée.
              {analysisData.metadata?.extracted_text_available && " ✓ Contenu PDF extrait et analysé."}
              {analysisData.metadata?.analysis_method === "content_based" && " ✓ Analyse basée sur le contenu réel."}
              {analysisData.metadata?.analysis_method === "filename_based" && " ⚠ Analyse basée sur le nom de fichier."}
            </AlertDescription>
          </Alert>
        )}

        {analysisData && !analysisData.metadata?.source && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Analyse complétée avec succès par le backend FastAPI Python.
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Résultats d'analyse</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{fileName}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Analysé le {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <Button
              variant={editing ? "default" : "outline"}
              onClick={() => editing ? handleSave() : setEditing(true)}
            >
              {editing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className={`mb-6 border-2 ${getEligibilityColor(data.eligibilityScore)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getEligibilityIcon(data.eligibilityScore)}
              Score d'éligibilité Maroc PME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{data.eligibilityScore}%</div>
                <p className="text-sm">
                  {data.eligibilityScore >= 80 ? "Éligibilité élevée" : 
                   data.eligibilityScore >= 60 ? "Éligibilité modérée" : "Éligibilité faible"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Basé sur les critères officiels Maroc PME
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="financial">Financier</TabsTrigger>
            <TabsTrigger value="swot">Analyse SWOT</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Visualization */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Visualisation du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Eligibility Score Circle */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="relative w-16 h-16 mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray={`${data.eligibilityScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">{data.eligibilityScore}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Éligibilité</p>
                  </div>

                  {/* Investment Amount */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-sm font-bold text-blue-600 text-center">{data.investmentAmount}</p>
                    <p className="text-xs text-center text-muted-foreground">Investissement</p>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="text-sm font-bold text-purple-600 text-center">
                      {data.startDate && data.endDate
                        ? `${Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} mois`
                        : "N/A"
                      }
                    </p>
                    <p className="text-xs text-center text-muted-foreground">Durée</p>
                  </div>

                  {/* SWOT Summary */}
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                    <p className="text-sm font-bold text-orange-600 text-center">
                      {data.swot.strengths.length + data.swot.opportunities.length} / {Object.values(data.swot).flat().length}
                    </p>
                    <p className="text-xs text-center text-muted-foreground">Forces + Opportunités</p>
                  </div>
                </div>

                {/* Project Summary Bar */}
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Résumé du Projet</h4>
                    <span className="text-xs text-muted-foreground">Analyse IA</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.projectObjective.slice(0, 120)}...
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Objectif du projet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Textarea
                      value={data.projectObjective}
                      onChange={(e) => setData({ ...data, projectObjective: e.target.value })}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{data.projectObjective}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date de début</label>
                    {editing ? (
                      <Input
                        type="date"
                        value={data.startDate}
                        onChange={(e) => setData({ ...data, startDate: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm">{new Date(data.startDate).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de fin</label>
                    {editing ? (
                      <Input
                        type="date"
                        value={data.endDate}
                        onChange={(e) => setData({ ...data, endDate: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm">{new Date(data.endDate).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Impact social
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Textarea
                      value={data.socialImpact}
                      onChange={(e) => setData({ ...data, socialImpact: e.target.value })}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{data.socialImpact}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share className="h-5 w-5" />
                    Impact culturel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Textarea
                      value={data.culturalImpact}
                      onChange={(e) => setData({ ...data, culturalImpact: e.target.value })}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{data.culturalImpact}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informations financières
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Montant d'investissement</label>
                  {editing ? (
                    <Input
                      value={data.investmentAmount}
                      onChange={(e) => setData({ ...data, investmentAmount: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-primary">{data.investmentAmount}</p>
                  )}
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ce montant sera analysé selon les critères d'éligibilité Maroc PME pour les entreprises touristiques.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swot">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Forces</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.swot.strengths.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Faiblesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.swot.weaknesses.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Opportunités</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.swot.opportunities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Menaces</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.swot.threats.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations pour améliorer l'éligibilité</CardTitle>
                <CardDescription>
                  Suggestions basées sur l'analyse de votre business plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
