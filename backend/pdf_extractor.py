import PyPDF2
import re
from typing import Dict, Any, List
import spacy
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFExtractor:
    def __init__(self):
        try:
            # Load French spaCy model
            self.nlp = spacy.load("fr_core_news_sm")
        except OSError:
            logger.warning("French spaCy model not found. Install with: python -m spacy download fr_core_news_sm")
            # Fallback to basic processing
            self.nlp = None
    
    def extract_text(self, pdf_path: str) -> str:
        """
        Extrait le texte d'un fichier PDF
        """
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            return text.strip()
        
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction PDF: {e}")
            raise Exception(f"Impossible d'extraire le texte du PDF: {e}")
    
    def analyze_content(self, text: str) -> Dict[str, Any]:
        """
        Analyse le texte extrait pour identifier les éléments clés
        """
        try:
            # Nettoyage du texte
            cleaned_text = self._clean_text(text)
            
            # Analyse avec spaCy si disponible
            if self.nlp:
                doc = self.nlp(cleaned_text)
                entities = [(ent.text, ent.label_) for ent in doc.ents]
            else:
                entities = []
            
            # Extraction des données structurées
            analyzed_data = {
                "objectif_du_projet": self._extract_project_objective(cleaned_text),
                "montant_total": self._extract_investment_amount(cleaned_text),
                "date_debut": self._extract_start_date(cleaned_text),
                "date_fin": self._extract_end_date(cleaned_text),
                "impact_social": self._extract_social_impact(cleaned_text),
                "impact_culturel": self._extract_cultural_impact(cleaned_text),
                "swot": self._extract_swot_analysis(cleaned_text),
                "pages_count": text.count('\f') + 1,  # Approximation du nombre de pages
                "word_count": len(cleaned_text.split()),
                "confidence": self._calculate_confidence(cleaned_text),
                "entities": entities
            }
            
            return analyzed_data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'analyse du contenu: {e}")
            raise Exception(f"Erreur lors de l'analyse: {e}")
    
    def _clean_text(self, text: str) -> str:
        """Nettoie et normalise le texte"""
        # Supprimer les caractères spéciaux et normaliser les espaces
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\(\)\-\€\%]', '', text, flags=re.UNICODE)
        return text.strip()
    
    def _extract_project_objective(self, text: str) -> str:
        """Extrait l'objectif du projet"""
        patterns = [
            r'objectif[s]?\s*:?\s*([^.]{50,200})',
            r'but\s+du\s+projet\s*:?\s*([^.]{50,200})',
            r'description\s+du\s+projet\s*:?\s*([^.]{50,200})',
            r'résumé\s+exécutif\s*:?\s*([^.]{50,200})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        
        # Fallback: prendre les premiers mots après certains mots-clés
        fallback_patterns = [
            r'(?:projet|business|entreprise|société)\s+([^.]{100,300})',
        ]
        
        for pattern in fallback_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "Objectif du projet non identifié dans le document"
    
    def _extract_investment_amount(self, text: str) -> str:
        """Extrait le montant d'investissement"""
        patterns = [
            r'investissement\s*:?\s*([0-9,.\s]+)\s*(?:MAD|DH|dirhams?|€|euros?)',
            r'montant\s+total\s*:?\s*([0-9,.\s]+)\s*(?:MAD|DH|dirhams?|€|euros?)',
            r'capital\s+nécessaire\s*:?\s*([0-9,.\s]+)\s*(?:MAD|DH|dirhams?|€|euros?)',
            r'financement\s+demandé\s*:?\s*([0-9,.\s]+)\s*(?:MAD|DH|dirhams?|€|euros?)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount = match.group(1).strip()
                # Normaliser le format
                amount = re.sub(r'\s+', '', amount)
                return f"{amount} MAD"
        
        # Rechercher tout montant en MAD/DH
        general_amount = re.search(r'([0-9,.\s]+)\s*(?:MAD|DH|dirhams?)', text, re.IGNORECASE)
        if general_amount:
            amount = general_amount.group(1).strip()
            amount = re.sub(r'\s+', '', amount)
            return f"{amount} MAD"
        
        return "Montant non spécifié"
    
    def _extract_start_date(self, text: str) -> str:
        """Extrait la date de début du projet"""
        patterns = [
            r'date\s+de\s+début\s*:?\s*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
            r'démarrage\s*:?\s*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
            r'lancement\s*:?\s*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return ""
    
    def _extract_end_date(self, text: str) -> str:
        """Extrait la date de fin du projet"""
        patterns = [
            r'date\s+de\s+fin\s*:?\s*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
            r'achèvement\s*:?\s*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
            r'durée.*?([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return ""
    
    def _extract_social_impact(self, text: str) -> str:
        """Extrait l'impact social du projet"""
        patterns = [
            r'impact\s+social\s*:?\s*([^.]{50,300})',
            r'retombées\s+sociales\s*:?\s*([^.]{50,300})',
            r'emplois?\s+créés?\s*:?\s*([^.]{50,200})',
            r'bénéfices?\s+sociaux?\s*:?\s*([^.]{50,300})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        
        # Rechercher des mentions d'emplois
        employment_match = re.search(r'([0-9]+)\s+emplois?', text, re.IGNORECASE)
        if employment_match:
            return f"Création de {employment_match.group(1)} emplois"
        
        return "Impact social non spécifié"
    
    def _extract_cultural_impact(self, text: str) -> str:
        """Extrait l'impact culturel du projet"""
        patterns = [
            r'impact\s+culturel\s*:?\s*([^.]{50,300})',
            r'patrimoine\s+culturel\s*:?\s*([^.]{50,300})',
            r'valorisation\s+culturelle\s*:?\s*([^.]{50,300})',
            r'tradition[s]?\s*:?\s*([^.]{50,200})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        
        return "Impact culturel non spécifié"
    
    def _extract_swot_analysis(self, text: str) -> Dict[str, List[str]]:
        """Extrait l'analyse SWOT"""
        swot = {
            "forces": [],
            "faiblesses": [],
            "opportunites": [],
            "menaces": []
        }
        
        # Patterns pour identifier les sections SWOT
        sections = {
            "forces": [r'forces?\s*:?\s*(.*?)(?=faiblesses?|opportunités?|menaces?|$)', r'points?\s+forts?\s*:?\s*(.*?)(?=faiblesses?|opportunités?|menaces?|$)'],
            "faiblesses": [r'faiblesses?\s*:?\s*(.*?)(?=forces?|opportunités?|menaces?|$)', r'points?\s+faibles?\s*:?\s*(.*?)(?=forces?|opportunités?|menaces?|$)'],
            "opportunites": [r'opportunités?\s*:?\s*(.*?)(?=forces?|faiblesses?|menaces?|$)'],
            "menaces": [r'menaces?\s*:?\s*(.*?)(?=forces?|faiblesses?|opportunités?|$)', r'risques?\s*:?\s*(.*?)(?=forces?|faiblesses?|opportunités?|$)']
        }
        
        for category, patterns in sections.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
                if match:
                    content = match.group(1).strip()
                    # Diviser en points (supposer des puces ou des lignes)
                    points = [point.strip() for point in re.split(r'[•\-\*\n]', content) if point.strip()]
                    swot[category] = points[:5]  # Limiter à 5 points maximum
                    break
        
        return swot
    
    def _calculate_confidence(self, text: str) -> float:
        """Calcule un score de confiance basé sur la qualité du texte extrait"""
        confidence = 0.0
        
        # Facteurs de confiance
        if len(text) > 1000:
            confidence += 0.3
        
        # Présence de mots-clés importants
        keywords = ['projet', 'investissement', 'objectif', 'montant', 'business', 'plan']
        keyword_count = sum(1 for keyword in keywords if keyword.lower() in text.lower())
        confidence += (keyword_count / len(keywords)) * 0.4
        
        # Structure du document
        if 'swot' in text.lower() or ('forces' in text.lower() and 'faiblesses' in text.lower()):
            confidence += 0.2
        
        if re.search(r'[0-9,.\s]+\s*(?:MAD|DH|dirhams?)', text, re.IGNORECASE):
            confidence += 0.1
        
        return min(confidence, 1.0)
