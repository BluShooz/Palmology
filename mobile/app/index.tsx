import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';

export default function IndexScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera access is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    setIsScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.95,
        skipProcessing: false,
      });

      // Resize image for faster upload
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1280 } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Navigate to result screen with image
      router.push({
        pathname: '/result',
        params: { imageUri: manipulated.uri },
      });
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image');
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Palm Insight AI</Text>
        <Text style={styles.subtitle}>Biometric Analysis</Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={false}
        />

        {/* Corner Guides */}
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />

        {/* Center Focus */}
        <View style={styles.focusArea} />

        {/* Scanning Overlay */}
        {isScanning && <View style={styles.scanLine} />}
      </View>

      {/* Instructions */}
      {!isScanning && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Position your palm clearly in the frame
          </Text>
          <Text style={styles.instructionSubtext}>
            Keep hand steady with good lighting
          </Text>
        </View>
      )}

      {/* Capture Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.captureButton, isScanning && styles.buttonDisabled]}
          onPress={handleCapture}
          disabled={isScanning}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      {/* Scanning Text */}
      {isScanning && (
        <View style={styles.scanningTextContainer}>
          <Text style={styles.scanningText}>Analyzing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  camera: {
    flex: 1,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ffff',
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ffff',
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ffff',
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ffff',
    borderBottomRightRadius: 12,
  },
  focusArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.5)',
    borderRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    top: '50%',
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  instructionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  instructionSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0a0a0f',
  },
  scanningTextContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanningText: {
    color: '#00ffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00ffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
