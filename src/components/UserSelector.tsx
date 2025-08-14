// Archivo: src/components/UserSelector.tsx - VERSIÓN FINAL Y COMPATIBLE

import React from 'react';
import { UserProfile } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogoutIcon } from './icons';

interface UserSelectorProps {
  users: UserProfile[];
  currentUser: UserProfile | null;
}

// Avatar premium con efectos futuristas
const Avatar: React.FC<{ user: UserProfile, size?: 'sm' | 'lg' }> = ({ user, size = 'lg' }) => {
  const sizeClasses = size === 'lg' 
    ? 'w-18 h-18 text-2xl' 
    : 'w-12 h-12 text-lg';

  const borderSize = size === 'lg' ? '4px' : '3px';

  return (
    <div className="relative group">
      {/* Efectos de fondo */}
      <div 
        className="absolute -inset-2 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
        style={{ 
          background: `radial-gradient(circle, ${user.color || '#6A5BFF'}40 0%, transparent 70%)`,
          animationDuration: '3s'
        }}
      />
      <div 
        className="absolute -inset-1 rounded-full blur-md opacity-40"
        style={{ background: `${user.color || '#6A5BFF'}30` }}
      />
      
      {/* Avatar principal */}
      <div 
        className={`relative flex-shrink-0 rounded-full flex items-center justify-center font-black text-white shadow-2xl group-hover:scale-110 transition-all duration-500 backdrop-blur-sm ${sizeClasses}`}
        style={{ 
          borderColor: user.color || '#6A5BFF',
          borderWidth: borderSize,
          borderStyle: 'solid',
          background: user.photoURL 
            ? 'transparent' 
            : `linear-gradient(135deg, ${user.color || '#6A5BFF'}80, ${user.color || '#6A5BFF'}40)`,
          boxShadow: `0 8px 32px ${user.color || '#6A5BFF'}30`
        }}
      >
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        
        {user.photoURL ? (
          <>
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="rounded-full w-full h-full object-cover"
            />
            {/* Overlay para fotos */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
          </>
        ) : (
          <>
            <span className="relative z-10 drop-shadow-lg">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
            {/* Partículas en avatares sin foto */}
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
        
        {/* Anillo exterior animado */}
        <div 
          className="absolute -inset-1 rounded-full border opacity-30 animate-rotate-slow"
          style={{ 
            borderColor: user.color || '#6A5BFF',
            borderWidth: '1px',
            borderStyle: 'dashed'
          }}
        />
      </div>
      
      {/* Indicador de estado para avatar grande */}
      {size === 'lg' && (
        <div className="absolute -bottom-1 -right-1">
          <div className="relative">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{ 
                background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                boxShadow: '0 0 12px #22c55e50'
              }}
            />
            {/* Pulso del indicador */}
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40" />
          </div>
        </div>
      )}
    </div>
  );
};

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser }) => {
  const handleSignOut = async () => {
    try { await signOut(auth); } 
    catch (error) { console.error("Error signing out: ", error); }
  };

  if (!currentUser) return null;
  
  const otherUsers = users.filter(u => u.uid !== currentUser.uid);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Efectos de fondo */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-violet-500/10 rounded-3xl blur-xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-40" />
      
      {/* Contenedor principal con glassmorphism */}
      <div className="relative p-4 sm:p-6 rounded-2xl border border-white/10 bg-[var(--card)]/80 backdrop-blur-2xl shadow-2xl">
        {/* Efectos internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
        <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
        
        {/* Partículas ambientales */}
        <div className="absolute top-4 left-6 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative flex items-center justify-between gap-6">
        
          <div className="flex items-center gap-6">
            <Avatar user={currentUser} size="lg" />
            <div className="flex-1">
              {/* Badge de estado */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">Online</span>
              </div>
              
              {/* Información del usuario */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                  {currentUser.displayName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  Administrador del hogar
                </p>
              </div>
              
              {/* Barra de nivel/progreso decorativa */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: '75%' }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)]">Nivel 5</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Otros usuarios */}
            {otherUsers.length > 0 && (
              <div className="hidden sm:flex items-center gap-3 border-r border-white/10 pr-4">
                <div className="text-center">
                  <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Equipo</p>
                  <div className="flex items-center gap-2">
                    {otherUsers.slice(0, 3).map((user, index) => (
                      <div key={user.uid} className="group relative" style={{ zIndex: otherUsers.length - index }}>
                        <div style={{ marginLeft: index > 0 ? '-8px' : '0' }}>
                          <Avatar user={user} size="sm" />
                        </div>
                        {/* Tooltip mejorado */}
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                          <div className="bg-[var(--card)]/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
                            <p className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">{user.displayName}</p>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--card)]/90 border-l border-b border-white/10 rotate-45" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {otherUsers.length > 3 && (
                      <div className="w-12 h-12 rounded-full bg-[var(--surface-2)]/50 backdrop-blur-sm border-2 border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]" style={{ marginLeft: '-8px' }}>
                        +{otherUsers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botón de logout premium */}
            <button
              onClick={handleSignOut}
              className="group relative overflow-hidden"
              aria-label="Cerrar Sesión"
            >
              {/* Efectos de fondo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-rose-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Botón principal */}
              <div className="relative flex items-center justify-center w-14 h-14 bg-[var(--surface-2)]/80 backdrop-blur-sm hover:bg-red-500/80 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 border border-white/10 shadow-xl">
                {/* Efectos internos */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                
                <LogoutIcon className="relative w-6 h-6 text-[var(--text-secondary)] group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                
                {/* Partícula de advertencia */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
                
                {/* Efecto de barrido */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserSelector;