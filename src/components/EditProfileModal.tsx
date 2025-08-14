// Archivo: src/components/EditProfileModal.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { UserCircleIcon, PaintBrushIcon, SparklesIcon } from './icons';

const PRESET_COLORS = [
  { color: '#6A5BFF', name: 'Violeta Espacial' },
  { color: '#EF4444', name: 'Rojo Fuego' },
  { color: '#38BDF8', name: 'Azul Océano' },
  { color: '#F97316', name: 'Naranja Solar' },
  { color: '#EC4899', name: 'Rosa Neón' },
  { color: '#84CC16', name: 'Verde Cristal' },
  { color: '#8B5CF6', name: 'Púrpura Real' },
  { color: '#06B6D4', name: 'Cian Eléctrico' }
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onProfileUpdated }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [selectedColor, setSelectedColor] = useState(currentUser.color || PRESET_COLORS[0].color);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `edit-profile-title`;

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentUser.displayName);
      setSelectedColor(currentUser.color || PRESET_COLORS[0].color);
      setError(null);
    }
  }, [isOpen, currentUser]);

  // Lógica para accesibilidad (Escape y Focus Trap)
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
    
    // Enfocar el primer input al abrir
    const firstInput = modalRef.current?.querySelector('input');
    firstInput?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { setError("El nombre no puede estar vacío."); return; }
    setLoading(true); setError(null);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedProfileData = { displayName: displayName.trim(), color: selectedColor };
      await updateDoc(userRef, updatedProfileData);
      onProfileUpdated({ ...currentUser, ...updatedProfileData });
      onClose();
    } catch (err) {
      console.error("Error updating profile: ", err);
      setError("Error al actualizar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedColorData = PRESET_COLORS.find(c => c.color === selectedColor) || PRESET_COLORS[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in" onClick={onClose}>
      {/* Efectos de fondo ambientales */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
      </div>
      
      <div 
        className="relative group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo del modal */}
        <div 
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"
          style={{ 
            background: `radial-gradient(circle at 30% 50%, ${selectedColor}30 0%, transparent 70%)`,
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute -inset-2 rounded-2xl blur-lg opacity-40"
          style={{ background: `${selectedColor}20` }}
        />
        
        {/* Modal principal con glassmorphism premium */}
        <div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative w-full max-w-xl bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8 animate-scale-in"
        >
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
          
          {/* Partículas flotantes */}
          <div className="absolute top-6 left-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" />
          <div className="absolute bottom-8 right-10 w-0.5 h-0.5 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Header mejorado */}
          <div className="text-center">
            {/* Avatar con preview del color */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div 
                className="absolute -inset-4 rounded-full blur-2xl opacity-60 animate-pulse"
                style={{ background: `radial-gradient(circle, ${selectedColor}40 0%, transparent 70%)` }}
              />
              
              <div 
                className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl group-hover:scale-110 transition-transform duration-300"
                style={{ 
                  borderColor: selectedColor,
                  background: currentUser.photoURL 
                    ? 'transparent' 
                    : `linear-gradient(135deg, ${selectedColor}80, ${selectedColor}40)`,
                  boxShadow: `0 8px 32px ${selectedColor}30`
                }}
              >
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                
                {currentUser.photoURL ? (
                  <>
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="w-full h-full object-cover rounded-full"
                    />
                    {/* Overlay para fotos */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-white drop-shadow-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    {/* Partículas en avatar */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                    <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </>
                )}
                
                {/* Anillo giratorio */}
                <div 
                  className="absolute -inset-1 border-2 opacity-30 rounded-full animate-rotate-slow"
                  style={{ borderColor: selectedColor, borderStyle: 'dashed' }}
                />
              </div>
              
              {/* Icono de edición */}
              <div className="absolute -bottom-1 -right-1">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <h3 id={titleId} className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
              Personalizar
              <span className="block text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Perfil
              </span>
            </h3>
            <p className="text-lg text-[var(--text-secondary)] font-medium">
              Haz que tu identidad 
              <span className="text-purple-300 font-semibold"> brille única</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campo nombre mejorado */}
            <div className="relative">
              <label htmlFor="displayName" className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-3">
                <UserCircleIcon className="w-4 h-4" />
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  id="displayName" 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-5 py-4 bg-[var(--input-bg)]/80 backdrop-blur-sm border border-[var(--input-border)]/50 rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all duration-300 shadow-lg font-medium text-lg"
                  placeholder="Tu nombre único..."
                />
                {/* Efecto de enfoque */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Preview en tiempo real */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedColor}80, ${selectedColor}40)` 
                    }}
                  >
                    {displayName.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de color premium */}
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-4">
                <PaintBrushIcon className="w-4 h-4" />
                Color de Identidad
              </label>
              
              {/* Color seleccionado actual */}
              <div className="mb-6 p-4 rounded-2xl border border-white/10" style={{ backgroundColor: `${selectedColor}10` }}>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl shadow-2xl border-4 border-white/20 relative group"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-sm" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[var(--text-primary)]">
                      {selectedColorData.name}
                    </p>
                    <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      {selectedColor}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Grid de colores */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {PRESET_COLORS.map((colorData, index) => (
                  <button 
                    type="button" 
                    key={colorData.color} 
                    onClick={() => setSelectedColor(colorData.color)}
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Efectos de fondo para cada color */}
                    <div 
                      className="absolute -inset-2 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle, ${colorData.color}40 0%, transparent 70%)` }}
                    />
                    
                    <div 
                      className={`relative w-14 h-14 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-xl border-2 ${
                        selectedColor === colorData.color 
                          ? 'border-white scale-110 shadow-2xl' 
                          : 'border-white/20 group-hover:border-white/40'
                      }`}
                      style={{ 
                        backgroundColor: colorData.color,
                        boxShadow: selectedColor === colorData.color 
                          ? `0 8px 32px ${colorData.color}40, 0 0 20px ${colorData.color}30`
                          : `0 4px 16px ${colorData.color}20`
                      }}
                    >
                      {/* Efectos internos */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                      
                      {/* Checkmark para color seleccionado */}
                      {selectedColor === colorData.color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Partícula de brillo */}
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                    </div>
                    
                    {/* Tooltip con nombre del color */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="bg-[var(--card)]/90 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 shadow-xl">
                        <p className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
                          {colorData.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selector de color personalizado */}
              <div className="relative">
                <label className="group block w-full p-4 bg-[var(--surface-1)]/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <input 
                    type="color" 
                    value={selectedColor} 
                    onChange={(e) => setSelectedColor(e.target.value)} 
                    className="opacity-0 w-0 h-0 absolute" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PaintBrushIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">Color Personalizado</p>
                      <p className="text-xs text-[var(--text-secondary)]">Elige cualquier color que desees</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Error message mejorado */}
            {error && (
              <div className="relative p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">⚠️</span>
                  </div>
                  <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
              </div>
            )}

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
                disabled={loading}
                className="group relative overflow-hidden"
              >
                <div 
                  className="absolute -inset-1 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${selectedColor}40, ${selectedColor}60)` }}
                />
                <div 
                  className="absolute -inset-0.5 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${selectedColor}50, ${selectedColor}70)` }}
                />
                
                <div 
                  className="relative px-10 py-4 text-white font-black rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}DD)`,
                    boxShadow: `0 8px 32px ${selectedColor}30`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                  <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg" />
                  
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
                        Guardar Cambios
                      </>
                    )}
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

export default EditProfileModal;