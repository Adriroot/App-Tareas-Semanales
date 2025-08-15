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
      // Solo animaciones esenciales para funcionalidad
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.98)' }, to: { opacity: 1, transform: 'scale(1)' } },
      }
    },
  },
  plugins: [],
}