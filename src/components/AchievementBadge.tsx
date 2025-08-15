// Archivo: src/components/AchievementBadge.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React from 'react';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, isUnlocked }) => {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
      isUnlocked 
        ? 'bg-[var(--warning-bg)] border-[var(--warning-border)]'
        : 'bg-[var(--card)] border-[var(--border)] opacity-60'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isUnlocked ? 'bg-[var(--warning)] text-white' : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'
      }`}>
        <achievement.icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold truncate ${
          isUnlocked ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'
        }`}>
          {achievement.name}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {achievement.description}
        </p>
      </div>

      {isUnlocked && (
        <div className="text-[var(--warning)] font-semibold text-sm">
          ✓
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;