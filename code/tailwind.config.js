/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'hunter-bg': 'var(--bg-primary)',
        'hunter-card': 'var(--bg-secondary)',
        'hunter-green': 'var(--accent-primary)',
        'hunter-red': '#ff4757',
        'hunter-blue': 'var(--accent-blue)',
        'hunter-orange': 'var(--accent-orange)',
        'hunter-text': 'var(--text-primary)',
        'hunter-text-muted': 'var(--text-secondary)',
      },
      fontFamily: {
        'heading': ['var(--font-heading)', 'sans-serif'],
        'body': ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88' },
          '100%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hunter-gradient': 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-strong) 100%)',
        'hunter-gradient-orange': 'linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-orange-strong) 100%)',
      },
    },
  },
  plugins: [],
}
