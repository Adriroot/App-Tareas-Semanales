// Archivo: src/components/SetDateModal.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState, useEffect } from 'react';
import { CalendarEditIcon, SparklesIcon, CheckCircleIcon } from './icons';

interface SetDateModalProps {
  currentDate: string;
  onSave: (newDate: string) => void;
  onClose: () => void;
}

const SetDateModal: React.FC<SetDateModalProps> = ({ currentDate, onSave, onClose }) => {
  // La lógica del estado y el efecto se mantienen intactas.
  const [date, setDate] = useState(new Date(currentDate).toISOString().split('T')[0]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(date);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Efectos de fondo principales */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse opacity-60" style={{ animationDuration: '6s' }} />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 to-cyan-500/5 blur-3xl opacity-40" />
      
      {/* Partículas ambientales */}
      <div className="fixed top-20 left-20 w-1 h-1 bg-indigo-400/40 rounded-full animate-pulse" />
      <div className="fixed bottom-20 right-20 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/3 right-1/4 w-0.5 h-0.5 bg-pink-400/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div 
        className="relative w-full max-w-lg bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos internos principales */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
        <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 rounded-full blur-xl" />

        {/* Header premium mejorado */}
        <div className="relative text-center">
          {/* Icono principal con efectos */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-3 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-lg opacity-60" />
            
            <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center border border-indigo-300/20 shadow-2xl">
              <CalendarEditIcon className="w-10 h-10 text-indigo-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            </div>
            
            {/* Anillo orbital */}
            <div className="absolute -inset-4 border-2 border-indigo-400/20 rounded-full animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
          </div>
          
          {/* Títulos premium */}
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Establecer Fecha
              <span className="block text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-1">
                de Inicio Premium
              </span>
            </h3>
            
            <p className="text-lg text-[var(--text-secondary)] font-medium max-w-md mx-auto">
              Elige cuándo comenzó la semana actual con precisión
            </p>
            
            {/* Línea decorativa */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-indigo-400" />
              <div className="w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input de fecha premium */}
          <div className="relative group">
            {/* Efectos de fondo para el input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              {/* Label premium */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-300/20">
                  <SparklesIcon className="w-4 h-4 text-indigo-400" />
                </div>
                <label htmlFor="week-start-date" className="text-lg font-bold text-[var(--text-primary)]">
                  Fecha de Inicio de Semana Premium
                </label>
              </div>
              
              {/* Contenedor del input con efectos */}
              <div className="relative">
                {/* Icono interno */}
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <CalendarEditIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                </div>
                
                <input
                  id="week-start-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="relative w-full pl-14 pr-4 py-4 bg-[var(--surface-1)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300 focus:scale-102 text-lg font-medium"
                  style={{ colorScheme: 'dark' }}
                />
                
                {/* Efectos internos del input */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                
                {/* Partículas decorativas */}
                <div className="absolute top-2 right-3 w-1 h-1 bg-indigo-400/40 rounded-full animate-pulse" />
                <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          {/* Botones premium */}
          <div className="flex gap-4 pt-6">
            {/* Botón cancelar premium */}
            <div className="relative flex-1 group/cancel">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-2xl blur-lg opacity-0 group-hover/cancel:opacity-60 transition-opacity duration-300" />
              
              <button 
                type="button" 
                onClick={onClose} 
                className="relative w-full px-6 py-4 font-bold bg-[var(--surface-2)]/80 backdrop-blur-sm text-[var(--text-primary)] rounded-2xl hover:bg-[var(--surface-2)] transition-all duration-300 border border-white/10 shadow-lg hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                Cancelar
              </button>
            </div>
            
            {/* Botón guardar premium */}
            <div className="relative flex-1 group/save">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover/save:opacity-100 transition-opacity duration-300" />
              
              <button 
                type="submit" 
                className="relative w-full px-6 py-4 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-indigo-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                
                <div className="flex items-center justify-center gap-3">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Guardar Fecha Premium</span>
                  <SparklesIcon className="w-4 h-4 animate-pulse" />
                </div>
              </button>
            </div>
          </div>
        </form>
        
        {/* Partículas adicionales para el modal */}
        <div className="absolute top-8 left-8 w-1 h-1 bg-indigo-400/30 rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-0.5 h-0.5 bg-purple-400/30 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-6 w-0.5 h-0.5 bg-pink-400/30 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
};

export default SetDateModal;