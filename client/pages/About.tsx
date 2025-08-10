import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Target, Zap, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function About() {
  const rightAction = (
    <Button variant="outline" asChild>
      <Link to="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Link>
    </Button>
  );

  return (
    <Layout rightAction={rightAction}>
      <div className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">À propos de Planalyze</h1>
            <p className="text-lg text-muted-foreground">
              Plateforme intelligente d'analyse de candidatures Maroc PME
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Planalyze révolutionne le processus d'analyse des candidatures Maroc PME en utilisant 
                l'intelligence artificielle pour extraire et analyser automatiquement les données clés 
                des business plans. Notre plateforme permet aux entreprises touristiques de soumettre 
                leurs dossiers de candidature de manière plus efficace et transparente.
              </p>
            </CardContent>
          </Card>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Intelligence Artificielle</CardTitle>
                <CardDescription>
                  Extraction automatique des données clés des business plans PDF
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Interface Intuitive</CardTitle>
                <CardDescription>
                  Design moderne et accessible pour tous les utilisateurs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Analyse Rapide</CardTitle>
                <CardDescription>
                  Résultats d'analyse disponibles en quelques minutes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contexte du Projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cette plateforme a été développée dans le cadre d'un projet de fin d'études pour 
                démontrer la faisabilité d'un système intelligent d'analyse de candidatures 
                Maroc PME. Elle s'inscrit dans une démarche de digitalisation des processus 
                administratifs et d'aide à la décision.
              </p>
              <p>
                Le système analyse automatiquement les critères d'éligibilité selon les 
                standards officiels du programme Maroc PME, en se concentrant particulièrement 
                sur les entreprises du secteur touristique.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies Utilisées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Frontend</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• React + Vite</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Shadcn/ui</li>
                    <li>• React Router</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Backend</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Python FastAPI</li>
                    <li>• PyPDF2 / pdfminer</li>
                    <li>• spaCy NLP</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
