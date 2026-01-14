/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        pantoneblack: '#2d2926',
        pantoneyellow: '#EADB75',
        pantonegreen: '#88B04B',
        pantonebg: '#bfdf8e',
        pantonebrown: '#8f7f61',
        pantoneorange: '#f97316',
        // Semantic aliases
        primary: '#88B04B',
        'primary-dark': '#6a8c3a',
        secondary: '#8f7f61',
        accent: '#EADB75',
        highlight: '#f97316',
        surface: '#ffffff',
        error: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};