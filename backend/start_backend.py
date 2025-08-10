#!/usr/bin/env python3
"""
Script de démarrage pour le backend Planalyze
"""

import subprocess
import sys
import os

def install_dependencies():
    """Installe les dépendances Python"""
    print("📦 Installation des dépendances...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dépendances installées avec succès")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de l'installation des dépendances: {e}")
        return False
    return True

def install_spacy_model():
    """Installe le modèle spaCy français"""
    print("🔤 Installation du modèle spaCy français...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "fr_core_news_sm"])
        print("✅ Modèle spaCy installé avec succès")
    except subprocess.CalledProcessError:
        print("⚠️  Modèle spaCy non installé (fonctionnement en mode dégradé)")
        return False
    return True

def start_server():
    """Démarre le serveur FastAPI"""
    print("🚀 Démarrage du serveur Planalyze API...")
    print("🌐 API disponible sur: http://localhost:8000")
    print("📚 Documentation API: http://localhost:8000/docs")
    print("⏹️  Arrêter avec Ctrl+C")
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Serveur arrêté")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors du démarrage: {e}")

def main():
    print("🧠 Planalyze Backend - Analyse intelligente de candidatures Maroc PME")
    print("=" * 60)
    
    # Vérifier si on est dans le bon répertoire
    if not os.path.exists("main.py"):
        print("❌ Erreur: Exécutez ce script depuis le répertoire backend/")
        sys.exit(1)
    
    # Installation des dépendances
    if not install_dependencies():
        sys.exit(1)
    
    # Installation du modèle spaCy
    install_spacy_model()
    
    # Démarrage du serveur
    start_server()

if __name__ == "__main__":
    main()
