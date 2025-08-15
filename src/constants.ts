import { Achievement, DayOfWeek, UserProfile } from './types';
import { TrophyIcon, FireIcon, UsersIcon, SparklesIcon, CalendarCheckIcon, ShieldCheckIcon, HomeIcon } from './components/icons';

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

// Sistema de logros expandido y optimizado
const createAchievementSeries = (baseName: string, baseDesc: string, icon: any, baseCheck: any, targets: number[], category: string = 'progreso', difficulty: string = 'medio') => {
  return targets.map((target, index) => ({
    id: `${baseName.toLowerCase().replace(/\s+/g, '-')}-${target}`,
    name: `${baseName} ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] || target}`,
    description: baseDesc.replace('X', target.toString()),
    icon,
    category,
    difficulty: index < 2 ? 'facil' : index < 4 ? 'medio' : index < 6 ? 'dificil' : 'extremo',
    points: Math.floor(target / 10) + (index * 5),
    check: (stats: any, history: any, tasks: any, householdUsers: any, currentUser: any) => 
      baseCheck(stats, history, tasks, householdUsers, currentUser) >= target
  }));
};

export const ACHIEVEMENTS: Achievement[] = [
  // === 🌟 LOGROS DE INICIACIÓN ===
  {
    id: 'first-task',
    name: '¡A romper el hielo!',
    description: 'Completa tu primera tarea de la historia.',
    icon: TrophyIcon,
    category: 'iniciacion',
    difficulty: 'facil',
    points: 10,
    check: (stats, history, tasks, householdUsers, currentUser) => 
      history.some(h => h.userId === currentUser.uid),
  },
  {
    id: 'team-player',
    name: 'Jugador de Equipo',
    description: 'Completa una tarea asignada a "Cualquiera".',
    icon: UsersIcon,
    category: 'equipo',
    difficulty: 'facil',
    points: 15,
    check: (stats, history, tasks, householdUsers, currentUser) => 
      history.some(h => {
        if (h.userId !== currentUser.uid) return false;
        const task = tasks.find(t => t.id === h.taskId);
        return !!task && (!task.assignedTo || task.assignedTo === null);
      })
  },
  
  // === 🏆 SERIES DE PROGRESO PERSONAL ===
  ...createAchievementSeries(
    'Completista Personal', 
    'Completa X tareas tú solo.',
    FireIcon,
    (stats, history, tasks, householdUsers, currentUser) => stats[currentUser.uid]?.completedTasks || 0,
    [5, 10, 25, 50, 100, 200, 500, 1000, 2000, 5000],
    'progreso'
  ),

  ...createAchievementSeries(
    'Acumulador de Puntos',
    'Alcanza X puntos personales.',
    SparklesIcon,
    (stats, history, tasks, householdUsers, currentUser) => stats[currentUser.uid]?.points || 0,
    [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000],
    'puntuacion'
  ),

  // === 🏡 SERIES DE HOGAR COLECTIVO ===
  ...createAchievementSeries(
    'Hogar Productivo',
    'El hogar completa X tareas en total.',
    UsersIcon,
    (stats, history, tasks, householdUsers) => 
      householdUsers.reduce((total, user) => total + (stats[user.uid]?.completedTasks || 0), 0),
    [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000],
    'hogar'
  ),

  // === 📅 LOGROS DE CONSISTENCIA ===
  {
    id: 'perfect-day',
    name: 'Día Perfecto',
    description: 'Completa todas las tareas programadas para hoy.',
    icon: CalendarCheckIcon,
    category: 'consistencia',
    difficulty: 'medio',
    points: 25,
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
    description: 'Completa 5 o más tareas durante el fin de semana.',
    icon: ShieldCheckIcon,
    category: 'consistencia',
    difficulty: 'medio',
    points: 30,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const weekendCompletions = history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        const task = tasks.find(t => t.id === h.taskId);
        return task && (task.day === DayOfWeek.Sábado || task.day === DayOfWeek.Domingo);
      }).length;
      return weekendCompletions >= 5;
    }
  },

  // === ⚡ LOGROS DE VELOCIDAD ===
  {
    id: 'speed-demon',
    name: 'Demonio de Velocidad',
    description: 'Completa 10 tareas en un solo día.',
    icon: FireIcon,
    category: 'velocidad',
    difficulty: 'dificil',
    points: 50,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const today = new Date().toDateString();
      const todayTasks = history.filter(h => 
        h.userId === currentUser.uid && 
        typeof h.date === 'string' && 
        new Date(h.date).toDateString() === today
      );
      return todayTasks.length >= 10;
    }
  },

  // === 🎯 LOGROS ESPECIALES ===
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Completa una tarea antes de las 6:00 AM.',
    icon: TrophyIcon,
    category: 'especiales',
    difficulty: 'medio',
    points: 20,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.some(h => {
        if (h.userId !== currentUser.uid) return false;
        if (typeof h.date === 'string') {
          const hour = new Date(h.date).getHours();
          return hour < 6;
        }
        return false;
      });
    }
  },
  {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Completa una tarea después de las 10:00 PM.',
    icon: TrophyIcon,
    category: 'especiales',
    difficulty: 'medio',
    points: 20,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.some(h => {
        if (h.userId !== currentUser.uid) return false;
        if (typeof h.date === 'string') {
          const hour = new Date(h.date).getHours();
          return hour >= 22;
        }
        return false;
      });
    }
  },
  {
    id: 'helping-hand',
    name: 'Mano Amiga',
    description: 'Ayuda completando tareas que no te tocaban.',
    icon: UsersIcon,
    category: 'equipo',
    difficulty: 'medio',
    points: 25,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        const task = tasks.find(t => t.id === h.taskId);
        return task && task.assignedTo && task.assignedTo.uid !== currentUser.uid;
      }).length >= 3;
    }
  },

  // === 💎 LOGROS LEGENDARIOS ===
  {
    id: 'household-hero',
    name: 'Héroe del Hogar',
    description: 'Ser el que más tareas ha completado en el hogar.',
    icon: TrophyIcon,
    category: 'legendarios',
    difficulty: 'legendario',
    points: 100,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const myTasks = stats[currentUser.uid]?.completedTasks || 0;
      if (myTasks < 50) return false; // Mínimo 50 tareas
      return householdUsers.every(user => 
        user.uid === currentUser.uid || (stats[user.uid]?.completedTasks || 0) < myTasks
      );
    }
  },
  {
    id: 'point-master',
    name: 'Maestro de Puntos',
    description: 'Acumula más puntos que cualquier otro miembro del hogar.',
    icon: SparklesIcon,
    category: 'legendarios',
    difficulty: 'legendario',
    points: 100,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const myPoints = stats[currentUser.uid]?.points || 0;
      if (myPoints < 1000) return false; // Mínimo 1000 puntos
      return householdUsers.every(user => 
        user.uid === currentUser.uid || (stats[user.uid]?.points || 0) < myPoints
      );
    }
  },

  // === 🎪 LOGROS DIVERTIDOS ===
  {
    id: 'clean-freak',
    name: 'Fanático de la Limpieza',
    description: 'Completa 20 tareas que contengan "limpiar" en el nombre.',
    icon: SparklesIcon,
    category: 'diversion',
    difficulty: 'medio',
    points: 35,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        return h.taskName.toLowerCase().includes('limpiar');
      }).length >= 20;
    }
  },
  {
    id: 'kitchen-master',
    name: 'Maestro de la Cocina',
    description: 'Completa 15 tareas relacionadas con cocinar.',
    icon: FireIcon,
    category: 'especialidad',
    difficulty: 'medio',
    points: 30,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const cookingWords = ['cocinar', 'cocina', 'platos', 'comida', 'comer'];
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        return cookingWords.some(word => h.taskName.toLowerCase().includes(word));
      }).length >= 15;
    }
  },

  // === 🌍 LOGROS TEMPORALES ===
  {
    id: 'new-year-resolution',
    name: 'Propósito de Año Nuevo',
    description: 'Completa 10 tareas en enero.',
    icon: CalendarCheckIcon,
    category: 'temporales',
    difficulty: 'medio',
    points: 40,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const januaryTasks = history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        if (typeof h.date === 'string') {
          return new Date(h.date).getMonth() === 0; // Enero = 0
        }
        return false;
      });
      return januaryTasks.length >= 10;
    }
  },

  // === ⚡ SERIES DE RACHA ===
  ...createAchievementSeries(
    'Racha Imparable', 
    'Completa al menos 1 tarea durante X días consecutivos.',
    FireIcon,
    (stats, history, tasks, householdUsers, currentUser) => {
      // Calcular racha actual
      const today = new Date();
      let streak = 0;
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toDateString();
        
        const hasTaskOnDate = history.some(h => 
          h.userId === currentUser.uid && 
          typeof h.date === 'string' && 
          new Date(h.date).toDateString() === dateStr
        );
        
        if (hasTaskOnDate) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },
    [3, 7, 14, 30, 60, 100, 200, 365],
    'racha'
  ),

  // === 🌈 LOGROS DE VARIEDAD ===
  {
    id: 'task-variety',
    name: 'Explorador de Tareas',
    description: 'Completa al menos 15 tareas con nombres diferentes.',
    icon: SparklesIcon,
    category: 'variedad',
    difficulty: 'medio',
    points: 30,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const uniqueTasks = new Set(
        history
          .filter(h => h.userId === currentUser.uid)
          .map(h => h.taskName.toLowerCase())
      );
      return uniqueTasks.size >= 15;
    }
  },

  // === 📊 SERIES DE PUNTUACIÓN SEMANAL ===
  ...createAchievementSeries(
    'Semana Productiva',
    'Consigue X puntos en una sola semana.',
    TrophyIcon,
    (stats, history, tasks, householdUsers, currentUser) => {
      // Calcular puntos de la semana actual
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekPoints = history
        .filter(h => {
          if (h.userId !== currentUser.uid) return false;
          if (typeof h.date === 'string') {
            const taskDate = new Date(h.date);
            return taskDate >= weekStart;
          }
          return false;
        })
        .reduce((sum, h) => sum + h.points, 0);
      
      return weekPoints;
    },
    [100, 250, 500, 1000, 2000, 5000],
    'semanal'
  ),

  // === 🎯 LOGROS DE ESPECIALIZACIÓN ===
  {
    id: 'bathroom-specialist',
    name: 'Especialista del Baño',
    description: 'Completa 20 tareas relacionadas con el baño.',
    icon: SparklesIcon,
    category: 'especialidad',
    difficulty: 'medio',
    points: 25,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const bathroomWords = ['baño', 'ducha', 'wc', 'aseo', 'lavabo', 'sanitario'];
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        return bathroomWords.some(word => h.taskName.toLowerCase().includes(word));
      }).length >= 20;
    }
  },
  {
    id: 'laundry-master',
    name: 'Maestro de la Lavandería',
    description: 'Completa 15 tareas de lavado y ropa.',
    icon: SparklesIcon,
    category: 'especialidad',
    difficulty: 'medio',
    points: 25,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const laundryWords = ['lavar', 'ropa', 'lavadora', 'tender', 'planchar', 'doblar'];
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        return laundryWords.some(word => h.taskName.toLowerCase().includes(word));
      }).length >= 15;
    }
  },

  // === 🏃 LOGROS DE VELOCIDAD AVANZADOS ===
  {
    id: 'task-sprint',
    name: 'Sprint de Tareas',
    description: 'Completa 5 tareas en menos de 1 hora.',
    icon: FireIcon,
    category: 'velocidad',
    difficulty: 'dificil',
    points: 40,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      // Buscar 5 tareas completadas en ventana de 1 hora
      for (let i = 0; i < history.length - 4; i++) {
        const task1 = history[i];
        if (task1.userId !== currentUser.uid || typeof task1.date !== 'string') continue;
        
        const startTime = new Date(task1.date);
        let count = 1;
        
        for (let j = i + 1; j < history.length && count < 5; j++) {
          const task2 = history[j];
          if (task2.userId !== currentUser.uid || typeof task2.date !== 'string') continue;
          
          const taskTime = new Date(task2.date);
          if (taskTime.getTime() - startTime.getTime() <= 3600000) { // 1 hora
            count++;
          }
        }
        
        if (count >= 5) return true;
      }
      return false;
    }
  },

  // === 👥 LOGROS SOCIALES AVANZADOS ===
  {
    id: 'team-leader',
    name: 'Líder del Equipo',
    description: 'Sé el usuario más activo del hogar durante 3 días.',
    icon: UsersIcon,
    category: 'social',
    difficulty: 'dificil',
    points: 60,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const myCompletions = stats[currentUser.uid]?.completedTasks || 0;
      let daysAsLeader = 0;
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toDateString();
        
        const dailyStats = {};
        history.forEach(h => {
          if (typeof h.date === 'string' && new Date(h.date).toDateString() === dateStr) {
            dailyStats[h.userId] = (dailyStats[h.userId] || 0) + 1;
          }
        });
        
        const myDailyTasks = dailyStats[currentUser.uid] || 0;
        const isLeader = Object.values(dailyStats).every(count => myDailyTasks >= count) && myDailyTasks > 0;
        
        if (isLeader) daysAsLeader++;
      }
      
      return daysAsLeader >= 3;
    }
  },

  // === 🌟 LOGROS DE PERFECTIONIST ===
  {
    id: 'perfect-week',
    name: 'Semana Perfecta',
    description: 'Completa todas las tareas de la semana sin fallar ninguna.',
    icon: TrophyIcon,
    category: 'perfeccionista',
    difficulty: 'extremo',
    points: 80,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekTasks = tasks.filter(t => {
        const taskDate = new Date(t.day); // Asumiendo que day se puede convertir a fecha
        return taskDate >= weekStart;
      });
      
      if (weekTasks.length === 0) return false;
      
      return weekTasks.every(t => t.isCompleted);
    }
  },

  // === 🎪 LOGROS DIVERTIDOS ADICIONALES ===
  {
    id: 'midnight-owl',
    name: 'Búho de Medianoche',
    description: 'Completa 5 tareas entre las 12:00 AM y 6:00 AM.',
    icon: TrophyIcon,
    category: 'diversion',
    difficulty: 'medio',
    points: 35,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        if (typeof h.date === 'string') {
          const hour = new Date(h.date).getHours();
          return hour >= 0 && hour < 6;
        }
        return false;
      }).length >= 5;
    }
  },
  {
    id: 'weekend-hero',
    name: 'Héroe del Fin de Semana',
    description: 'Completa más tareas en fin de semana que en días laborables.',
    icon: ShieldCheckIcon,
    category: 'diversion',
    difficulty: 'medio',
    points: 30,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      let weekendCount = 0;
      let weekdayCount = 0;
      
      history.forEach(h => {
        if (h.userId !== currentUser.uid) return;
        const task = tasks.find(t => t.id === h.taskId);
        if (task) {
          if (task.day === DayOfWeek.Sábado || task.day === DayOfWeek.Domingo) {
            weekendCount++;
          } else {
            weekdayCount++;
          }
        }
      });
      
      return weekendCount > weekdayCount && weekendCount >= 10;
    }
  },

  // === 🏆 LOGROS LEGENDARIOS ADICIONALES ===
  {
    id: 'ultimate-achiever',
    name: 'Máximo Conseguidor',
    description: 'Desbloquea 50 logros diferentes.',
    icon: TrophyIcon,
    category: 'legendarios',
    difficulty: 'legendario',
    points: 200,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      // Este se evalúa externamente basándose en unlockedAchievements
      return false; // Se marca manualmente
    }
  },
  {
    id: 'household-creator',
    name: 'Creador de Hogares',
    description: 'Crea y gestiona 3 hogares diferentes.',
    icon: HomeIcon,
    category: 'legendarios',
    difficulty: 'extremo',
    points: 150,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      // Este requiere datos adicionales sobre hogares creados
      return false; // Se evaluaría con datos del hogar
    }
  },

  // === 🌈 LOGROS DE DÍAS ESPECÍFICOS ===
  {
    id: 'monday-warrior',
    name: 'Guerrero del Lunes',
    description: 'Completa 20 tareas en lunes.',
    icon: CalendarCheckIcon,
    category: 'dias',
    difficulty: 'medio',
    points: 25,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        const task = tasks.find(t => t.id === h.taskId);
        return task && task.day === DayOfWeek.Lunes;
      }).length >= 20;
    }
  },
  {
    id: 'friday-finisher',
    name: 'Finalizador de Viernes',
    description: 'Completa 15 tareas en viernes.',
    icon: CalendarCheckIcon,
    category: 'dias',
    difficulty: 'medio',
    points: 25,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        const task = tasks.find(t => t.id === h.taskId);
        return task && task.day === DayOfWeek.Viernes;
      }).length >= 15;
    }
  },

  // === 💯 LOGROS DE PUNTUACIÓN EXACTA ===
  {
    id: 'century-maker',
    name: 'Centenario',
    description: 'Consigue exactamente 100 puntos en un día.',
    icon: TrophyIcon,
    category: 'precision',
    difficulty: 'medio',
    points: 50,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const dailyPoints = {};
      
      history.forEach(h => {
        if (h.userId !== currentUser.uid || typeof h.date !== 'string') return;
        const day = new Date(h.date).toDateString();
        dailyPoints[day] = (dailyPoints[day] || 0) + h.points;
      });
      
      return Object.values(dailyPoints).includes(100);
    }
  },

  // === 🔥 LOGROS DE COMBO ===
  {
    id: 'triple-threat',
    name: 'Triple Amenaza',
    description: 'Completa 3 tareas en menos de 30 minutos.',
    icon: FireIcon,
    category: 'combo',
    difficulty: 'dificil',
    points: 45,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      for (let i = 0; i < history.length - 2; i++) {
        const task1 = history[i];
        if (task1.userId !== currentUser.uid || typeof task1.date !== 'string') continue;
        
        const startTime = new Date(task1.date);
        let count = 1;
        
        for (let j = i + 1; j < history.length && count < 3; j++) {
          const task2 = history[j];
          if (task2.userId !== currentUser.uid || typeof task2.date !== 'string') continue;
          
          const taskTime = new Date(task2.date);
          if (taskTime.getTime() - startTime.getTime() <= 1800000) { // 30 minutos
            count++;
          }
        }
        
        if (count >= 3) return true;
      }
      return false;
    }
  },

  // === 🌅 LOGROS MATUTINOS ===
  {
    id: 'sunrise-hero',
    name: 'Héroe del Amanecer',
    description: 'Completa 10 tareas antes de las 8:00 AM.',
    icon: TrophyIcon,
    category: 'matutino',
    difficulty: 'medio',
    points: 30,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      return history.filter(h => {
        if (h.userId !== currentUser.uid) return false;
        if (typeof h.date === 'string') {
          const hour = new Date(h.date).getHours();
          return hour < 8;
        }
        return false;
      }).length >= 10;
    }
  },

  // === 📈 LOGROS DE MEJORA ===
  {
    id: 'improvement-master',
    name: 'Maestro de la Mejora',
    description: 'Completa más tareas esta semana que la anterior.',
    icon: TrophyIcon,
    category: 'mejora',
    difficulty: 'medio',
    points: 35,
    check: (stats, history, tasks, householdUsers, currentUser) => {
      const now = new Date();
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay());
      thisWeekStart.setHours(0, 0, 0, 0);
      
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      
      const thisWeekTasks = history.filter(h => {
        if (h.userId !== currentUser.uid || typeof h.date !== 'string') return false;
        const taskDate = new Date(h.date);
        return taskDate >= thisWeekStart;
      }).length;
      
      const lastWeekTasks = history.filter(h => {
        if (h.userId !== currentUser.uid || typeof h.date !== 'string') return false;
        const taskDate = new Date(h.date);
        return taskDate >= lastWeekStart && taskDate < thisWeekStart;
      }).length;
      
      return thisWeekTasks > lastWeekTasks && thisWeekTasks >= 5;
    }
  },
];
