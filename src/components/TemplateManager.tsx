// Archivo: src/components/TemplateManager.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState, useEffect } from 'react';
import { TaskTemplate, Task, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { TrashIcon, BookmarkSquareIcon, FolderOpenIcon, TagIcon, ChevronDownIcon, DocumentDuplicateIcon, SparklesIcon } from './icons';

interface TemplateManagerProps {
  templates: TaskTemplate[];
  tasks: Task[];
  onSave: (name: string, scope: 'day' | 'week', day?: DayOfWeek) => void;
  onLoad: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, tasks, onSave, onLoad, onDelete, onClose }) => {
  const [templateName, setTemplateName] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.Lunes);

  useEffect(() => { const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);

  const handleSave = (scope: 'day' | 'week') => {
    if (!templateName.trim()) { alert("Por favor, dale un nombre a la plantilla."); return; }
    onSave(templateName, scope, scope === 'day' ? selectedDay : undefined);
    setTemplateName('');
  };
  
  const tasksForSelectedDay = tasks.filter(t => t.day === selectedDay).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      {/* Efectos de fondo principales */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse opacity-60" style={{ animationDuration: '6s' }} />
      <div className="fixed inset-0 bg-gradient-to-tl from-cyan-400/5 to-purple-400/5 blur-3xl opacity-40" />
      
      {/* Partículas ambientales */}
      <div className="fixed top-20 left-20 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse" />
      <div className="fixed bottom-20 right-20 w-0.5 h-0.5 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/3 right-1/4 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="relative w-full max-w-5xl bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 space-y-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        {/* Header premium con efectos */}
        <div className="relative text-center mb-8">
          {/* Icono principal con efectos */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full blur-lg opacity-60" />
            
            <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center border border-cyan-300/20 shadow-2xl">
              <BookmarkSquareIcon className="w-10 h-10 text-cyan-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            </div>
            
            {/* Anillo orbital */}
            <div className="absolute -inset-4 border-2 border-cyan-400/20 rounded-full animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
          </div>
          
          <h2 className="text-4xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
            Gestor de
            <span className="block text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-1">
              Plantillas
            </span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
            Ahorra tiempo guardando y cargando configuraciones de tareas premium
          </p>
          
          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full animate-pulse" />
            <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda: Crear Plantilla */}
          <div className="relative group">
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-md opacity-40" />
            
            <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              <div className="absolute top-3 right-4 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl" />
              
              {/* Partículas */}
              <div className="absolute top-4 left-6 w-1 h-1 bg-green-400/40 rounded-full animate-pulse" />
              <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              
              <h3 className="flex items-center gap-3 font-black text-xl mb-6 text-[var(--text-primary)] tracking-tight">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-300/20">
                  <SparklesIcon className="w-5 h-5 text-green-400" />
                </div>
                Crear Nueva Plantilla
              </h3>
            
              <div className="space-y-6">
                {/* Input premium */}
                <div className="relative group/input">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] z-10" />
                    <input
                      type="text" 
                      value={templateName} 
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Nombre para la nueva plantilla premium..."
                      className="relative w-full pl-12 pr-4 py-4 bg-[var(--surface-2)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg transition-all duration-300 focus:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                  </div>
                </div>

                {/* Botón de guardar semana premium */}
                <div className="relative group/week">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover/week:opacity-100 transition-opacity duration-300" />
                  
                  <button 
                    onClick={() => handleSave('week')} 
                    className="relative w-full flex justify-between items-center px-6 py-4 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 hover:shadow-purple-500/25" 
                    disabled={tasks.length === 0}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                    <div className="flex items-center gap-2">
                      <DocumentDuplicateIcon className="w-5 h-5" />
                      <span>Guardar Semana Completa</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-xl">
                      <SparklesIcon className="w-3 h-3" />
                      <span className="text-sm font-black">{tasks.length}</span>
                    </div>
                  </button>
                </div>

                <div className="flex gap-4">
                  {/* Selector premium */}
                  <div className="relative flex-1 group/select">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/select:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none z-10" />
                      <select 
                        value={selectedDay} 
                        onChange={e => setSelectedDay(e.target.value as DayOfWeek)} 
                        className="relative w-full appearance-none pl-4 pr-12 py-4 bg-[var(--surface-2)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-300 font-bold cursor-pointer hover:scale-102"
                      >
                        {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Botón de guardar día premium */}
                  <div className="relative flex-1 group/day">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover/day:opacity-100 transition-opacity duration-300" />
                    
                    <button 
                      onClick={() => handleSave('day')} 
                      className="relative w-full flex justify-between items-center px-4 py-4 font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 hover:shadow-blue-500/25" 
                      disabled={tasksForSelectedDay === 0}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                      <div className="flex items-center gap-2">
                        <BookmarkSquareIcon className="w-4 h-4" />
                        <span>Guardar Día</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-xl">
                        <SparklesIcon className="w-3 h-3" />
                        <span className="text-sm font-black">{tasksForSelectedDay}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Cargar Plantilla */}
          <div className="relative group">
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-xl blur-md opacity-40" />
            
            <div className="relative p-6 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              <div className="absolute top-3 right-4 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-2xl" />
              
              {/* Partículas */}
              <div className="absolute top-4 left-6 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse" />
              <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              
              <h3 className="flex items-center gap-3 font-black text-xl mb-6 text-[var(--text-primary)] tracking-tight">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center border border-orange-300/20">
                  <FolderOpenIcon className="w-5 h-5 text-orange-400" />
                </div>
                Plantillas Existentes
              </h3>
              
              {templates.length > 0 ? (
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                  {templates.map((template, index) => (
                    <div 
                      key={template.id} 
                      className="relative group/template animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Efectos de fondo para cada template */}
                      <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover/template:opacity-60 transition-opacity duration-300 ${
                        template.scope === 'week' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                          : 'bg-gradient-to-r from-orange-500/20 to-amber-500/20'
                      }`} />
                      
                      <div className="relative flex items-center justify-between p-4 bg-[var(--card)]/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg group-hover/template:scale-102 transition-all duration-300">
                        {/* Efectos internos */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-2xl" />
                        
                        {/* Barra lateral premium */}
                        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                          template.scope === 'week' 
                            ? 'bg-gradient-to-b from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-b from-orange-500 to-amber-500'
                        }`} style={{ 
                          boxShadow: `0 0 10px ${template.scope === 'week' ? '#A855F7' : '#F97316'}40` 
                        }} />
                        
                        <div className="flex-1 pl-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-black text-lg text-[var(--text-primary)]">{template.name}</span>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                              template.scope === 'week' 
                                ? 'border-purple-400/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400' 
                                : 'border-orange-400/40 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400'
                            }`}>
                              <SparklesIcon className="w-3 h-3" />
                              <span className="text-xs font-bold">
                                {template.scope === 'week' ? 'Semana' : template.day}
                              </span>
                            </div>
                          </div>
                          
                          {/* Información adicional */}
                          <div className="text-sm text-[var(--text-secondary)] font-medium">
                            Plantilla {template.scope === 'week' ? 'semanal' : 'diaria'} premium
                          </div>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                          {/* Botón cargar premium */}
                          <div className="relative group/load">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover/load:opacity-100 transition-opacity duration-300" />
                            
                            <button 
                              onClick={() => onLoad(template.id)} 
                              className="relative px-4 py-2 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                              Cargar
                            </button>
                          </div>
                          
                          {/* Botón eliminar premium */}
                          <div className="relative group/trash">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-lg opacity-0 group-hover/trash:opacity-100 transition-opacity duration-300" />
                            
                            <button 
                              onClick={() => onDelete(template.id)} 
                              className="relative w-10 h-10 flex items-center justify-center bg-[var(--surface-2)]/80 backdrop-blur-sm hover:bg-red-500 rounded-2xl transition-all duration-300 border border-white/10 hover:scale-110 shadow-lg"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                              <TrashIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover/trash:text-white transition-colors duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative text-center py-16">
                  {/* Efectos de estado vacío */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-400/5 rounded-2xl blur-xl opacity-60" />
                  
                  <div className="relative">
                    {/* Icono con efectos */}
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute -inset-4 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-2xl flex items-center justify-center border border-slate-400/20 shadow-lg">
                        <DocumentDuplicateIcon className="w-8 h-8 text-slate-400" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                      </div>
                    </div>
                    
                    <p className="text-lg font-bold text-[var(--text-secondary)] mb-2">Sin Plantillas Guardadas</p>
                    <p className="text-sm text-[var(--text-secondary)] opacity-75">Crea tu primera plantilla premium para empezar</p>
                    
                    {/* Partículas decorativas */}
                    <div className="absolute top-4 left-1/4 w-1 h-1 bg-slate-400/30 rounded-full animate-pulse" />
                    <div className="absolute bottom-4 right-1/4 w-0.5 h-0.5 bg-slate-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer premium */}
        <div className="relative flex justify-end pt-6 border-t border-white/10">
          <div className="relative group/close">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-2xl blur-lg opacity-0 group-hover/close:opacity-100 transition-opacity duration-300" />
            
            <button 
              type="button" 
              onClick={onClose} 
              className="relative px-8 py-3 font-bold bg-[var(--surface-2)]/80 backdrop-blur-sm text-[var(--text-primary)] rounded-2xl hover:bg-[var(--surface-2)] transition-all duration-300 border border-white/10 shadow-lg hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;