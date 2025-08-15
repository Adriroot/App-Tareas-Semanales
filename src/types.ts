// Archivo: src/types.ts - VERSIÓN CORREGIDA

import React from 'react';
import { FieldValue } from 'firebase/firestore'; 

export enum DayOfWeek {
    Lunes = 'Lunes',
    Martes = 'Martes',
    Miércoles = 'Miércoles',
    Jueves = 'Jueves',
    Viernes = 'Viernes',
    Sábado = 'Sábado',
    Domingo = 'Domingo',
}

export interface UserProfile {
  uid: string;
  displayName: string;
  householdId: string;
  householdName?: string; // Nombre del hogar actual
  color?: string;
  photoURL?: string | null;
}

export interface Household {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  weekStartDate: string;
  unlockedAchievements: string[];
  memberCount?: number;
}

// Interfaz de un usuario asignado o que ha completado una tarea
type AssignedUser = { uid: string; displayName: string };

export interface Task {
  id: string;
  name: string;
  day: DayOfWeek;
  points: number;
  isCompleted: boolean;
  householdId: string;
  // --- ESTE ES EL CAMBIO MÁS IMPORTANTE ---
  assignedTo: AssignedUser | null; // Ahora es un objeto de usuario o null
  completedBy: AssignedUser | null;
}

export interface HistoryEntry {
  id: string;
  taskId: string;
  taskName: string;
  userId: string;
  userDisplayName: string;
  date: string | FieldValue;
  points: number;
  householdId: string;
}

export interface UserStats {
  points: number;
  completedTasks: number;
}

export interface ArchivedWeek {
    id: string;
    startDate: string;
    endDate: string;
    completedTasks: HistoryEntry[];
    stats: Record<string, UserStats>;
}

export interface TaskTemplate {
  id:string;
  name: string;
  scope: 'day' | 'week';
  day?: DayOfWeek;
  tasks: Omit<Task, 'id' | 'isCompleted' | 'completedBy' | 'householdId'>[];
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.FC<{className?: string}>;
    category?: string;
    difficulty?: 'facil' | 'medio' | 'dificil' | 'extremo' | 'legendario';
    points?: number;
    check: (
        stats: Record<string, UserStats>,
        history: HistoryEntry[],
        tasks: Task[],
        householdUsers: UserProfile[],
        currentUser: UserProfile
    ) => boolean;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error' | 'achievement';
}