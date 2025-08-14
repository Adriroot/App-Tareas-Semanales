// Archivo: src/components/AchievementBadge.tsx - VERSIÓN CORREGIDA

import React from 'react';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, isUnlocked }) => {
  // Estados visuales premium
  const unlockedClasses = 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 border-yellow-300/60 shadow-2xl shadow-yellow-500/40 animate-glow-pulse';
  const lockedClasses = 'bg-[var(--surface-1)]/50 border-[var(--border)]/30 opacity-50 hover:opacity-70';

  return (
    <div className="relative group">
      {/* Efectos de fondo para logros desbloqueados */}
      {isUnlocked && (
        <>
          <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-amber-600/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Partículas doradas */}
          <div className="absolute top-0 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1 left-0 w-0.5 h-0.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </>
      )}
      
      <div 
        className={`hexagon relative flex flex-col items-center justify-center p-3 text-center border-2 transition-all duration-500 transform group-hover:scale-110 ${
          isUnlocked ? unlockedClasses : lockedClasses
        } ${isUnlocked ? 'hover:shadow-yellow-400/50' : 'hover:border-[var(--border)]'}`}
      >
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent hexagon" />
        
        {/* Anillo interior para logros desbloqueados */}
        {isUnlocked && (
          <div className="absolute inset-1 border border-white/20 hexagon animate-rotate-slow" />
        )}
        
        {/* Icono con efectos mejorados */}
        <div className="relative mb-2">
          <achievement.icon 
            className={`w-12 h-12 transition-all duration-500 drop-shadow-lg ${
              isUnlocked 
                ? 'text-white group-hover:scale-110 animate-bounce-subtle' 
                : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
            }`} 
          />
          
          {/* Efecto de brillo en el icono desbloqueado */}
          {isUnlocked && (
            <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm animate-pulse opacity-50" />
          )}
        </div>
        
        {/* Nombre con efectos tipográficos */}
        <span 
          className={`text-xs font-black uppercase tracking-widest leading-tight transition-all duration-500 ${
            isUnlocked 
              ? 'text-white drop-shadow-sm group-hover:tracking-wider' 
              : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
          }`}
        >
          {achievement.name}
        </span>
        
        {/* Indicador de estado */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 ${
          isUnlocked 
            ? 'bg-green-500 shadow-lg shadow-green-400/50' 
            : 'bg-[var(--surface-2)] border-[var(--border)]'
        }`}>
          {isUnlocked ? (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {/* Tooltip premium mejorado */}
      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 transform group-hover:-translate-y-1">
        <div className="relative">
          {/* Efectos de fondo del tooltip */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-lg" />
          
          <div className="relative w-64 p-4 bg-[var(--card)]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
            {/* Efectos internos */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
            <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg" />
            
            {/* Header del tooltip */}
            <div className="flex items-center gap-2 mb-2">
              <achievement.icon className={`w-5 h-5 ${
                isUnlocked ? 'text-yellow-400' : 'text-[var(--text-secondary)]'
              }`} />
              <h4 className={`text-sm font-black uppercase tracking-wide ${
                isUnlocked ? 'text-yellow-400' : 'text-[var(--text-primary)]'
              }`}>
                {achievement.name}
              </h4>
            </div>
            
            {/* Descripción */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {achievement.description}
            </p>
            
            {/* Estado */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-[var(--border)]/30">
              <div className={`w-2 h-2 rounded-full ${
                isUnlocked ? 'bg-green-400 animate-pulse' : 'bg-[var(--text-secondary)]/50'
              }`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isUnlocked ? 'text-green-400' : 'text-[var(--text-secondary)]'
              }`}>
                {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
              </span>
            </div>
            
            {/* Flecha del tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2">
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[var(--card)]/95" />
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;