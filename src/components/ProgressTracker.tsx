// Archivo: src/components/ProgressTracker.tsx - VERSIÓN FINAL Y COMPATIBLE

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { UserProfile, HistoryEntry, UserStats, Task } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { CheckCircleIcon, ShieldCheckIcon } from './icons';
import useAnimatedCounter from '../hooks/useAnimatedCounter';
import AchievementBadge from './AchievementBadge';
import EmptyState from './EmptyState';

interface ProgressTrackerProps {
  stats: Record<string, UserStats>;
  history: HistoryEntry[];
  users: UserProfile[];
  tasks: Task[];
  unlockedAchievements: string[];
}

const AnimatedCounter = ({ value }: { value: number }) => {
    const count = useAnimatedCounter(value, 1000);
    return <span>{count}</span>;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats, history, users, tasks, unlockedAchievements }) => {
  
  // 1. AHORA USAMOS EL COLOR DEL USUARIO DIRECTAMENTE
  const pieData = users.map(user => ({
    name: user.displayName,
    value: stats[user.uid]?.completedTasks || 0,
    fill: user.color || '#6b7280', // Usamos el color del perfil, con un gris por defecto
  })).filter(d => d.value > 0);
  
  const mostRecentCompletions = [...history].reverse().slice(0, 5);
  
  let mvp: UserProfile | null = null;
  let maxPoints = -1;
  let isTie = false;

  users.forEach(user => {
    const userPoints = stats[user.uid]?.points || 0;
    if (userPoints > maxPoints) {
      maxPoints = userPoints;
      mvp = user;
      isTie = false;
    } else if (userPoints === maxPoints && maxPoints > 0) {
      isTie = true;
      mvp = null; // En caso de empate, no hay un único MVP
    }
  });

  return (
    <div className="space-y-10">
      {/* Sección de puntos premium */}
      <div className="relative">
        {/* Efectos de fondo */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-violet-500/10 rounded-3xl blur-xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-40" />
        
        <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
          
          {/* Partículas ambientales */}
          <div className="absolute top-6 left-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" />
          <div className="absolute bottom-6 right-10 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Header mejorado */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-300/20">
              <ShieldCheckIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
              Ranking
              <span className="block text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Semanal
              </span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-medium">
              Compite por la
              <span className="text-yellow-400 font-bold"> corona de oro</span>
            </p>
          </div>
          
          {/* Grid de usuarios mejorado */}
          <div className={`grid grid-cols-1 sm:grid-cols-${users.length > 0 ? Math.min(users.length, 3) : 1} gap-6`}>
            {users.map((user, index) => {
              const userStats = stats[user.uid] || { points: 0, completedTasks: 0 };
              const isLeader = index === 0; // Asumiendo que están ordenados por puntos
              
              return (
                <div key={user.uid} className="relative group">
                  {/* Efectos de fondo para cada usuario */}
                  <div 
                    className="absolute -inset-2 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${user.color || '#6366F1'}30 0%, transparent 70%)` }}
                  />
                  
                  {/* Tarjeta de usuario */}
                  <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-center group-hover:scale-105 transition-all duration-300 shadow-xl">
                    {/* Corona para el líder */}
                    {isLeader && userStats.points > 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300 animate-bounce">
                          <span className="text-sm font-black text-white">👑</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Avatar mejorado */}
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-2xl group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${user.color || '#6366F1'}80, ${user.color || '#6366F1'}40)`,
                          boxShadow: `0 8px 32px ${user.color || '#6366F1'}30`
                        }}
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          user.displayName.charAt(0).toUpperCase()
                        )}
                        {/* Efecto interno */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                      </div>
                      
                      {/* Anillo de nivel */}
                      <div 
                        className="absolute -inset-1 rounded-2xl border-2 opacity-60 animate-rotate-slow"
                        style={{ borderColor: user.color || '#6366F1' }}
                      />
                    </div>
                    
                    {/* Puntos con animación */}
                    <div className="mb-4">
                      <p 
                        className="text-6xl font-black mb-2 drop-shadow-lg"
                        style={{ color: user.color || '#6366F1' }}
                      >
                        <AnimatedCounter value={userStats.points} />
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{user.displayName}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                          {userStats.completedTasks} tarea{userStats.completedTasks !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min((userStats.points / Math.max(...users.map(u => stats[u.uid]?.points || 0), 1)) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${user.color || '#6366F1'}80, ${user.color || '#6366F1'})`
                        }}
                      />
                    </div>
                    
                    {/* Badge de posición */}
                    <div className="absolute -bottom-2 -right-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white"
                        style={{ background: `linear-gradient(135deg, ${user.color || '#6366F1'}, ${user.color || '#6366F1'}80)` }}
                      >
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de distribución mejorado */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-60" />
          
          <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)]">Distribución</h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium">de Tareas</p>
              </div>
            </div>
            
            {history.length > 0 && pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={90} 
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      strokeWidth={3}
                      stroke="var(--surface-1)"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Leyenda personalizada */}
                <div className="mt-4 space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-1)]/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-sm font-bold text-[var(--text-primary)]">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: entry.fill }}>
                        {entry.value} tarea{entry.value !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-16">
                <EmptyState title="Sin Tareas Completadas" message="Completa tareas para ver las estadísticas." small />
              </div>
            )}
          </div>
        </div>

        {/* Sección MVP mejorada */}
        <div className="relative">
          {mvp ? (
            <>
              {/* Efectos de fondo para MVP */}
              <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400/30 via-orange-500/30 to-amber-600/30 rounded-3xl blur-2xl opacity-80 animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/40 to-amber-500/40 rounded-2xl blur-lg opacity-60" />
              
              <div className="relative p-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-600 rounded-2xl shadow-2xl text-white overflow-hidden">
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl" />
                
                {/* Partículas doradas */}
                <div className="absolute top-4 left-6 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" />
                <div className="absolute bottom-6 right-8 w-0.5 h-0.5 bg-orange-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-8 right-12 w-0.5 h-0.5 bg-amber-200 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                
                <div className="relative text-center">
                  {/* Corona animada */}
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-200 animate-bounce">
                        <span className="text-3xl">👑</span>
                      </div>
                      {/* Anillo exterior */}
                      <div className="absolute -inset-2 border-2 border-yellow-300/50 rounded-full animate-rotate-slow" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-2 drop-shadow-lg tracking-tight">
                    MVP
                    <span className="block text-2xl font-bold opacity-90">de la Semana</span>
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-5xl font-black mb-2 drop-shadow-xl">{mvp.displayName}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                      <span className="text-2xl">✨</span>
                      <span className="font-black text-xl">{stats[mvp.uid]?.points || 0} puntos</span>
                    </div>
                  </div>
                  
                  {/* Medallas decorativas */}
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-xs">🥇</div>
                    <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs">⭐</div>
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs">🏆</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-2xl blur-lg opacity-60" />
              
              <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500/20 to-slate-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl opacity-60">🏆</span>
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">
                    {isTie ? '¡Empate Perfecto!' : '¡La Batalla Comienza!'}
                  </h3>
                  <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                    {isTie 
                      ? 'La competición está tan reñida que no hay un claro ganador.' 
                      : 'Completa tareas para coronarte como el MVP de esta semana.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sección de logros premium */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-lg opacity-60" />
        
        <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Header de logros */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🏅</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)]">Logros</h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium">Desbloqueados</p>
              </div>
            </div>
            
            {/* Contador de logros */}
            <div className="text-right">
              <p className="text-3xl font-black text-purple-400">
                {unlockedAchievements.length}/{ACHIEVEMENTS.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">Completado</p>
            </div>
          </div>
          
          {/* Grid de logros */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map(ach => (
              <AchievementBadge key={ach.id} achievement={ach} isUnlocked={unlockedAchievements.includes(ach.id)} />
            ))}
          </div>
          
          {/* Barra de progreso de logros */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-[var(--text-secondary)]">Progreso General</span>
              <span className="text-sm font-bold text-purple-400">
                {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente premium */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-60" />
        
        <div className="relative p-8 bg-[var(--card)]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)]">Actividad</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Reciente</p>
            </div>
          </div>
          
          {/* Lista de actividades */}
          <div className="space-y-4">
            {mostRecentCompletions.length > 0 ? mostRecentCompletions.map((entry, index) => {
              const user = users.find(u => u.uid === entry.userId);
              return (
                <div 
                  key={entry.id} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Efecto de fondo */}
                  <div 
                    className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle, ${user?.color || '#6366F1'}20 0%, transparent 70%)` }}
                  />
                  
                  <div className="relative flex items-center gap-4 p-4 bg-[var(--surface-1)]/50 backdrop-blur-sm rounded-xl border border-white/5 group-hover:scale-102 transition-all duration-300">
                    {/* Avatar mini */}
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${user?.color || '#6366F1'}80, ${user?.color || '#6366F1'}40)` 
                        }}
                      >
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          user?.displayName?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      {/* Indicador de completado */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        <span style={{ color: user?.color || '#6366F1' }}>{user?.displayName || 'Desconocido'}</span>
                        <span className="text-[var(--text-secondary)] font-medium ml-1">completó</span>
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate font-medium mt-0.5">
                        "{entry.taskName}"
                      </p>
                    </div>
                    
                    {/* Puntos */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100/80 dark:bg-yellow-900/30 rounded-full">
                        <span className="text-xs">✨</span>
                        <span className="text-xs font-black text-yellow-600 dark:text-yellow-400">+{entry.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-12">
                <EmptyState title="Sin actividad reciente" message="Completa una tarea para empezar a llenar el historial." small />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;