import { useCallback, useEffect, useRef } from 'react';
import { DefenderType, Defender } from '@/types/game';
import { useGameState } from './useGameState';
import { updateGameTick } from '@/logic/updateLogic';

export const useGameLoop = (onAttack?: (defenderType: DefenderType) => void) => {
  const {
    gameState, setGameState, speedMultiplier, toggleSpeed,
    enemiesSpawnedRef, resetGame, placeDefender, upgradeDefender
  } = useGameState();

  const lastUpdateRef = useRef<number>(Date.now());
  const enemySpawnTimerRef = useRef<number>(0);
  const attackAnimationsRef = useRef<Set<string>>(new Set());

  // Initialization
  const finishLoading = useCallback(() => setGameState(p => ({ ...p, isLoading: false })), [setGameState]);
  const startGame = useCallback(() => {
    lastUpdateRef.current = Date.now();
    enemiesSpawnedRef.current = 0;
    setGameState(p => ({ ...p, isPlaying: true, isPaused: false }));
  }, [setGameState, enemiesSpawnedRef]);
  const pauseGame = useCallback(() => setGameState(p => ({ ...p, isPlaying: false, isPaused: true })), [setGameState]);
  const resumeGame = useCallback(() => {
    lastUpdateRef.current = Date.now();
    setGameState(p => ({ ...p, isPlaying: true, isPaused: false }));
  }, [setGameState]);
  const selectDefender = useCallback((type: DefenderType | null) => setGameState(p => ({ ...p, selectedDefender: type })), [setGameState]);
  const sellDefender = useCallback((id: string) => { /* Sell Removed per design but keeping signature if needed or can remove */ }, []);
  const getDefenderCount = useCallback((type: DefenderType, defenders: Defender[]) => defenders.filter(d => d.type === type).length, []);

  // Main Loop
  useEffect(() => {
    if (!gameState.isPlaying) return;
    const loop = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setGameState(prev => updateGameTick(
        prev, deltaTime, speedMultiplier,
        enemiesSpawnedRef, enemySpawnTimerRef, attackAnimationsRef, onAttack
      ));
    }, 50);
    return () => clearInterval(loop);
  }, [gameState.isPlaying, speedMultiplier, onAttack, setGameState, enemiesSpawnedRef]);

  return {
    gameState, startGame, pauseGame, resetGame, resumeGame,
    selectDefender, placeDefender, upgradeDefender, sellDefender,
    finishLoading, attackAnimations: attackAnimationsRef.current,
    getDefenderCount, speedMultiplier, toggleSpeed,
    dismissAchievement: () => setGameState(p => ({ ...p, lastUnlockedAchievement: null })),
  };
};
