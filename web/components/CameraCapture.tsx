'use client'

import { useState, useEffect, useRef } from 'react'

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onCapture: (blob: Blob) => void
  isScanning: boolean
}

export default function CameraCapture({
  videoRef,
  onCapture,
  isScanning,
}: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const [isVideoReady, setIsVideoReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let mounted = true

    async function setupCamera() {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access')
        setHasPermission(false)
        return
      }

      try {
        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Changed to 'user' for better compatibility
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (!mounted) return

        setStream(mediaStream)
        setHasPermission(true)

        // Set video source
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream

          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && mounted) {
              videoRef.current.play()
                .then(() => {
                  setIsVideoReady(true)
                  setError('')
                })
                .catch((err) => {
                  console.error('Error playing video:', err)
                  setError('Failed to start camera stream')
                })
            }
          }
        }
      } catch (err: any) {
        console.error('Camera access error:', err)

        if (!mounted) return

        // Provide more specific error messages
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access denied. Please allow camera permissions and refresh.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found on this device.')
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use by another application.')
        } else {
          setError(`Camera error: ${err.message || 'Unknown error'}`)
        }

        setHasPermission(false)
      }
    }

    setupCamera()

    return () => {
      mounted = false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, []) // Remove videoRef from dependencies

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      setError('Camera not ready. Please wait for video to load.')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0)

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob)
        } else {
          setError('Failed to capture image')
        }
      },
      'image/jpeg',
      0.95
    )
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-dark-border">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-400">Requesting camera access...</p>
        <p className="text-gray-500 text-sm mt-2">Please allow camera permissions when prompted</p>
      </div>
    )
  }

  // Error state
  if (hasPermission === false) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-red-500 p-8">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-red-400 font-semibold mb-2">Camera Not Available</p>
        <p className="text-gray-400 text-sm text-center mb-4">{error}</p>
        <div className="text-gray-500 text-xs space-y-1">
          <p>Troubleshooting tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Allow camera permissions in your browser</li>
            <li>Check if another app is using the camera</li>
            <li>Try refreshing the page</li>
            <li>Use Chrome, Firefox, or Safari</li>
            <li>Ensure you're on HTTPS or localhost</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-neon-cyan text-dark-bg rounded-lg hover:bg-neon-blue transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden neon-border camera-overlay">
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-card z-10">
            <div className="animate-pulse">
              <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isVideoReady ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: 'scaleX(-1)' }} // Mirror effect for better UX
        />

        {/* Corner Guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-neon-cyan rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-neon-cyan rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-neon-cyan rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-neon-cyan rounded-br-lg" />
        </div>

        {/* Center Focus Area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-neon-cyan/50 rounded-lg" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCapture}
          disabled={isScanning || !isVideoReady}
          className={`relative w-20 h-20 bg-neon-cyan rounded-full hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-effect ${
            !isVideoReady ? 'animate-pulse' : ''
          }`}
        >
          <div className="absolute inset-2 bg-dark-bg rounded-full" />
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-400 text-sm">
        {!isVideoReady ? (
          <p>Initializing camera...</p>
        ) : (
          <p>Position your palm in the frame and tap to capture</p>
        )}
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
