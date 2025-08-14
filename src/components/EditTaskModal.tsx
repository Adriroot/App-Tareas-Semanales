// Archivo: src/components/EditTaskModal.tsx - VERSIÓN FINAL Y COMPATIBLE

import React, { useState, useEffect } from 'react';
import { Task, DayOfWeek, UserProfile } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { PencilSquareIcon } from './icons';

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onClose: () => void;
  users: UserProfile[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, task, onUpdate, onClose, users }) => {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedTask(prev => ({ ...prev, [name]: name === 'points' ? Number(value) : value }));
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uid = e.target.value;
    const user = users.find(u => u.uid === uid);
    setUpdatedTask(prev => ({ ...prev, assignedTo: user ? { uid: user.uid, displayName: user.displayName } : null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedTask);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in" onClick={onClose}>
      {/* Efectos de fondo ambientales */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      </div>
      
      <div 
        className="relative group w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo del modal */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-2xl blur-lg opacity-40" />
        
        {/* Modal principal con glassmorphism premium */}
        <div className="relative bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8 animate-scale-in">
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
          
          {/* Partículas flotantes */}
          <div className="absolute top-6 left-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" />
          <div className="absolute bottom-8 right-10 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Header mejorado */}
          <div className="text-center">
            {/* Icono con efectos */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg animate-pulse" />
              
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-purple-300/20 shadow-2xl">
                <PencilSquareIcon className="w-8 h-8 text-purple-400 drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
              </div>
              
              {/* Anillo giratorio */}
              <div className="absolute -inset-1 border-2 border-purple-400/20 rounded-2xl animate-rotate-slow" />
            </div>
            
            <h3 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
              Editar
              <span className="block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Tarea
              </span>
            </h3>
            <p className="text-lg text-[var(--text-secondary)] font-medium">
              Modifica los detalles con
              <span className="text-purple-300 font-semibold"> precisión</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo nombre mejorado */}
            <div className="relative">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-3">
                <PencilSquareIcon className="w-4 h-4" />
                Nombre de la Tarea
              </label>
              <div className="relative">
                <input
                  id="name" name="name" type="text" value={updatedTask.name} onChange={handleChange}
                  className="w-full px-5 py-4 bg-[var(--input-bg)]/80 backdrop-blur-sm border border-[var(--input-border)]/50 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-medium"
                  placeholder="Describe la tarea..."
                />
                {/* Efecto de enfoque */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Grid de campos mejorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Campo día */}
              <div className="relative">
                <label htmlFor="day" className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Día de la Semana
                </label>
                <div className="relative">
                  <select
                    id="day" name="day" value={updatedTask.day} onChange={handleChange}
                    className="w-full px-5 py-4 pr-12 bg-[var(--input-bg)]/80 backdrop-blur-sm border border-[var(--input-border)]/50 rounded-xl text-[var(--text-primary)] appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-medium cursor-pointer"
                  >
                    {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Campo asignado a */}
              <div className="relative">
                <label htmlFor="assignedTo" className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Asignado a
                </label>
                <div className="relative">
                  <select
                    id="assignedTo" name="assignedTo" value={updatedTask.assignedTo?.uid || ''} onChange={handleAssigneeChange}
                    className="w-full px-5 py-4 pr-12 bg-[var(--input-bg)]/80 backdrop-blur-sm border border-[var(--input-border)]/50 rounded-xl text-[var(--text-primary)] appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-medium cursor-pointer"
                  >
                    <option value="">🎲 Cualquiera</option>
                    {users.map(user => <option key={user.uid} value={user.uid}>👤 {user.displayName}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campo puntos */}
              <div className="relative">
                <label htmlFor="points" className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Puntos de Valor
                </label>
                <div className="relative">
                  <input
                    id="points" name="points" type="number" value={updatedTask.points} onChange={handleChange}
                    min="1" max="100"
                    className="w-full px-5 py-4 bg-[var(--input-bg)]/80 backdrop-blur-sm border border-[var(--input-border)]/50 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-medium"
                    placeholder="10"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-yellow-400 text-sm font-bold">pts</span>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Botones de acción premium */}
            <div className="flex justify-center gap-6 pt-8">
              {/* Botón cancelar */}
              <button 
                type="button" 
                onClick={onClose} 
                className="group relative overflow-hidden"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative px-8 py-4 bg-[var(--surface-2)]/80 backdrop-blur-sm text-[var(--text-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300 border border-white/10 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
                </div>
              </button>
              
              {/* Botón guardar */}
              <button 
                type="submit" 
                className="group relative overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                
                <div className="relative px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-xl hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-2xl shadow-purple-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                  <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg" />
                  
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Cambios
                  </span>
                  
                  <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;