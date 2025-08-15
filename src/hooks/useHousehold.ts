// Archivo: src/hooks/useHousehold.ts - Gestión de datos del hogar

import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Household } from '../types';

const useHousehold = (householdId: string | null) => {
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!householdId) {
      setHousehold(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, 'householdState', householdId),
      (doc) => {
        if (doc.exists()) {
          setHousehold({ id: doc.id, ...doc.data() } as Household);
        } else {
          setError('Hogar no encontrado');
          setHousehold(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading household:', err);
        setError('Error al cargar el hogar');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [householdId]);

  return { household, loading, error };
};

export default useHousehold;