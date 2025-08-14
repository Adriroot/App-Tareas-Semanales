// Archivo: src/components/Nav.tsx - VERSIÓN FINAL Y CORRECTA

import React, { useState, useEffect, useRef } from 'react';
import { CalendarDaysIcon, ClipboardListIcon, ChartBarIcon } from './icons';

type View = 'semana' | 'hoy' | 'stats';

interface NavProps {
  currentView: View;
  setView: (view: View) => void;
}

const Nav: React.FC<NavProps> = ({ currentView, setView }) => {
  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const navItems = [
    { id: 'semana', label: 'Semana', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'hoy', label: 'Hoy', icon: <ClipboardListIcon className="w-5 h-5" /> },
    { id: 'stats', label: 'Estadísticas', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];
  
  // Este efecto recalcula la posición y el ancho del indicador cada vez que cambia la vista
  useEffect(() => {
    const navNode = navRef.current;
    if (!navNode) return;

    const activeButton = navNode.querySelector(`[data-view-id="${currentView}"]`) as HTMLButtonElement;
    if (activeButton) {
      const { offsetLeft, clientWidth } = activeButton;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${clientWidth}px`,
      });
    }
  }, [currentView]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Efectos de fondo */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-violet-500/20 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-lg opacity-40" />
      
      {/* Navegación principal con glassmorphism */}
      <nav ref={navRef} className="relative p-2 flex items-center justify-around bg-[var(--surface-1)]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full" />
        <div className="absolute top-1 right-1 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
        
        {/* Indicador mejorado con efectos */}
        <span
          className="absolute top-1/2 -translate-y-1/2 h-[calc(100%-16px)] bg-gradient-to-br from-[var(--primary)] via-purple-500 to-[var(--accent-gradient-end)] rounded-full shadow-2xl shadow-[var(--primary)]/30 transition-all duration-500 ease-out border border-white/20"
          style={{
            ...indicatorStyle,
            boxShadow: `0 8px 32px -8px var(--primary)40, inset 0 1px 0 rgba(255,255,255,0.2)`
          }}
          aria-hidden="true"
        >
          {/* Efecto de brillo interno */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
          {/* Partículas */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
        </span>

        {navItems.map((item) => (
          <button
            key={item.id}
            data-view-id={item.id}
            onClick={() => setView(item.id as View)}
            className={`group relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-full transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] ${
              currentView === item.id
                ? 'text-white transform scale-105'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105'
            }`}
            aria-pressed={currentView === item.id}
          >
            {/* Efecto de hover para botones inactivos */}
            {currentView !== item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            
            {/* Icono con efectos */}
            <div className={`relative transition-all duration-300 ${
              currentView === item.id ? 'text-white' : 'group-hover:scale-110'
            }`}>
              {item.icon}
              {/* Efecto de brillo en icono activo */}
              {currentView === item.id && (
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm animate-pulse" />
              )}
            </div>
            
            {/* Texto con efectos */}
            <span className={`transition-all duration-300 ${
              currentView === item.id ? 'font-black' : 'group-hover:font-bold'
            }`}>
              {item.label}
            </span>
            
            {/* Indicador de actividad para el botón activo */}
            {currentView === item.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Nav;