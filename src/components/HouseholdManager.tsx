// Archivo: src/components/HouseholdManager.tsx - Gestión de múltiples hogares

import React, { useState, useRef, useEffect } from 'react';
import { doc, updateDoc, deleteDoc, getDoc, writeBatch, collection, query, where, getDocs, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Household } from '../types';
import { HomeIcon, XMarkIcon, PlusIcon, TrashIcon, UserMinusIcon, CrownIcon, UsersIcon, SparklesIcon, PencilIcon, CheckIcon } from './icons';
import { v4 as uuidv4 } from 'uuid';

interface HouseholdManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onHouseholdChanged: (updatedProfile: UserProfile) => void;
  userHouseholds: Household[]; // Hogares del usuario
}

const HouseholdManager: React.FC<HouseholdManagerProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onHouseholdChanged,
  userHouseholds
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHouseholdId, setEditingHouseholdId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const switchToHousehold = async (householdId: string) => {
    if (householdId === currentUser.householdId) return;
    
    setLoading(householdId);
    setError(null);

    try {
      const role = currentUser.householdRoles?.[householdId] || 'member';
      
      const updatedProfile: UserProfile = {
        ...currentUser,
        householdId,
        role
      };

      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId,
        role
      });

      onHouseholdChanged(updatedProfile);
      onClose();
      
    } catch (err) {
      console.error("Error switching household: ", err);
      setError("Error al cambiar de hogar.");
    } finally {
      setLoading(null);
    }
  };

  const createNewHousehold = async () => {
    if (!newHouseholdName.trim()) {
      setError("Por favor introduce un nombre para el hogar.");
      return;
    }

    // Verificar límite basado en hogares reales que existen
    const activeHouseholds = userHouseholds.length;
    if (activeHouseholds >= 3) {
      setError("Máximo 3 hogares activos permitidos por usuario.");
      return;
    }

    setLoading('create');
    setError(null);

    try {
      const newHouseholdId = uuidv4().substring(0, 8);
      
      // Crear nuevo hogar
      const newHousehold: Household = {
        id: newHouseholdId,
        name: newHouseholdName.trim(),
        memberIds: [currentUser.uid],
        adminIds: [currentUser.uid],
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        inviteCode: newHouseholdId
      };
      
      // Operaciones separadas para evitar problemas de permisos
      await setDoc(doc(db, 'households', newHouseholdId), newHousehold);
      
      // Crear estado inicial del hogar
      await setDoc(doc(db, 'householdState', newHouseholdId), {
        weekStartDate: new Date().toISOString(),
        unlockedAchievements: [],
        createdAt: new Date().toISOString()
      });
      
      // Actualizar perfil del usuario
      const updatedHouseholdIds = [...(currentUser.householdIds || [currentUser.householdId]), newHouseholdId];
      const updatedRoles = {
        ...currentUser.householdRoles,
        [newHouseholdId]: 'admin' as const
      };
      
      const updatedProfile: UserProfile = {
        ...currentUser,
        householdId: newHouseholdId, // Cambiar al nuevo hogar
        householdIds: updatedHouseholdIds,
        householdRoles: updatedRoles,
        role: 'admin'
      };
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId: newHouseholdId,
        householdIds: updatedHouseholdIds,
        householdRoles: updatedRoles,
        role: 'admin'
      });
      
      onHouseholdChanged(updatedProfile);
      setNewHouseholdName('');
      setShowCreateForm(false);
      onClose();
      
    } catch (err) {
      console.error("Error creating household: ", err);
      setError("Error al crear el hogar.");
    } finally {
      setLoading(null);
    }
  };

  const leaveHousehold = async (householdId: string) => {
    if (currentUser.householdIds?.length === 1) {
      setError("No puedes salir del único hogar. Crea otro primero.");
      return;
    }

    setLoading(householdId);
    setError(null);

    try {
      const batch = writeBatch(db);
      
      // Actualizar hogar - remover usuario
      const householdRef = doc(db, 'households', householdId);
      batch.update(householdRef, {
        memberIds: arrayRemove(currentUser.uid),
        adminIds: arrayRemove(currentUser.uid),
        lastUpdated: new Date().toISOString()
      });
      
      // Actualizar perfil de usuario
      const updatedHouseholdIds = currentUser.householdIds?.filter(id => id !== householdId) || [];
      const updatedRoles = { ...currentUser.householdRoles };
      delete updatedRoles[householdId];
      
      // Si el hogar activo es el que está dejando, cambiar al primero disponible
      const newActiveHousehold = currentUser.householdId === householdId 
        ? updatedHouseholdIds[0] 
        : currentUser.householdId;
      
      const updatedProfile: UserProfile = {
        ...currentUser,
        householdId: newActiveHousehold,
        householdIds: updatedHouseholdIds,
        householdRoles: updatedRoles,
        role: updatedRoles[newActiveHousehold] || 'member'
      };
      
      batch.update(doc(db, 'users', currentUser.uid), {
        householdId: newActiveHousehold,
        householdIds: updatedHouseholdIds,
        householdRoles: updatedRoles,
        role: updatedProfile.role
      });
      
      await batch.commit();
      
      onHouseholdChanged(updatedProfile);
      
    } catch (err) {
      console.error("Error leaving household: ", err);
      setError("Error al salir del hogar.");
    } finally {
      setLoading(null);
    }
  };

  const updateHouseholdName = async (householdId: string, newName: string) => {
    if (!newName.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    const role = currentUser.householdRoles?.[householdId];
    if (role !== 'admin') {
      setError("Solo los administradores pueden cambiar el nombre del hogar.");
      return;
    }

    setLoading(`rename-${householdId}`);
    setError(null);

    try {
      await updateDoc(doc(db, 'households', householdId), {
        name: newName.trim(),
        lastUpdated: new Date().toISOString()
      });

      setEditingHouseholdId(null);
      setEditingName('');
      
      // Recargar hogares
      const updatedHouseholds = userHouseholds.map(h => 
        h.id === householdId ? { ...h, name: newName.trim() } : h
      );
      
    } catch (err) {
      console.error("Error updating household name: ", err);
      setError("Error al actualizar el nombre del hogar.");
    } finally {
      setLoading(null);
    }
  };

  const deleteHousehold = async (householdId: string) => {
    const role = currentUser.householdRoles?.[householdId];
    if (role !== 'admin') {
      setError("Solo los administradores pueden borrar hogares.");
      return;
    }

    setLoading(`delete-${householdId}`);
    setError(null);

    try {
      // Paso 1: Obtener datos del hogar
      const householdDoc = await getDoc(doc(db, 'households', householdId));
      if (!householdDoc.exists()) {
        setError("El hogar no existe.");
        setLoading(null);
        return;
      }
      
      const householdData = householdDoc.data() as Household;
      const memberIds = householdData.memberIds || [];
      
      // Paso 2: Solo actualizar usuarios (lo mínimo necesario)
      for (const userId of memberIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            const updatedHouseholdIds = userData.householdIds?.filter(id => id !== householdId) || [];
            const updatedRoles = { ...userData.householdRoles };
            delete updatedRoles[householdId];
            
            const newActiveHousehold = userData.householdId === householdId 
              ? (updatedHouseholdIds.length > 0 ? updatedHouseholdIds[0] : '') 
              : userData.householdId;
            
            await updateDoc(doc(db, 'users', userId), {
              householdId: newActiveHousehold,
              householdIds: updatedHouseholdIds,
              householdRoles: updatedRoles,
              role: updatedRoles[newActiveHousehold] || 'member'
            });
          }
        } catch (userError) {
          console.warn(`No se pudo actualizar usuario ${userId}:`, userError);
        }
      }
      
      // Paso 3: Eliminar solo household y householdState (lo esencial)
      try {
        await deleteDoc(doc(db, 'households', householdId));
        await deleteDoc(doc(db, 'householdState', householdId));
      } catch (deleteError) {
        console.error("Error eliminando hogar:", deleteError);
        setError("Error al eliminar el hogar principal.");
        setLoading(null);
        return;
      }
      
      // Paso 4: Actualizar estado local si es necesario
      if (currentUser.householdId === householdId) {
        const remainingHouseholds = currentUser.householdIds?.filter(id => id !== householdId) || [];
        const newActiveHousehold = remainingHouseholds[0] || '';
        
        // Limpiar roles del hogar borrado
        const updatedRoles = { ...currentUser.householdRoles };
        delete updatedRoles[householdId];
        
        const updatedProfile: UserProfile = {
          ...currentUser,
          householdId: newActiveHousehold,
          householdIds: remainingHouseholds,
          householdRoles: updatedRoles,
          role: updatedRoles[newActiveHousehold] || 'member'
        };
        
        onHouseholdChanged(updatedProfile);
      }
      
      // Nota: Los datos relacionados (tareas, historial) se pueden limpiar manualmente después
      // o mediante funciones de Firebase Cloud Functions para evitar problemas de permisos
      
    } catch (err) {
      console.error("Error deleting household: ", err);
      setError("Error al borrar el hogar.");
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="relative group max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-2xl blur-lg opacity-40" />
        
        {/* Modal principal */}
        <div 
          ref={modalRef}
          className="relative bg-[var(--card)]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6 animate-scale-in max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                  Mis Hogares
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  Gestiona tus hogares (máximo 3)
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
          
          {/* Lista de hogares */}
          <div className="space-y-4">
            {userHouseholds.map((household) => {
              const isActive = household.id === currentUser.householdId;
              const userRole = currentUser.householdRoles?.[household.id] || 'member';
              const isAdmin = userRole === 'admin';
              
              return (
                <div key={household.id} className="relative group">
                  <div className={`absolute -inset-1 rounded-2xl blur-lg transition-opacity duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-100' 
                      : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  <div className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-[var(--surface-1)]/80 border-white/10 hover:border-indigo-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${isActive ? '#10b981' : '#6366f1'}80, ${isActive ? '#059669' : '#4f46e5'}40)` 
                          }}
                        >
                          <HomeIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          {editingHouseholdId === household.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-3 py-1 bg-[var(--surface-2)] border border-white/10 rounded-lg text-[var(--text-primary)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') updateHouseholdName(household.id, editingName);
                                  if (e.key === 'Escape') { setEditingHouseholdId(null); setEditingName(''); }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => updateHouseholdName(household.id, editingName)}
                                disabled={loading === `rename-${household.id}`}
                                className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                              >
                                {loading === `rename-${household.id}` ? (
                                  <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckIcon className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => { setEditingHouseholdId(null); setEditingName(''); }}
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                  {household.name || `Hogar ${household.id}`}
                                  {isActive && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">ACTIVO</span>}
                                  {isAdmin && <CrownIcon className="w-4 h-4 text-yellow-500" />}
                                </h4>
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      setEditingHouseholdId(household.id);
                                      setEditingName(household.name || `Hogar ${household.id}`);
                                    }}
                                    className="p-1 text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/20 rounded transition-all duration-200"
                                    title="Editar nombre"
                                  >
                                    <PencilIcon className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {isAdmin ? 'Administrador' : 'Miembro'} • {household.memberIds?.length || 0} miembros
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                Código: {household.inviteCode || household.id}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <button
                            onClick={() => switchToHousehold(household.id)}
                            disabled={loading === household.id}
                            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-xl transition-all duration-300 text-sm font-bold"
                          >
                            {loading === household.id ? 'Cambiando...' : 'Activar'}
                          </button>
                        )}
                        
                        <button
                          onClick={() => leaveHousehold(household.id)}
                          disabled={loading === household.id}
                          className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded-xl transition-all duration-300 text-sm font-bold flex items-center gap-1"
                        >
                          <UserMinusIcon className="w-3 h-3" />
                          Salir
                        </button>
                        
                        {isAdmin && (
                          <button
                            onClick={() => deleteHousehold(household.id)}
                            disabled={loading === `delete-${household.id}`}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl transition-all duration-300 text-sm font-bold flex items-center gap-1"
                          >
                            {loading === `delete-${household.id}` ? (
                              <div className="w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <TrashIcon className="w-3 h-3" />
                            )}
                            Borrar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Crear nuevo hogar */}
          {(currentUser.householdIds?.length || 1) < 3 && (
            <div className="border-t border-white/10 pt-6">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full p-4 border-2 border-dashed border-indigo-500/30 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <PlusIcon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-indigo-400 font-bold">Crear Nuevo Hogar</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newHouseholdName}
                      onChange={(e) => setNewHouseholdName(e.target.value)}
                      placeholder="Nombre del nuevo hogar"
                      className="flex-1 px-4 py-3 bg-[var(--surface-2)]/80 border border-white/10 rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={createNewHousehold}
                      disabled={loading === 'create'}
                      className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                    >
                      {loading === 'create' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <SparklesIcon className="w-4 h-4" />
                      )}
                      Crear
                    </button>
                    <button
                      onClick={() => {setShowCreateForm(false); setNewHouseholdName(''); setError(null);}}
                      className="px-4 py-3 bg-[var(--surface-2)] text-[var(--text-secondary)] rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Footer */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Puedes tener hasta 3 hogares. Como admin puedes borrar hogares, como miembro puedes salirte de ellos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdManager;