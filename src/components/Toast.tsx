import React from 'react';
import { Toast } from '../types';
import { CheckCircleIcon, TrophyIcon, SparklesIcon, XIcon } from './icons'; // Asumo XIcon para el cierre

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastMessage: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  // Configuración premium para cada tipo de toast
  const typeConfig = {
    success: {
      icon: <CheckCircleIcon className="w-7 h-7 text-green-400 drop-shadow-lg" />,
      accent: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-600',
      bgGradient: 'from-green-500/20 via-emerald-500/10 to-green-600/20',
      shadow: 'shadow-2xl shadow-green-500/40',
      borderGlow: 'border-green-400/30',
      particles: 'bg-green-400/60'
    },
    info: {
      icon: <SparklesIcon className="w-7 h-7 text-blue-400 drop-shadow-lg animate-pulse" />,
      accent: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600',
      bgGradient: 'from-blue-500/20 via-cyan-500/10 to-blue-600/20',
      shadow: 'shadow-2xl shadow-blue-500/40',
      borderGlow: 'border-blue-400/30',
      particles: 'bg-blue-400/60'
    },
    error: {
      icon: <XIcon className="w-7 h-7 text-red-400 drop-shadow-lg" />,
      accent: 'bg-gradient-to-br from-red-400 via-rose-500 to-red-600',
      bgGradient: 'from-red-500/20 via-rose-500/10 to-red-600/20',
      shadow: 'shadow-2xl shadow-red-500/40',
      borderGlow: 'border-red-400/30',
      particles: 'bg-red-400/60'
    },
    achievement: {
      icon: <TrophyIcon className="w-7 h-7 text-yellow-400 drop-shadow-lg animate-bounce" />,
      accent: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600',
      bgGradient: 'from-yellow-500/20 via-amber-500/15 to-orange-600/20',
      shadow: 'shadow-2xl shadow-yellow-500/50',
      borderGlow: 'border-yellow-400/40',
      particles: 'bg-yellow-400/80'
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className="relative group">
      {/* Efectos de fondo */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${config.bgGradient} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${config.bgGradient} rounded-2xl blur-md opacity-40`} />
      
      {/* Contenedor principal con glassmorphism premium */}
      <div className={`relative flex items-center w-full max-w-sm overflow-hidden p-5 rounded-2xl border ${config.borderGlow} bg-slate-800/80 backdrop-blur-2xl ${config.shadow} animate-toast-in group-hover:scale-105 transition-all duration-300`}>
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
        <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
        
        {/* Barra de acento mejorada */}
        <div className={`absolute left-0 top-0 h-full w-2 ${config.accent} rounded-l-2xl`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-l-2xl" />
        </div>
        
        {/* Partículas flotantes */}
        <div className={`absolute top-3 left-8 w-1 h-1 ${config.particles} rounded-full animate-pulse`} />
        <div className={`absolute bottom-3 left-6 w-0.5 h-0.5 ${config.particles} rounded-full animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-6 right-8 w-0.5 h-0.5 ${config.particles} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }} />
        
        {/* Contenedor del icono mejorado */}
        <div className="relative flex-shrink-0 pl-4">
          <div className="relative">
            {config.icon}
            {/* Anillo de brillo alrededor del icono */}
            <div className={`absolute -inset-2 bg-gradient-to-r ${config.bgGradient} rounded-full blur-md opacity-50 animate-pulse`} />
          </div>
        </div>

        {/* Mensaje mejorado */}
        <div className="ml-5 flex-1">
          <div className="text-sm font-bold text-slate-100 leading-relaxed drop-shadow-sm">
            {toast.message}
          </div>
          {/* Barra de progreso sutil */}
          <div className="mt-2 h-0.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div className={`h-full ${config.accent} animate-pulse`} style={{ width: '60%' }} />
          </div>
        </div>

        {/* Botón de cierre premium */}
        <button 
          onClick={() => onDismiss(toast.id)} 
          className="group/btn relative ml-5 flex-shrink-0 overflow-hidden"
          aria-label="Dismiss"
        >
          {/* Efectos del botón */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-600/30 to-slate-500/30 rounded-full blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          
          {/* Botón principal */}
          <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-600/50 text-slate-400 hover:bg-slate-800/80 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg">
            {/* Efecto interno */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
            
            <XIcon className="relative w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
            
            {/* Partícula en el botón */}
            <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse" />
          </div>
        </button>
      </div>
    </div>
  );
};


interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    return (
        <>
            {/* Contenedor mejorado con efectos ambientales */}
            <div className="fixed top-6 right-6 z-50 space-y-4">
                {/* Efectos de fondo para el área de toasts */}
                {toasts.length > 0 && (
                    <div className="absolute -inset-4 bg-gradient-to-bl from-purple-500/5 via-blue-500/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
                )}
                
                {toasts.map((toast, index) => (
                    <div 
                        key={toast.id} 
                        style={{ 
                            animationDelay: `${index * 150}ms`,
                            zIndex: 50 - index 
                        }}
                    >
                        <ToastMessage toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </div>
            
            {/* Animaciones CSS mejoradas */}
            <style>{`
              @keyframes toast-in {
                from {
                  transform: translateX(calc(100% + 30px)) scale(0.9);
                  opacity: 0;
                }
                to {
                  transform: translateX(0) scale(1);
                  opacity: 1;
                }
              }
              
              @keyframes toast-fade-out {
                from {
                  transform: translateX(0) scale(1);
                  opacity: 1;
                }
                to {
                  transform: translateX(calc(100% + 30px)) scale(0.9);
                  opacity: 0;
                }
              }
              
              .animate-toast-in {
                animation: toast-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              
              .animate-toast-out {
                animation: toast-fade-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
              }
            `}</style>
        </>
    );
}

export default ToastContainer;