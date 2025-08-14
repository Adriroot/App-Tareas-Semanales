// Archivo: tailwind.config.js - VERSIÓN MEJORADA Y SIMPLIFICADA

export default {
  // 1. Ruta de contenido actualizada para ser más precisa.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Busca en toda la carpeta src
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 2. Mantenemos solo las extensiones que NO son colores,
      //    ya que los colores se manejarán con variables CSS.
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.15)',
        card: '0 4px 12px rgba(0,0,0,0.2), 0 12px 36px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'card-radius': '16px',
        pill: '9999px',
      },
      // 3. (Opcional pero recomendado) Puedes añadir tus animaciones aquí
      //    en lugar de tenerlas solo en el CSS, para poder usarlas
      //    como clases de Tailwind (ej: `animate-gradient-shift`).
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'grid-move': 'grid-move 20s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'pulse-slow': {
          '50%': {
            opacity: '.85',
            boxShadow: '0 0 1.5rem 0.25rem rgba(234, 179, 8, 0.3)',
          }
        },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        'float': {
            '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) translateX(10px) rotate(10deg)' },
        },
        'grid-move': {
            from: { 'background-position': '0 0' },
            to: { 'background-position': '-100px 100px' },
        }
      }
    },
  },
  plugins: [],
}