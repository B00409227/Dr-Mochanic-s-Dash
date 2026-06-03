import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#010312',
        surface: '#031a35',
        surface2: '#0a1628',
        cyan: '#00dcf0',
        red: '#ff2429',
        purple: '#630c70',
        plate: '#FFC612',
        'text-main': '#f0f4ff',
        muted: '#4a6080',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        scanLine: 'scanLine 3s linear infinite',
        criticalPulse: 'criticalPulse 1.5s ease-in-out infinite',
        fadeSlideUp: 'fadeSlideUp 0.3s ease forwards',
        float: 'float 3s ease-in-out infinite',
        blink: 'blink 1s infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
        radarSpin: 'radarSpin 2s linear infinite',
        radarRing: 'radarRing 2s ease-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        scanLine: { '0%': { top: '0%', opacity: '1' }, '100%': { top: '100%', opacity: '1' } },
        criticalPulse: { '0%,100%': { boxShadow: '0 0 8px rgba(255,36,41,0.4)' }, '50%': { boxShadow: '0 0 28px rgba(255,36,41,0.9)' } },
        fadeSlideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
        radarSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        radarRing: { '0%': { transform: 'scale(1)', opacity: '0.8' }, '100%': { transform: 'scale(2.5)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      },
    },
  },
  plugins: [],
}
export default config
