import React, { createContext, useContext } from 'react';
import { useGameState } from '../hooks/useGameState';

type GameContextType = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameState = useGameState();

  // Centralized dark mode document-level side effect
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (gameState.state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [gameState.state.darkMode]);

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
