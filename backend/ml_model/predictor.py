import pickle
import os
from typing import Dict, Any, Optional
import logging
import numpy as np

logger = logging.getLogger(__name__)

class MLPredictor:
    """
    Prédicteur ML pour l'évaluation d'éligibilité (optionnel)
    """
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), "vectorizer.pkl")
        
        self._load_model()
    
    def _load_model(self):
        """Charge le modèle ML s'il existe"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.vectorizer_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                logger.info("Modèle ML chargé avec succès")
            else:
                logger.info("Modèle ML non disponible - utilisation du modèle de règles uniquement")
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle ML: {e}")
            self.model = None
            self.vectorizer = None
    
    def is_available(self) -> bool:
        """Vérifie si le modèle ML est disponible"""
        return self.model is not None and self.vectorizer is not None
    
    def predict_eligibility(self, analyzed_data: Dict[str, Any]) -> Optional[float]:
        """
        Prédit le score d'éligibilité using ML model
        """
        if not self.is_available():
            return None
        
        try:
            # Préparer les features pour le modèle
            features_text = self._prepare_features(analyzed_data)
            
            # Vectoriser le texte
            features_vector = self.vectorizer.transform([features_text])
            
            # Prédiction
            prediction = self.model.predict_proba(features_vector)[0]
            
            # Retourner la probabilité d'éligibilité (classe positive)
            return float(prediction[1]) if len(prediction) > 1 else float(prediction[0])
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction ML: {e}")
            return None
    
    def _prepare_features(self, analyzed_data: Dict[str, Any]) -> str:
        """
        Prépare les features textuelles pour le modèle ML
        """
        features = []
        
        # Ajouter les différents champs textuels
        if analyzed_data.get("objectif_du_projet"):
            features.append(analyzed_data["objectif_du_projet"])
        
        if analyzed_data.get("impact_social"):
            features.append(analyzed_data["impact_social"])
        
        if analyzed_data.get("impact_culturel"):
            features.append(analyzed_data["impact_culturel"])
        
        # Ajouter les éléments SWOT
        swot = analyzed_data.get("swot", {})
        for category in ["forces", "faiblesses", "opportunites", "menaces"]:
            items = swot.get(category, [])
            if items:
                features.extend(items)
        
        # Joindre tous les features
        return " ".join(features)

    def train_model(self, training_data: list, labels: list):
        """
        Entraîne un nouveau modèle (pour usage futur)
        """
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.ensemble import RandomForestClassifier
            from sklearn.model_selection import train_test_split
            from sklearn.metrics import classification_report
            
            # Préparer les données
            vectorizer = TfidfVectorizer(max_features=1000, stop_words='french')
            X = vectorizer.fit_transform(training_data)
            y = np.array(labels)
            
            # Division train/test
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Entraîner le modèle
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            
            # Évaluation
            y_pred = model.predict(X_test)
            logger.info(f"Performance du modèle:\n{classification_report(y_test, y_pred)}")
            
            # Sauvegarder le modèle
            with open(self.model_path, 'wb') as f:
                pickle.dump(model, f)
            with open(self.vectorizer_path, 'wb') as f:
                pickle.dump(vectorizer, f)
            
            # Charger le nouveau modèle
            self.model = model
            self.vectorizer = vectorizer
            
            logger.info("Modèle entraîné et sauvegardé avec succès")
            return True
            
        except ImportError:
            logger.error("scikit-learn non installé - impossible d'entraîner le modèle")
            return False
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement: {e}")
            return False

# Exemple de données d'entraînement (pour référence)
SAMPLE_TRAINING_DATA = [
    # Exemples de projets éligibles (label = 1)
    {
        "text": "Projet d'hôtel écologique au Maroc avec création de 15 emplois locaux et valorisation de l'artisanat traditionnel. Investissement de 2 millions MAD pour un tourisme durable.",
        "label": 1
    },
    {
        "text": "Développement d'un complexe touristique innovant avec restaurant gastronomique local. 8 emplois créés, investissement 800000 MAD, impact culturel fort.",
        "label": 1
    },
    # Exemples de projets non éligibles (label = 0)
    {
        "text": "Ouverture d'un petit commerce sans lien avec le tourisme. Investissement 30000 MAD, 1 emploi créé.",
        "label": 0
    },
    {
        "text": "Projet industriel de fabrication sans impact touristique ni culturel. Investissement 20 millions MAD.",
        "label": 0
    }
]
