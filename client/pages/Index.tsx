import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Brain, CheckCircle, TrendingUp, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">
            Plateforme Intelligente • Maroc PME
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Analyse Intelligente de 
            <span className="text-primary"> Candidatures</span> Maroc PME
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Simplifiez l'analyse de vos business plans avec notre plateforme IA. 
            Extraction automatique des données clés, évaluation d'éligibilité, et rapport détaillé en quelques minutes.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="h-12 px-8">
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Analyser un Business Plan
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">
              <FileText className="mr-2 h-4 w-4" />
              Voir la Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Fonctionnalités Principales</h2>
            <p className="text-muted-foreground">
              Une solution complète pour l'analyse et l'évaluation des candidatures touristiques
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Upload PDF Sécurisé</CardTitle>
                <CardDescription>
                  Téléchargement simple et sécurisé de vos business plans au format PDF
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Brain className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">Extraction IA</CardTitle>
                <CardDescription>
                  Analyse intelligente des données clés : objectifs, montant, planning, impact social
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-lg">Évaluation Éligibilité</CardTitle>
                <CardDescription>
                  Vérification automatique des critères d'éligibilité Maroc PME
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Analyse SWOT</CardTitle>
                <CardDescription>
                  Extraction et structuration des forces, faiblesses, opportunités et menaces
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">Export Sécurisé</CardTitle>
                <CardDescription>
                  Exportation des résultats en JSON ou PDF préformaté
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-lg">Interface Moderne</CardTitle>
                <CardDescription>
                  Interface intuitive avec édition en temps réel des données extraites
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Comment ça fonctionne</h2>
            <p className="text-muted-foreground">
              Un processus simple en 3 étapes pour analyser vos candidatures
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Télécharger</h3>
              <p className="text-sm text-muted-foreground">
                Uploadez votre business plan au format PDF sur notre plateforme sécurisée
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Analyser</h3>
              <p className="text-sm text-muted-foreground">
                Notre IA extrait automatiquement les informations clés et évalue l'éligibilité
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Exporter</h3>
              <p className="text-sm text-muted-foreground">
                Consultez, éditez et exportez les résultats dans le format de votre choix
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">Prêt à commencer ?</h2>
            <p className="mb-8 text-muted-foreground">
              Rejoignez Planalyze dans la digitalisation des processus de candidature Maroc PME. 
              Analysez votre premier business plan dès maintenant.
            </p>
            <Button size="lg" asChild className="h-12 px-8">
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Analyser votre Business Plan
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
