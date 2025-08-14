// Hook para throttle agresivo y prevención de clicks múltiples
import { useRef, useCallback } from 'react';

export const useThrottledAction = (delay: number = 150) => {
  const lastActionTime = useRef(0);
  const actionInProgress = useRef(false);

  const throttledAction = useCallback((action: () => void) => {
    const now = Date.now();
    
    // Si ya hay una acción en progreso, ignorar
    if (actionInProgress.current) {
      return false;
    }
    
    // Si no ha pasado suficiente tiempo, ignorar
    if (now - lastActionTime.current < delay) {
      return false;
    }
    
    // Marcar acción como en progreso
    actionInProgress.current = true;
    lastActionTime.current = now;
    
    // Ejecutar acción
    try {
      action();
    } finally {
      // Resetear inmediatamente después de la ejecución
      setTimeout(() => {
        actionInProgress.current = false;
      }, 50);
    }
    
    return true;
  }, [delay]);

  const reset = useCallback(() => {
    actionInProgress.current = false;
    lastActionTime.current = 0;
  }, []);

  return { throttledAction, reset, isInProgress: actionInProgress.current };
};

export default useThrottledAction;