// Archivo: src/components/UserProfileSetup.tsx - VERSIÓN PREMIUM Y FUTURISTA

import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { UsersIcon, KeyIcon, PaintBrushIcon, SparklesIcon, HomeIcon } from './icons';

const PRESET_COLORS = ['#6A5BFF', '#EF4444', '#38BDF8', '#F97316', '#EC4899', '#84CC16'];

interface UserProfileSetupProps {
  authUser: FirebaseUser;
  onProfileSaved: (profile: UserProfile) => void;
}

const UserProfileSetup: React.FC<UserProfileSetupProps> = ({ authUser, onProfileSaved }) => {
  const [displayName, setDisplayName] = useState(authUser.displayName || '');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [invitationCode, setInvitationCode] = useState('');
  const [loading, setLoading] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA ORIGINAL COMPLETA ---
  const handleAction = async (action: 'create' | 'join') => {
    if (!displayName.trim()) {
      setError("Por favor, introduce un nombre.");
      return;
    }
    if (action === 'join' && !invitationCode.trim()) {
      setError("Por favor, introduce un código de invitación.");
      return;
    }

    setLoading(action);
    setError(null);

    try {
      let householdId = '';
      if (action === 'create') {
        householdId = uuidv4().substring(0, 8); // Un código más corto y amigable
      } else {
        const householdDocRef = doc(db, 'households', invitationCode.trim());
        const householdDocSnap = await getDoc(householdDocRef);
        
        if (!householdDocSnap.exists()) {
          setError("El código de invitación no es válido.");
          setLoading(null);
          return;
        }
        householdId = householdDocSnap.id;
      }
      
      const userProfile: UserProfile = {
        uid: authUser.uid,
        displayName: displayName.trim(),
        householdId,
        color: selectedColor,
        photoURL: authUser.photoURL || null,
      };

      const batch = writeBatch(db);
      batch.set(doc(db, 'users', authUser.uid), userProfile);
      
      const householdDocRef = doc(db, 'households', householdId);

      if (action === 'create') {
        batch.set(householdDocRef, { id: householdId, memberIds: [authUser.uid] });
        batch.set(doc(db, 'householdState', householdId), {
           weekStartDate: new Date().toISOString(),
           unlockedAchievements: [],
        });
      } else {
        const householdData = (await getDoc(householdDocRef)).data();
        batch.update(householdDocRef, {
            memberIds: [...(householdData?.memberIds || []), authUser.uid]
        });
      }

      await batch.commit();
      onProfileSaved(userProfile);

    } catch (err) {
      console.error("Error setting up profile: ", err);
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)] overflow-hidden">
      {/* Efectos de fondo principales */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse opacity-60" style={{ animationDuration: '8s' }} />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-cyan-500/5 to-teal-500/5 blur-3xl opacity-40" />
      
      {/* Partículas ambientales flotantes */}
      <div className="fixed top-20 left-20 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse" />
      <div className="fixed top-1/3 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="fixed bottom-20 right-20 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }} />
      
      {/* Anillos orbitales de fondo */}
      <div className="fixed top-1/4 -left-1/4 w-[800px] h-[800px] border border-purple-500/10 rounded-full animate-rotate-slow opacity-30" style={{ borderStyle: 'dashed' }} />
      <div className="fixed bottom-1/4 -right-1/4 w-[900px] h-[900px] border border-blue-500/10 rounded-full animate-rotate-slow opacity-20" style={{ borderStyle: 'dashed', animationDirection: 'reverse', animationDuration: '30s' }} />
      
      <div className="relative z-10 w-full max-w-5xl bg-[var(--card)]/80 backdrop-blur-2xl p-10 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        {/* Efectos internos principales */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 rounded-full blur-2xl" />
        {/* Header premium mejorado */}
        <div className="relative text-center mb-12">
          {/* Avatar premium con efectos */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Efectos de fondo para el avatar */}
            <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-lg opacity-60" />
            
            <div 
              className="relative w-32 h-32 rounded-full flex items-center justify-center font-black text-5xl text-white border-4 shadow-2xl overflow-hidden group hover:scale-110 transition-all duration-500"
              style={{ 
                backgroundColor: selectedColor, 
                borderColor: selectedColor,
                boxShadow: `0 20px 60px ${selectedColor}40`
              }}
            >
              {/* Efectos internos del avatar */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              
              {authUser.photoURL ? (
                <img src={authUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="drop-shadow-lg">{displayName.charAt(0).toUpperCase() || '?'}</span>
              )}
              
              {/* Partículas en el avatar */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
              <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Anillo orbital del avatar */}
            <div 
              className="absolute -inset-6 border-2 rounded-full animate-rotate-slow opacity-40"
              style={{ 
                borderColor: selectedColor + '40',
                borderStyle: 'dashed'
              }}
            />
          </div>
          
          {/* Títulos premium */}
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
              ¡Bienvenido,
              <span className="block text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                {displayName || 'Invitado'}!
              </span>
            </h2>
            
            <p className="text-xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
              Vamos a configurar tu perfil premium para empezar la experiencia definitiva
            </p>
            
            {/* Línea decorativa */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-indigo-400" />
              <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-pink-400 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Sección de configuración premium */}
        <div className="relative space-y-8 max-w-2xl mx-auto mb-12">
          {/* Input premium */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <input
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre de usuario premium" 
                required
                className="w-full px-6 py-4 bg-[var(--surface-1)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300 focus:scale-102 text-lg font-medium"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>

          {/* Selector de color premium */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-300/20">
                <PaintBrushIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                Elige tu color de identificación premium
              </h3>
            </div>
            
            <div className="relative p-8 bg-[var(--surface-1)]/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-2xl pointer-events-none" />
              
              <div className="flex flex-wrap gap-5 justify-center">
                {PRESET_COLORS.map((color, index) => (
                  <div key={color} className="relative group/color animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    {/* Efectos de fondo para cada color */}
                    <div 
                      className="absolute -inset-3 rounded-full blur-xl opacity-0 group-hover/color:opacity-60 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }}
                    />
                    
                    <button 
                      type="button" 
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-16 h-16 rounded-2xl transition-all duration-500 transform hover:scale-125 shadow-lg group-hover/color:shadow-2xl ${
                        selectedColor === color 
                          ? 'ring-4 ring-white/80 ring-offset-4 ring-offset-[var(--surface-1)] scale-125' 
                          : ''
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: selectedColor === color 
                          ? `0 15px 50px ${color}60, 0 5px 20px ${color}40` 
                          : `0 8px 25px ${color}40`
                      }}
                    >
                      {/* Efectos internos del botón de color */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent rounded-2xl" />
                      
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <SparklesIcon className="w-7 h-7 text-white drop-shadow-lg animate-pulse" />
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
                
                {/* Selector de color personalizado premium */}
                <div className="relative group/custom animate-fade-in" style={{ animationDelay: `${PRESET_COLORS.length * 150}ms` }}>
                  <div className="absolute -inset-3 bg-gradient-to-r from-slate-500/30 to-slate-400/30 rounded-2xl blur-xl opacity-0 group-hover/custom:opacity-60 transition-opacity duration-500" />
                  
                  <label className="relative w-16 h-16 rounded-2xl cursor-pointer bg-gradient-to-br from-slate-500/30 to-slate-600/30 flex items-center justify-center hover:scale-125 transition-all duration-500 border-2 border-slate-400/40 shadow-lg hover:shadow-2xl">
                    <input 
                      type="color" 
                      value={selectedColor} 
                      onChange={(e) => setSelectedColor(e.target.value)} 
                      className="opacity-0 w-0 h-0 absolute" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                    <PaintBrushIcon className="w-7 h-7 text-slate-200 drop-shadow-lg" />
                    
                    {/* Partícula para el selector personalizado */}
                    <div className="absolute top-1 right-1 w-1 h-1 bg-slate-200/60 rounded-full animate-pulse" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de acción premium */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Crear hogar premium */}
          <div className="relative group">
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-2xl blur-md opacity-40" />
            
            <div className="relative p-8 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-3xl border border-white/10 text-center flex flex-col justify-between shadow-2xl min-h-[280px] group-hover:scale-102 transition-all duration-300">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl" />
              
              {/* Partículas */}
              <div className="absolute top-6 left-8 w-1 h-1 bg-green-400/40 rounded-full animate-pulse" />
              <div className="absolute bottom-6 right-8 w-0.5 h-0.5 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="space-y-6">
                {/* Icono premium */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '3s' }} />
                  
                  <div className="relative w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center border border-green-300/30 shadow-xl">
                    <HomeIcon className="w-8 h-8 text-green-400" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-3xl" />
                  </div>
                  
                  {/* Anillo orbital */}
                  <div className="absolute -inset-2 border-2 border-green-400/20 rounded-full animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
                    Crear un Hogar
                    <span className="block text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Nuevo
                    </span>
                  </h3>
                  <p className="text-[var(--text-secondary)] text-lg font-medium">
                    Empieza de cero e invita a otros a tu hogar premium
                  </p>
                </div>
              </div>
              
              {/* Botón premium */}
              <div className="relative mt-8 group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                
                <button 
                  onClick={() => handleAction('create')} 
                  disabled={!!loading} 
                  className="relative w-full font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 hover:shadow-green-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                  
                  {loading === 'create' ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <SparklesIcon className="w-5 h-5" />
                      <span>Crear Hogar Premium</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Unirse a hogar premium */}
          <div className="relative group">
            {/* Efectos de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-2xl blur-md opacity-40" />
            
            <div className="relative p-8 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-3xl border border-white/10 text-center flex flex-col justify-between shadow-2xl min-h-[280px] group-hover:scale-102 transition-all duration-300">
              {/* Efectos internos */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
              
              {/* Partículas */}
              <div className="absolute top-6 left-8 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse" />
              <div className="absolute bottom-6 right-8 w-0.5 h-0.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              
              <div className="space-y-6">
                {/* Icono premium */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '3s' }} />
                  
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center border border-blue-300/30 shadow-xl">
                    <KeyIcon className="w-8 h-8 text-blue-400" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-3xl" />
                  </div>
                  
                  {/* Anillo orbital */}
                  <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-full animate-rotate-slow opacity-40" style={{ borderStyle: 'dashed' }} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tight">
                    Unirse a un
                    <span className="block text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Hogar Existente
                    </span>
                  </h3>
                  <p className="text-[var(--text-secondary)] text-lg font-medium">
                    Ingresa un código de invitación premium
                  </p>
                </div>
              </div>
              
              {/* Input y botón premium */}
              <div className="space-y-4 mt-8">
                {/* Input premium */}
                <div className="relative group/input">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                  
                  <input
                    type="text" 
                    value={invitationCode} 
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Código de Invitación Premium"
                    className="relative w-full text-center px-4 py-3 bg-[var(--surface-2)]/80 backdrop-blur-sm border border-white/10 rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-300 focus:scale-102 font-bold"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                </div>
                
                {/* Botón premium */}
                <div className="relative group/btn">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  <button 
                    onClick={() => handleAction('join')} 
                    disabled={!!loading || !invitationCode.trim()} 
                    className="relative w-full font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-2xl py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 hover:shadow-blue-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                    
                    {loading === 'join' ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uniendose...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <KeyIcon className="w-5 h-5" />
                        <span>Unirse con Código</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error message premium */}
        {error && (
          <div className="relative mt-8 group animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-60" />
            
            <div className="relative p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              <p className="text-red-400 font-bold text-lg">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSetup;