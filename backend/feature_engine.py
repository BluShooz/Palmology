import numpy as np
from typing import List, Dict


class FeatureEngine:
    """
    Extracts biometric features from hand landmarks.
    """

    def __init__(self):
        pass

    def extract_features(self, landmarks: List[Dict]) -> Dict:
        """
        Extract comprehensive features from hand landmarks.
        """
        features = {
            'palm_ratio': self.calculate_palm_ratio(landmarks),
            'finger_spread': self.calculate_finger_spread(landmarks),
            'stability_score': self.calculate_stability_score(landmarks),
            'landmark_variance': self.calculate_landmark_variance(landmarks),
            'palm_width': self.calculate_palm_width(landmarks),
            'palm_height': self.calculate_palm_height(landmarks),
            'finger_lengths': self.calculate_finger_lengths(landmarks),
            'thumb_angle': self.calculate_thumb_angle(landmarks),
            'mount_depths': self.calculate_mount_depths(landmarks)
        }

        return features

    def calculate_palm_ratio(self, landmarks: List[Dict]) -> float:
        """
        Calculate palm width-to-height ratio.
        """
        # Palm width: distance between wrist and middle finger base
        wrist = landmarks[0]
        middle_base = landmarks[9]

        width = np.sqrt(
            (middle_base['x'] - wrist['x'])**2 +
            (middle_base['y'] - wrist['y'])**2
        )

        # Palm height: distance from wrist to middle finger tip
        middle_tip = landmarks[12]

        height = np.sqrt(
            (middle_tip['x'] - wrist['x'])**2 +
            (middle_tip['y'] - wrist['y'])**2
        )

        if height == 0:
            return 0.0

        return round(width / height, 4)

    def calculate_finger_spread(self, landmarks: List[Dict]) -> float:
        """
        Calculate how spread out fingers are.
        """
        finger_tips = [8, 12, 16, 20]  # Index, Middle, Ring, Pinky tips
        finger_bases = [5, 9, 13, 17]  # Corresponding bases

        spreads = []
        for tip_idx, base_idx in zip(finger_tips, finger_bases):
            tip = landmarks[tip_idx]
            base = landmarks[base_idx]

            # Calculate distance from base to tip
            distance = np.sqrt(
                (tip['x'] - base['x'])**2 +
                (tip['y'] - base['y'])**2
            )
            spreads.append(distance)

        # Calculate variance in finger spreads
        if len(spreads) > 0:
            spread_variance = np.var(spreads)
            mean_spread = np.mean(spreads)
            return round(spread_variance / (mean_spread + 1e-6), 4)

        return 0.0

    def calculate_stability_score(self, landmarks: List[Dict]) -> float:
        """
        Calculate hand stability based on landmark positions.
        """
        # Calculate center of palm
        palm_center = self._get_palm_center(landmarks)

        # Calculate distances from center to key points
        key_points = [0, 5, 9, 13, 17]  # Wrist and finger bases
        distances = []

        for idx in key_points:
            lm = landmarks[idx]
            dist = np.sqrt(
                (lm['x'] - palm_center['x'])**2 +
                (lm['y'] - palm_center['y'])**2
            )
            distances.append(dist)

        # Lower variance = more stable
        if len(distances) > 0:
            stability = 1.0 / (1.0 + np.var(distances))
            return round(stability, 4)

        return 0.0

    def calculate_landmark_variance(self, landmarks: List[Dict]) -> float:
        """
        Calculate spatial variance of all landmarks.
        """
        x_coords = [lm['x'] for lm in landmarks]
        y_coords = [lm['y'] for lm in landmarks]

        x_variance = np.var(x_coords)
        y_variance = np.var(y_coords)

        total_variance = np.sqrt(x_variance**2 + y_variance**2)

        return round(total_variance, 4)

    def calculate_palm_width(self, landmarks: List[Dict]) -> float:
        """
        Calculate palm width.
        """
        # Distance between index and pinky bases
        index_base = landmarks[5]
        pinky_base = landmarks[17]

        width = np.sqrt(
            (index_base['x'] - pinky_base['x'])**2 +
            (index_base['y'] - pinky_base['y'])**2
        )

        return round(width, 4)

    def calculate_palm_height(self, landmarks: List[Dict]) -> float:
        """
        Calculate palm height.
        """
        wrist = landmarks[0]
        middle_tip = landmarks[12]

        height = np.sqrt(
            (middle_tip['x'] - wrist['x'])**2 +
            (middle_tip['y'] - wrist['y'])**2
        )

        return round(height, 4)

    def calculate_finger_lengths(self, landmarks: List[Dict]) -> Dict[str, float]:
        """
        Calculate relative finger lengths.
        """
        fingers = {
            'thumb': self._finger_length(landmarks, [1, 2, 3, 4]),
            'index': self._finger_length(landmarks, [5, 6, 7, 8]),
            'middle': self._finger_length(landmarks, [9, 10, 11, 12]),
            'ring': self._finger_length(landmarks, [13, 14, 15, 16]),
            'pinky': self._finger_length(landmarks, [17, 18, 19, 20])
        }

        return fingers

    def calculate_thumb_angle(self, landmarks: List[Dict]) -> float:
        """
        Calculate thumb angle relative to palm.
        """
        thumb_base = landmarks[1]
        thumb_tip = landmarks[4]
        wrist = landmarks[0]

        # Calculate vectors
        thumb_vector = np.array([
            thumb_tip['x'] - thumb_base['x'],
            thumb_tip['y'] - thumb_base['y']
        ])

        palm_vector = np.array([
            thumb_base['x'] - wrist['x'],
            thumb_base['y'] - wrist['y']
        ])

        # Calculate angle
        cos_angle = np.dot(thumb_vector, palm_vector) / (
            np.linalg.norm(thumb_vector) * np.linalg.norm(palm_vector) + 1e-6
        )
        angle = np.arccos(np.clip(cos_angle, -1, 1))

        return round(float(np.degrees(angle)), 4)

    def calculate_mount_depths(self, landmarks: List[Dict]) -> Dict[str, float]:
        """
        Calculate palm mount depths (areas between fingers).
        """
        mounts = {}

        # Mount of Venus (below thumb)
        wrist = landmarks[0]
        thumb_base = landmarks[1]
        index_base = landmarks[5]

        venus_depth = self._triangle_area(wrist, thumb_base, index_base)
        mounts['venus'] = round(venus_depth, 4)

        # Mount of Jupiter (below index)
        middle_base = landmarks[9]
        jupiter_depth = self._triangle_area(thumb_base, index_base, middle_base)
        mounts['jupiter'] = round(jupiter_depth, 4)

        # Mount of Saturn (below middle)
        ring_base = landmarks[13]
        saturn_depth = self._triangle_area(index_base, middle_base, ring_base)
        mounts['saturn'] = round(saturn_depth, 4)

        # Mount of Apollo (below ring)
        pinky_base = landmarks[17]
        apollo_depth = self._triangle_area(middle_base, ring_base, pinky_base)
        mounts['apollo'] = round(apollo_depth, 4)

        # Mount of Mercury (below pinky)
        mercury_depth = self._triangle_area(ring_base, pinky_base, wrist)
        mounts['mercury'] = round(mercury_depth, 4)

        return mounts

    def _get_palm_center(self, landmarks: List[Dict]) -> Dict[str, float]:
        """
        Calculate center point of palm.
        """
        palm_indices = [0, 5, 9, 13, 17]
        x_sum = sum(landmarks[i]['x'] for i in palm_indices)
        y_sum = sum(landmarks[i]['y'] for i in palm_indices)

        return {
            'x': x_sum / len(palm_indices),
            'y': y_sum / len(palm_indices)
        }

    def _finger_length(self, landmarks: List[Dict], indices: List[int]) -> float:
        """
        Calculate length of a finger.
        """
        total_length = 0
        for i in range(len(indices) - 1):
            p1 = landmarks[indices[i]]
            p2 = landmarks[indices[i + 1]]

            distance = np.sqrt(
                (p1['x'] - p2['x'])**2 +
                (p1['y'] - p2['y'])**2
            )
            total_length += distance

        return round(total_length, 4)

    def _triangle_area(self, p1: Dict, p2: Dict, p3: Dict) -> float:
        """
        Calculate area of triangle formed by three points.
        """
        # Using cross product formula
        v1 = np.array([p2['x'] - p1['x'], p2['y'] - p1['y']])
        v2 = np.array([p3['x'] - p1['x'], p3['y'] - p1['y']])

        cross_product = np.abs(np.cross(v1, v2))
        area = 0.5 * cross_product

        return float(area)
