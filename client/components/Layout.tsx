import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function Layout({ children, rightAction }: LayoutProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-green-50/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg">Planalyze</span>
            <Badge variant="secondary" className="text-xs">MAROC PME</Badge>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
            <Link 
              to="/" 
              className={`transition-colors hover:text-foreground ${
                location.pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/upload" 
              className={`transition-colors hover:text-foreground ${
                location.pathname === "/upload" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Analyser
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors hover:text-foreground ${
                location.pathname === "/about" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              À propos
            </Link>
          </nav>
          {rightAction || (
            <Button asChild>
              <Link to="/upload">Commencer l'analyse</Link>
            </Button>
          )}
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <Brain className="h-3 w-3" />
              </div>
              <span className="font-medium">Planalyze</span>
              <span className="text-muted-foreground">• Plateforme Maroc PME</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Planalyze. Projet de fin d'études - Analyse intelligente de candidatures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
