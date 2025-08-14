
// Archivo: src/components/EmptyState.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React from 'react';
import { EmptyTasksIcon, SparklesIcon } from './icons';

interface EmptyStateProps {
    title: string;
    message: string;
    small?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, small = false }) => {
    return (
        <div className="relative">
            {/* Efectos de fondo ambientales */}
            <div className={`absolute ${small ? '-inset-4' : '-inset-8'} bg-gradient-to-br from-slate-500/5 via-transparent to-slate-400/5 rounded-3xl blur-2xl opacity-60 animate-pulse`} style={{ animationDuration: '4s' }} />
            <div className={`absolute ${small ? '-inset-2' : '-inset-4'} bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-2xl blur-lg opacity-40`} />
            
            <div className={`relative text-center ${small ? 'py-12 px-6' : 'py-20 px-8'} bg-[var(--card)]/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl`}>
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
                <div className={`absolute top-4 right-4 ${small ? 'w-16 h-16' : 'w-24 h-24'} bg-gradient-to-br from-slate-500/10 to-slate-600/10 rounded-full blur-2xl`} />
                
                {/* Partículas flotantes */}
                <div className={`absolute ${small ? 'top-4 left-6' : 'top-8 left-12'} w-1 h-1 bg-slate-400/40 rounded-full animate-pulse`} />
                <div className={`absolute ${small ? 'bottom-6 right-8' : 'bottom-12 right-16'} w-0.5 h-0.5 bg-slate-500/40 rounded-full animate-pulse`} style={{ animationDelay: '2s' }} />
                <div className={`absolute ${small ? 'top-6 right-6' : 'top-10 right-10'} w-0.5 h-0.5 bg-slate-400/60 rounded-full animate-pulse`} style={{ animationDelay: '1s' }} />
                
                {/* Icono mejorado */}
                {!small && (
                    <div className="relative inline-flex items-center justify-center mb-8">
                        <div className="absolute -inset-8 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
                        <div className="absolute -inset-4 bg-gradient-to-r from-slate-400/30 to-slate-500/30 rounded-full blur-xl opacity-60" />
                        
                        <div className="relative w-40 h-40 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-full flex items-center justify-center border border-slate-400/20 shadow-2xl group hover:scale-105 transition-transform duration-500">
                            <EmptyTasksIcon className="w-20 h-20 text-slate-400 drop-shadow-lg" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                            
                            {/* Partículas orbitales */}
                            <div className="absolute -top-1 left-8 w-1 h-1 bg-slate-300/60 rounded-full animate-pulse" />
                            <div className="absolute -bottom-1 right-8 w-0.5 h-0.5 bg-slate-400/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                            <div className="absolute top-1/2 -left-1 w-0.5 h-0.5 bg-slate-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <div className="absolute top-1/2 -right-1 w-0.5 h-0.5 bg-slate-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                        </div>
                        
                        {/* Anillo exterior giratorio */}
                        <div className="absolute -inset-6 border-2 border-slate-400/20 rounded-full animate-rotate-slow opacity-30" style={{ borderStyle: 'dashed' }} />
                        <div className="absolute -inset-3 border border-slate-400/10 rounded-full animate-rotate-slow opacity-20" style={{ animationDirection: 'reverse' }} />
                    </div>
                )}
                
                {/* Contenido mejorado */}
                <div className="relative space-y-4">
                    {/* Título con efectos */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {small && (
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-2xl flex items-center justify-center shadow-xl">
                                    <EmptyTasksIcon className="w-6 h-6 text-slate-400" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                                </div>
                                <div className="absolute -inset-1 border border-slate-400/20 rounded-2xl animate-pulse opacity-30" />
                            </div>
                        )}
                        
                        <h3 className={`font-black tracking-tight text-[var(--text-primary)] ${
                            small ? 'text-2xl' : 'text-4xl'
                        }`}>
                            {title}
                        </h3>
                        
                        {!small && (
                            <div className="relative">
                                <SparklesIcon className="w-6 h-6 text-slate-400 animate-pulse" />
                                <div className="absolute -inset-1 bg-slate-400/20 rounded-full blur-sm animate-pulse opacity-50" />
                            </div>
                        )}
                    </div>
                    
                    {/* Mensaje con efectos tipográficos */}
                    <p className={`text-[var(--text-secondary)] font-medium leading-relaxed ${
                        small ? 'text-sm max-w-sm' : 'text-lg max-w-md'
                    } mx-auto`}>
                        {message}
                    </p>
                    
                    {/* Indicadores decorativos */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="w-2 h-2 bg-slate-400/50 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-slate-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="w-2 h-2 bg-slate-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                    
                    {/* Línea decorativa */}
                    {!small && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-slate-400/50" />
                            <div className="w-3 h-3 bg-gradient-to-br from-slate-400/30 to-slate-500/30 rounded-full">
                                <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                            </div>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-slate-400/50 to-transparent" />
                        </div>
                    )}
                </div>
                
                {/* Efectos adicionales para versión grande */}
                {!small && (
                    <>
                        {/* Ondas de fondo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-sm max-h-sm">
                            <div className="absolute inset-0 border border-slate-400/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s' }} />
                            <div className="absolute inset-4 border border-slate-400/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                            <div className="absolute inset-8 border border-slate-400/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s', animationDelay: '2s' }} />
                        </div>
                        
                        {/* Grid de partículas de fondo */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute top-1/4 left-1/6 w-px h-px bg-slate-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="absolute top-1/3 right-1/6 w-px h-px bg-slate-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
                            <div className="absolute bottom-1/4 left-1/4 w-px h-px bg-slate-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
                            <div className="absolute bottom-1/3 right-1/4 w-px h-px bg-slate-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmptyState;