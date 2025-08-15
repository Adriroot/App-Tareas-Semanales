// Archivo: src/components/TaskSuggestions.tsx - SUGERIDOR MINIMALISTA

import React from 'react';
import { Task, UserProfile, HistoryEntry, DayOfWeek } from '../types';
import { LightBulbIcon, ClockIcon, FireIcon } from './icons';

interface TaskSuggestionsProps {
  tasks: Task[];
  users: UserProfile[];
  history: HistoryEntry[];
  currentUser: UserProfile;
  onTaskSelect?: (taskId: string) => void;
}

interface TaskSuggestion {
  task: Task;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  daysSince: number;
}

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ 
  tasks, 
  users, 
  history, 
  currentUser,
  onTaskSelect 
}) => {
  
  // Lógica pura para generar sugerencias
  const generateSuggestions = (): TaskSuggestion[] => {
    const today = new Date();
    const currentDay = getDayOfWeek();
    
    const suggestions: TaskSuggestion[] = [];
    
    tasks.forEach(task => {
      // Solo tareas no completadas del día actual o sin día específico
      if (task.isCompleted) return;
      if (task.day !== currentDay && task.day !== null) return;
      
      // Calcular días desde última vez completada
      const lastCompletion = history
        .filter(h => h.taskId === task.id)
        .sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime())[0];
      
      const daysSince = lastCompletion 
        ? Math.floor((today.getTime() - new Date(lastCompletion.date as string).getTime()) / (1000 * 60 * 60 * 24))
        : 999; // Nunca se ha hecho
      
      // Determinar prioridad y razón
      let priority: 'high' | 'medium' | 'low' = 'low';
      let reason = '';
      
      if (daysSince > 7) {
        priority = 'high';
        reason = `Hace ${daysSince} días que no se hace`;
      } else if (daysSince > 3) {
        priority = 'medium';
        reason = `Pendiente desde hace ${daysSince} días`;
      } else if (!task.assignedTo || task.assignedTo.uid === currentUser.uid) {
        priority = 'low';
        reason = daysSince === 999 ? 'Nueva tarea por hacer' : 'Tu turno';
      } else {
        return; // Skip si no es su turno
      }
      
      suggestions.push({ task, reason, priority, daysSince });
    });
    
    // Ordenar por prioridad y días
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.daysSince - a.daysSince;
      })
      .slice(0, 3); // Máximo 3 sugerencias
  };
  
  const getDayOfWeek = (): DayOfWeek => {
    const dayIndex = new Date().getDay();
    const weekDays = [
      DayOfWeek.Domingo, DayOfWeek.Lunes, DayOfWeek.Martes, 
      DayOfWeek.Miércoles, DayOfWeek.Jueves, DayOfWeek.Viernes, DayOfWeek.Sábado
    ];
    return weekDays[dayIndex];
  };
  
  const suggestions = generateSuggestions();
  
  if (suggestions.length === 0) {
    return null; // No mostrar nada si no hay sugerencias
  }
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/20 bg-red-500/5 text-red-600';
      case 'medium':
        return 'border-yellow-500/20 bg-yellow-500/5 text-yellow-600';
      default:
        return 'border-blue-500/20 bg-blue-500/5 text-blue-600';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <FireIcon className="w-4 h-4" />;
      case 'medium':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <LightBulbIcon className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="relative bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm overflow-hidden">
      {/* Gradiente sutil de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center shadow-sm">
            <LightBulbIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Sugerencias Inteligentes</h3>
            <p className="text-xs text-[var(--text-secondary)]">Basado en tu actividad</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.task.id}
              onClick={() => onTaskSelect?.(suggestion.task.id)}
              className={`group w-full p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-left relative overflow-hidden ${getPriorityStyle(suggestion.priority)}`}
            >
              {/* Efecto hover sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              <div className="relative flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {getPriorityIcon(suggestion.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-base">
                    {suggestion.task.name}
                  </div>
                  <div className="text-sm opacity-90 mt-1 flex items-center gap-2">
                    <span>{suggestion.reason}</span>
                    <span className="w-1 h-1 bg-current rounded-full opacity-50" />
                    <span className="font-medium">{suggestion.task.points} pts</span>
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[var(--border)]/50">
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            <span>Actualizado en tiempo real</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSuggestions;