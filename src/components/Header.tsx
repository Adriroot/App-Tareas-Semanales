// Archivo: src/components/Header.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { SunIcon, MoonIcon, HomeIcon } from './icons';
import { Household } from '../types';

interface HeaderProps {
  household?: Household | null;
}

const Header: React.FC<HeaderProps> = ({ household }) => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error("Header must be used within a ThemeProvider");
    }

    const { theme, toggleTheme } = themeContext;

    return (
        <header className="relative py-4 px-4">
            {/* Fondo con gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent rounded-2xl" />
            
            <div className="relative flex items-center justify-between">
                {/* Logo y título compacto */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        {/* Indicador de actividad */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--card)] animate-pulse" />
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                            Horario
                            <span className="text-base">✨</span>
                        </h1>
                        {household?.name ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <HomeIcon className="w-3 h-3 text-[var(--primary)]" />
                                <span className="text-xs font-semibold text-[var(--primary)] truncate max-w-[120px]">
                                    {household.name}
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs text-[var(--text-secondary)] font-medium">
                                🏠 Gestión inteligente de tareas
                            </p>
                        )}
                    </div>
                </div>

                {/* Controles compactos */}
                <div className="flex items-center gap-2">
                    {/* Indicador de estado */}
                    <div className="hidden sm:flex items-center gap-2 bg-[var(--surface-2)] px-3 py-1.5 rounded-xl border border-[var(--border)]">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">Online</span>
                    </div>
                    
                    <button 
                        onClick={toggleTheme} 
                        className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-1)] transition-all active:scale-95"
                        aria-label="Cambiar tema"
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-4 h-4 text-[var(--warning)]" />
                        ) : (
                            <MoonIcon className="w-4 h-4 text-[var(--primary)]" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;