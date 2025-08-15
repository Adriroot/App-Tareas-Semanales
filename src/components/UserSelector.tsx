// Archivo: src/components/UserSelector.tsx - VERSIÓN OPTIMIZADA MÓVIL

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogoutIcon, ChevronDownIcon, ChevronRightIcon, UsersIcon } from './icons';

interface UserSelectorProps {
  users: UserProfile[];
  currentUser: UserProfile | null;
}

const Avatar: React.FC<{ user: UserProfile, size?: 'sm' | 'lg' }> = ({ user, size = 'lg' }) => {
  const sizeClasses = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-8 h-8 text-sm';

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-semibold text-white border-2 ${sizeClasses}`}
      style={{ 
        borderColor: user.color || '#6A5BFF',
        backgroundColor: user.color || '#6A5BFF'
      }}
    >
      {user.photoURL ? (
        <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span>{user.displayName.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!currentUser || users.length === 0) {
    return null;
  }

  const otherUsers = users.filter(user => user.uid !== currentUser.uid);

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      {/* Header compacto clickeable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--surface-1)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Avatar user={currentUser} size="sm" />
          <div className="text-left">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {currentUser.displayName.split(' ')[0]}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {users.length === 1 ? 'Solo tú' : `${users.length} miembros`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Avatares mini de otros usuarios cuando está contraído */}
          {!isExpanded && otherUsers.length > 0 && (
            <div className="flex -space-x-1">
              {otherUsers.slice(0, 3).map(user => (
                <div key={user.uid} className="w-6 h-6 rounded-full border-2 border-[var(--card)] overflow-hidden">
                  <Avatar user={user} size="sm" />
                </div>
              ))}
              {otherUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-[var(--surface-2)] border-2 border-[var(--card)] flex items-center justify-center">
                  <span className="text-xs text-[var(--text-secondary)]">+{otherUsers.length - 3}</span>
                </div>
              )}
            </div>
          )}
          
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
          )}
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--border)]/50">
          {/* Usuario actual expandido */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Avatar user={currentUser} size="lg" />
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {currentUser.displayName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Tú • Usuario actual
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] bg-[var(--surface-2)] rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Otros usuarios del hogar */}
          {otherUsers.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                Otros miembros ({otherUsers.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {otherUsers.map(user => (
                  <div key={user.uid} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-[var(--surface-1)] border border-[var(--border)]">
                    <Avatar user={user} size="sm" />
                    <span className="text-xs text-[var(--text-secondary)] text-center truncate w-full">
                      {user.displayName.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSelector;