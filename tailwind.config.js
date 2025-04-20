/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        pantoneblack: '#2d2926', // Para textos
        pantoneyellow: '#EADB75', // Para botones
        pantonegreen: '#88B04B', // Para botones
        pantonebg: '#bfdf8e', // Para fondo
        pantonebrown: '#8f7f61', // Para otros elementos
        pantoneorange: '#f97316', // Naranja personalizado
      },
    },
  },
  plugins: [],
};