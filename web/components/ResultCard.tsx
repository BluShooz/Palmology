'use client'

interface ResultCardProps {
  data: {
    features: any
    insights: any
    detection_confidence: string
  }
  onReset: () => void
}

export default function ResultCard({ data, onReset }: ResultCardProps) {
  const { insights } = data

  return (
    <div className="result-card">
      {/* Archetype Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="text-6xl mb-4">🧠</div>
        </div>
        <h2 className="text-4xl font-bold mb-2 text-neon-cyan neon-text">
          {insights.archetype}
        </h2>
        <p className="text-gray-400">Your Personality Archetype</p>
      </div>

      {/* Main Insights */}
      <div className="grid gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 neon-border">
          <h3 className="text-xl font-semibold mb-4 text-neon-cyan">
            Personality Insights
          </h3>
          <ul className="space-y-3">
            {insights.personality_insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="text-neon-cyan mr-3 mt-1">▹</span>
                <span className="text-gray-300">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emotional State */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-neon-cyan">
            Emotional State
          </h3>
          <p className="text-gray-300">{insights.emotional_state}</p>
        </div>

        {/* Life Phase */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-neon-cyan">
            Life Phase
          </h3>
          <p className="text-gray-300">{insights.life_phase}</p>
        </div>

        {/* Shock Line */}
        <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border-2 border-neon-cyan rounded-lg p-6 glow-effect">
          <h3 className="text-lg font-semibold mb-3 text-neon-cyan">
            🔮 Key Insight
          </h3>
          <p className="text-xl text-white italic">
            {insights.shock_line}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-neon-cyan text-dark-bg font-semibold rounded-lg hover:bg-neon-blue transition-all duration-300"
        >
          Scan Again
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Palm Insight AI Reading',
                text: `I'm a "${insights.archetype}" - ${insights.shock_line}`,
                url: window.location.href,
              })
            }
          }}
          className="px-8 py-3 bg-dark-card border border-neon-cyan text-neon-cyan font-semibold rounded-lg hover:bg-neon-cyan/10 transition-all duration-300"
        >
          Share Results
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          This analysis is based on biometric patterns and AI interpretation.
          <br />
          Results are for entertainment and self-reflection purposes.
        </p>
      </div>
    </div>
  )
}
