// Archivo: src/components/AddTaskForm.tsx - VERSIÓN CORREGIDA Y FINAL

import React, { useId, useState } from 'react';
import { Task, DayOfWeek, UserProfile } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { PlusIcon, SparklesIcon, CalendarIcon, UserIcon, StarIcon, TaskIcon } from './icons';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted' | 'householdId' | 'completedBy'>) => void;
  users: UserProfile[];
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, users }) => {
  const nameId = useId();
  const dayId = useId();
  const userId = useId();
  const pointsId = useId();

  const [name, setName] = useState('');
  const [day, setDay] = useState<DayOfWeek>(DayOfWeek.Lunes);
  // --- CAMBIO 1: El estado ahora solo guarda el UID del usuario seleccionado ---
  const [assignedToUid, setAssignedToUid] = useState<string>('');
  const [points, setPoints] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dayEmojis: Record<DayOfWeek, string> = {
    [DayOfWeek.Lunes]: '🌅',
    [DayOfWeek.Martes]: '💪',
    [DayOfWeek.Miércoles]: '⚡',
    [DayOfWeek.Jueves]: '🎯',
    [DayOfWeek.Viernes]: '🎉',
    [DayOfWeek.Sábado]: '🌟',
    [DayOfWeek.Domingo]: '🏖️',
  };

  const taskSuggestions: Array<{ label: string; value: string }> = [
    { label: '🧹 Limpiar cocina', value: 'Limpiar cocina' },
    { label: '🧺 Lavar ropa', value: 'Lavar ropa' },
    { label: '🍽️ Lavar platos', value: 'Lavar platos' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAnimating(true);
    const timeout = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;

    setTimeout(() => {
      // --- CAMBIO 2: Lógica para crear el objeto de usuario o null ---
      const assignedUser = users.find(u => u.uid === assignedToUid);
      const userToAssign = assignedUser ? { uid: assignedUser.uid, displayName: assignedUser.displayName } : null;

      onAddTask({
        name: name.trim(),
        day,
        assignedTo: userToAssign,
        points: Math.max(1, Math.min(100, points)),
      });
      
      // Reseteamos el formulario
      setName('');
      setPoints(10);
      setAssignedToUid('');
      setIsExpanded(false);
      setIsAnimating(false);
    }, timeout);
  };

  const handleCancel = () => {
    setIsAnimating(true);
    const timeout = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
    setTimeout(() => {
      setIsExpanded(false);
      setIsAnimating(false);
    }, timeout);
  };

  if (!isExpanded) {
    return (
      <div className="flex justify-center my-8">
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative overflow-hidden"
        >
          {/* Efectos de fondo */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/50 via-blue-500/50 to-violet-600/50 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Botón principal */}
          <div className="relative flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            {/* Efectos internos */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
            <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            
            {/* Contenido */}
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <SparklesIcon className="w-7 h-7 text-white group-hover:animate-pulse" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <span className="text-xl font-black text-white tracking-tight">
                Añadir Tarea Nueva
              </span>
              
              <div className="relative">
                <PlusIcon className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`my-8 transition-all duration-500 ease-out motion-reduce:transition-none ${
        isAnimating ? 'opacity-0 scale-95 motion-reduce:scale-100' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative">
        {/* Efectos de fondo exteriores */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-violet-600/20 rounded-3xl blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-3xl blur-xl opacity-60" />
        
        {/* Contenedor principal con glassmorphism premium */}
        <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-800/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Efectos de luz internos */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-violet-500/20 to-pink-500/20 rounded-full blur-2xl" />
          
          {/* Partículas flotantes */}
          <div className="absolute top-6 right-12 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-12 right-20 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <form onSubmit={handleSubmit} className="relative space-y-6" noValidate>
          <div className="text-center mb-8">
            {/* Icono mejorado */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-3xl blur-lg animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <TaskIcon className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
              </div>
            </div>
            
            {/* Título mejorado */}
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
              Crear
              <span className="block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Tarea Nueva
              </span>
            </h3>
            
            <p className="text-lg text-slate-300 font-medium">
              Organiza tu hogar con
              <span className="text-purple-300 font-semibold"> estilo futurista</span> 🚀
            </p>
            
            {/* Indicadores de estado */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Sistema Activo</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <span>IA Asistida</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor={nameId} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <TaskIcon className="w-5 h-5" />
              Nombre de la Tarea
            </label>
            <div className="relative">
              <input
                id={nameId} type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="¿Qué hay que hacer? 🤔" required
                className="w-full px-4 py-4 rounded-xl border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg"
              />
              {/* Efecto de brillo en focus */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
             <div className="flex flex-wrap gap-2 pt-1">
              {taskSuggestions.map((s) => (
                <button
                  key={s.value} type="button" onClick={() => setName(s.value)}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor={dayId} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CalendarIcon className="w-5 h-5" />
                Día de la Semana
              </label>
              <div className="relative">
                <select
                  id={dayId} value={day} onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className="w-full px-4 py-4 pr-12 rounded-xl border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg"
                >
                  {DAYS_OF_WEEK.map((d) => (<option key={d} value={d}>{dayEmojis[d as DayOfWeek]} {d}</option>))}
                </select>
                {/* Icono de dropdown personalizado */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor={userId} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <UserIcon className="w-5 h-5" />
                Asignar a
              </label>
              <div className="relative">
                <select
                  id={userId}
                  value={assignedToUid}
                  onChange={(e) => setAssignedToUid(e.target.value)}
                  className="w-full px-4 py-4 pr-12 rounded-xl border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg"
                >
                  <option value="">🎲 Cualquiera</option>
                  {users.map((u) => (<option key={u.uid} value={u.uid}>👤 {u.displayName}</option>))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor={pointsId} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <StarIcon className="w-5 h-5" />
                Puntos
              </label>
              <div className="relative">
                <input
                  id={pointsId} type="number" value={points}
                  onChange={(e) => setPoints(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
                  min={1} max={100}
                  className="w-full px-4 py-4 rounded-xl border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-yellow-400 text-sm font-bold">pts</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8">
            {/* Botón cancelar mejorado */}
            <button
              type="button" onClick={handleCancel}
              className="group relative overflow-hidden px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-sm rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 via-slate-500/50 to-slate-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative text-slate-300 font-semibold group-hover:text-white transition-colors duration-300">
                Cancelar
              </span>
            </button>
            
            {/* Botón submit mejorado */}
            <button
              type="submit" disabled={!name.trim()}
              className={`group relative overflow-hidden px-10 py-4 rounded-xl transition-all duration-300 ${
                name.trim() 
                  ? 'hover:scale-105 shadow-2xl hover:shadow-purple-500/40' 
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              {name.trim() ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-blue-400/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-3 text-white font-bold">
                    <SparklesIcon className="w-6 h-6 group-hover:animate-pulse" />
                    Crear Tarea
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-slate-600 rounded-xl" />
                  <span className="relative flex items-center gap-3 text-slate-400 font-bold">
                    <SparklesIcon className="w-6 h-6" />
                    Crear Tarea
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;