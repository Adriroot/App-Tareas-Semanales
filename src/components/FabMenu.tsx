// Archivo: src/components/FabMenu.tsx - VERSIÓN CORREGIDA

import React, { useState, useRef, useEffect } from 'react';
import { ShareIcon, Cog8ToothIcon, BookmarkSquareIcon, CalendarEditIcon, ArrowPathIcon, Squares2X2Icon, XMarkIcon } from './icons';

interface FabMenuProps {
  onInvite: () => void;
  onSettings: () => void;
  onTemplates: () => void;
  onEditDate: () => void;
  onResetWeek: () => void;
}

// 1. Objeto de estilos para mapear el propósito del botón a las clases correctas
const themeStyles = {
  primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white',
  neutral: 'bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)]',
  info: 'bg-blue-500 hover:bg-blue-600 text-white', // Azul funciona bien en ambos temas
  danger: 'bg-red-600 hover:bg-red-700 text-white', // Rojo es universal para peligro
};

const FabMenu: React.FC<FabMenuProps> = ({ onInvite, onSettings, onTemplates, onEditDate, onResetWeek }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Usamos 'theme' para definir el propósito del botón, no el color
  const menuItems = [
    { icon: ShareIcon, label: 'Invitar', action: onInvite, theme: 'info' as const },
    { icon: Cog8ToothIcon, label: 'Ajustes', action: onSettings, theme: 'neutral' as const },
    { icon: BookmarkSquareIcon, label: 'Plantillas', action: onTemplates, theme: 'primary' as const },
  ];

  const secondaryActions = [
    { icon: CalendarEditIcon, label: 'Editar Fecha', action: onEditDate, theme: 'info' as const },
    { icon: ArrowPathIcon, label: 'Reiniciar Semana', action: onResetWeek, theme: 'danger' as const },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Efectos de fondo para el menú */}
      {isOpen && (
        <>
          <div className="absolute -inset-8 bg-gradient-to-t from-purple-500/10 via-blue-500/5 to-transparent rounded-3xl blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-4 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-xl" />
        </>
      )}
      
      <div className={`flex flex-col items-end gap-4 transition-all duration-500 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => { item.action(); setIsOpen(false); }}
            className="group relative overflow-hidden"
            style={{ transitionDelay: `${isOpen ? index * 100 : 0}ms` }}
          >
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Botón principal con glassmorphism */}
            <div className={`relative flex items-center gap-3 px-6 py-4 font-bold rounded-2xl shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-1 backdrop-blur-xl border border-white/10 ${themeStyles[item.theme]}`}>
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
              <div className="absolute top-1 right-1 w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
              
              {/* Contenido */}
              <div className="relative">
                <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <span className="relative font-black tracking-tight">{item.label}</span>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </button>
        ))}

        <div className="flex gap-3" style={{ transitionDelay: `${isOpen ? menuItems.length * 100 : 0}ms` }}>
            {secondaryActions.map((item, index) => (
                <button
                    key={item.label}
                    onClick={() => { item.action(); setIsOpen(false); }}
                    className="group relative overflow-hidden"
                >
                    {/* Efectos de fondo para botones secundarios */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Botón secundario */}
                    <div className={`relative flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-xl shadow-xl transition-all duration-300 transform group-hover:scale-105 backdrop-blur-xl border border-white/5 ${themeStyles[item.theme]}`}>
                        {/* Efectos internos */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
                        
                        {/* Contenido */}
                        <div className="relative">
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="relative font-semibold tracking-tight">{item.label}</span>
                        
                        {/* Partícula flotante */}
                        <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Botón principal FAB mejorado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative overflow-hidden"
        aria-expanded={isOpen}
        aria-label="Abrir menú de acciones"
      >
        {/* Efectos de fondo */}
        <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-violet-500/40 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Botón principal */}
        <div className="relative w-18 h-18 flex items-center justify-center bg-gradient-to-br from-[var(--primary)] via-purple-500 to-[var(--accent-gradient-end)] text-white rounded-full shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 border-2 border-white/20">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-lg" />
          
          {/* Anillo giratorio */}
          <div className="absolute -inset-1 border-2 border-white/10 rounded-full animate-rotate-slow" />
          
          {/* Iconos con animación mejorada */}
          <div className="relative w-8 h-8">
            <Squares2X2Icon className={`absolute inset-0 transition-all duration-500 transform ${isOpen ? 'opacity-0 -rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
            <XMarkIcon className={`absolute inset-0 transition-all duration-500 transform ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'}`} />
            
            {/* Efecto de pulso en el centro */}
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Partículas alrededor */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1 right-3 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Efecto de barrido */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full" />
        </div>
      </button>
    </div>
  );
};

export default FabMenu;