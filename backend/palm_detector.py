import cv2
import mediapipe as mp
import numpy as np
from typing import Tuple, Optional, List


class PalmDetector:
    """
    Detects hands and extracts landmarks using MediaPipe.
    """

    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for better hand detection.
        """
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # Apply CLAHE for contrast enhancement
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # Convert back to BGR for MediaPipe
        if len(image.shape) == 3:
            enhanced = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

        return enhanced

    def detect_hand(self, image: np.ndarray) -> Optional[Tuple[List, np.ndarray]]:
        """
        Detect hand in image and return landmarks with processed image.
        Returns (landmarks, processed_image) or None if no hand detected.
        """
        # Preprocess
        processed = self.preprocess_image(image)

        # Convert to RGB for MediaPipe
        rgb_image = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)

        # Detect hands
        results = self.hands.process(rgb_image)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]

            # Extract landmarks as list of dictionaries
            landmarks = []
            for idx, landmark in enumerate(hand_landmarks.landmark):
                landmarks.append({
                    'id': idx,
                    'x': landmark.x,
                    'y': landmark.y,
                    'z': landmark.z
                })

            return landmarks, processed

        return None

    def draw_landmarks(self, image: np.ndarray, landmarks: List) -> np.ndarray:
        """
        Draw landmarks on image for debugging.
        """
        annotated = image.copy()

        # Convert landmarks back to MediaPipe format
        h, w = image.shape[:2]
        landmark_points = []

        for lm in landmarks:
            cx, cy = int(lm['x'] * w), int(lm['y'] * h)
            landmark_points.append((cx, cy))

        # Draw connections
        connections = [
            (0, 1), (1, 2), (2, 3), (3, 4),  # Thumb
            (0, 5), (5, 6), (6, 7), (7, 8),  # Index
            (0, 9), (9, 10), (10, 11), (11, 12),  # Middle
            (0, 13), (13, 14), (14, 15), (15, 16),  # Ring
            (0, 17), (17, 18), (18, 19), (19, 20),  # Pinky
            (5, 9), (9, 13), (13, 17)  # Palm
        ]

        for start, end in connections:
            cv2.line(annotated, landmark_points[start], landmark_points[end], (0, 255, 0), 2)

        # Draw points
        for point in landmark_points:
            cv2.circle(annotated, point, 5, (0, 0, 255), -1)

        return annotated

    def __del__(self):
        if hasattr(self, 'hands'):
            self.hands.close()
