/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#070B1E',
          light: '#101730',
          dark: '#03050F'
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFAA55',
          dark: '#E6801A'
        },
        indiagreen: {
          DEFAULT: '#138808',
          light: '#1AAB0B',
          dark: '#0E6606'
        },
        exam: {
          neet: '#ef4444',
          jee: '#0ea5e9',
          ugc: '#6366f1',
          slet: '#10b981',
          ssc: '#eab308',
          apsc: '#a855f7'
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        rajdhani: ['Plus Jakarta Sans', 'sans-serif'],
        nunito: ['Inter', 'sans-serif']
      },
      boxShadow: {
        saffron: '0 0 20px rgba(255, 153, 51, 0.3)',
        'saffron-lg': '0 0 30px rgba(255, 153, 51, 0.5)'
      }
    },
  },
  plugins: [],
}
