'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [error, setError] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Browser does not support camera access')
      return
    }

    // List available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput')
        setCameras(videoDevices)
        console.log('Available cameras:', videoDevices)
      })
      .catch(err => {
        console.error('Error listing devices:', err)
        setError('Failed to list cameras: ' + err.message)
      })
  }, [])

  const testCamera = async () => {
    setTestResult('Testing camera...')
    setError('')

    try {
      console.log('Requesting camera access...')

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      console.log('Camera access granted')
      setStream(mediaStream)
      setTestResult('✅ Camera working! Stream active.')

      // Get video track settings
      const videoTrack = mediaStream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()
      console.log('Camera settings:', settings)

      setTestResult(prev => prev + `\n\nCamera info:\n${JSON.stringify(settings, null, 2)}`)

    } catch (err: any) {
      console.error('Camera test failed:', err)
      setError(`Camera test failed: ${err.message}`)
      setTestResult('❌ Camera test failed')

      if (err.name === 'NotAllowedError') {
        setError('Permission denied. Please allow camera access.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera already in use.')
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setTestResult('Camera stopped')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neon-cyan">🔍 Camera Debug Page</h1>

        {/* Browser Info */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Browser Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Platform:</strong> {navigator.platform}</p>
            <p><strong>HTTPS:</strong> {window.location.protocol === 'https:' ? '✅ Yes' : '❌ No (camera may not work)'}</p>
            <p><strong>Host:</strong> {window.location.hostname}</p>
            <p><strong>Camera API:</strong> {navigator.mediaDevices?.getUserMedia ? '✅ Supported' : '❌ Not supported'}</p>
          </div>
        </div>

        {/* Available Cameras */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Available Cameras ({cameras.length})</h2>
          {cameras.length > 0 ? (
            <ul className="space-y-2">
              {cameras.map((camera, index) => (
                <li key={camera.deviceId} className="bg-dark-bg p-3 rounded border border-dark-border">
                  <p><strong>Camera {index + 1}:</strong> {camera.label || 'Unnamed camera'}</p>
                  <p className="text-xs text-gray-400">ID: {camera.deviceId}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-400">No cameras detected</p>
          )}
        </div>

        {/* Test Camera */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Camera</h2>
          <div className="space-x-4 mb-4">
            <button
              onClick={testCamera}
              disabled={!!stream}
              className="px-6 py-3 bg-neon-cyan text-dark-bg rounded-lg hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Test Camera Access
            </button>
            <button
              onClick={stopCamera}
              disabled={!stream}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Stop Camera
            </button>
          </div>

          {testResult && (
            <div className="bg-dark-bg p-4 rounded border border-dark-border">
              <h3 className="font-semibold mb-2">Test Result:</h3>
              <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500 p-4 rounded mt-4">
              <h3 className="font-semibold text-red-400 mb-2">Error:</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Video Preview */}
        {stream && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Camera Preview</h2>
            <video
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg border-2 border-neon-cyan"
              style={{ transform: 'scaleX(-1)' }}
              ref={video => {
                if (video && stream) {
                  video.srcObject = stream
                }
              }}
            />
          </div>
        )}

        {/* Console Logs */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use This Page</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check browser information to ensure camera API is supported</li>
            <li>Verify available cameras are detected</li>
            <li>Click "Test Camera Access" to request permissions</li>
            <li>Allow camera permissions when prompted</li>
            <li>If successful, you'll see a live camera preview</li>
            <li>If failed, check the error message for troubleshooting</li>
          </ol>
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500 rounded">
            <p className="text-sm"><strong>💡 Tip:</strong> Open browser console (F12) to see detailed logs</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-neon-cyan hover:text-neon-blue underline"
          >
            ← Back to Palm Insight AI
          </a>
        </div>
      </div>
    </div>
  )
}
