// Archivo: src/components/TaskList.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React from 'react';
import { Task, UserProfile, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import TaskItem from './TaskItem';
import { EmptyTasksIcon, CalendarDaysIcon } from './icons';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onComplete: (taskId: string, points: number) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks, ...props }) => {
  const tasksByDay = tasks.reduce((acc, task) => {
    (acc[task.day] = acc[task.day] || []).push(task);
    return acc;
  }, {} as Record<DayOfWeek, Task[]>);

  if (tasks.length === 0) {
    return (
      <div className="relative">
        {/* Efectos de fondo para estado vacío */}
        <div className="absolute -inset-4 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-400/5 rounded-3xl blur-2xl opacity-60" />
        <div className="absolute -inset-2 bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-2xl blur-lg opacity-40" />
        
        <div className="relative text-center py-20 px-8 bg-[var(--card)]/60 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-slate-500/10 to-slate-600/10 rounded-full blur-2xl" />
          
          {/* Partículas ambientales */}
          <div className="absolute top-8 left-12 w-1 h-1 bg-slate-400/40 rounded-full animate-pulse" />
          <div className="absolute bottom-12 right-16 w-0.5 h-0.5 bg-slate-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Icono mejorado */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute -inset-6 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            
            <div className="relative w-32 h-32 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-full flex items-center justify-center border border-slate-400/20 shadow-2xl">
              <EmptyTasksIcon className="w-16 h-16 text-slate-400 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            </div>
            
            {/* Anillo exterior */}
            <div className="absolute -inset-2 border-2 border-slate-400/20 rounded-full animate-rotate-slow" />
          </div>
          
          <div className="relative space-y-4">
            <h3 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
              Lista Vacía
            </h3>
            <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-md mx-auto">
              Añade una nueva tarea para empezar a 
              <span className="text-purple-300 font-semibold"> organizar la semana</span>
            </p>
            
            {/* Indicador decorativo */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-slate-400/50 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-slate-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-slate-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header mejorado */}
      <div className="relative text-center">
        {/* Efectos de fondo del título */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-violet-500/10 rounded-2xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-lg opacity-40" />
        
        <div className="relative py-6">
          {/* Icono decorativo */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-300/20">
            <CalendarDaysIcon className="w-8 h-8 text-purple-400" />
          </div>
          
          <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
            {title}
            <span className="block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-1">
              Organización Semanal
            </span>
          </h2>
          
          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
          </div>
        </div>
      </div>

      {/* Días de la semana con efectos premium */}
      {DAYS_OF_WEEK.map((day, dayIndex) => {
        const dayTasks = tasksByDay[day];
        if (!dayTasks || dayTasks.length === 0) return null;

        // Colores únicos para cada día
        const dayColors = {
          'Lunes': { primary: '#EF4444', secondary: '#DC2626', light: '#FEE2E2' },
          'Martes': { primary: '#F97316', secondary: '#EA580C', light: '#FED7AA' },
          'Miércoles': { primary: '#EAB308', secondary: '#CA8A04', light: '#FEF3C7' },
          'Jueves': { primary: '#22C55E', secondary: '#16A34A', light: '#D1FAE5' },
          'Viernes': { primary: '#3B82F6', secondary: '#2563EB', light: '#DBEAFE' },
          'Sábado': { primary: '#8B5CF6', secondary: '#7C3AED', light: '#EDE9FE' },
          'Domingo': { primary: '#EC4899', secondary: '#DB2777', light: '#FCE7F3' }
        };

        const dayColor = dayColors[day as keyof typeof dayColors] || dayColors.Lunes;

        return (
          <div key={day} className="relative group" style={{ animationDelay: `${dayIndex * 100}ms` }}>
            {/* Efectos de fondo para cada día */}
            <div 
              className="absolute -inset-3 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"
              style={{ 
                background: `radial-gradient(circle at 30% 50%, ${dayColor.primary}20 0%, transparent 70%)`,
                animationDuration: `${3 + dayIndex * 0.5}s`
              }}
            />
            <div 
              className="absolute -inset-1 rounded-2xl blur-lg opacity-20"
              style={{ background: `${dayColor.primary}30` }}
            />

            <div className="relative p-6 bg-[var(--card)]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl group-hover:scale-102 transition-all duration-300">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div 
                className="absolute top-4 right-4 w-20 h-20 rounded-full blur-2xl"
                style={{ background: `linear-gradient(135deg, ${dayColor.primary}10, ${dayColor.secondary}10)` }}
              />
              
              {/* Partículas del día */}
              <div 
                className="absolute top-6 left-8 w-1 h-1 rounded-full animate-pulse"
                style={{ backgroundColor: `${dayColor.primary}60` }}
              />
              <div 
                className="absolute bottom-6 right-10 w-0.5 h-0.5 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: `${dayColor.secondary}60`,
                  animationDelay: `${dayIndex * 0.5}s`
                }}
              />

              {/* Header del día mejorado */}
              <div className="relative flex items-center gap-4 mb-6">
                {/* Indicador del día */}
                <div className="relative">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-2xl group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${dayColor.primary}80, ${dayColor.secondary})`,
                      boxShadow: `0 8px 32px ${dayColor.primary}30`
                    }}
                  >
                    {day.charAt(0)}
                    {/* Efecto interno */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                  </div>
                  
                  {/* Anillo del día */}
                  <div 
                    className="absolute -inset-1 rounded-2xl border opacity-60 animate-rotate-slow"
                    style={{ borderColor: dayColor.primary }}
                  />
                </div>

                {/* Información del día */}
                <div className="flex-1">
                  <h3 
                    className="text-2xl font-black mb-1 tracking-tight drop-shadow-lg"
                    style={{ color: dayColor.primary }}
                  >
                    {day}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${dayColor.primary}20`,
                        color: dayColor.secondary,
                        border: `1px solid ${dayColor.primary}30`
                      }}
                    >
                      {dayTasks.length} tarea{dayTasks.length !== 1 ? 's' : ''}
                    </div>
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: dayColor.primary }}
                    />
                  </div>
                </div>

                {/* Puntos totales del día */}
                <div className="text-right">
                  <p 
                    className="text-2xl font-black drop-shadow-lg"
                    style={{ color: dayColor.primary }}
                  >
                    {dayTasks.reduce((sum, task) => sum + task.points, 0)}
                  </p>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Puntos
                  </p>
                </div>
              </div>

              {/* Lista de tareas con espaciado mejorado */}
              <div className="space-y-4">
                {dayTasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(dayIndex * 100) + (taskIndex * 50)}ms` }}
                  >
                    <TaskItem task={task} {...props} />
                  </div>
                ))}
              </div>
              
              {/* Barra de progreso del día */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-2">
                  <span>Progreso del día</span>
                  <span>{Math.round((dayTasks.filter(t => t.isCompleted).length / dayTasks.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(dayTasks.filter(t => t.isCompleted).length / dayTasks.length) * 100}%`,
                      background: `linear-gradient(90deg, ${dayColor.primary}80, ${dayColor.secondary})`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;