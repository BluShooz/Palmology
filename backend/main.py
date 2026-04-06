from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

from palm_detector import PalmDetector
from feature_engine import FeatureEngine
from ai_engine import AIEngine


app = FastAPI(
    title="Palm Insight AI API",
    description="Biometric hand analysis with AI-powered personality insights",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
detector = PalmDetector()
feature_engine = FeatureEngine()
ai_engine = AIEngine()


class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Palm Insight AI",
        "version": "1.0.0"
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_palm(file: UploadFile = File(...)):
    """
    Analyze palm from uploaded image file.

    Accepts image files (jpg, png, jpeg).
    Returns comprehensive personality analysis.
    """
    try:
        # Read and decode image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid image format"
            )

        # Detect hand
        detection_result = detector.detect_hand(image)

        if detection_result is None:
            return AnalysisResponse(
                success=False,
                message="No hand detected in image. Please ensure your palm is clearly visible and well-lit.",
                data=None
            )

        landmarks, processed_image = detection_result

        # Extract features
        features = feature_engine.extract_features(landmarks)

        # Generate AI insights
        insights = ai_engine.generate_insights(features)

        # Combine features and insights
        result = {
            "features": features,
            "insights": insights,
            "detection_confidence": "high"
        }

        return AnalysisResponse(
            success=True,
            message="Analysis complete",
            data=result
        )

    except Exception as e:
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}",
            data=None
        )


@app.post("/analyze_mobile", response_model=AnalysisResponse)
async def analyze_palm_mobile(image_data: dict):
    """
    Analyze palm from base64 encoded image (mobile endpoint).

    Accepts JSON with 'image' field containing base64 string.
    Returns comprehensive personality analysis.
    """
    try:
        # Extract base64 string
        image_base64 = image_data.get("image", "")

        if not image_base64:
            raise HTTPException(
                status_code=400,
                detail="No image data provided"
            )

        # Remove data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]

        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid image format"
            )

        # Detect hand
        detection_result = detector.detect_hand(image)

        if detection_result is None:
            return AnalysisResponse(
                success=False,
                message="No hand detected in image. Please ensure your palm is clearly visible and well-lit.",
                data=None
            )

        landmarks, processed_image = detection_result

        # Extract features
        features = feature_engine.extract_features(landmarks)

        # Generate AI insights
        insights = ai_engine.generate_insights(features)

        # Combine features and insights
        result = {
            "features": features,
            "insights": insights,
            "detection_confidence": "high"
        }

        return AnalysisResponse(
            success=True,
            message="Analysis complete",
            data=result
        )

    except Exception as e:
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}",
            data=None
        )


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "detector": "initialized",
            "feature_engine": "ready",
            "ai_engine": "ready"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
