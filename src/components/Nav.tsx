// Archivo: src/components/Nav.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React from 'react';
import { CalendarDaysIcon, ClipboardListIcon, ChartBarIcon } from './icons';

type View = 'semana' | 'hoy' | 'stats';

interface NavProps {
  currentView: View;
  setView: (view: View) => void;
}

const Nav: React.FC<NavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'semana', label: 'Semana', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'hoy', label: 'Hoy', icon: <ClipboardListIcon className="w-5 h-5" /> },
    { id: 'stats', label: 'Estadísticas', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="relative flex bg-[var(--card)] rounded-2xl border border-[var(--border)] p-1 shadow-card">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as View)}
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl min-h-[48px] ${
            currentView === item.id
              ? 'bg-[var(--primary)] text-white shadow-soft'
              : 'text-[var(--text-secondary)] active:bg-[var(--surface-2)]'
          }`}
          aria-pressed={currentView === item.id}
        >
          <span className={currentView === item.id ? 'scale-110' : ''}>{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
          
          {/* Subtle active indicator */}
          {currentView === item.id && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white/60 rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Nav;