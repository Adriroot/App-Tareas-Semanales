// Archivo: src/components/ProgressTracker.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useState, useMemo } from 'react';
import { UserProfile, HistoryEntry, UserStats, Task } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { CheckCircleIcon, TrophyIcon, StarIcon, ChevronDownIcon, ChevronRightIcon } from './icons';
import AchievementBadge from './AchievementBadge';

interface ProgressTrackerProps {
  stats: Record<string, UserStats>;
  history: HistoryEntry[];
  users: UserProfile[];
  tasks: Task[];
  unlockedAchievements: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats, history, users, tasks, unlockedAchievements }) => {
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debug: ver qué datos llegan
  console.log('ProgressTracker Debug:', {
    statsKeys: Object.keys(stats),
    statsValues: stats,
    historyLength: history.length,
    usersLength: users.length,
    tasksLength: tasks.length,
    unlockedAchievementsLength: unlockedAchievements.length
  });
  
  // Optimización: categorías únicas y filtrado inteligente
  const achievementCategories = useMemo(() => {
    const categories = new Set(['all']);
    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.category) {
        categories.add(achievement.category);
      }
    });
    return Array.from(categories);
  }, []);
  
  // Filtrado optimizado de logros
  const filteredAchievements = useMemo(() => {
    let filtered = ACHIEVEMENTS;
    
    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchTerm]);
  
  // Separar logros desbloqueados y por desbloquear
  const { unlockedFiltered, lockedFiltered } = useMemo(() => {
    const unlocked = filteredAchievements.filter(a => unlockedAchievements.includes(a.id));
    const locked = filteredAchievements.filter(a => !unlockedAchievements.includes(a.id));
    return { unlockedFiltered: unlocked, lockedFiltered: locked };
  }, [filteredAchievements, unlockedAchievements]);
  
  // Stats básicas sin animaciones
  const totalTasks = Object.values(stats).reduce((sum, s) => sum + s.completedTasks, 0);
  const totalPoints = Object.values(stats).reduce((sum, s) => sum + s.points, 0);
  
  // MVP simple
  let mvp: UserProfile | null = null;
  let maxPoints = -1;
  
  users.forEach(user => {
    const userPoints = stats[user.uid]?.points || 0;
    if (userPoints > maxPoints) {
      maxPoints = userPoints;
      mvp = user;
    }
  });

  // Últimas tareas completadas (solo 3 para no sobrecargar)
  const recentCompletions = [...history].reverse().slice(0, 3);
  
  // Verificar si hay datos para mostrar
  const hasData = totalTasks > 0 || users.length > 0 || tasks.length > 0;
  
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 px-6 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--text-secondary)]/10 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            ¡Empecemos!
          </h3>
          <p className="text-[var(--text-secondary)]">
            Crea algunas tareas y complétalas para ver estadísticas aquí
          </p>
        </div>

        {/* Mostrar logros aunque no haya estadísticas */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Logros</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  0/{ACHIEVEMENTS.length} desbloqueados
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Completa tareas para desbloquear tus primeros logros
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen global */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Resumen Semanal</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">{totalTasks}</div>
            <div className="text-sm text-[var(--text-secondary)]">Tareas completadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--warning)]">{totalPoints}</div>
            <div className="text-sm text-[var(--text-secondary)]">Puntos totales</div>
          </div>
        </div>

        {/* MVP */}
        {mvp && (
          <div className="flex items-center gap-3 p-3 bg-[var(--success-bg)] rounded-xl border border-[var(--success-border)]">
            <div className="w-8 h-8 bg-[var(--success)] rounded-full flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-[var(--success)]">MVP de la semana</div>
              <div className="text-sm text-[var(--text-primary)]">
                {mvp.displayName} - {stats[mvp.uid]?.points || 0} puntos
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ranking simple */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ranking</h3>
        
        <div className="space-y-3">
          {users
            .sort((a, b) => (stats[b.uid]?.points || 0) - (stats[a.uid]?.points || 0))
            .map((user, index) => {
              const userStats = stats[user.uid] || { points: 0, completedTasks: 0 };
              const percentage = totalPoints > 0 ? Math.round((userStats.points / totalPoints) * 100) : 0;
              
              return (
                <div key={user.uid} className="flex items-center gap-3">
                  <div className="text-lg font-bold text-[var(--text-secondary)] w-8">
                    #{index + 1}
                  </div>
                  
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: user.color || '#6B7280' }}
                  >
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--text-primary)] truncate">
                      {user.displayName}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {userStats.completedTasks} tareas • {userStats.points} pts ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Actividad reciente */}
      {recentCompletions.length > 0 && (
        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Actividad Reciente</h3>
          
          <div className="space-y-3">
            {recentCompletions.map((completion) => {
              const user = users.find(u => u.uid === completion.userId);
              return (
                <div key={completion.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[var(--success)] rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {completion.taskName}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {user?.displayName} • +{completion.points} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logros mejorados con filtros */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-6">
          <button
            onClick={() => setShowAllAchievements(!showAllAchievements)}
            className="w-full flex items-center justify-between hover:bg-[var(--surface-1)]/50 rounded-lg p-3 -m-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Logros</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {unlockedAchievements.length}/{ACHIEVEMENTS.length} desbloqueados
                </p>
              </div>
            </div>
            {showAllAchievements ? (
              <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
            )}
          </button>

          {/* Vista previa de logros (siempre visible) */}
          {!showAllAchievements && unlockedAchievements.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-2">
              {unlockedFiltered
                .slice(0, 2) // Solo mostrar 2 en vista previa
                .map(achievement => (
                  <AchievementBadge 
                    key={achievement.id} 
                    achievement={achievement} 
                    isUnlocked={true}
                  />
                ))}
              {unlockedAchievements.length > 2 && (
                <div className="text-center py-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    +{unlockedAchievements.length - 2} logros más
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel expandido con controles y filtros */}
        {showAllAchievements && (
          <div className="border-t border-[var(--border)] p-6 bg-[var(--surface-1)]/30">
            {/* Controles de filtrado */}
            <div className="mb-6 space-y-4">
              {/* Barra de búsqueda */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar logros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              
              {/* Filtro de categorías */}
              <div className="flex flex-wrap gap-2">
                {achievementCategories.map(category => {
                  const isSelected = selectedCategory === category;
                  const categoryName = category === 'all' ? 'Todos' : 
                    category.charAt(0).toUpperCase() + category.slice(1);
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10'
                      }`}
                    >
                      {categoryName}
                    </button>
                  );
                })}
              </div>
              
              {/* Contador de resultados */}
              <div className="text-sm text-[var(--text-secondary)]">
                Mostrando {filteredAchievements.length} de {ACHIEVEMENTS.length} logros
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {/* Logros desbloqueados filtrados */}
              {unlockedFiltered.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[var(--success)] mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Desbloqueados ({unlockedFiltered.length})
                  </h4>
                  <div className="space-y-2">
                    {unlockedFiltered.map(achievement => (
                      <AchievementBadge 
                        key={achievement.id} 
                        achievement={achievement} 
                        isUnlocked={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Logros por desbloquear filtrados */}
              {lockedFiltered.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4" />
                    Por Desbloquear ({lockedFiltered.length})
                  </h4>
                  <div className="space-y-2">
                    {lockedFiltered
                      .slice(0, 10) // Limitar para rendimiento
                      .map(achievement => (
                        <AchievementBadge 
                          key={achievement.id} 
                          achievement={achievement} 
                          isUnlocked={false}
                        />
                      ))}
                    {lockedFiltered.length > 10 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-[var(--text-secondary)]">
                          +{lockedFiltered.length - 10} logros más por descubrir
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Sin resultados */}
              {filteredAchievements.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[var(--text-secondary)]">
                    No se encontraron logros que coincidan con tu búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;