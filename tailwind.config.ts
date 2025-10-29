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
        bg: '#0b0f14',
        panel: 'rgba(255, 255, 255, 0.04)',
        accent: '#ff6a00',
        'accent-2': '#ff9a3c',
      },
      backgroundImage: {
        'glass-panel': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'prismatic': 'radial-gradient(circle at 50% 0%, rgba(255, 106, 0, 0.1) 0%, transparent 70%), radial-gradient(circle at 0% 50%, rgba(255, 154, 60, 0.08) 0%, transparent 70%), radial-gradient(circle at 100% 50%, rgba(255, 106, 0, 0.06) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'accent-glow': '0 0 20px rgba(255, 106, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
