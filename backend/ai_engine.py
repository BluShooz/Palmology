import os
import json
from typing import Dict, List
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class AIEngine:
    """
    Generates personality insights using GPT-4o-mini.
    """

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"

    def generate_insights(self, features: Dict) -> Dict:
        """
        Generate AI-powered personality insights from biometric features.
        """
        prompt = self._build_prompt(features)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
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

            result = json.loads(response.choices[0].message.content)
            return result

        except Exception as e:
            # Fallback response if API fails
            return self._generate_fallback_response(features)

    def _get_system_prompt(self) -> str:
        """
        System prompt for personality analysis.
        """
        return """You are a behavioral psychologist specializing in biometric analysis and personality assessment.

You analyze hand-derived biometric data to generate psychological insights. Your readings must:

1. NEVER mention palmistry, astrology, or mysticism
2. NEVER use phrases like "palm reading" or "fortune telling"
3. Sound like a trained behavioral psychologist
4. Be specific, grounded, and evidence-based
5. Include subtle contradictions for realism
6. Generate one highly memorable "shock line" that feels psychologically penetrating
7. Frame everything as behavioral tendencies and personality traits
8. Avoid vague statements - be specific and actionable

Your output must be a JSON object with these exact fields:
{
  "archetype": "Specific personality archetype (e.g., 'The Analytical Protector', 'The Creative Catalyst')",
  "personality_insights": [
    "Specific insight about cognitive patterns",
    "Specific insight about emotional processing",
    "Specific insight about social behavior",
    "Specific insight about decision-making"
  ],
  "emotional_state": "Current emotional baseline with specific details",
  "life_phase": "Current developmental phase with context",
  "shock_line": "One psychologically piercing insight that feels uncannily accurate"
}

Make the insights feel:
- Psychologically grounded
- Emotionally reflective
- Slightly intense but not harmful
- Memorable and shareable
- Based on behavioral patterns, not destiny"""

    def _build_prompt(self, features: Dict) -> str:
        """
        Build prompt from extracted features.
        """
        prompt = f"""Analyze the following biometric hand features and generate a comprehensive personality assessment.

BIOMETRIC DATA:
- Palm Ratio (width/height): {features['palm_ratio']} (lower = more elongated, higher = broader)
- Finger Spread Variance: {features['finger_spread']} (higher = more asymmetrical finger expression)
- Hand Stability Score: {features['stability_score']} (higher = more consistent patterns)
- Landmark Variance: {features['landmark_variance']} (spatial distribution of features)
- Palm Width: {features['palm_width']} (absolute palm breadth)
- Palm Height: {features['palm_height']} (absolute palm length)
- Finger Lengths: {features['finger_lengths']} (relative finger proportions)
- Thumb Angle: {features['thumb_angle']} degrees (thumb positioning relative to palm)
- Mount Depths: {features['mount_depths']} (palm area distributions)

ANALYSIS FRAMEWORK:
1. Palm Ratio: Relates to preference for breadth vs depth in thinking and experience
2. Finger Spread: Indicates cognitive flexibility vs specialization
3. Hand Stability: Suggests consistency in behavioral patterns
4. Finger Lengths: Correlates with different cognitive and expressive tendencies
5. Thumb Angle: Relates to willfulness and adaptability
6. Mount Depths: Connect to different motivational and emotional drivers

Generate a psychologically grounded personality profile based on these biometric markers.

Remember:
- Frame everything as behavioral tendencies and patterns
- Be specific and avoid generic statements
- Include one memorable "shock line" that feels psychologically penetrating
- Sound like a behavioral psychologist, not a fortune teller"""

        return prompt

    def _generate_fallback_response(self, features: Dict) -> Dict:
        """
        Generate fallback response if API fails.
        """
        return {
            "archetype": "The Adaptive Thinker",
            "personality_insights": [
                "You show a strong balance between analytical thinking and emotional intelligence",
                "Your patterns suggest adaptability in social situations",
                "You tend to process information deeply before acting",
                "You value authentic connections over superficial interactions"
            ],
            "emotional_state": "Currently in a growth-oriented phase with increasing self-awareness",
            "life_phase": "Transition period with significant potential for personal development",
            "shock_line": "You've been carrying an idea that scares you a little - that's exactly the one you should pursue."
        }
