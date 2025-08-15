// Archivo: src/components/MonthlyStats.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useMemo } from 'react';
import { HistoryEntry, UserProfile } from '../types';
import { CalendarDaysIcon, StarIcon, TrophyIcon } from './icons';

interface MonthlyStatsProps {
  history: HistoryEntry[];
  users: UserProfile[];
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ history, users }) => {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar historial del mes actual
    const thisMonthHistory = history.filter(entry => {
      const entryDate = new Date(entry.date as string);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    // Stats por usuario este mes
    const userStats: Record<string, { totalPoints: number; totalTasks: number; user: UserProfile }> = {};
    
    users.forEach(user => {
      userStats[user.uid] = { totalPoints: 0, totalTasks: 0, user };
    });
    
    thisMonthHistory.forEach(entry => {
      if (userStats[entry.userId]) {
        userStats[entry.userId].totalPoints += entry.points;
        userStats[entry.userId].totalTasks += 1;
      }
    });
    
    const sortedStats = Object.values(userStats).sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Stats por día del mes
    const dailyStats: Record<string, number> = {};
    thisMonthHistory.forEach(entry => {
      const day = new Date(entry.date as string).getDate().toString();
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });
    
    const topDays = Object.entries(dailyStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    return {
      thisMonthHistory,
      sortedStats,
      topDays,
      monthName: now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    };
  }, [history, users]);

  const totalPoints = monthlyData.sortedStats.reduce((sum, stat) => sum + stat.totalPoints, 0);
  
  if (monthlyData.thisMonthHistory.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
        <div className="w-16 h-16 mx-auto mb-4 bg-[var(--text-secondary)]/10 rounded-full flex items-center justify-center">
          <CalendarDaysIcon className="w-8 h-8 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Sin actividad este mes
        </h3>
        <p className="text-[var(--text-secondary)]">
          Completa tareas para ver las estadísticas mensuales
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen del mes */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 capitalize">
          Estadísticas de {monthlyData.monthName}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {monthlyData.thisMonthHistory.length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Tareas completadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--warning)]">{totalPoints}</div>
            <div className="text-sm text-[var(--text-secondary)]">Puntos obtenidos</div>
          </div>
        </div>
      </div>

      {/* Ranking mensual */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ranking del Mes</h3>
        
        <div className="space-y-3">
          {monthlyData.sortedStats.map((stat, index) => {
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

      {/* Días más productivos */}
      {monthlyData.topDays.length > 0 && (
        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Días Más Productivos</h3>
          
          <div className="space-y-3">
            {monthlyData.topDays.map(([day, count], index) => (
              <div key={day} className="flex items-center gap-3">
                <div className="text-lg font-bold text-[var(--text-secondary)] w-8">
                  {index + 1}.
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text-primary)]">
                    Día {day}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {count} {count === 1 ? 'tarea completada' : 'tareas completadas'}
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
      )}
    </div>
  );
};

export default MonthlyStats;