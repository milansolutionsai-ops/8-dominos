import { useState, useEffect } from 'react';
import { Domino } from '@/types/domino';
import { StorageService } from '@/utils/storage';

export function useDominos() {
  const [dominos, setDominos] = useState<Domino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDominos();
  }, []);

  const loadDominos = async () => {
    try {
      const loadedDominos = await StorageService.getDominos();
      setDominos(loadedDominos);
    } catch (error) {
      console.error('Error loading dominos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDominos = async (newDominos: Domino[]) => {
    try {
      await StorageService.saveDominos(newDominos);
      setDominos(newDominos);
    } catch (error) {
      console.error('Error updating dominos:', error);
    }
  };

  const toggleCompletion = async (dominoId: string, weekKey: string, day: string, completed: boolean) => {
    try {
      const updatedDominos = dominos.map(domino => {
        if (domino.id === dominoId) {
          return {
            ...domino,
            completionStatus: {
              ...domino.completionStatus,
              [weekKey]: {
                ...domino.completionStatus[weekKey],
                [day]: completed
              }
            }
          };
        }
        return domino;
      });
      await updateDominos(updatedDominos);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  return {
    dominos,
    loading,
    updateDominos,
    toggleCompletion,
    refreshDominos: loadDominos,
  };
}