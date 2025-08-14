// Hook global para prevenir spam de clicks en toda la aplicación
import { useRef, useCallback } from 'react';

// Mapa global de debounces activos
const globalDebounceMap = new Map<string, number>();

export const useGlobalDebounce = (key: string, delay: number = 200) => {
  const lastCallTime = useRef(0);

  const debouncedFunction = useCallback((callback: () => void) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime.current;
    
    // Verificar debounce global para esta clave
    const globalLastCall = globalDebounceMap.get(key) || 0;
    const timeSinceGlobalCall = now - globalLastCall;
    
    // Si cualquiera de los dos debounces está activo, cancelar
    if (timeSinceLastCall < delay || timeSinceGlobalCall < delay) {
      return false;
    }
    
    // Actualizar tiempos
    lastCallTime.current = now;
    globalDebounceMap.set(key, now);
    
    // Ejecutar callback
    try {
      callback();
      return true;
    } catch (error) {
      console.error('Error in debounced function:', error);
      return false;
    }
  }, [key, delay]);

  const reset = useCallback(() => {
    lastCallTime.current = 0;
    globalDebounceMap.delete(key);
  }, [key]);

  return { debouncedFunction, reset };
};

// Función para limpiar el mapa global (útil para tests o cleanup)
export const clearGlobalDebounceMap = () => {
  globalDebounceMap.clear();
};

export default useGlobalDebounce;