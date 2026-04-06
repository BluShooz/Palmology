import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-blue': '#0080ff',
        'dark-bg': '#0a0a0f',
        'dark-card': '#12121a',
        'dark-border': '#1a1a2e',
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #00ffff' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px #00ffff' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
