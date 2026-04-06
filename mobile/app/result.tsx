import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { analyzePalm } from '../services/api';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUri } = params as { imageUri: string };

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    analyzeImage();
  }, [imageUri]);

  const analyzeImage = async () => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await analyzePalm(base64);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    try {
      await Share.share({
        message: `I'm a "${result.insights.archetype}" - ${result.insights.shock_line}`,
        url: 'https://palminsight.ai',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ffff" />
          <Text style={styles.loadingText}>Analyzing your palm...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🧠</Text>
          <Text style={styles.archetype}>{result.insights.archetype}</Text>
          <Text style={styles.subtitle}>Your Personality Archetype</Text>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personality Insights</Text>
          {result.insights.personality_insights.map((insight: string, idx: number) => (
            <View key={idx} style={styles.insightRow}>
              <Text style={styles.bullet}>▹</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>

        {/* Emotional State */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emotional State</Text>
          <Text style={styles.cardText}>{result.insights.emotional_state}</Text>
        </View>

        {/* Life Phase */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Life Phase</Text>
          <Text style={styles.cardText}>{result.insights.life_phase}</Text>
        </View>

        {/* Shock Line */}
        <View style={[styles.card, styles.shockCard]}>
          <Text style={styles.cardTitle}>🔮 Key Insight</Text>
          <Text style={styles.shockText}>{result.insights.shock_line}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This analysis is based on biometric patterns and AI interpretation.
          {'\n'}Results are for entertainment and self-reflection purposes.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00ffff',
    fontSize: 18,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  archetype: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffff',
    textAlign: 'center',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#12121a',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  shockCard: {
    borderWidth: 2,
    borderColor: '#00ffff',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  insightRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    color: '#00ffff',
    fontSize: 16,
    marginRight: 8,
    marginTop: 4,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
  shockText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#00ffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00ffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#00ffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
