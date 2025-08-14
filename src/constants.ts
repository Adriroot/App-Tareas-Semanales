import { Achievement, DayOfWeek, UserProfile } from './types';
import { TrophyIcon, FireIcon, UsersIcon, SparklesIcon, CalendarCheckIcon, ShieldCheckIcon } from './components/icons';

export const DAYS_OF_WEEK: DayOfWeek[] = [
    DayOfWeek.Lunes,
    DayOfWeek.Martes,
    DayOfWeek.Miércoles,
    DayOfWeek.Jueves,
    DayOfWeek.Viernes,
    DayOfWeek.Sábado,
    DayOfWeek.Domingo,
];

const getToday = (): DayOfWeek => {
    const dayIndex = new Date().getDay();
    const weekDays = [DayOfWeek.Domingo, DayOfWeek.Lunes, DayOfWeek.Martes, DayOfWeek.Miércoles, DayOfWeek.Jueves, DayOfWeek.Viernes, DayOfWeek.Sábado];
    return weekDays[dayIndex];
};

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-task',
        name: '¡A romper el hielo!',
        description: 'Completa tu primera tarea de la historia.',
        icon: TrophyIcon,
        check: (stats, history, tasks, householdUsers, currentUser) => 
            history.some(h => h.userId === currentUser.uid),
    },
    {
        id: 'team-player',
        name: 'Trabajo en Equipo',
        description: 'Completa una tarea asignada a "Cualquiera".',
        icon: UsersIcon,
        check: (stats, history, tasks, householdUsers, currentUser) => 
            history.some(h => {
                if (h.userId !== currentUser.uid) return false;
                const task = tasks.find(t => t.id === h.taskId);
                return !!task && task.assignedTo === 'Cualquiera';
            })
    },
    {
        id: 'task-machine',
        name: 'Máquina de Tareas',
        description: 'Completa un total de 10 tareas (entre todos los del hogar).',
        icon: FireIcon,
        check: (stats, history, tasks, householdUsers) => 
            householdUsers.reduce((total, user) => total + (stats[user.uid]?.completedTasks || 0), 0) >= 10,
    },
    {
        id: 'point-hoarder-500',
        name: 'Acumulador de Puntos',
        description: 'Alcanza los 500 puntos (entre todos los del hogar).',
        icon: SparklesIcon,
        check: (stats, history, tasks, householdUsers) => 
            householdUsers.reduce((total, user) => total + (stats[user.uid]?.points || 0), 0) >= 500,
    },
    {
        id: 'perfect-day',
        name: 'Día Perfecto',
        description: 'Completa todas las tareas programadas para hoy.',
        icon: CalendarCheckIcon,
        check: (stats, history, tasks) => {
            const today = getToday();
            const tasksForToday = tasks.filter(t => t.day === today);
            if (tasksForToday.length === 0) return false;
            return tasksForToday.every(t => t.isCompleted);
        }
    },
    {
        id: 'weekend-warrior',
        name: 'Guerrero de Finde',
        description: 'Completa 3 o más tareas durante el fin de semana.',
        icon: ShieldCheckIcon,
        check: (stats, history, tasks) => {
            const weekendCompletions = history.filter(h => {
                const task = tasks.find(t => t.id === h.taskId);
                return task && (task.day === DayOfWeek.Sábado || task.day === DayOfWeek.Domingo);
            }).length;
            return weekendCompletions >= 3;
        }
    }
];
