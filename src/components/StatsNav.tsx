// Archivo: src/components/StatsNav.tsx - VERSIÓN ESPACIAL Y FUTURISTA

import React, { useState, useEffect, useRef } from 'react';

// 1. Añadimos 'monthly' al tipo para que sea una opción válida
type StatsView = 'weekly' | 'all-time' | 'archive' | 'monthly';

interface StatsNavProps {
  currentView: StatsView;
  setView: (view: StatsView) => void;
}

const StatsNav: React.FC<StatsNavProps> = ({ currentView, setView }) => {
  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // 2. Añadimos iconos y colores únicos para cada vista
  const navItems = [
    { 
      id: 'weekly', 
      label: 'Semanal', 
      icon: '📊',
      color: { primary: '#3B82F6', secondary: '#2563EB', glow: '#3B82F6' }
    },
    { 
      id: 'all-time', 
      label: 'Historial', 
      icon: '🏆',
      color: { primary: '#8B5CF6', secondary: '#7C3AED', glow: '#8B5CF6' }
    },
    { 
      id: 'monthly', 
      label: 'Mensual', 
      icon: '📅',
      color: { primary: '#10B981', secondary: '#059669', glow: '#10B981' }
    },
    { 
      id: 'archive', 
      label: 'Archivo', 
      icon: '📦',
      color: { primary: '#F59E0B', secondary: '#D97706', glow: '#F59E0B' }
    },
  ];

  // Indicador dinámico mejorado
  useEffect(() => {
    const navNode = navRef.current;
    if (!navNode) return;

    const activeButton = navNode.querySelector(`[data-view-id="${currentView}"]`) as HTMLButtonElement;
    if (activeButton) {
      const { offsetLeft, clientWidth } = activeButton;
      const activeItem = navItems.find(item => item.id === currentView);
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${clientWidth}px`,
        background: activeItem 
          ? `linear-gradient(135deg, ${activeItem.color.primary}80, ${activeItem.color.secondary})`
          : `linear-gradient(135deg, #3B82F6, #2563EB)`,
        boxShadow: activeItem 
          ? `0 8px 32px ${activeItem.color.glow}40, 0 0 20px ${activeItem.color.glow}30`
          : '0 8px 32px #3B82F640'
      });
    }
  }, [currentView]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Efectos de fondo espaciales (sin interferir con clics) */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      
      {/* Partículas orbitales (pointer-events-none) */}
      <div className="absolute -top-1 left-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse pointer-events-none" />
      <div className="absolute -bottom-1 right-1/3 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      
      <nav 
        ref={navRef} 
        className="relative p-2 flex items-center justify-between gap-2 bg-[var(--card)]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Efectos internos del navegador (pointer-events-none) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-full pointer-events-none" />
        
        {/* Indicador activo simplificado */}
        <span
          className="absolute top-1/2 -translate-y-1/2 h-[calc(100%-16px)] rounded-full transition-all duration-300 ease-out pointer-events-none z-0"
          style={indicatorStyle}
          aria-hidden="true"
        >
          {/* Efecto interno del indicador */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-full" />
        </span>

        {navItems.map((item, index) => {
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              data-view-id={item.id}
              onClick={() => setView(item.id as StatsView)}
              className="relative z-20 flex-1 group/button cursor-pointer"
              aria-pressed={isActive}
            >
              <div 
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'text-white transform scale-105' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105'
                }`}
              >
                {/* Icono simplificado */}
                <span className={`text-lg transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`}>
                  {item.icon}
                </span>
                
                {/* Texto */}
                <span className={`text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'drop-shadow-sm' 
                    : ''
                }`}>
                  {item.label}
                </span>
                
                {/* Indicador de estado simple */}
                <div className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/60' 
                    : 'bg-transparent group-hover/button:bg-[var(--text-secondary)]/30'
                }`} />
              </div>
            </button>
          );
        })}
        
        {/* Línea decorativa simple (pointer-events-none) */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      </nav>
      
      {/* Información contextual */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface-1)]/40 backdrop-blur-sm border border-white/5 rounded-full text-xs font-medium text-[var(--text-secondary)]">
          <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse" />
          <span>Vista: <span className="font-bold text-[var(--text-primary)]">{navItems.find(item => item.id === currentView)?.label}</span></span>
        </div>
      </div>
    </div>
  );
};

export default StatsNav;