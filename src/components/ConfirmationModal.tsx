// Archivo: src/components/ConfirmationModal.tsx - VERSIÓN FINAL Y COMPLETA

import React, { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = 'confirmation-modal-title';
  const messageId = 'confirmation-modal-message';

  // Lógica para accesibilidad (Escape y Focus Trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Enfocar el botón de confirmación por defecto para acciones rápidas
    confirmButtonRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in" onClick={onClose}>
      {/* Efectos de fondo ambientales */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-orange-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>
      
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="relative group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo del modal */}
        <div className="absolute -inset-3 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-2xl blur-lg opacity-40" />
        
        {/* Modal principal */}
        <div className="relative w-full max-w-lg bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 text-center animate-scale-in">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-2xl" />
          
          {/* Partículas de alerta */}
          <div className="absolute top-6 left-8 w-1 h-1 bg-red-400/60 rounded-full animate-pulse" />
          <div className="absolute bottom-8 right-10 w-0.5 h-0.5 bg-orange-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Icono de alerta mejorado */}
          <div className="relative mx-auto mb-6">
            {/* Anillos de alerta */}
            <div className="absolute -inset-4 border-2 border-red-500/20 rounded-full animate-ping" />
            <div className="absolute -inset-2 border border-red-400/30 rounded-full animate-pulse" />
            
            {/* Contenedor del icono */}
            <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30 shadow-2xl">
              {/* Efecto interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              
              <ExclamationTriangleIcon className="relative w-10 h-10 text-red-400 drop-shadow-lg animate-pulse" />
              
              {/* Partícula central */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Contenido del modal */}
          <div className="space-y-4">
            <h3 id={titleId} className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              {title}
            </h3>
            <p id={messageId} className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>
        
          {/* Botones mejorados */}
          <div className="flex justify-center gap-6 mt-10">
            {/* Botón cancelar */}
            <button
              onClick={onClose}
              className="group relative overflow-hidden"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative px-8 py-4 bg-[var(--surface-2)]/80 backdrop-blur-sm text-[var(--text-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300 border border-white/10 shadow-lg">
                {/* Efecto interno */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
                
                <span className="relative">Cancelar</span>
                
                {/* Efecto de barrido */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
              </div>
            </button>
            
            {/* Botón confirmar */}
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className="group relative overflow-hidden"
            >
              {/* Efectos de fondo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/40 to-orange-500/40 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-orange-500/50 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              
              <div className="relative px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-black rounded-xl hover:scale-105 hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-2xl shadow-red-500/30">
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg" />
                
                <span className="relative flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 group-hover:animate-pulse" />
                  Confirmar
                </span>
                
                {/* Partícula de alerta */}
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" />
                
                {/* Efecto de barrido */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;