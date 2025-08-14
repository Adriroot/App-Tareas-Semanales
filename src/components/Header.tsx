// Archivo: src/components/Header.tsx - VERSIÓN CORREGIDA

import React, { useContext } from 'react';
import { ThemeContext } from '../App'; // Asegúrate de que la ruta del import sea correcta
import { SunIcon, MoonIcon } from './icons';

const Header: React.FC = () => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error("Header must be used within a ThemeProvider");
    }

    const { theme, toggleTheme } = themeContext;

    return (
        <header className="relative py-8 px-4 md:px-8 overflow-hidden">
            {/* Fondo con efectos */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '3s' }} />
            
            <div className="relative">
                {/* Logo/Icono futurista */}
                <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-300/20 flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 animate-pulse" />
                    </div>
                </div>
                
                {/* Título mejorado */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-gradient-start)] via-purple-400 to-[var(--accent-gradient-end)] mb-2 tracking-tight">
                        Horario
                        <span className="block text-4xl md:text-5xl mt-1 font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Pro
                        </span>
                    </h1>
                    
                    {/* Subtítulo con efectos */}
                    <div className="relative">
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
                            ¡Colabora en equipo, gamifica tus tareas y
                            <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold"> alcanza la excelencia</span>!
                        </p>
                        
                        {/* Indicadores de estado */}
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>Sistema Activo</span>
                            </div>
                            <div className="w-1 h-1 bg-[var(--border)] rounded-full" />
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                <span>Tiempo Real</span>
                            </div>
                            <div className="w-1 h-1 bg-[var(--border)] rounded-full" />
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                                <span>IA Integrada</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Botón de tema premium */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-0 right-0 group"
                    aria-label="Toggle theme"
                >
                    <div className="relative">
                        {/* Anillo exterior */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Botón principal */}
                        <div className="relative w-14 h-14 bg-[var(--surface-1)]/80 backdrop-blur-xl border border-[var(--border)]/50 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            {/* Efecto de brillo interno */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Iconos con animación mejorada */}
                            <div className="relative w-6 h-6 overflow-hidden">
                                <SunIcon className={`absolute inset-0 transition-all duration-500 transform text-yellow-400 ${theme === 'light' ? 'opacity-0 -rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                                <MoonIcon className={`absolute inset-0 transition-all duration-500 transform text-indigo-400 ${theme === 'dark' ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                            </div>
                        </div>
                        
                        {/* Tooltip premium */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="bg-[var(--surface-1)]/90 backdrop-blur-sm text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-lg border border-[var(--border)]/50 whitespace-nowrap shadow-xl">
                                {theme === 'dark' ? 'Modo Solar' : 'Modo Lunar'}
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[var(--surface-1)]/90 border-l border-t border-[var(--border)]/50 rotate-45" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;