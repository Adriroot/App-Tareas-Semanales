import React, { useState } from 'react';
import { Task, UserProfile } from '../types';

// Iconos personalizados
const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const FireIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.049 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TrophyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string, points: number) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
}

// Helper function to determine contrast text color
const getContrastTextColor = (hexcolor: string): string => {
  if (!hexcolor) return 'text-gray-800';
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const y = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (y >= 128) ? 'text-gray-800' : 'text-white';
};

// Función para obtener emoji según los puntos
const getPointsEmoji = (points: number): string => {
  if (points >= 50) return '🏆';
  if (points >= 30) return '💎';
  if (points >= 20) return '⭐';
  if (points >= 10) return '✨';
  return '💫';
};

// Función para obtener color de gradiente según el usuario
const getUserGradient = (user: UserProfile | undefined, fallbackIndex: number): string => {
  if (user?.color) {
    // Si el usuario tiene color personalizado, crear un gradiente basado en ese color
    return `linear-gradient(135deg, ${user.color}40, ${user.color}20)`;
  }
  // Gradientes predefinidos como fallback
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];
  return gradients[fallbackIndex % gradients.length];
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onEdit, currentUser, users }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleComplete = () => {
    if (!task.isCompleted) {
      setIsCompleting(true);
      setShowConfetti(true);
      setTimeout(() => {
        onComplete(task.id, task.points);
        setIsCompleting(false);
      }, 600);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const isCompletable = currentUser && (task.assignedTo === 'Cualquiera' || task.assignedTo === currentUser.uid);
  
  const assignedUser = users.find(u => u.uid === task.assignedTo);
  const completedByUser = task.completedBy ? users.find(u => u.uid === task.completedBy.uid) : null;
  const assignedToName = assignedUser ? assignedUser.displayName : task.assignedTo;
  
  // Obtener índice para colores de fallback
  const userIndex = users.findIndex(u => u.uid === (task.isCompleted ? task.completedBy?.uid : task.assignedTo));
  
  // Determinar el color/gradiente del borde izquierdo
  const borderColor = task.isCompleted && completedByUser?.color
    ? completedByUser.color
    : assignedUser?.color || ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'][userIndex % 4];

  // Avatar emoji según el estado
  const getAvatarEmoji = () => {
    if (task.assignedTo === 'Cualquiera') return '🎲';
    if (task.isCompleted) return '✅';
    return ['👤', '👥', '🧑', '👩', '👨'][userIndex % 5];
  };

  return (
    <div
      className={`relative group transition-all duration-500 ${isCompleting ? 'scale-105' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efecto de confetti al completar */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="animate-ping absolute inset-0 rounded-2xl bg-green-400 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl animate-bounce">🎉</span>
          </div>
        </div>
      )}

      {/* Card principal con glassmorphism */}
      <div
        className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-white/10 ${
          task.isCompleted 
            ? 'bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-900/80 opacity-75' 
            : 'bg-white/90 dark:bg-slate-800/90 hover:translate-y-[-4px] hover:scale-[1.02]'
        }`}
        style={{
          borderLeft: `4px solid ${borderColor}`,
          boxShadow: task.isCompleted ? undefined : `0 20px 40px -12px ${borderColor}20`
        }}
      >
        {/* Efectos de fondo futuristas */}
        {!task.isCompleted && (
          <>
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                background: getUserGradient(assignedUser, userIndex)
              }}
            />
            {/* Orbe luminoso en la esquina */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl" />
            {/* Partículas flotantes */}
            <div className="absolute top-4 right-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-6 right-6 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </>
        )}

        {/* Contenido de la tarjeta */}
        <div className="relative p-5 flex items-center gap-4">
          {/* Botón de completar con animación mejorada */}
          <div className="relative">
            <button
              onClick={handleComplete}
              disabled={task.isCompleted || !isCompletable}
              className={`relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500 group/btn ${
                task.isCompleted
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-400/30'
                  : isCompletable
                  ? 'bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-700/80 dark:to-slate-600/80 hover:from-purple-400 hover:to-pink-400 hover:shadow-2xl hover:shadow-purple-400/30 hover:scale-110 border border-slate-300/50 dark:border-slate-600/50 backdrop-blur-sm'
                  : 'bg-slate-100/50 dark:bg-slate-700/50 cursor-not-allowed opacity-50'
              }`}
              aria-label={`Completar ${task.name}`}
            >
              {/* Anillo exterior en hover */}
              {!task.isCompleted && isCompletable && (
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              )}
              {task.isCompleted ? (
                <CheckCircleIcon className="w-7 h-7 text-white" />
              ) : isCompleting ? (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isCompletable && isHovered 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-400/50' 
                    : 'bg-slate-400 dark:bg-slate-500'
                }`}></div>
              )}
            </button>
            
            {/* Indicador de puntos flotante mejorado */}
            {!task.isCompleted && isCompletable && isHovered && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-xl shadow-yellow-400/30 animate-bounce border-2 border-white/20">
                <span className="relative z-10">+{task.points}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-orange-400/50 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* Información de la tarea */}
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className={`font-bold text-lg transition-all duration-300 ${
                  task.isCompleted 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {task.name}
                  {task.isCompleted && <span className="ml-2 text-green-500">✓</span>}
                </h3>
                
                {/* Badges informativos */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Badge de asignación con glassmorphism */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 shadow-lg ${
                    task.assignedTo === 'Cualquiera'
                      ? 'bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300'
                      : 'bg-gradient-to-r from-blue-100/80 to-cyan-100/80 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300'
                  }`}>
                    <span className="text-base">{getAvatarEmoji()}</span>
                    <span>{assignedToName}</span>
                  </div>
                  
                  {/* Badge de puntos con animación mejorada */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100/80 to-orange-100/80 dark:from-yellow-900/40 dark:to-orange-900/40 text-orange-700 dark:text-orange-300 backdrop-blur-sm border border-white/20 shadow-lg">
                    <span className="text-base animate-pulse">{getPointsEmoji(task.points)}</span>
                    <span>{task.points} pts</span>
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-pulse" />
                  </div>

                  {/* Badge de completado con efectos */}
                  {task.isCompleted && completedByUser && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 backdrop-blur-sm border border-white/20 shadow-lg">
                      <TrophyIcon className="w-4 h-4 animate-pulse text-yellow-500" />
                      <span>Por {completedByUser.displayName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-1">
            {!task.isCompleted && (
              <button 
                onClick={() => onEdit(task)} 
                className="p-2.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-110"
                aria-label={`Editar ${task.name}`}
              >
                <EditIcon />
              </button>
            )}
            <button 
              onClick={() => onDelete(task.id)} 
              className="p-2.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110"
              aria-label={`Eliminar ${task.name}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Barra de progreso visual mejorada */}
        {!task.isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-200/50 to-slate-300/50 dark:from-slate-700/50 dark:to-slate-600/50 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-500 relative overflow-hidden"
              style={{ 
                width: `${Math.min(task.points * 2, 100)}%`,
                opacity: isHovered ? 1 : 0.4
              }}
            >
              {/* Efecto de brillo que se mueve */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;