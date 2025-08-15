// Archivo: src/components/JoinHouseholdModal.tsx - VERSIÓN SIMPLE

import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { UsersIcon, XMarkIcon } from './icons';

interface JoinHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onJoined: (updatedProfile: UserProfile) => void;
}

const JoinHouseholdModal: React.FC<JoinHouseholdModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onJoined
}) => {
  const [householdCode, setHouseholdCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewHousehold, setPreviewHousehold] = useState<{name: string; memberCount?: number} | null>(null);

  const handleJoin = async () => {
    if (!householdCode.trim()) {
      setError('Ingresa un código válido');
      return;
    }

    if (householdCode.trim() === currentUser.householdId) {
      setError('Ya eres miembro de este hogar');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verificar si el hogar existe
      const householdDoc = await getDoc(doc(db, 'householdState', householdCode.trim()));
      if (!householdDoc.exists()) {
        setError('Código de hogar no válido. Verifica el código e inténtalo de nuevo.');
        setIsLoading(false);
        return;
      }

      const householdData = householdDoc.data();

      // Actualizar el usuario con el nuevo hogar
      const updatedProfile = { ...currentUser, householdId: householdCode.trim() };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        householdId: householdCode.trim()
      });

      onJoined(updatedProfile);
      setHouseholdCode('');
      onClose();
    } catch (err) {
      console.error('Error joining household:', err);
      setError('Error al unirse al hogar. Inténtalo de nuevo.');
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
              <UsersIcon className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Unirse a Hogar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Código del Hogar
            </label>
            <input
              type="text"
              value={householdCode}
              onChange={(e) => {
                setHouseholdCode(e.target.value);
                setPreviewHousehold(null);
                setError('');
              }}
              placeholder="Ingresa el código..."
              className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleJoin}
              className="flex-1 h-12 rounded-xl bg-[var(--primary)] text-white font-semibold disabled:opacity-50"
              disabled={isLoading || !householdCode.trim()}
            >
              {isLoading ? 'Uniéndose...' : 'Unirse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinHouseholdModal;