// Archivo: src/utils/powerUps.ts - POWER-UPS SUTILES

import { HistoryEntry, Task } from '../types';

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  emoji: string;
  type: 'streak' | 'combo' | 'daily';
}

export interface ActivePowerUp {
  powerUp: PowerUp;
  isActive: boolean;
  progress?: number;
  maxProgress?: number;
}

// Definición de power-ups disponibles
export const POWER_UPS: PowerUp[] = [
  {
    id: 'streak',
    name: 'Racha',
    description: '+50% puntos por completar 3 tareas seguidas',
    multiplier: 1.5,
    emoji: '🔥',
    type: 'streak'
  },
  {
    id: 'combo',
    name: 'Combo',
    description: '+25% puntos por tareas relacionadas',
    multiplier: 1.25,
    emoji: '🎯',
    type: 'combo'
  },
  {
    id: 'daily',
    name: 'Madrugador',
    description: 'Primera tarea del día vale doble',
    multiplier: 2.0,
    emoji: '⭐',
    type: 'daily'
  }
];

// Verificar si una tarea puede activar un power-up
export const checkPowerUps = (
  taskToComplete: Task,
  recentHistory: HistoryEntry[],
  allTasks: Task[],
  userId: string
): ActivePowerUp[] => {
  const activePowerUps: ActivePowerUp[] = [];
  const today = new Date().toDateString();
  
  // Power-up de Racha (3 tareas en las últimas 2 horas)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const recentUserTasks = recentHistory.filter(h => 
    h.userId === userId && 
    typeof h.date === 'string' && 
    new Date(h.date) > twoHoursAgo
  );
  
  if (recentUserTasks.length >= 2) {
    const streakPowerUp = POWER_UPS.find(p => p.id === 'streak')!;
    activePowerUps.push({
      powerUp: streakPowerUp,
      isActive: true,
      progress: recentUserTasks.length,
      maxProgress: 3
    });
  }
  
  // Power-up de Combo (tareas relacionadas)
  const lastTask = recentUserTasks[recentUserTasks.length - 1];
  if (lastTask && isRelatedTask(taskToComplete, lastTask, allTasks)) {
    const comboPowerUp = POWER_UPS.find(p => p.id === 'combo')!;
    activePowerUps.push({
      powerUp: comboPowerUp,
      isActive: true
    });
  }
  
  // Power-up Diario (primera tarea del día)
  const todayUserTasks = recentHistory.filter(h => 
    h.userId === userId && 
    typeof h.date === 'string' && 
    new Date(h.date).toDateString() === today
  );
  
  if (todayUserTasks.length === 0) {
    const dailyPowerUp = POWER_UPS.find(p => p.id === 'daily')!;
    activePowerUps.push({
      powerUp: dailyPowerUp,
      isActive: true
    });
  }
  
  return activePowerUps;
};

// Verificar si dos tareas están relacionadas
const isRelatedTask = (task1: Task, historyEntry: HistoryEntry, allTasks: Task[]): boolean => {
  const task2 = allTasks.find(t => t.id === historyEntry.taskId);
  if (!task2) return false;
  
  // Palabras clave relacionadas
  const relatedKeywords = [
    ['cocina', 'platos', 'fregar', 'limpiar cocina'],
    ['baño', 'ducha', 'aseo', 'lavabo'],
    ['ropa', 'lavar', 'tender', 'planchar', 'doblar'],
    ['sala', 'salón', 'sofá', 'televisión'],
    ['dormitorio', 'cama', 'habitación']
  ];
  
  const task1Name = task1.name.toLowerCase();
  const task2Name = task2.name.toLowerCase();
  
  // Verificar si ambas tareas contienen palabras del mismo grupo
  return relatedKeywords.some(group => 
    group.some(keyword => task1Name.includes(keyword)) &&
    group.some(keyword => task2Name.includes(keyword))
  );
};

// Calcular puntos con power-ups aplicados
export const calculatePointsWithPowerUps = (
  basePoints: number,
  activePowerUps: ActivePowerUp[]
): { finalPoints: number; appliedPowerUps: PowerUp[] } => {
  let finalPoints = basePoints;
  const appliedPowerUps: PowerUp[] = [];
  
  activePowerUps.forEach(({ powerUp, isActive }) => {
    if (isActive) {
      finalPoints = Math.floor(finalPoints * powerUp.multiplier);
      appliedPowerUps.push(powerUp);
    }
  });
  
  return { finalPoints, appliedPowerUps };
};

// Obtener power-ups disponibles para mostrar en UI
export const getAvailablePowerUps = (
  recentHistory: HistoryEntry[],
  userId: string
): ActivePowerUp[] => {
  const today = new Date().toDateString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const recentUserTasks = recentHistory.filter(h => 
    h.userId === userId && 
    typeof h.date === 'string' && 
    new Date(h.date) > twoHoursAgo
  );
  
  const todayUserTasks = recentHistory.filter(h => 
    h.userId === userId && 
    typeof h.date === 'string' && 
    new Date(h.date).toDateString() === today
  );
  
  const availablePowerUps: ActivePowerUp[] = [];
  
  // Streak progress
  const streakPowerUp = POWER_UPS.find(p => p.id === 'streak')!;
  availablePowerUps.push({
    powerUp: streakPowerUp,
    isActive: recentUserTasks.length >= 2,
    progress: Math.min(recentUserTasks.length, 3),
    maxProgress: 3
  });
  
  // Daily status
  const dailyPowerUp = POWER_UPS.find(p => p.id === 'daily')!;
  availablePowerUps.push({
    powerUp: dailyPowerUp,
    isActive: todayUserTasks.length === 0,
  });
  
  // Combo siempre disponible
  const comboPowerUp = POWER_UPS.find(p => p.id === 'combo')!;
  availablePowerUps.push({
    powerUp: comboPowerUp,
    isActive: false, // Se activa dinámicamente
  });
  
  return availablePowerUps;
};