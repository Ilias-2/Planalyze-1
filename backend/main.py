from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from typing import Dict, Any

from pdf_extractor import PDFExtractor
from rules_engine.evaluator import EligibilityEvaluator
from ml_model.predictor import MLPredictor

app = FastAPI(
    title="Planalyze API",
    description="API d'analyse intelligente de candidatures Maroc PME",
    version="1.0.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
pdf_extractor = PDFExtractor()
eligibility_evaluator = EligibilityEvaluator()
ml_predictor = MLPredictor()

@app.get("/")
async def root():
    return {"message": "Planalyze API - Analyse intelligente de candidatures Maroc PME"}

@app.post("/analyze")
async def analyze_business_plan(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Analyse un business plan PDF et retourne les données extraites avec évaluation d'éligibilité
    """
    
    # Validation du fichier
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Le fichier doit être au format PDF")
    
    if file.size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Le fichier est trop volumineux (max 10MB)")
    
    try:
        # Sauvegarder temporairement le fichier
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Étape 1: Extraction du texte du PDF
            extracted_text = pdf_extractor.extract_text(temp_file_path)
            
            # Étape 2: Analyse NLP pour extraire les données structurées
            analyzed_data = pdf_extractor.analyze_content(extracted_text)
            
            # Étape 3: Évaluation de l'éligibilité Maroc PME
            eligibility_result = eligibility_evaluator.evaluate(analyzed_data)
            
            # Étape 4: Prédiction ML (optionnel)
            ml_score = ml_predictor.predict_eligibility(analyzed_data) if ml_predictor.is_available() else None
            
            # Construction de la réponse
            response = {
                "success": True,
                "file_name": file.filename,
                "texte_extrait": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
                "objectif_du_projet": analyzed_data.get("objectif_du_projet", ""),
                "montant_total": analyzed_data.get("montant_total", ""),
                "date_debut": analyzed_data.get("date_debut", ""),
                "date_fin": analyzed_data.get("date_fin", ""),
                "impact_social": analyzed_data.get("impact_social", ""),
                "impact_culturel": analyzed_data.get("impact_culturel", ""),
                "swot": analyzed_data.get("swot", {
                    "forces": [],
                    "faiblesses": [],
                    "opportunites": [],
                    "menaces": []
                }),
                "eligibilite": {
                    "statut": eligibility_result["eligible"],
                    "score": eligibility_result["score"],
                    "raisons": eligibility_result["raisons"] if not eligibility_result["eligible"] else [],
                    "recommandations": eligibility_result["recommandations"]
                },
                "ml_score": ml_score,
                "metadata": {
                    "pages_count": analyzed_data.get("pages_count", 0),
                    "word_count": analyzed_data.get("word_count", 0),
                    "analysis_confidence": analyzed_data.get("confidence", 0.0)
                }
            }
            
            return response
            
        finally:
            # Nettoyer le fichier temporaire
            os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse: {str(e)}")

@app.get("/health")
async def health_check():
    """Point de contrôle de santé de l'API"""
    return {
        "status": "healthy",
        "components": {
            "pdf_extractor": "ready",
            "eligibility_evaluator": "ready",
            "ml_predictor": "ready" if ml_predictor.is_available() else "not_available"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
