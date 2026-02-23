import { AppState, Contact } from "@/../../shared/types";
import { clearAppState, getDefaultAppState, loadAppState, saveAppState } from "@/lib/storage";
import { useEffect, useRef, useState } from "react";

const MAX_UNDO_STEPS = 10;

/**
 * Custom hook for managing app state with IndexedDB persistence
 */
export function useIndexedDBState() {
  const [state, setState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const undoStackRef = useRef<Contact[][]>([]);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const loaded = await loadAppState();
        // Merge with defaults to handle missing fields from older stored data
        setState(loaded ? { ...getDefaultAppState(), ...loaded } : getDefaultAppState());
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

  const saveToUndo = () => {
    if (!state) return;
    undoStackRef.current = [
      ...undoStackRef.current.slice(-MAX_UNDO_STEPS + 1),
      [...state.contacts],
    ];
  };

  const undo = () => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current[undoStackRef.current.length - 1];
    undoStackRef.current = undoStackRef.current.slice(0, -1);
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, contacts: previous };
    });
  };

  const resetState = async () => {
    await clearAppState();
    undoStackRef.current = [];
    setState(getDefaultAppState());
  };

  return {
    state: state || getDefaultAppState(),
    setState,
    updateState,
    saveToUndo,
    undo,
    canUndo: undoStackRef.current.length > 0,
    resetState,
    isLoading,
  };
}
