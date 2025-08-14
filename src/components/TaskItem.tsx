// Archivo: src/components/TaskItem.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React from 'react';
import { Task, UserProfile } from '../types';
import { CheckIcon, TrashIcon, PencilIcon, StarIcon, UserIcon, SparklesIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string, points: number) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete, onEdit, currentUser, users }) => {
  // Encontramos el perfil completo del usuario que completó la tarea
  const completingUser = task.isCompleted ? users.find(u => u.uid === task.completedBy?.uid) : null;
  // Usamos su color, o el color de éxito por defecto si no se encuentra
  const userColor = completingUser?.color || '#22C55E';
  const assignedUser = task.assignedTo ? users.find(u => u.uid === task.assignedTo?.uid) : null;

  return (
    <div className="relative group">
      {/* Efectos de fondo */}
      {task.isCompleted ? (
        <div 
          className="absolute -inset-1 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"
          style={{ 
            background: `radial-gradient(circle at 30% 50%, ${userColor}20 0%, transparent 70%)`,
            animationDuration: '3s'
          }}
        />
      ) : (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
      )}
      
      <div 
        className={`relative flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-102 shadow-lg group-hover:shadow-xl ${
          task.isCompleted 
            ? 'bg-[var(--surface-1)]/80 border-white/10' 
            : 'bg-[var(--surface-1)]/90 hover:bg-[var(--surface-2)]/80 border-white/10'
        }`}
      >
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-2xl pointer-events-none" />
        {task.isCompleted && (
          <div 
            className="absolute top-2 right-4 w-16 h-16 rounded-full blur-2xl opacity-30"
            style={{ background: `linear-gradient(135deg, ${userColor}20, ${userColor}10)` }}
          />
        )}
        
        {/* Partículas */}
        {task.isCompleted && (
          <>
            <div 
              className="absolute top-2 left-4 w-1 h-1 rounded-full animate-pulse pointer-events-none"
              style={{ backgroundColor: `${userColor}60` }}
            />
            <div 
              className="absolute bottom-3 right-8 w-0.5 h-0.5 rounded-full animate-pulse pointer-events-none"
              style={{ backgroundColor: `${userColor}40`, animationDelay: '1s' }}
            />
          </>
        )}

        {/* Botón de Completar Premium */}
        <div className="relative">
          <button
            onClick={() => !task.isCompleted && currentUser && onComplete(task.id, task.points)}
            disabled={task.isCompleted}
            className="relative group/check"
          >
            {/* Efectos de fondo del botón */}
            {!task.isCompleted && (
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-lg opacity-0 group-hover/check:opacity-100 transition-opacity duration-300" />
            )}
            
            <div
              className={`relative w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                task.isCompleted
                  ? 'text-white cursor-default scale-110'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-green-400 hover:text-green-400 hover:scale-110 group-hover/check:shadow-green-400/30'
              }`}
              style={task.isCompleted ? { 
                backgroundColor: userColor, 
                borderColor: userColor,
                boxShadow: `0 8px 32px ${userColor}40`
              } : {}}
            >
              {/* Efectos internos del botón */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              
              <CheckIcon className={`w-6 h-6 transition-all duration-300 ${task.isCompleted ? 'animate-pulse' : 'group-hover/check:scale-110'}`} />
              
              {task.isCompleted && (
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
              )}
            </div>
            
            {/* Anillo exterior para botón completado */}
            {task.isCompleted && (
              <div 
                className="absolute -inset-1 border opacity-30 rounded-2xl animate-rotate-slow pointer-events-none"
                style={{ borderColor: userColor, borderStyle: 'dashed' }}
              />
            )}
          </button>
        </div>

        {/* Contenido de la Tarea Mejorado */}
        <div className="flex-grow space-y-2">
          <div className="flex items-start justify-between gap-3">
            <p className={`font-bold text-lg leading-tight transition-all duration-300 ${
              task.isCompleted 
                ? 'line-through text-[var(--text-secondary)] opacity-75' 
                : 'text-[var(--text-primary)] group-hover:text-[var(--text-primary)]'
            }`}>
              {task.name}
            </p>
            
            {task.isCompleted && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: `${userColor}20`, color: userColor }}>
                <SparklesIcon className="w-3 h-3" />
                Completado
              </div>
            )}
          </div>
          
          {/* Información de la tarea con badges premium */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Badge de puntos */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-400/30">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">{task.points}</span>
              <span className="text-xs font-bold text-yellow-300">pts</span>
            </div>
            
            {/* Badge de usuario asignado */}
            {task.assignedTo && assignedUser ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20" style={{ backgroundColor: `${assignedUser.color || '#3B82F6'}20` }}>
                <div 
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                  style={{ backgroundColor: assignedUser.color || '#3B82F6' }}
                >
                  {assignedUser.photoURL ? (
                    <img src={assignedUser.photoURL} alt={assignedUser.displayName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    assignedUser.displayName?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-bold text-[var(--text-primary)]">{task.assignedTo.displayName}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--surface-2)]/50 rounded-full border border-white/10">
                <UserIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Cualquiera</span>
              </div>
            )}
            
            {/* Badge de completado por */}
            {task.isCompleted && task.completedBy && completingUser && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2" style={{ 
                backgroundColor: `${userColor}20`,
                borderColor: `${userColor}40`
              }}>
                <div 
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  style={{ backgroundColor: userColor }}
                >
                  {completingUser.photoURL ? (
                    <img src={completingUser.photoURL} alt={completingUser.displayName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    completingUser.displayName?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-bold" style={{ color: userColor }}>
                  {task.completedBy.displayName}
                </span>
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: userColor }} />
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción Premium */}
        <div className="flex items-center gap-3">
          {/* Botón Editar */}
          <button
            onClick={() => onEdit(task)}
            disabled={task.isCompleted}
            className="group/edit relative overflow-hidden"
            aria-label="Editar tarea"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300" />
            
            <div className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 border border-white/10 shadow-lg ${
              task.isCompleted 
                ? 'bg-[var(--surface-2)]/50 opacity-50 cursor-not-allowed' 
                : 'bg-[var(--surface-2)]/80 backdrop-blur-sm hover:bg-blue-500 hover:scale-110 group-hover/edit:shadow-blue-400/30'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
              <PencilIcon className={`w-5 h-5 transition-all duration-300 ${
                task.isCompleted 
                  ? 'text-[var(--text-secondary)]' 
                  : 'text-[var(--text-secondary)] group-hover/edit:text-white group-hover/edit:scale-110'
              }`} />
              
              {/* Partícula de edición */}
              {!task.isCompleted && (
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-blue-400/60 rounded-full opacity-0 group-hover/edit:opacity-100 animate-pulse transition-opacity duration-300" />
              )}
            </div>
          </button>
          
          {/* Botón Eliminar */}
          <button
            onClick={() => onDelete(task.id)}
            className="group/delete relative overflow-hidden"
            aria-label="Eliminar tarea"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300" />
            
            <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 bg-[var(--surface-2)]/80 backdrop-blur-sm border border-white/10 hover:bg-red-500 hover:scale-110 group-hover/delete:shadow-red-400/30 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
              <TrashIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover/delete:text-white transition-all duration-300 group-hover/delete:scale-110" />
              
              {/* Partícula de advertencia */}
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-red-400/60 rounded-full opacity-0 group-hover/delete:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;