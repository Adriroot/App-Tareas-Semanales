// Componente expandible para mostrar logros con estadísticas completas
import React, { useState, useMemo, memo, useCallback } from 'react';
import { Achievement, UserProfile, UserStats, HistoryEntry, Task } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { ChevronDownIcon, TrophyIcon, StarIcon, FilterIcon, CheckCircleIcon } from './icons';

interface AchievementsPanelProps {
  unlockedAchievements: string[];
  userAchievementProgress: Record<string, { timesEarned: number; unlockedAt: string; lastEarnedAt: string }>;
  stats: Record<string, UserStats>;
  history: HistoryEntry[];
  users: UserProfile[];
  tasks: Task[];
  currentUser: UserProfile;
}

const CATEGORY_NAMES = {
  iniciacion: '🌟 Iniciación',
  progreso: '🏆 Progreso Personal',
  equipo: '🤝 Trabajo en Equipo',
  consistencia: '📅 Consistencia',
  retos: '🎯 Retos Específicos',
  hogar: '🏡 Hogar Colectivo',
  especiales: '✨ Logros Especiales',
  velocidad: '⚡ Velocidad',
  resistencia: '🏅 Resistencia',
  puntuacion: '💰 Puntuación',
  especialidad: '🎯 Especialización',
  temporales: '🌍 Temporales',
  diversion: '🎪 Diversión',
  maestria: '💎 Maestría',
  legendarios: '👑 Legendarios'
};

const DIFFICULTY_COLORS = {
  facil: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' },
  medio: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  dificil: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' },
  extremo: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
  legendario: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' }
};

const AchievementsPanel: React.FC<AchievementsPanelProps> = memo(({ 
  unlockedAchievements, 
  userAchievementProgress, 
  stats, 
  history, 
  users, 
  tasks, 
  currentUser 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  // Añadir las propiedades faltantes a los logros existentes para evitar errores
  const enhancedAchievements = useMemo(() => {
    // Solo calcular si el panel está expandido
    if (!isExpanded) return [];
    
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      category: achievement.category || 'especiales',
      difficulty: achievement.difficulty || 'medio',
      points: achievement.points || 10
    }));
  }, [isExpanded]);

  // Estadísticas generales - versión optimizada
  const achievementStats = useMemo(() => {
    if (!isExpanded) {
      // Versión rápida para vista colapsada
      return {
        totalAchievements: ACHIEVEMENTS.length,
        unlockedCount: unlockedAchievements.length,
        totalTimesEarned: 0,
        totalPointsFromAchievements: 0
      };
    }

    const totalAchievements = enhancedAchievements.length;
    const unlockedCount = unlockedAchievements.length;
    const totalTimesEarned = Object.values(userAchievementProgress).reduce((sum, progress) => sum + progress.timesEarned, 0);
    const totalPointsFromAchievements = unlockedAchievements.reduce((sum, id) => {
      const achievement = enhancedAchievements.find(a => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0);

    return { totalAchievements, unlockedCount, totalTimesEarned, totalPointsFromAchievements };
  }, [isExpanded, enhancedAchievements, unlockedAchievements, userAchievementProgress]);

  // Filtrar logros
  const filteredAchievements = useMemo(() => {
    return enhancedAchievements.filter(achievement => {
      if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && achievement.difficulty !== selectedDifficulty) return false;
      if (showOnlyUnlocked && !unlockedAchievements.includes(achievement.id)) return false;
      return true;
    });
  }, [enhancedAchievements, selectedCategory, selectedDifficulty, showOnlyUnlocked, unlockedAchievements]);

  // Agrupar por categoría
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<string, typeof enhancedAchievements> = {};
    filteredAchievements.forEach(achievement => {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = [];
      }
      grouped[achievement.category].push(achievement);
    });
    return grouped;
  }, [filteredAchievements]);

  const categories = Object.keys(CATEGORY_NAMES);
  const difficulties = ['facil', 'medio', 'dificil', 'extremo', 'legendario'];

  if (!isExpanded) {
    return (
      <div className="bg-[var(--card)]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between group hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Logros</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {achievementStats.unlockedCount}/{achievementStats.totalAchievements} desbloqueados
              </p>
            </div>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)]/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header con estadísticas */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Sistema de Logros</h3>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="w-8 h-8 rounded-lg bg-[var(--surface-2)]/60 hover:bg-red-500/20 flex items-center justify-center transition-colors"
          >
            <ChevronDownIcon className="w-4 h-4 text-[var(--text-secondary)] rotate-180" />
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-[var(--surface-1)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--text-primary)]">{achievementStats.unlockedCount}</div>
            <div className="text-xs text-[var(--text-secondary)]">Desbloqueados</div>
          </div>
          <div className="p-3 bg-[var(--surface-1)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--text-primary)]">{achievementStats.totalTimesEarned}</div>
            <div className="text-xs text-[var(--text-secondary)]">Veces Conseguidos</div>
          </div>
          <div className="p-3 bg-[var(--surface-1)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--text-primary)]">{achievementStats.totalPointsFromAchievements}</div>
            <div className="text-xs text-[var(--text-secondary)]">Puntos de Logros</div>
          </div>
          <div className="p-3 bg-[var(--surface-1)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {Math.round((achievementStats.unlockedCount / achievementStats.totalAchievements) * 100)}%
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Completado</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <FilterIcon className="w-4 h-4 text-[var(--text-secondary)]" />
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 text-xs bg-[var(--surface-2)] border border-white/10 rounded text-[var(--text-primary)]"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_NAMES[cat as keyof typeof CATEGORY_NAMES]}</option>
            ))}
          </select>

          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2 py-1 text-xs bg-[var(--surface-2)] border border-white/10 rounded text-[var(--text-primary)]"
          >
            <option value="all">Todas las dificultades</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
            ))}
          </select>

          <label className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <input 
              type="checkbox" 
              checked={showOnlyUnlocked} 
              onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              className="w-3 h-3"
            />
            Solo desbloqueados
          </label>
        </div>
      </div>

      {/* Lista de logros por categoría */}
      <div className="max-h-96 overflow-y-auto p-4">
        {Object.entries(achievementsByCategory).map(([category, achievements]) => (
          <div key={category} className="mb-6">
            <h4 className="text-md font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
              <span className="text-xs bg-[var(--surface-2)] px-2 py-1 rounded">
                {achievements.filter(a => unlockedAchievements.includes(a.id)).length}/{achievements.length}
              </span>
            </h4>
            
            <div className="grid gap-2">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const progress = userAchievementProgress[achievement.id];
                const difficultyStyle = DIFFICULTY_COLORS[achievement.difficulty];
                const IconComponent = achievement.icon;

                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                        : 'bg-[var(--surface-1)]/30 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isUnlocked ? 'bg-yellow-500/30' : 'bg-[var(--surface-2)]/50'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${isUnlocked ? 'text-yellow-400' : 'text-[var(--text-secondary)]'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className={`font-semibold ${isUnlocked ? 'text-yellow-200' : 'text-[var(--text-secondary)]'}`}>
                            {achievement.name}
                          </h5>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${difficultyStyle.bg} ${difficultyStyle.border} ${difficultyStyle.text}`}>
                            {achievement.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300">
                            {achievement.points} pts
                          </span>
                        </div>
                        
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          {achievement.description}
                        </p>
                        
                        {isUnlocked && progress && (
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 text-green-400" />
                              Conseguido {progress.timesEarned} {progress.timesEarned === 1 ? 'vez' : 'veces'}
                            </span>
                            <span className="text-[var(--text-secondary)]">
                              Primera vez: {new Date(progress.unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <TrophyIcon className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-2" />
            <p className="text-[var(--text-secondary)]">No hay logros que coincidan con los filtros</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default AchievementsPanel;