// Archivo: src/components/MonthlyStats.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState, useMemo } from 'react';
import { HistoryEntry, UserProfile } from '../types';
import EmptyState from './EmptyState';
import { ChevronDownIcon, CalendarIcon, TrendingUpIcon, CheckCircleIcon, SparklesIcon } from './icons';

interface MonthlyStatsProps {
  history: HistoryEntry[];
  users: UserProfile[];
}

// ESTA FUNCIÓN AHORA DEVUELVE UN VALOR, SOLUCIONANDO EL ERROR
const getMonthYearOptions = (history: HistoryEntry[]) => {
  if (history.length === 0) return { months: [], years: [] };
  const dates = history.map(h => new Date(h.date));
  const months = new Set<number>();
  const years = new Set<number>();
  dates.forEach(d => {
    months.add(d.getMonth());
    years.add(d.getFullYear());
  });
  return {
    months: Array.from(months).sort((a, b) => a - b),
    years: Array.from(years).sort((a, b) => b - a),
  };
};

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ history, users }) => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const { months, years } = getMonthYearOptions(history);

  const monthlyHistory = useMemo(() => {
    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
    });
  }, [history, selectedMonth, selectedYear]);

  const statsByTask = useMemo(() => {
    const aggregatedStats: Record<string, { originalName: string; counts: Record<string, number>; instances: HistoryEntry[] }> = {};
    monthlyHistory.forEach(entry => {
      const normalizedName = entry.taskName.toLowerCase();
      if (!aggregatedStats[normalizedName]) {
        aggregatedStats[normalizedName] = { originalName: entry.taskName, counts: {}, instances: [] };
        users.forEach(user => { aggregatedStats[normalizedName].counts[user.uid] = 0; });
      }
      aggregatedStats[normalizedName].counts[entry.userId]++;
      aggregatedStats[normalizedName].instances.push(entry);
    });
    
    const finalStatsArray = Object.values(aggregatedStats).map(data => {
        return [data.originalName, { counts: data.counts, instances: data.instances }] as [string, { counts: Record<string, number>, instances: HistoryEntry[] }];
    });

    return finalStatsArray.sort(([, a], [, b]) => b.instances.length - a.instances.length);
  }, [monthlyHistory, users]);
  
  const totalPoints = monthlyHistory.reduce((sum, entry) => sum + entry.points, 0);
  const totalTasks = monthlyHistory.length;
  const topUser = users.reduce((top, user) => {
    const userPoints = monthlyHistory.filter(h => h.userId === user.uid).reduce((sum, h) => sum + h.points, 0);
    return userPoints > (top.points || 0) ? { user, points: userPoints } : top;
  }, { user: null as UserProfile | null, points: 0 });

  return (
    <div className="relative space-y-8">
      {/* Efectos de fondo principales */}
      <div className="absolute -inset-4 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -inset-2 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-2xl blur-lg opacity-40" />
      
      <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Partículas */}
        <div className="absolute top-8 left-12 w-1 h-1 bg-green-400/40 rounded-full animate-pulse" />
        <div className="absolute bottom-12 right-16 w-0.5 h-0.5 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Header premium mejorado */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
          <div className="flex items-center gap-6">
            {/* Icono principal */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center border border-green-300/20 shadow-2xl">
                <CalendarIcon className="w-10 h-10 text-green-400" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
              </div>
              {/* Anillo orbital */}
              <div className="absolute -inset-2 border-2 border-green-400/20 rounded-3xl animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
            </div>
            
            <div>
              <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                Registro
                <span className="block text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Mensual
                </span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] font-medium">
                Análisis detallado del rendimiento mensual
              </p>
            </div>
          </div>

          {/* Selectores premium */}
          <div className="flex gap-4">
            {/* Selector de mes */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                  className="appearance-none cursor-pointer px-4 py-3 pr-12 rounded-2xl bg-[var(--surface-1)]/80 backdrop-blur-sm border border-white/10 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-500 font-bold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {months.length > 0 ? months.map(m => (
                    <option key={m} value={m}>{monthNames[m]}</option>
                  )) : (
                    <option>{monthNames[currentDate.getMonth()]}</option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                {/* Efecto interno */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
              </div>
            </div>
            
            {/* Selector de año */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))} 
                  className="appearance-none cursor-pointer px-4 py-3 pr-12 rounded-2xl bg-[var(--surface-1)]/80 backdrop-blur-sm border border-white/10 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {years.length > 0 ? years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  )) : (
                    <option>{currentDate.getFullYear()}</option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Panel de estadísticas rápidas */}
        {statsByTask.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Total de puntos */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUpIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{totalPoints}</div>
                <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Puntos Totales</div>
              </div>
            </div>

            {/* Total de tareas */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{totalTasks}</div>
                <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Tareas Completadas</div>
              </div>
            </div>

            {/* Top user */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                {topUser.user ? (
                  <>
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-bold shadow-lg"
                      style={{ backgroundColor: topUser.user.color || '#8B5CF6' }}
                    >
                      {topUser.user.photoURL ? (
                        <img src={topUser.user.photoURL} alt={topUser.user.displayName} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        topUser.user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="text-lg font-black text-[var(--text-primary)] mb-1">{topUser.user.displayName}</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Top del Mes</div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👑</span>
                    </div>
                    <div className="text-lg font-black text-[var(--text-primary)] mb-1">Sin MVP</div>
                    <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Este mes</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {statsByTask.length === 0 ? (
          <EmptyState 
            title={`Sin actividad en ${monthNames[selectedMonth]} ${selectedYear}`} 
            message="No se completaron tareas en este período." 
          />
        ) : (
          <div className="space-y-6">
            {statsByTask.map(([taskName, { counts, instances }], index) => (
              <div 
                key={taskName} 
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efectos de fondo para cada tarea */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-md opacity-40" />
                
                <div className="relative bg-[var(--surface-1)]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg group-hover:scale-102 transition-all duration-300">
                  {/* Efectos internos */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                  
                  <div 
                    className="cursor-pointer" 
                    onClick={() => setExpandedTask(expandedTask === taskName ? null : taskName)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{taskName}</h3>
                          <p className="text-sm text-[var(--text-secondary)] font-medium">
                            {instances.length} vece{instances.length !== 1 ? 's' : ''} completada{instances.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Badge de frecuencia */}
                        <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30">
                          <SparklesIcon className="w-4 h-4 text-green-400" />
                          <span className="text-lg font-black text-green-400">{instances.length}</span>
                        </div>
                        
                        {/* Indicador de expansión */}
                        <div className={`w-10 h-10 bg-[var(--surface-2)]/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                          expandedTask === taskName ? 'rotate-180 bg-green-500/20' : 'group-hover:scale-110'
                        }`}>
                          <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Usuarios participantes con badges premium */}
                    <div className="flex flex-wrap gap-3">
                      {users.map(user => counts[user.uid] > 0 && (
                        <div key={user.uid} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20" style={{ backgroundColor: `${user.color || '#6B7280'}15` }}>
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                            style={{ backgroundColor: user.color || '#6B7280' }}
                          >
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              user.displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="text-sm font-bold text-[var(--text-primary)]">{user.displayName}</span>
                          <span className="text-sm font-bold" style={{ color: user.color || '#6B7280' }}>
                            {counts[user.uid]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Contenido expandible mejorado */}
                  {expandedTask === taskName && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {instances.map((instance, instanceIndex) => {
                          const user = users.find(u => u.uid === instance.userId);
                          return (
                            <div 
                              key={instance.id} 
                              className="flex items-center justify-between p-4 bg-[var(--card)]/60 backdrop-blur-sm rounded-xl border border-white/10 animate-fade-in"
                              style={{ animationDelay: `${instanceIndex * 50}ms` }}
                            >
                              <div className="flex items-center gap-4">
                                {/* Avatar del usuario */}
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg"
                                  style={{ backgroundColor: user?.color || '#6B7280' }}
                                >
                                  {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    user?.displayName?.charAt(0).toUpperCase() || '?'
                                  )}
                                </div>
                                
                                <div>
                                  <span className="font-bold text-[var(--text-primary)]" style={{ color: user?.color || '#6B7280' }}>
                                    {instance.userDisplayName}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-400/30">
                                      <SparklesIcon className="w-3 h-3 text-yellow-400" />
                                      <span className="text-xs font-bold text-yellow-400">+{instance.points}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Fecha premium */}
                              <div className="text-right">
                                <div className="text-sm font-bold text-[var(--text-primary)]">
                                  {new Date(instance.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] font-medium">
                                  {new Date(instance.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MonthlyStats;