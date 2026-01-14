/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Warm backgrounds
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFDFB',
          100: '#FFF8F0',
          200: '#F5EBE0',
          300: '#E8DDD0',
        },
        // Rich forest green - primary
        forest: {
          DEFAULT: '#2D5A27',
          light: '#4A7C43',
          dark: '#1E3D1A',
          50: '#E8F5E7',
          100: '#C5E6C3',
          200: '#9DD49A',
          300: '#74C170',
          400: '#55B24F',
          500: '#2D5A27',
          600: '#264D21',
          700: '#1E3D1A',
        },
        // Fresh mint accent
        mint: {
          DEFAULT: '#B8E0C5',
          light: '#D4EEE0',
          dark: '#8BCDA0',
        },
        // Vibrant tangerine - CTA & favorites
        tangerine: {
          DEFAULT: '#FF6B35',
          light: '#FF8F66',
          dark: '#E55A28',
          50: '#FFF0EB',
          100: '#FFD9CC',
          200: '#FFBDA8',
          300: '#FFA184',
          400: '#FF8560',
          500: '#FF6B35',
          600: '#E55A28',
        },
        // Warm cocoa - text
        cocoa: {
          DEFAULT: '#3D2914',
          light: '#6B4423',
          lighter: '#8B6B4A',
          50: '#F5EDE6',
          100: '#E6D5C5',
        },
        // Golden honey - highlights
        honey: {
          DEFAULT: '#FFB627',
          light: '#FFCF66',
          dark: '#E5A31F',
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(61, 41, 20, 0.08), 0 4px 6px -4px rgba(61, 41, 20, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(61, 41, 20, 0.12), 0 4px 15px -5px rgba(61, 41, 20, 0.08)',
        'soft-xl': '0 20px 60px -15px rgba(61, 41, 20, 0.15), 0 8px 25px -8px rgba(61, 41, 20, 0.1)',
        'glow-tangerine': '0 0 30px -5px rgba(255, 107, 53, 0.4)',
        'glow-forest': '0 0 30px -5px rgba(45, 90, 39, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(61, 41, 20, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'heart-beat': 'heartBeat 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #FFF8F0 0%, #F5EBE0 100%)',
        'gradient-forest': 'linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%)',
        'gradient-tangerine': 'linear-gradient(135deg, #FF6B35 0%, #FFB627 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(61, 41, 20, 0.7) 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
