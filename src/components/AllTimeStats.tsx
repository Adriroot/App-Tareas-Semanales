// Archivo: src/components/AllTimeStats.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useMemo } from 'react';
import { HistoryEntry, UserProfile } from '../types';
import { TrophyIcon, StarIcon } from './icons';

interface AllTimeStatsProps {
  history: HistoryEntry[];
  users: UserProfile[];
}

const AllTimeStats: React.FC<AllTimeStatsProps> = ({ history, users }) => {
  const allTimeStats = useMemo(() => {
    const userStats: Record<string, { totalPoints: number; totalTasks: number; user: UserProfile }> = {};
    
    users.forEach(user => {
      userStats[user.uid] = { totalPoints: 0, totalTasks: 0, user };
    });
    
    history.forEach(entry => {
      if (userStats[entry.userId]) {
        userStats[entry.userId].totalPoints += entry.points;
        userStats[entry.userId].totalTasks += 1;
      }
    });
    
    return Object.values(userStats).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [history, users]);

  const topTasks = useMemo(() => {
    const taskCounts: Record<string, number> = {};
    
    history.forEach(entry => {
      taskCounts[entry.taskName] = (taskCounts[entry.taskName] || 0) + 1;
    });
    
    return Object.entries(taskCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
        <div className="w-16 h-16 mx-auto mb-4 bg-[var(--text-secondary)]/10 rounded-full flex items-center justify-center">
          <TrophyIcon className="w-8 h-8 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Sin historial
        </h3>
        <p className="text-[var(--text-secondary)]">
          Las estadísticas aparecerán aquí una vez que completes tareas
        </p>
      </div>
    );
  }

  const totalPoints = allTimeStats.reduce((sum, stat) => sum + stat.totalPoints, 0);

  return (
    <div className="space-y-6">
      {/* Resumen total */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Estadísticas Históricas</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">{history.length}</div>
            <div className="text-sm text-[var(--text-secondary)]">Tareas completadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--warning)]">{totalPoints}</div>
            <div className="text-sm text-[var(--text-secondary)]">Puntos obtenidos</div>
          </div>
        </div>
      </div>

      {/* Ranking histórico */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ranking Histórico</h3>
        
        <div className="space-y-3">
          {allTimeStats.map((stat, index) => {
            const percentage = totalPoints > 0 ? Math.round((stat.totalPoints / totalPoints) * 100) : 0;
            
            return (
              <div key={stat.user.uid} className="flex items-center gap-3">
                <div className="text-lg font-bold text-[var(--text-secondary)] w-8">
                  #{index + 1}
                </div>
                
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: stat.user.color || '#6B7280' }}
                >
                  {stat.user.displayName.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text-primary)] truncate">
                    {stat.user.displayName}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {stat.totalTasks} tareas • {stat.totalPoints} pts ({percentage}%)
                  </div>
                </div>

                {index === 0 && stat.totalPoints > 0 && (
                  <TrophyIcon className="w-5 h-5 text-[var(--warning)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tareas más populares */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Tareas Más Realizadas</h3>
        
        <div className="space-y-3">
          {topTasks.map(([taskName, count], index) => (
            <div key={taskName} className="flex items-center gap-3">
              <div className="text-lg font-bold text-[var(--text-secondary)] w-8">
                {index + 1}.
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[var(--text-primary)] truncate">
                  {taskName}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Completada {count} {count === 1 ? 'vez' : 'veces'}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[var(--warning)]">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTimeStats;