import re
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class EligibilityEvaluator:
    """
    Évaluateur d'éligibilité selon les critères Maroc PME pour le secteur touristique
    """
    
    def __init__(self):
        # Critères d'éligibilité Maroc PME (version simplifiée)
        self.eligibility_criteria = {
            "sector_tourism": {
                "weight": 0.2,
                "keywords": ["tourisme", "hôtel", "restaurant", "riad", "voyage", "tour", "guide", "hébergement"]
            },
            "investment_range": {
                "weight": 0.25,
                "min_amount": 50000,  # 50k MAD minimum
                "max_amount": 10000000,  # 10M MAD maximum
            },
            "job_creation": {
                "weight": 0.2,
                "min_jobs": 2,  # Minimum 2 emplois créés
            },
            "innovation": {
                "weight": 0.15,
                "keywords": ["innovation", "technologie", "digital", "écologique", "durable", "moderne"]
            },
            "local_development": {
                "weight": 0.1,
                "keywords": ["local", "région", "communauté", "artisan", "patrimoine", "culture"]
            },
            "sustainability": {
                "weight": 0.1,
                "keywords": ["durable", "environnement", "écologique", "vert", "responsable", "social"]
            }
        }
    
    def evaluate(self, analyzed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Évalue l'éligibilité d'un projet selon les critères Maroc PME
        """
        try:
            scores = {}
            total_score = 0.0
            reasons = []
            recommendations = []
            
            # Concaténer tout le texte pour l'analyse
            full_text = " ".join([
                str(analyzed_data.get("objectif_du_projet", "")),
                str(analyzed_data.get("impact_social", "")),
                str(analyzed_data.get("impact_culturel", "")),
            ]).lower()
            
            # 1. Vérification du secteur touristique
            tourism_score = self._evaluate_tourism_sector(full_text)
            scores["tourism_sector"] = tourism_score
            total_score += tourism_score * self.eligibility_criteria["sector_tourism"]["weight"]
            
            if tourism_score < 0.5:
                reasons.append("Le projet ne semble pas clairement orienté vers le secteur touristique")
                recommendations.append("Préciser l'orientation touristique du projet dans l'objectif")
            
            # 2. Vérification du montant d'investissement
            investment_score = self._evaluate_investment_amount(analyzed_data.get("montant_total", ""))
            scores["investment_amount"] = investment_score
            total_score += investment_score * self.eligibility_criteria["investment_range"]["weight"]
            
            if investment_score < 0.5:
                reasons.append("Le montant d'investissement ne respecte pas les critères Maroc PME (50k - 10M MAD)")
                recommendations.append("Ajuster le montant d'investissement selon les critères Maroc PME")
            
            # 3. Création d'emplois
            job_score = self._evaluate_job_creation(analyzed_data.get("impact_social", ""))
            scores["job_creation"] = job_score
            total_score += job_score * self.eligibility_criteria["job_creation"]["weight"]
            
            if job_score < 0.5:
                reasons.append("L'impact en termes de création d'emplois est insuffisant (minimum 2 emplois)")
                recommendations.append("Détailler le plan de création d'emplois (minimum 2 postes)")
            
            # 4. Innovation
            innovation_score = self._evaluate_innovation(full_text)
            scores["innovation"] = innovation_score
            total_score += innovation_score * self.eligibility_criteria["innovation"]["weight"]
            
            if innovation_score < 0.3:
                recommendations.append("Intégrer des éléments d'innovation ou de modernisation")
            
            # 5. Développement local
            local_score = self._evaluate_local_development(full_text)
            scores["local_development"] = local_score
            total_score += local_score * self.eligibility_criteria["local_development"]["weight"]
            
            if local_score < 0.3:
                recommendations.append("Renforcer l'impact sur le développement local et les communautés")
            
            # 6. Durabilité
            sustainability_score = self._evaluate_sustainability(full_text)
            scores["sustainability"] = sustainability_score
            total_score += sustainability_score * self.eligibility_criteria["sustainability"]["weight"]
            
            if sustainability_score < 0.3:
                recommendations.append("Intégrer des aspects de développement durable")
            
            # Score final (sur 100)
            final_score = min(total_score * 100, 100)
            
            # Déterminer l'éligibilité
            eligible = final_score >= 60 and len(reasons) <= 1
            
            # Recommandations générales
            if final_score < 60:
                recommendations.append("Améliorer le score global en renforçant les critères défaillants")
            
            if not analyzed_data.get("date_debut") or not analyzed_data.get("date_fin"):
                recommendations.append("Préciser le planning du projet (dates de début et fin)")
            
            return {
                "eligible": eligible,
                "score": round(final_score, 1),
                "detailed_scores": scores,
                "raisons": reasons,
                "recommandations": recommendations[:5],  # Limiter à 5 recommandations
                "criteria_analysis": {
                    "secteur_touristique": tourism_score > 0.5,
                    "montant_eligible": investment_score > 0.5,
                    "creation_emplois": job_score > 0.5,
                    "innovation_presente": innovation_score > 0.3,
                    "impact_local": local_score > 0.3,
                    "durabilite": sustainability_score > 0.3
                }
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'évaluation: {e}")
            return {
                "eligible": False,
                "score": 0,
                "raisons": ["Erreur lors de l'évaluation des critères"],
                "recommandations": ["Vérifier la qualité du document soumis"]
            }
    
    def _evaluate_tourism_sector(self, text: str) -> float:
        """Évalue si le projet est dans le secteur touristique"""
        keywords = self.eligibility_criteria["sector_tourism"]["keywords"]
        matches = sum(1 for keyword in keywords if keyword in text)
        return min(matches / 3, 1.0)  # Score basé sur la présence de mots-clés
    
    def _evaluate_investment_amount(self, amount_text: str) -> float:
        """Évalue si le montant d'investissement est dans la fourchette"""
        try:
            # Extraire le montant numérique
            amount_match = re.search(r'([0-9,.\s]+)', amount_text.replace(' ', ''))
            if not amount_match:
                return 0.0
            
            amount_str = amount_match.group(1).replace(',', '').replace('.', '').replace(' ', '')
            amount = float(amount_str)
            
            # Convertir en MAD si nécessaire (supposer MAD par défaut)
            min_amount = self.eligibility_criteria["investment_range"]["min_amount"]
            max_amount = self.eligibility_criteria["investment_range"]["max_amount"]
            
            if min_amount <= amount <= max_amount:
                return 1.0
            elif amount < min_amount:
                return amount / min_amount * 0.5  # Score partiel si trop bas
            else:
                return max(0.5 - (amount - max_amount) / max_amount, 0.1)  # Pénalité si trop élevé
                
        except (ValueError, AttributeError):
            return 0.0
    
    def _evaluate_job_creation(self, impact_text: str) -> float:
        """Évalue la création d'emplois"""
        # Rechercher des mentions numériques d'emplois
        job_patterns = [
            r'([0-9]+)\s+emplois?',
            r'([0-9]+)\s+postes?',
            r'([0-9]+)\s+personnes?',
            r'embauche[r]?\s+([0-9]+)',
        ]
        
        max_jobs = 0
        for pattern in job_patterns:
            matches = re.findall(pattern, impact_text.lower())
            for match in matches:
                try:
                    jobs = int(match)
                    max_jobs = max(max_jobs, jobs)
                except ValueError:
                    continue
        
        min_required = self.eligibility_criteria["job_creation"]["min_jobs"]
        if max_jobs >= min_required:
            return 1.0
        elif max_jobs > 0:
            return max_jobs / min_required
        else:
            # Recherche de termes généraux
            general_terms = ["emploi", "embauche", "recrutement", "personnel", "équipe"]
            if any(term in impact_text.lower() for term in general_terms):
                return 0.3
            return 0.0
    
    def _evaluate_innovation(self, text: str) -> float:
        """Évalue le niveau d'innovation"""
        keywords = self.eligibility_criteria["innovation"]["keywords"]
        matches = sum(1 for keyword in keywords if keyword in text)
        return min(matches / 2, 1.0)
    
    def _evaluate_local_development(self, text: str) -> float:
        """Évalue l'impact sur le développement local"""
        keywords = self.eligibility_criteria["local_development"]["keywords"]
        matches = sum(1 for keyword in keywords if keyword in text)
        return min(matches / 2, 1.0)
    
    def _evaluate_sustainability(self, text: str) -> float:
        """Évalue les aspects de durabilité"""
        keywords = self.eligibility_criteria["sustainability"]["keywords"]
        matches = sum(1 for keyword in keywords if keyword in text)
        return min(matches / 2, 1.0)
