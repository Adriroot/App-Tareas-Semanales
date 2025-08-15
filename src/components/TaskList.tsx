// Archivo: src/components/TaskList.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React from 'react';
import { Task, UserProfile, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import TaskItem from './TaskItem';
import { EmptyTasksIcon } from './icons';

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
      <div className="text-center py-12 px-6 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
        <div className="w-16 h-16 mx-auto mb-4 bg-[var(--text-secondary)]/10 rounded-full flex items-center justify-center">
          <EmptyTasksIcon className="w-8 h-8 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          No hay tareas
        </h3>
        <p className="text-[var(--text-secondary)]">
          Añade una nueva tarea para empezar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)] text-center">
        {title}
      </h2>
      
      {DAYS_OF_WEEK.map((day) => {
        const dayTasks = tasksByDay[day] || [];
        if (dayTasks.length === 0) return null;

        return (
          <div key={day} className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] px-1">
              {day}
            </h3>
            <div className="space-y-2">
              {dayTasks.map((task) => (
                <TaskItem key={task.id} task={task} {...props} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;