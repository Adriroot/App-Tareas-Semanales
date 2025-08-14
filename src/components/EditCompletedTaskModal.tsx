// Modal específico para editar tareas completadas (solo nombre y día)
import React, { useState, useEffect } from 'react';
import { Task, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { PencilSquareIcon, CheckCircleIcon } from './icons';

interface EditCompletedTaskModalProps {
  isOpen: boolean;
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onClose: () => void;
}

const EditCompletedTaskModal: React.FC<EditCompletedTaskModalProps> = ({ 
  isOpen, 
  task, 
  onUpdate, 
  onClose 
}) => {
  const [name, setName] = useState(task.name);
  const [day, setDay] = useState<DayOfWeek>(task.day);

  useEffect(() => {
    setName(task.name);
    setDay(task.day);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    // Solo actualizar nombre y día, mantener todo lo demás igual
    const updatedTask: Task = {
      ...task,
      name: name.trim(),
      day
    };

    onUpdate(updatedTask);
  };

  const handleMarkAsIncomplete = () => {
    // Crear tarea marcada como no completada
    const updatedTask: Task = {
      ...task,
      name: name.trim(),
      day,
      isCompleted: false,
      completedBy: null
    };

    onUpdate(updatedTask);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Editar tarea completada
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Solo puedes cambiar el nombre y el día
              </p>
            </div>
          </div>

          {/* Información de estado */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Tarea completada</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] space-y-1">
              <p>• Completada por: <strong>{task.completedBy?.displayName}</strong></p>
              <p>• Puntos obtenidos: <strong>{task.points} pts</strong></p>
              <p>• Para cambiar puntos o asignación, márcala como pendiente</p>
            </div>
          </div>

          {/* Campos editables */}
          <div className="space-y-4 mb-6">
            {/* Nombre */}
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Nombre de la tarea
              </label>
              <input
                id="taskName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-white/10 rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Nombre de la tarea..."
                required
                autoFocus
              />
            </div>

            {/* Día */}
            <div>
              <label htmlFor="taskDay" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Día de la semana
              </label>
              <select
                id="taskDay"
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-white/10 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              >
                {DAYS_OF_WEEK.map(dayOption => (
                  <option key={dayOption} value={dayOption}>
                    {dayOption.charAt(0).toUpperCase() + dayOption.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campos no editables (mostrar solo como info) */}
          <div className="bg-[var(--surface-2)]/50 rounded-xl p-4 mb-6 space-y-2">
            <h4 className="font-medium text-[var(--text-primary)] text-sm mb-2">
              Información no editable:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Puntos:</span>
                <span className="ml-2 font-medium text-[var(--text-primary)]">{task.points}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Asignado a:</span>
                <span className="ml-2 font-medium text-[var(--text-primary)]">
                  {task.assignedTo?.displayName || 'Cualquiera'}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            {/* Botones principales */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-[var(--surface-2)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--surface-1)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Guardar cambios
              </button>
            </div>

            {/* Botón para marcar como pendiente */}
            <button
              type="button"
              onClick={handleMarkAsIncomplete}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
            >
              ⚠️ Marcar como pendiente (permitirá edición completa)
            </button>
          </div>

          {/* Nota informativa */}
          <p className="text-xs text-[var(--text-secondary)] mt-4 text-center opacity-75">
            💡 Si marcas como pendiente, se revertirán los puntos del historial
          </p>
        </form>
      </div>
    </div>
  );
};

export default EditCompletedTaskModal;