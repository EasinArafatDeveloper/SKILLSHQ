/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Bengali', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: "#0066CC",
        secondary: "#FF6B35",
        dark: "#1a1a1a",
        light: "#f5f5f5",
        brand: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0F172A',
          gold: '#D97706',
          goldHover: '#B45309',
          emerald: '#059669',
          sky: '#0284C7',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(217, 119, 6, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(217, 119, 6, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
