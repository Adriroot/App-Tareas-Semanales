// Archivo: src/components/TaskItem.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React from 'react';
import { Task, UserProfile } from '../types';
import { CheckIcon, TrashIcon, PencilIcon, StarIcon, UserIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string, points: number) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete, onEdit, currentUser, users }) => {
  const completingUser = task.isCompleted ? users.find(u => u.uid === task.completedBy?.uid) : null;
  const userColor = completingUser?.color || '#22C55E';
  const assignedUser = task.assignedTo ? users.find(u => u.uid === task.assignedTo?.uid) : null;

  const canComplete = !task.isCompleted && (!task.assignedTo || task.assignedTo.uid === currentUser?.uid);

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-xl border ${
        task.isCompleted 
          ? 'bg-[var(--success-bg)] border-[var(--success-border)]' 
          : 'bg-[var(--card)] border-[var(--border)]'
      }`}
    >
      {/* Botón de completar */}
      <button
        onClick={() => canComplete && onComplete(task.id, task.points)}
        disabled={!canComplete}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          task.isCompleted
            ? 'bg-[var(--success)] text-white'
            : canComplete
            ? 'bg-[var(--card)] border-2 border-[var(--border)] text-[var(--text-secondary)]'
            : 'bg-[var(--card)] border-2 border-[var(--border)] text-[var(--text-secondary)] opacity-50'
        }`}
      >
        {task.isCompleted && <CheckIcon className="w-4 h-4" />}
      </button>

      {/* Contenido de la tarea */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-medium truncate ${
            task.isCompleted ? 'text-[var(--success)] line-through' : 'text-[var(--text-primary)]'
          }`}>
            {task.name}
          </h3>
          
          {/* Puntos */}
          <div className="flex items-center gap-1 px-2 py-1 bg-[var(--warning)]/10 text-[var(--warning)] rounded-lg text-sm font-medium">
            <StarIcon className="w-3 h-3" />
            <span>{task.points}</span>
          </div>
        </div>

        {/* Usuario asignado */}
        {assignedUser && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <UserIcon className="w-3 h-3" />
            <span>{assignedUser.displayName}</span>
          </div>
        )}

        {/* Usuario que completó */}
        {task.isCompleted && completingUser && (
          <div className="flex items-center gap-1 text-xs text-[var(--success)] mt-1">
            <CheckIcon className="w-3 h-3" />
            <span>Completado por {completingUser.displayName}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] rounded-lg"
          aria-label="Editar tarea"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(task.id)}
          className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] rounded-lg"
          aria-label="Eliminar tarea"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;