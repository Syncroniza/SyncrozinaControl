/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '.65rem',  // 10.4px, más pequeño que text-xs
        'xxx-small': '.5rem'  // 8px, extremadamente pequeño
      },
      backgroundColor: {
        'custom': '#fffff', // Reemplaza con tu color deseado
      },
      // Puedes seguir extendiendo otras propiedades aquí
    },
  },
  plugins: [],
}
