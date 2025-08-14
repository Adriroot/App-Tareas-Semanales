// Archivo: src/components/WeeklyArchive.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState, useMemo } from 'react';
import { ArchivedWeek, HistoryEntry, UserProfile, DayOfWeek, UserStats } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import EmptyState from './EmptyState';
import { CheckCircleIcon, ChevronDownIcon, CalendarDaysIcon, TrophyIcon, SparklesIcon } from './icons';

interface WeeklyArchiveProps {
  archivedWeeks: ArchivedWeek[];
  users: UserProfile[];
}

interface ArchivedWeekCardProps {
    week: ArchivedWeek;
    users: UserProfile[];
}

const USER_COLORS = [
  '#ec4899', // pink-500
  '#38bdf8',  // sky-400
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#ef4444', // red-500
];

const getUserColor = (userId: string, users: UserProfile[]) => {
  const user = users.find(u => u.uid === userId);
  return user?.color || USER_COLORS[users.findIndex(u => u.uid === userId) % USER_COLORS.length] || '#6b7280';
};

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${startDate.toLocaleDateString('es-ES', options)} - ${endDate.toLocaleDateString('es-ES', options)}`;
}

const ArchivedWeekCard: React.FC<ArchivedWeekCardProps> = ({ week, users }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const tasksByDay = useMemo(() => {
        const grouped: Record<string, HistoryEntry[]> = {};
        DAYS_OF_WEEK.forEach(day => {
            const tasksForDay = week.completedTasks.filter(t => {
                const taskDate = new Date(t.date);
                const dayName = taskDate.toLocaleDateString('es-ES', { weekday: 'long' });
                return dayName.charAt(0).toUpperCase() + dayName.slice(1) === day;
            });
            if (tasksForDay.length > 0) {
                grouped[day] = tasksForDay;
            }
        });
        return grouped;
    }, [week.completedTasks]);
    
    const totalPoints = Object.values(week.stats).reduce((sum: number, userStats: UserStats) => sum + userStats.points, 0);
    const topUser = Object.entries(week.stats).reduce((top, [userId, stats]) => 
        (stats as UserStats).points > (top.points || 0) ? { userId, points: (stats as UserStats).points } : top, 
        { userId: '', points: 0 }
    );

    return (
        <div className="relative group">
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-md opacity-40" />
            
            <div className="relative bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:scale-102">
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="absolute top-2 right-4 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
                
                {/* Partículas */}
                <div className="absolute top-4 left-6 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" />
                <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Header premium */}
                <button 
                    className="w-full p-6 text-left transition-all duration-300 hover:bg-white/5"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-grow space-y-4">
                            {/* Título con icono */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-purple-300/20">
                                    <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                                        Semana del {formatDateRange(week.startDate, week.endDate)}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">
                                        {Object.keys(tasksByDay).length} días activos • {week.completedTasks.length} tareas
                                    </p>
                                </div>
                            </div>
                            
                            {/* Usuarios con badges premium */}
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(week.stats).map(([userId, userStats]) => {
                                    const user = users.find(u => u.uid === userId);
                                    const userColor = getUserColor(userId, users);
                                    const isTopUser = userId === topUser.userId;
                                    
                                    return (
                                        <div key={userId} className="relative group/user">
                                            {/* Efectos de fondo para top user */}
                                            {isTopUser && (
                                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-xl blur-md animate-pulse" />
                                            )}
                                            
                                            <div 
                                                className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
                                                    isTopUser 
                                                        ? 'border-yellow-400/40 bg-gradient-to-r from-yellow-500/20 to-amber-500/20' 
                                                        : 'border-white/20'
                                                }`}
                                                style={{ backgroundColor: isTopUser ? undefined : `${userColor}15` }}
                                            >
                                                {/* Avatar mini */}
                                                <div 
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                                                    style={{ backgroundColor: userColor }}
                                                >
                                                    {user?.photoURL ? (
                                                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        user?.displayName?.charAt(0).toUpperCase() || '?'
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold" style={{ color: userColor }}>
                                                        {(userStats as UserStats).points}
                                                    </span>
                                                    <span className="text-xs font-bold text-yellow-400">pts</span>
                                                </div>
                                                
                                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                                    {user?.displayName || 'Usuario desconocido'}
                                                </span>
                                                
                                                {/* Corona para el top user */}
                                                {isTopUser && (
                                                    <TrophyIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Panel derecho mejorado */}
                        <div className="text-right space-y-2">
                            <div className="relative">
                                <div className="text-3xl font-black text-[var(--text-primary)]">{totalPoints}</div>
                                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Puntos Totales</div>
                                
                                {/* Efecto de brillo */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                            </div>
                            
                            {/* Indicador de expansión */}
                            <div className={`w-8 h-8 bg-[var(--surface-2)]/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ml-auto ${
                                isExpanded ? 'rotate-180' : 'group-hover:scale-110'
                            }`}>
                                <ChevronDownIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                        </div>
                    </div>
                </button>
                
                {/* Contenido expandible mejorado */}
                {isExpanded && (
                    <div className="relative border-t border-white/10 bg-[var(--surface-1)]/30 backdrop-blur-sm">
                        {/* Efectos internos del contenido expandido */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />
                        
                        <div className="p-6 space-y-6">
                            {Object.keys(tasksByDay).length > 0 ? Object.entries(tasksByDay).map(([day, tasks], dayIndex) => {
                                // Colores únicos para cada día (igual que TaskList)
                                const dayColors = {
                                    'Lunes': '#EF4444', 'Martes': '#F97316', 'Miércoles': '#EAB308',
                                    'Jueves': '#22C55E', 'Viernes': '#3B82F6', 'Sábado': '#8B5CF6', 'Domingo': '#EC4899'
                                };
                                const dayColor = dayColors[day as keyof typeof dayColors] || '#6B7280';
                                
                                return (
                                    <div key={day} className="relative group/day" style={{ animationDelay: `${dayIndex * 100}ms` }}>
                                        {/* Efectos de fondo para cada día */}
                                        <div 
                                            className="absolute -inset-2 rounded-2xl blur-lg opacity-20 group-hover/day:opacity-40 transition-opacity duration-300"
                                            style={{ background: `radial-gradient(circle, ${dayColor}20 0%, transparent 70%)` }}
                                        />
                                        
                                        <div className="relative p-4 bg-[var(--surface-2)]/50 backdrop-blur-sm rounded-2xl border border-white/10">
                                            {/* Header del día */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div 
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg"
                                                    style={{ backgroundColor: dayColor }}
                                                >
                                                    {day.charAt(0)}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                                                </div>
                                                <h4 className="text-lg font-black tracking-tight" style={{ color: dayColor }}>{day}</h4>
                                                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${dayColor}40, transparent)` }} />
                                                <span className="text-sm font-bold text-[var(--text-secondary)]">
                                                    {tasks.length} tarea{tasks.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            
                                            {/* Lista de tareas premium */}
                                            <div className="space-y-3">
                                                {(tasks as HistoryEntry[]).map((entry, taskIndex) => {
                                                    const user = users.find(u => u.uid === entry.userId);
                                                    const userColor = getUserColor(entry.userId, users);
                                                    
                                                    return (
                                                        <div 
                                                            key={entry.id} 
                                                            className="relative group/task animate-fade-in"
                                                            style={{ animationDelay: `${taskIndex * 50}ms` }}
                                                        >
                                                            <div className="flex items-center gap-4 p-3 bg-[var(--card)]/60 backdrop-blur-sm rounded-xl border border-white/10 group-hover/task:scale-102 transition-transform duration-200">
                                                                {/* Icono de completado */}
                                                                <div className="relative">
                                                                    <div 
                                                                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                                                                        style={{ backgroundColor: `${userColor}20`, border: `1px solid ${userColor}40` }}
                                                                    >
                                                                        <CheckCircleIcon className="w-4 h-4" style={{ color: userColor }} />
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Información de la tarea */}
                                                                <div className="flex-grow min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div 
                                                                            className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                                                                            style={{ backgroundColor: userColor }}
                                                                        >
                                                                            {user?.photoURL ? (
                                                                                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-lg" />
                                                                            ) : (
                                                                                user?.displayName?.charAt(0).toUpperCase() || '?'
                                                                            )}
                                                                        </div>
                                                                        <span className="text-sm font-bold" style={{ color: userColor }}>
                                                                            {user?.displayName || 'Usuario desconocido'}
                                                                        </span>
                                                                        <span className="text-sm text-[var(--text-secondary)]">completó</span>
                                                                    </div>
                                                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">"{entry.taskName}"</p>
                                                                </div>
                                                                
                                                                {/* Badge de puntos */}
                                                                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-400/30">
                                                                    <SparklesIcon className="w-3 h-3 text-yellow-400" />
                                                                    <span className="text-sm font-black text-yellow-400">+{entry.points}</span>
                                                                    <span className="text-xs font-bold text-yellow-300">pts</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="p-8 text-center">
                                    <EmptyState 
                                        title="Semana Silenciosa" 
                                        message="No se completaron tareas en esta semana."
                                        small 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const WeeklyArchive: React.FC<WeeklyArchiveProps> = ({ archivedWeeks, users }) => {
  if (archivedWeeks.length === 0) {
    return (
        <div className="relative">
            {/* Efectos de fondo para estado vacío */}
            <div className="absolute -inset-4 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-400/5 rounded-3xl blur-2xl opacity-60" />
            <div className="absolute -inset-2 bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-2xl blur-lg opacity-40" />
            
            <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
                
                <EmptyState 
                    title="El archivo está vacío" 
                    message="Cuando reinicies tu primera semana, aparecerá aquí un resumen de toda la actividad." 
                />
            </div>
        </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Efectos de fondo para el contenedor principal */}
      <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -inset-2 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-2xl blur-lg opacity-40" />
      
      <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        
        {/* Partículas ambientales */}
        <div className="absolute top-8 left-12 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" />
        <div className="absolute bottom-12 right-16 w-0.5 h-0.5 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Header premium */}
        <div className="relative text-center mb-10">
          {/* Icono principal */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-purple-300/20 shadow-2xl">
            <CalendarDaysIcon className="w-10 h-10 text-purple-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
          </div>
          
          <h2 className="text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            Archivo
            <span className="block text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
              Semanal
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 text-lg text-[var(--text-secondary)] font-medium">
            <span>{archivedWeeks.length} semana{archivedWeeks.length !== 1 ? 's' : ''} archivada{archivedWeeks.length !== 1 ? 's' : ''}</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Historial completo</span>
          </div>
          
          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-purple-400" />
            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full animate-pulse" />
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-transparent" />
          </div>
        </div>

        {/* Grid de semanas archivadas */}
        <div className="space-y-6">
          {archivedWeeks.map((week, index) => (
            <div 
              key={week.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ArchivedWeekCard week={week} users={users} />
            </div>
          ))}
        </div>
        
        {/* Footer estadístico */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="relative p-4 bg-[var(--surface-1)]/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-black text-[var(--text-primary)]">
                {archivedWeeks.reduce((total, week) => 
                  total + Object.values(week.stats).reduce((sum: number, userStats: UserStats) => sum + userStats.points, 0), 0
                )}
              </div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Puntos Totales</div>
            </div>
            
            <div className="relative p-4 bg-[var(--surface-1)]/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-black text-[var(--text-primary)]">
                {archivedWeeks.reduce((total, week) => total + week.completedTasks.length, 0)}
              </div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Tareas Completadas</div>
            </div>
            
            <div className="relative p-4 bg-[var(--surface-1)]/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-black text-[var(--text-primary)]">
                {Math.round(archivedWeeks.reduce((total, week) => 
                  total + Object.values(week.stats).reduce((sum: number, userStats: UserStats) => sum + userStats.points, 0), 0
                ) / archivedWeeks.length) || 0}
              </div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Promedio Semanal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyArchive;
