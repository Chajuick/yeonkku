import { AppState } from "@/../../shared/types";
import { clearAppState, getDefaultAppState, loadAppState, saveAppState } from "@/lib/storage";
import { useEffect, useState } from "react";

/**
 * Custom hook for managing app state with IndexedDB persistence
 */
export function useIndexedDBState() {
  const [state, setState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const loaded = await loadAppState();
        setState(loaded || getDefaultAppState());
      } catch (error) {
        console.error("Failed to load state:", error);
        setState(getDefaultAppState());
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (state && !isLoading) {
      const timer = setTimeout(() => {
        saveAppState(state).catch((error) => {
          console.error("Failed to save state:", error);
        });
      }, 500); // Debounce saves

      return () => clearTimeout(timer);
    }
  }, [state, isLoading]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const resetState = async () => {
    await clearAppState();
    setState(getDefaultAppState());
  };

  return {
    state: state || getDefaultAppState(),
    setState,
    updateState,
    resetState,
    isLoading,
  };
}
