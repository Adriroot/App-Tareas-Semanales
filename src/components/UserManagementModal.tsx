// Archivo: src/components/UserManagementModal.tsx - Gestión de usuarios para admins

import React, { useState, useRef, useEffect } from 'react';
import { doc, updateDoc, arrayRemove, deleteDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Household } from '../types';
import { UsersIcon, XMarkIcon, TrashIcon, UserMinusIcon, CrownIcon } from './icons';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  householdUsers: UserProfile[];
  onUserRemoved: (userId: string) => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  householdUsers,
  onUserRemoved 
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const removeUserFromHousehold = async (userToRemove: UserProfile) => {
    if (!currentUser.householdId || currentUser.role !== 'admin') {
      setError("No tienes permisos para realizar esta acción.");
      return;
    }

    setLoading(userToRemove.uid);
    setError(null);

    try {
      const batch = writeBatch(db);
      
      // Obtener datos del household actual
      const householdRef = doc(db, 'households', currentUser.householdId);
      const householdDoc = await getDoc(householdRef);
      
      if (!householdDoc.exists()) {
        throw new Error("El hogar no existe.");
      }
      
      const householdData = householdDoc.data() as Household;
      
      // Actualizar household (remover de memberIds y adminIds)
      batch.update(householdRef, {
        memberIds: arrayRemove(userToRemove.uid),
        adminIds: arrayRemove(userToRemove.uid),
        lastUpdated: new Date().toISOString()
      });
      
      // Eliminar el perfil del usuario
      batch.delete(doc(db, 'users', userToRemove.uid));
      
      await batch.commit();
      
      onUserRemoved(userToRemove.uid);
      setError(null);
      
    } catch (err) {
      console.error("Error removing user: ", err);
      setError("Error al expulsar usuario. Inténtalo de nuevo.");
    } finally {
      setLoading(null);
    }
  };

  const promoteToAdmin = async (userToPromote: UserProfile) => {
    if (!currentUser.householdId || currentUser.role !== 'admin') {
      setError("No tienes permisos para realizar esta acción.");
      return;
    }

    setLoading(userToPromote.uid);
    setError(null);

    try {
      const batch = writeBatch(db);
      
      // Actualizar rol del usuario
      batch.update(doc(db, 'users', userToPromote.uid), {
        role: 'admin'
      });
      
      // Añadir a adminIds del household
      const householdRef = doc(db, 'households', currentUser.householdId);
      const householdDoc = await getDoc(householdRef);
      
      if (householdDoc.exists()) {
        const householdData = householdDoc.data() as Household;
        const currentAdmins = householdData.adminIds || [];
        
        if (!currentAdmins.includes(userToPromote.uid)) {
          batch.update(householdRef, {
            adminIds: [...currentAdmins, userToPromote.uid],
            lastUpdated: new Date().toISOString()
          });
        }
      }
      
      await batch.commit();
      setError(null);
      
    } catch (err) {
      console.error("Error promoting user: ", err);
      setError("Error al promover usuario. Inténtalo de nuevo.");
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  // Filtrar usuarios (excluir al usuario actual)
  const otherUsers = householdUsers.filter(user => user.uid !== currentUser.uid);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="relative group max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-2xl blur-lg opacity-40" />
        
        {/* Modal principal */}
        <div 
          ref={modalRef}
          className="relative bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6 animate-scale-in max-h-[80vh] overflow-y-auto"
        >
          {/* Efectos internos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
          
          {/* Header */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                  Gestión de Usuarios
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  Administrar miembros del hogar
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[var(--surface-2)]/80 hover:bg-red-500/80 flex items-center justify-center transition-all duration-300 group"
            >
              <XMarkIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-white" />
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}
          
          {/* Lista de usuarios */}
          <div className="space-y-4">
            {otherUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--surface-2)]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-[var(--text-secondary)]" />
                </div>
                <p className="text-[var(--text-secondary)] font-medium">
                  No hay otros usuarios en el hogar
                </p>
              </div>
            ) : (
              otherUsers.map((user) => (
                <div key={user.uid} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-4 bg-[var(--surface-1)]/80 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${user.color || '#6A5BFF'}80, ${user.color || '#6A5BFF'}40)` 
                        }}
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          user.displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                          {user.displayName}
                          {user.role === 'admin' && (
                            <CrownIcon className="w-4 h-4 text-yellow-500" />
                          )}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {user.role === 'admin' ? 'Administrador' : 'Miembro'}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Se unió: {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Fecha desconocida'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      {/* Promover a admin (solo si no es admin ya) */}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => promoteToAdmin(user)}
                          disabled={loading === user.uid}
                          className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-xl transition-all duration-300 text-xs font-bold flex items-center gap-1"
                        >
                          <CrownIcon className="w-3 h-3" />
                          Hacer Admin
                        </button>
                      )}
                      
                      {/* Expulsar usuario */}
                      <button
                        onClick={() => removeUserFromHousehold(user)}
                        disabled={loading === user.uid}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl transition-all duration-300 text-xs font-bold flex items-center gap-1"
                      >
                        {loading === user.uid ? (
                          <div className="w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UserMinusIcon className="w-3 h-3" />
                        )}
                        Expulsar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-[var(--text-secondary)] text-center">
              Solo los administradores pueden gestionar usuarios. Los cambios se aplican inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;