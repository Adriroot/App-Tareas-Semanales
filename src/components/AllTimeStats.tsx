// Archivo: src/components/AllTimeStats.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useMemo } from 'react';
import { HistoryEntry, UserProfile } from '../types';
import EmptyState from './EmptyState';
import { ChartBarIcon, TrophyIcon, SparklesIcon, TrendingUpIcon } from './icons';

interface AllTimeStatsProps {
  history: HistoryEntry[];
  users: UserProfile[];
}

const AllTimeStats: React.FC<AllTimeStatsProps> = ({ history, users }) => {
  const statsByTask = useMemo(() => {
    const aggregatedStats: Record<string, { originalName: string, counts: Record<string, number> }> = {};

    history.forEach(entry => {
      const normalizedName = entry.taskName.toLowerCase();
      if (!aggregatedStats[normalizedName]) {
        aggregatedStats[normalizedName] = { originalName: entry.taskName, counts: {} };
        users.forEach(user => { aggregatedStats[normalizedName].counts[user.uid] = 0; });
      }
      aggregatedStats[normalizedName].counts[entry.userId]++;
    });
    
    const finalStatsArray = Object.values(aggregatedStats).map(data => {
      return [data.originalName, data.counts] as [string, Record<string, number>];
    });

    return finalStatsArray.sort(([, a], [, b]) => {
      const sumA = Object.values(a).reduce((acc, val) => acc + val, 0);
      const sumB = Object.values(b).reduce((acc, val) => acc + val, 0);
      return sumB - sumA;
    });
  }, [history, users]);

  const totalTasks = history.length;
  const totalPoints = history.reduce((sum, entry) => sum + entry.points, 0);
  const avgPoints = totalTasks > 0 ? Math.round(totalPoints / totalTasks) : 0;

  if (history.length === 0) {
    return (
      <div className="relative">
        {/* Efectos de fondo para estado vacío */}
        <div className="absolute -inset-4 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-400/5 rounded-3xl blur-2xl opacity-60" />
        <div className="absolute -inset-2 bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-2xl blur-lg opacity-40" />
        
        <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          
          <EmptyState title="Sin Datos Históricos" message="Completa tareas para generar estadísticas históricas completas." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Efectos de fondo principales */}
      <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="absolute -inset-2 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-2xl blur-lg opacity-40" />
      
      <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
        <div className="absolute top-4 right-4 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl" />
        
        {/* Partículas */}
        <div className="absolute top-8 left-12 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse" />
        <div className="absolute bottom-12 right-16 w-0.5 h-0.5 bg-red-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Header premium mejorado */}
        <div className="text-center mb-12">
          {/* Icono principal con efectos */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-lg opacity-60" />
            
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl flex items-center justify-center border border-orange-300/20 shadow-2xl">
              <ChartBarIcon className="w-12 h-12 text-orange-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            </div>
            
            {/* Anillo orbital */}
            <div className="absolute -inset-6 border-2 border-orange-400/20 rounded-full animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
          </div>
          
          <h2 className="text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            Registro
            <span className="block text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mt-2">
              Histórico Global
            </span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
            Análisis completo del rendimiento y estadísticas de todas las tareas completadas
          </p>
          
          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-orange-400" />
            <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full animate-pulse" />
            <div className="w-20 h-0.5 bg-gradient-to-r from-red-400 to-transparent" />
          </div>
        </div>

        {/* Panel de estadísticas globales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Total tareas */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUpIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{totalTasks}</div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Tareas Totales</div>
            </div>
          </div>

          {/* Total puntos */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <SparklesIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{totalPoints}</div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Puntos Totales</div>
            </div>
          </div>

          {/* Promedio */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrophyIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{avgPoints}</div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Promedio/Tarea</div>
            </div>
          </div>
        </div>

        {/* Lista de tareas con efectos premium */}
        <div className="space-y-6">
          {statsByTask.map(([taskName, userCounts], index) => {
            const total = Object.values(userCounts).reduce((acc, val) => acc + val, 0);
            const topUser = users.reduce((top, user) => {
              const count = userCounts[user.uid] || 0;
              return count > (userCounts[top.uid] || 0) ? user : top;
            }, users[0]);
            
            return (
              <div 
                key={taskName} 
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efectos de fondo para cada tarea */}
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur-md opacity-40" />
                
                <div className="relative bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden group-hover:scale-102 transition-all duration-300">
                  {/* Efectos internos */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="absolute top-2 right-4 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl" />
                  
                  {/* Barra lateral premium con gradiente */}
                  <div 
                    className="absolute left-0 top-0 h-full w-2 rounded-l-3xl"
                    style={{ 
                      background: `linear-gradient(180deg, ${topUser?.color || '#F97316'}, ${topUser?.color || '#F97316'}80)`,
                      boxShadow: `0 0 20px ${topUser?.color || '#F97316'}40`
                    }}
                  />
                  
                  {/* Partículas por tarea */}
                  <div className="absolute top-4 left-6 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse" />
                  <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-red-400/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    {/* Información y barras de progreso */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Header de la tarea */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
                          <ChartBarIcon className="w-7 h-7 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{taskName}</h3>
                          <p className="text-sm text-[var(--text-secondary)] font-medium">
                            Completada {total} vece{total !== 1 ? 's' : ''} • Líder: {topUser?.displayName}
                          </p>
                        </div>
                      </div>

                      {/* Barras de progreso premium */}
                      <div className="space-y-5">
                        {users.map((user, userIndex) => {
                          const count = userCounts[user.uid] || 0;
                          const percentage = total > 0 ? (count / total) * 100 : 0;
                          const isTop = user.uid === topUser?.uid;
                          
                          return (
                            <div 
                              key={user.uid} 
                              className="relative group/user animate-fade-in"
                              style={{ animationDelay: `${userIndex * 100}ms` }}
                            >
                              {/* Efectos para el usuario líder */}
                              {isTop && count > 0 && (
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl blur-lg animate-pulse opacity-60" />
                              )}
                              
                              <div className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                                isTop && count > 0 
                                  ? 'border-yellow-400/40 bg-gradient-to-r from-yellow-500/10 to-amber-500/10' 
                                  : 'border-white/10 bg-[var(--card)]/40'
                              }`}>
                                {/* Header del usuario */}
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-3">
                                    {/* Avatar del usuario */}
                                    <div 
                                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                      style={{ backgroundColor: user.color || '#6b7280' }}
                                    >
                                      {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-2xl" />
                                      ) : (
                                        user.displayName.charAt(0).toUpperCase()
                                      )}
                                    </div>
                                    
                                    <div>
                                      <span className="font-bold text-[var(--text-primary)]">{user.displayName}</span>
                                      {isTop && count > 0 && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <TrophyIcon className="w-3 h-3 text-yellow-400" />
                                          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Líder</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Contador premium */}
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="px-3 py-1 rounded-xl font-black text-lg"
                                      style={{ 
                                        backgroundColor: `${user.color || '#6b7280'}20`,
                                        color: user.color || '#6b7280'
                                      }}
                                    >
                                      {count}
                                    </div>
                                    {percentage > 0 && (
                                      <div className="text-sm font-bold text-[var(--text-secondary)]">
                                        {percentage.toFixed(1)}%
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Barra de progreso premium */}
                                <div className="relative h-4 bg-[var(--surface-2)] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-1000 relative"
                                    style={{ 
                                      width: `${percentage}%`,
                                      background: `linear-gradient(90deg, ${user.color || '#6b7280'}80, ${user.color || '#6b7280'})`,
                                      boxShadow: `0 0 15px ${user.color || '#6b7280'}60`
                                    }}
                                  >
                                    {/* Efectos internos de la barra */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
                                    {percentage > 15 && (
                                      <div className="absolute top-0.5 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Panel lateral con estadísticas */}
                    <div className="lg:col-span-1 flex flex-col justify-center">
                      <div className="relative p-6 bg-[var(--card)]/60 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                        {/* Efectos internos */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                        
                        {/* Icono de total */}
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <SparklesIcon className="w-8 h-8 text-orange-400" />
                        </div>
                        
                        {/* Número total con efectos */}
                        <div className="relative">
                          <span className="text-6xl lg:text-7xl font-black text-[var(--text-primary)] drop-shadow-lg">{total}</span>
                          <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                        </div>
                        
                        <p className="text-sm uppercase tracking-widest text-[var(--text-secondary)] font-bold mt-2">
                          Completaciones
                        </p>
                        
                        {/* Línea decorativa */}
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-orange-400" />
                          <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                          <div className="w-6 h-0.5 bg-gradient-to-r from-orange-400 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllTimeStats;