import { useState, useEffect } from 'react';
import { useAuthStore } from './use-auth-store';
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Zustand's persist middleware has a `hasHydrated` function that returns true
    // once the store has been rehydrated from storage.
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // Call it once to check if it's already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => {
      unsubFinishHydration();
    };
  }, []);
  return hydrated;
}