// Archivo: src/components/SimpleHouseholdModal.tsx - VERSIÓN SIMPLE

import React, { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, writeBatch, collection, query, where, getDocs, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Household } from '../types';
import { HomeIcon, XMarkIcon, PlusIcon, ChevronRightIcon, TrashIcon, PencilIcon } from './icons';
import { v4 as uuidv4 } from 'uuid';

interface SimpleHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  household?: { name: string; id: string } | null;
  onHouseholdChanged: (updatedProfile: UserProfile) => void;
}

const SimpleHouseholdModal: React.FC<SimpleHouseholdModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  household,
  onHouseholdChanged
}) => {
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableHouseholds, setAvailableHouseholds] = useState<{owned: Household[], member: Household[]}>({owned: [], member: []});
  const [loadingHouseholds, setLoadingHouseholds] = useState(true);
  const [editingHousehold, setEditingHousehold] = useState<{id: string, name: string} | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar hogares disponibles
  useEffect(() => {
    const loadAvailableHouseholds = async () => {
      if (!isOpen) return;
      
      setLoadingHouseholds(true);
      setConnectionError(false);
      try {
        // Buscar todos los hogares donde el usuario es creador
        const ownedQuery = query(collection(db, 'householdState'), where('createdBy', '==', currentUser.uid));
        const ownedSnapshot = await getDocs(ownedQuery);
        const ownedHouseholds = ownedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Household));

        // Buscar hogares donde el usuario ha sido activo
        // Primero obtenemos todos los householdIds únicos del historial del usuario
        const historyQuery = query(collection(db, 'history'), where('userId', '==', currentUser.uid));
        const historySnapshot = await getDocs(historyQuery);
        
        const uniqueHouseholdIds = new Set<string>();
        historySnapshot.docs.forEach(doc => {
          const householdId = doc.data().householdId;
          if (householdId && 
              householdId !== currentUser.householdId && 
              !ownedHouseholds.some(h => h.id === householdId)) {
            uniqueHouseholdIds.add(householdId);
          }
        });
        
        // Ahora obtenemos la información de cada hogar usando los IDs del historial
        const memberHouseholds: Household[] = [];
        
        for (const householdId of uniqueHouseholdIds) {
          try {
            const householdDoc = await getDoc(doc(db, 'householdState', householdId));
            
            if (householdDoc.exists()) {
              const householdData = householdDoc.data();
              memberHouseholds.push({
                id: householdDoc.id,
                name: householdData.name || 'Hogar sin nombre',
                createdBy: householdData.createdBy || '',
                createdAt: householdData.createdAt || '',
                weekStartDate: householdData.weekStartDate || '',
                unlockedAchievements: householdData.unlockedAchievements || []
              } as Household);
            }
          } catch (err) {
            console.warn(`Could not load household ${householdId}:`, err);
          }
        }

        // Debug removido para producción

        setAvailableHouseholds({
          owned: ownedHouseholds.filter(h => h.id !== currentUser.householdId),
          member: memberHouseholds
        });
      } catch (err) {
        console.error('Error loading households:', err);
        setConnectionError(true);
        // Mostrar mensaje de error más específico
        if (err instanceof Error) {
          if (err.message.includes('offline') || err.message.includes('network')) {
            setError('Sin conexión. Verifica tu internet e inténtalo de nuevo.');
          } else if (err.message.includes('permission')) {
            setError('Sin permisos para acceder a los datos.');
          } else {
            setError('Error al cargar hogares. Inténtalo de nuevo.');
          }
        }
      } finally {
        setLoadingHouseholds(false);
      }
    };

    loadAvailableHouseholds();
  }, [isOpen, currentUser.uid, currentUser.householdId]);

  const handleSwitchHousehold = async (householdId: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const updatedProfile = { ...currentUser, householdId };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId
      });

      onHouseholdChanged(updatedProfile);
      onClose();
    } catch (err) {
      console.error('Error switching household:', err);
      setError('Error al cambiar de hogar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditHousehold = async (householdId: string, newName: string) => {
    if (!newName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await updateDoc(doc(db, 'householdState', householdId), {
        name: newName.trim()
      });

      // Actualizar el estado local
      setAvailableHouseholds(prev => ({
        owned: prev.owned.map(h => h.id === householdId ? {...h, name: newName.trim()} : h),
        member: prev.member.map(h => h.id === householdId ? {...h, name: newName.trim()} : h)
      }));

      setEditingHousehold(null);
    } catch (err) {
      console.error('Error updating household name:', err);
      if (err instanceof Error && err.message.includes('permission')) {
        setError('Sin permisos para editar este hogar');
      } else {
        setError('Error al actualizar el nombre. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHousehold = async (householdId: string) => {
    // Verificar que el usuario sea el creador del hogar
    const householdToDelete = availableHouseholds.owned.find(h => h.id === householdId);
    if (!householdToDelete || householdToDelete.createdBy !== currentUser.uid) {
      setError('No tienes permisos para eliminar este hogar');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const batch = writeBatch(db);
      
      // Eliminar todas las tareas del hogar
      const tasksQuery = query(collection(db, 'tasks'), where('householdId', '==', householdId));
      const tasksSnapshot = await getDocs(tasksQuery);
      tasksSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      // Eliminar todo el historial del hogar
      const historyQuery = query(collection(db, 'history'), where('householdId', '==', householdId));
      const historySnapshot = await getDocs(historyQuery);
      historySnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      // Eliminar semanas archivadas del hogar
      const archivedQuery = query(collection(db, 'archivedWeeks'), where('householdId', '==', householdId));
      const archivedSnapshot = await getDocs(archivedQuery);
      archivedSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      // Eliminar plantillas del hogar
      const templatesQuery = query(collection(db, 'templates'), where('householdId', '==', householdId));
      const templatesSnapshot = await getDocs(templatesQuery);
      templatesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      // Eliminar el estado del hogar
      batch.delete(doc(db, 'householdState', householdId));
      
      await batch.commit();

      // Si estamos eliminando el hogar actual, crear un hogar personal
      if (householdId === currentUser.householdId) {
        const personalHouseholdId = uuidv4();
        
        await setDoc(doc(db, 'householdState', personalHouseholdId), {
          name: `Hogar de ${currentUser.displayName}`,
          createdBy: currentUser.uid,
          createdAt: new Date().toISOString(),
          weekStartDate: new Date().toISOString(),
          unlockedAchievements: []
        });

        const updatedProfile = { ...currentUser, householdId: personalHouseholdId };
        await updateDoc(doc(db, 'users', currentUser.uid), {
          householdId: personalHouseholdId
        });

        onHouseholdChanged(updatedProfile);
      }

      // Actualizar el estado local
      setAvailableHouseholds(prev => ({
        owned: prev.owned.filter(h => h.id !== householdId),
        member: prev.member.filter(h => h.id !== householdId)
      }));

      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting household:', err);
      setError('Error al eliminar el hogar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHousehold = async () => {
    const trimmedName = newHouseholdName.trim();
    
    if (!trimmedName) {
      setError('Ingresa un nombre para el hogar');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres');
      return;
    }

    // Verificar si ya existe un hogar con el mismo nombre
    const existingHousehold = availableHouseholds.owned.find(h => 
      h.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingHousehold) {
      setError('Ya tienes un hogar con ese nombre');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const newHouseholdId = uuidv4();
      
      // Crear el estado del hogar
      await setDoc(doc(db, 'householdState', newHouseholdId), {
        name: newHouseholdName.trim(),
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        weekStartDate: new Date().toISOString(),
        unlockedAchievements: []
      });

      // Actualizar el usuario
      const updatedProfile = { ...currentUser, householdId: newHouseholdId };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId: newHouseholdId
      });

      onHouseholdChanged(updatedProfile);
      onClose();
    } catch (err) {
      console.error('Error creating household:', err);
      setError('Error al crear el hogar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveHousehold = async () => {
    if (!confirm('¿Estás seguro de que quieres salir del hogar actual? Se creará un hogar personal para ti.')) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const personalHouseholdId = uuidv4();
      
      // Crear hogar personal con un nombre único
      await setDoc(doc(db, 'householdState', personalHouseholdId), {
        name: `Hogar de ${currentUser.displayName}`,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        weekStartDate: new Date().toISOString(),
        unlockedAchievements: []
      });

      // Actualizar usuario con nuevo hogar
      const updatedProfile = { ...currentUser, householdId: personalHouseholdId };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId: personalHouseholdId
      });

      // Verificar si el usuario actual era el único miembro del hogar anterior
      const usersQuery = query(collection(db, 'users'), where('householdId', '==', currentUser.householdId));
      const remainingUsers = await getDocs(usersQuery);
      
      // Si era el último usuario, limpiar el hogar vacío
      if (remainingUsers.docs.length === 0) {
        const batch = writeBatch(db);
        
        // Eliminar tareas del hogar vacío
        const tasksQuery = query(collection(db, 'tasks'), where('householdId', '==', currentUser.householdId));
        const tasksSnapshot = await getDocs(tasksQuery);
        tasksSnapshot.docs.forEach(doc => batch.delete(doc.ref));
        
        // Eliminar historial del hogar vacío
        const historyQuery = query(collection(db, 'history'), where('householdId', '==', currentUser.householdId));
        const historySnapshot = await getDocs(historyQuery);
        historySnapshot.docs.forEach(doc => batch.delete(doc.ref));
        
        // Eliminar estado del hogar
        batch.delete(doc(db, 'householdState', currentUser.householdId));
        
        await batch.commit();
      }

      onHouseholdChanged(updatedProfile);
      onClose();
    } catch (err) {
      console.error('Error leaving household:', err);
      setError('Error al salir del hogar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--card)] rounded-3xl p-8 w-full max-w-md border border-[var(--border)] shadow-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Gestionar Hogar
              </h2>
              {!isOnline && (
                <p className="text-xs text-red-500 mt-1">Sin conexión</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Current Household */}
        <div className="mb-6 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Hogar Actual</h3>
          <div className="mb-3">
            <p className="text-[var(--text-primary)] font-medium">
              {household?.name || 'Cargando...'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              ID: {currentUser.householdId}
            </p>
          </div>
          <button
            onClick={handleLeaveHousehold}
            className="w-full h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saliendo...' : 'Salir del Hogar'}
          </button>
        </div>

        {/* Error de conexión */}
        {connectionError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="text-center">
              <p className="text-red-500 font-medium mb-3">Error de conexión</p>
              <button
                onClick={() => {
                  setConnectionError(false);
                  setError('');
                  // Recargar hogares
                  const loadHouseholds = async () => {
                    setLoadingHouseholds(true);
                    // Trigger useEffect manually by changing a dependency
                    window.location.reload();
                  };
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Available Households */}
        {loadingHouseholds ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Owned Households */}
            {availableHouseholds.owned.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">Mis Hogares</h3>
                <div className="space-y-2">
                  {availableHouseholds.owned.map((house) => (
                    <div key={house.id} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      {editingHousehold?.id === house.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingHousehold.name}
                            onChange={(e) => setEditingHousehold({...editingHousehold, name: e.target.value})}
                            className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            disabled={isLoading}
                            onKeyPress={(e) => e.key === 'Enter' && handleEditHousehold(house.id, editingHousehold.name)}
                          />
                          <button
                            onClick={() => handleEditHousehold(house.id, editingHousehold.name)}
                            className="px-3 py-2 bg-[var(--primary)] text-white rounded-lg disabled:opacity-50"
                            disabled={isLoading}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingHousehold(null)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg"
                            disabled={isLoading}
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSwitchHousehold(house.id)}
                            className="flex-1 flex items-center justify-between text-left hover:bg-[var(--primary)]/5 transition-colors rounded-lg p-2 -m-2 disabled:opacity-50"
                            disabled={isLoading}
                          >
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">{house.name}</p>
                              <p className="text-xs text-[var(--text-secondary)]">Creado por ti</p>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => setEditingHousehold({id: house.id, name: house.name})}
                              className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center disabled:opacity-50"
                              disabled={isLoading}
                              title="Editar nombre"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({id: house.id, name: house.name})}
                              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center disabled:opacity-50"
                              disabled={isLoading}
                              title="Eliminar hogar"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Households */}
            {availableHouseholds.member.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">Otros Hogares</h3>
                <div className="space-y-2">
                  {availableHouseholds.member.map((house) => (
                    <div key={house.id} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <button
                        onClick={() => handleSwitchHousehold(house.id)}
                        className="w-full flex items-center justify-between text-left hover:bg-[var(--primary)]/5 transition-colors rounded-lg p-2 -m-2 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{house.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">Has participado aquí</p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Mensaje si no hay hogares adicionales */}
        {!loadingHouseholds && availableHouseholds.owned.length === 0 && availableHouseholds.member.length === 0 && (
          <div className="text-center py-6">
            <p className="text-[var(--text-secondary)] text-sm">
              No tienes otros hogares disponibles
            </p>
          </div>
        )}

        {/* Create New Household */}
        <div className="space-y-4 border-t border-[var(--border)] pt-6">
          <h3 className="font-semibold text-[var(--text-primary)]">Crear Nuevo Hogar</h3>
          
          <div>
            <input
              type="text"
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              placeholder="Nombre del nuevo hogar..."
              className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateHousehold}
            className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isLoading || !newHouseholdName.trim()}
          >
            <PlusIcon className="w-5 h-5" />
            {isLoading ? 'Creando...' : 'Crear Hogar'}
          </button>
        </div>

        {/* Modal de confirmación de eliminación */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-[var(--card)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border)] mx-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrashIcon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Eliminar Hogar
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  ¿Estás seguro de que quieres eliminar "{confirmDelete.name}"? 
                  <br />
                  <span className="font-medium text-red-500">Esta acción no se puede deshacer.</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteHousehold(confirmDelete.id)}
                    className="flex-1 h-10 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleHouseholdModal;