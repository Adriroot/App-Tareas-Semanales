// Archivo: src/components/PowerUpDisplay.tsx - POWER-UPS MINIMALISTAS

import React, { useState } from 'react';
import { ActivePowerUp } from '../utils/powerUps';
import { ChevronDownIcon, ChevronRightIcon } from './icons';

interface PowerUpDisplayProps {
  powerUps: ActivePowerUp[];
  compact?: boolean;
}

const PowerUpDisplay: React.FC<PowerUpDisplayProps> = ({ powerUps, compact = false }) => {
  const activePowerUps = powerUps.filter(p => p.isActive);
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (activePowerUps.length === 0 && compact) {
    return null;
  }
  
  if (compact) {
    // Versión compacta para mostrar junto a tareas
    return (
      <div className="flex gap-1">
        {activePowerUps.map(({ powerUp }) => (
          <span
            key={powerUp.id}
            className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 rounded font-medium"
            title={powerUp.description}
          >
            {powerUp.emoji}
          </span>
        ))}
      </div>
    );
  }
  
  // Versión completa para panel de power-ups
  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      {/* Header clickeable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-1)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-all ${
            activePowerUps.length > 0
              ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
              : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20'
          }`}>
            <span className="text-lg">⚡</span>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-[var(--text-primary)]">Power-ups</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {activePowerUps.length} de {powerUps.length} activos
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[var(--border)]/50">
          <div className="mt-4 space-y-3">
        
            {powerUps.map(({ powerUp, isActive, progress, maxProgress }) => (
              <div
                key={powerUp.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'border-green-500/30 bg-green-50/50 shadow-sm' 
                    : 'border-[var(--border)] bg-[var(--surface-1)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    isActive 
                      ? 'bg-green-500/15' 
                      : 'bg-[var(--surface-2)]'
                  }`}>
                    {powerUp.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-[var(--text-primary)]`}>
                        {powerUp.name}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-700 rounded-full font-medium">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-[var(--text-secondary)] mt-1">
                      {powerUp.description}
                    </div>
                    
                    {/* Barra de progreso mejorada */}
                    {progress !== undefined && maxProgress !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-2 text-[var(--text-secondary)]">
                          <span>Progreso</span>
                          <span className="font-medium">{progress}/{maxProgress}</span>
                        </div>
                        <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isActive 
                                ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                                : 'bg-[var(--text-secondary)]/30'
                            }`}
                            style={{ width: `${(progress / maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {activePowerUps.length === 0 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-[var(--surface-2)] rounded-full flex items-center justify-center">
                  <span className="text-xl opacity-60">💪</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Completa tareas para activar power-ups
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerUpDisplay;