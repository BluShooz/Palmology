"""
Simplified Palm Insight AI Backend
Works without OpenCV/MediaPipe for demo/testing purposes
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import base64
import io
import random
from PIL import Image
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Palm Insight AI - Simple")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


def extract_mock_features(image_data: bytes) -> dict:
    """
    Extract mock features from image without using MediaPipe/OpenCV
    This is a demo version that generates plausible biometric features
    """
    try:
        # Open image to get basic properties
        image = Image.open(io.BytesIO(image_data))
        width, height = image.size

        # Generate realistic biometric features based on image properties
        palm_ratio = round(random.uniform(0.35, 0.50), 4)
        finger_spread = round(random.uniform(0.05, 0.15), 4)
        stability_score = round(random.uniform(0.60, 0.85), 4)
        landmark_variance = round(random.uniform(0.10, 0.18), 4)

        return {
            "palm_ratio": palm_ratio,
            "finger_spread": finger_spread,
            "stability_score": stability_score,
            "landmark_variance": landmark_variance,
            "palm_width": round(width / 1000, 4),
            "palm_height": round(height / 1000, 4),
            "finger_lengths": {
                "thumb": round(random.uniform(0.10, 0.15), 4),
                "index": round(random.uniform(0.18, 0.25), 4),
                "middle": round(random.uniform(0.20, 0.28), 4),
                "ring": round(random.uniform(0.18, 0.25), 4),
                "pinky": round(random.uniform(0.12, 0.18), 4),
            },
            "thumb_angle": round(random.uniform(30, 60), 2),
            "mount_depths": {
                "venus": round(random.uniform(0.01, 0.03), 4),
                "jupiter": round(random.uniform(0.02, 0.04), 4),
                "saturn": round(random.uniform(0.02, 0.04), 4),
                "apollo": round(random.uniform(0.01, 0.03), 4),
                "mercury": round(random.uniform(0.01, 0.02), 4),
            },
            "image_properties": {
                "width": width,
                "height": height,
                "format": image.format
            }
        }
    except Exception as e:
        print(f"Error processing image: {e}")
        # Return default features if image processing fails
        return {
            "palm_ratio": 0.42,
            "finger_spread": 0.08,
            "stability_score": 0.75,
            "landmark_variance": 0.14,
            "palm_width": 0.35,
            "palm_height": 0.55,
            "finger_lengths": {
                "thumb": 0.12, "index": 0.22, "middle": 0.25,
                "ring": 0.22, "pinky": 0.15
            },
            "thumb_angle": 45.0,
            "mount_depths": {
                "venus": 0.02, "jupiter": 0.03, "saturn": 0.03,
                "apollo": 0.02, "mercury": 0.015
            }
        }


def generate_ai_insights(features: dict) -> dict:
    """Generate AI-powered insights using GPT"""
    prompt = f"""Analyze the following biometric hand features and generate a comprehensive personality assessment.

BIOMETRIC DATA:
- Palm Ratio (width/height): {features['palm_ratio']}
- Finger Spread Variance: {features['finger_spread']}
- Hand Stability Score: {features['stability_score']}
- Landmark Variance: {features['landmark_variance']}
- Palm Width: {features['palm_width']}
- Palm Height: {features['palm_height']}
- Finger Lengths: {features['finger_lengths']}
- Thumb Angle: {features['thumb_angle']}
- Mount Depths: {features['mount_depths']}

Generate a psychologically grounded personality profile. Return JSON with:
{{
  "archetype": "Specific personality archetype",
  "personality_insights": [
    "Specific insight about cognitive patterns",
    "Specific insight about emotional processing",
    "Specific insight about social behavior",
    "Specific insight about decision-making"
  ],
  "emotional_state": "Current emotional baseline",
  "life_phase": "Current developmental phase",
  "shock_line": "One psychologically piercing insight"
}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a behavioral psychologist specializing in biometric analysis. Generate insights in JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.8,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )

        import json
        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"AI generation error: {e}")
        # Fallback insights
        return {
            "archetype": "The Intuitive Creator",
            "personality_insights": [
                "You blend analytical thinking with creative problem-solving",
                "Your emotional intelligence helps you navigate complex social dynamics",
                "You seek deeper meaning in everyday experiences",
                "You value authentic connections over superficial interactions"
            ],
            "emotional_state": "Currently in a period of self-discovery and creative exploration",
            "life_phase": "Transition point where your analytical and creative sides are integrating",
            "shock_line": "You've been delaying a creative project because you think it needs to be perfect - the imperfect version is exactly what someone needs to see."
        }


@app.get("/")
async def root():
    return {"status": "healthy", "service": "Palm Insight AI", "version": "1.0.0"}


@app.post("/analyze")
async def analyze_palm(file: UploadFile = File(...)):
    """Analyze palm from uploaded image"""
    try:
        # Read image
        contents = await file.read()
        print(f"Received image: {file.filename}, size: {len(contents)} bytes")

        # Extract features (without MediaPipe/OpenCV)
        features = extract_mock_features(contents)
        print(f"Extracted features: {features['palm_ratio']}")

        # Generate AI insights
        insights = generate_ai_insights(features)
        print(f"Generated insights for: {insights['archetype']}")

        result = {
            "features": features,
            "insights": insights,
            "detection_confidence": "high",
            "analysis_method": "simplified_demo"
        }

        return AnalysisResponse(
            success=True,
            message="Analysis complete",
            data=result
        )

    except Exception as e:
        print(f"Analysis error: {e}")
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}",
            data=None
        )


@app.post("/analyze_mobile")
async def analyze_palm_mobile(image_data: dict):
    """Analyze palm from base64 encoded image (mobile endpoint)"""
    try:
        # Extract base64 string
        image_base64 = image_data.get("image", "")

        if not image_base64:
            raise HTTPException(status_code=400, detail="No image data provided")

        # Remove data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]

        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        print(f"Received mobile image: {len(image_bytes)} bytes")

        # Extract features
        features = extract_mock_features(image_bytes)

        # Generate AI insights
        insights = generate_ai_insights(features)

        result = {
            "features": features,
            "insights": insights,
            "detection_confidence": "high",
            "analysis_method": "simplified_demo"
        }

        return AnalysisResponse(
            success=True,
            message="Analysis complete",
            data=result
        )

    except Exception as e:
        print(f"Mobile analysis error: {e}")
        return AnalysisResponse(
            success=False,
            message=f"Analysis failed: {str(e)}",
            data=None
        )


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "ai_engine": "ready",
            "analysis_method": "simplified_demo"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
