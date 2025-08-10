# 🧠 Planalyze Backend API

Backend FastAPI pour l'analyse intelligente de candidatures Maroc PME.

## 🚀 Démarrage rapide

### 1. Installation automatique
```bash
cd backend
python start_backend.py
```

### 2. Installation manuelle

#### Prérequis
- Python 3.11+
- pip

#### Installation des dépendances
```bash
pip install -r requirements.txt
```

#### Installation du modèle spaCy français
```bash
python -m spacy download fr_core_news_sm
```

#### Démarrage du serveur
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📡 API Endpoints

### POST /analyze
Analyse un business plan PDF et retourne les données extraites.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Fichier PDF (max 10MB)

**Response:**
```json
{
  "success": true,
  "file_name": "business_plan.pdf",
  "texte_extrait": "Texte extrait du PDF...",
  "objectif_du_projet": "Description de l'objectif...",
  "montant_total": "2,500,000 MAD",
  "date_debut": "01/06/2024",
  "date_fin": "31/12/2025",
  "impact_social": "Description de l'impact social...",
  "impact_culturel": "Description de l'impact culturel...",
  "swot": {
    "forces": ["Force 1", "Force 2"],
    "faiblesses": ["Faiblesse 1"],
    "opportunites": ["Opportunité 1"],
    "menaces": ["Menace 1"]
  },
  "eligibilite": {
    "statut": true,
    "score": 85.5,
    "raisons": [],
    "recommandations": ["Recommandation 1", "Recommandation 2"]
  },
  "ml_score": 0.87,
  "metadata": {
    "pages_count": 15,
    "word_count": 2500,
    "analysis_confidence": 0.85
  }
}
```

### GET /health
Point de contrôle de santé de l'API.

### GET /
Information générale sur l'API.

## 🔧 Architecture

```
backend/
├── main.py                 # Point d'entrée FastAPI
├── pdf_extractor.py        # Extraction NLP à partir du PDF
├── rules_engine/
│   └── evaluator.py        # Règles d'éligibilité Maroc PME
├── ml_model/
│   ├── predictor.py        # Prédiction ML (optionnel)
│   └── model.pkl           # Modèle entraîné (optionnel)
├── test_files/             # Business plans de test
├── requirements.txt        # Dépendances Python
└── start_backend.py        # Script de démarrage
```

## 🎯 Fonctionnalités

### Extraction PDF
- **PyPDF2**: Extraction du texte des fichiers PDF
- **Nettoyage**: Normalisation et nettoyage du texte extrait
- **Validation**: Vérification de la taille et du format des fichiers

### Traitement NLP
- **spaCy**: Analyse du langage naturel (modèle français)
- **Extraction d'entités**: Identification automatique des éléments clés
- **Patterns regex**: Extraction de données structurées (montants, dates)

### Évaluation d'éligibilité
- **Critères Maroc PME**: Règles spécifiques au secteur touristique
- **Score pondéré**: Évaluation multicritères
- **Recommandations**: Suggestions d'amélioration automatiques

### Modèle ML (Optionnel)
- **Classification**: Prédiction d'éligibilité basée sur l'apprentissage automatique
- **Features**: Vectorisation TF-IDF du contenu textuel
- **Entraînement**: Possibilité d'entraîner de nouveaux modèles

## 📋 Critères d'éligibilité Maroc PME

1. **Secteur touristique** (20%)
   - Mots-clés: tourisme, hôtel, restaurant, riad, voyage, etc.

2. **Montant d'investissement** (25%)
   - Fourchette: 50,000 - 10,000,000 MAD

3. **Création d'emplois** (20%)
   - Minimum: 2 emplois créés

4. **Innovation** (15%)
   - Mots-clés: innovation, technologie, digital, écologique, etc.

5. **Développement local** (10%)
   - Mots-clés: local, région, communauté, artisan, patrimoine, etc.

6. **Durabilité** (10%)
   - Mots-clés: durable, environnement, écologique, responsable, etc.

## 🧪 Tests

### Tester avec un fichier exemple
```bash
# Utiliser curl pour tester l'API
curl -X POST "http://localhost:8000/analyze" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@test_files/sample_business_plan.pdf"
```

### Vérifier la santé de l'API
```bash
curl http://localhost:8000/health
```

## 🔧 Configuration

### Variables d'environnement
- `API_HOST`: Adresse du serveur (défaut: 0.0.0.0)
- `API_PORT`: Port du serveur (défaut: 8000)
- `MAX_FILE_SIZE`: Taille max des fichiers en MB (défaut: 10)

### Mode développement
```bash
uvicorn main:app --reload --log-level debug
```

## 📚 Documentation

- **API Interactive**: http://localhost:8000/docs (Swagger)
- **Documentation alternative**: http://localhost:8000/redoc

## 🔍 Dépannage

### Erreur modèle spaCy
```bash
python -m spacy download fr_core_news_sm
```

### Erreur de dépendances
```bash
pip install --upgrade -r requirements.txt
```

### Problème de CORS
L'API est configurée pour accepter toutes les origines en développement. En production, modifiez `allow_origins` dans `main.py`.

## 🚀 Déploiement

### Docker (recommandé)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m spacy download fr_core_news_sm
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📝 Contribuer

1. Ajouter de nouveaux extracteurs dans `pdf_extractor.py`
2. Enrichir les règles d'éligibilité dans `rules_engine/evaluator.py`
3. Améliorer le modèle ML dans `ml_model/predictor.py`
4. Ajouter des tests dans le dossier `tests/`

## 📄 Licence

Projet de fin d'études - Planalyze © 2024
