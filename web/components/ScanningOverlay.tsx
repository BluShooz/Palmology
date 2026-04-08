'use client'

export default function ScanningOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-neon-cyan/10" />

      {/* Scanning Line */}
      <div className="scan-line" />

      {/* Additional scan beam effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-pulse" />

      {/* Corner scanning indicators */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-neon-cyan rounded-tl-3xl animate-pulse" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-neon-cyan rounded-tr-3xl animate-pulse delay-100" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-neon-cyan rounded-bl-3xl animate-pulse delay-200" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-neon-cyan rounded-br-3xl animate-pulse delay-300" />

      {/* Center scanning reticle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-neon-cyan/30 rounded-lg animate-pulse" />
        <div className="absolute w-48 h-48 border border-neon-cyan/20 rounded-lg animate-ping" />
      </div>

      {/* Animated particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-ping delay-300" />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-neon-cyan rounded-full animate-ping delay-700" />

      {/* Scanning Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-30">
        <div className="inline-block bg-dark-bg/90 px-8 py-4 rounded-xl border-2 border-neon-cyan backdrop-blur-sm">
          <p className="text-neon-cyan text-xl font-bold mb-2 animate-pulse">
            🔍 Analyzing Palm...
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200" />
          </div>
          <p className="text-gray-300 text-sm mt-3">
            Extracting biometric features
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Generating AI personality insights
          </p>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  )
}
