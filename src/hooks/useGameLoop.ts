import { useCallback, useEffect, useRef } from 'react';
import { DefenderType, Defender } from '@/types/game';
import { useGameState } from './useGameState';
import { updateGameTick } from '@/logic/updateLogic';
import { MAPS } from '@/config/gameConfig';
import { trackEvent } from '@/lib/analytics';
import { saveUsedDefender } from '@/lib/storage';

export const useGameLoop = (mapId: string, onAttack?: (defenderType: DefenderType) => void) => {
  const {
    gameState, setGameState, speedMultiplier, toggleSpeed,
    enemiesSpawnedRef, resetGame, placeDefender, upgradeDefender,
    dismissNotification, clearScreenFlash, restoreCheckpoint,
    triggerMeteor, triggerBlizzard
  } = useGameState(mapId);

  const lastUpdateRef = useRef<number>(Date.now());
  const enemySpawnTimerRef = useRef<number>(0);
  const attackAnimationsRef = useRef<Set<string>>(new Set());

  // Initialization
  const finishLoading = useCallback(() => setGameState(p => ({ ...p, isLoading: false })), [setGameState]);
  const startGame = useCallback(() => {
    lastUpdateRef.current = Date.now();
    enemiesSpawnedRef.current = 0;
    enemySpawnTimerRef.current = 0;
    setGameState(p => ({ ...p, isPlaying: true, isPaused: false }));
  }, [setGameState, enemiesSpawnedRef]);
  const pauseGame = useCallback(() => setGameState(p => ({ ...p, isPlaying: false, isPaused: true })), [setGameState]);
  const resumeGame = useCallback(() => {
    lastUpdateRef.current = Date.now();
    setGameState(p => ({ ...p, isPlaying: true, isPaused: false }));
  }, [setGameState]);
  const selectDefender = useCallback((type: DefenderType | null) => setGameState(p => ({ ...p, selectedDefender: type })), [setGameState]);

  const getDefenderCount = useCallback((type: DefenderType, defenders: Defender[]) => defenders.filter(d => d.type === type).length, []);

  // Main Loop
  useEffect(() => {
    if (!gameState.isPlaying) return;
    const loop = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setGameState(prev => {
        const currentMap = MAPS.find(m => m.id === prev.mapId) || MAPS[0];
        return updateGameTick(
          prev, deltaTime, speedMultiplier,
          enemiesSpawnedRef, enemySpawnTimerRef, attackAnimationsRef,
          currentMap.path,
          onAttack
        );
      });
    }, 50);
    return () => clearInterval(loop);
  }, [gameState.isPlaying, speedMultiplier, onAttack, setGameState, enemiesSpawnedRef]);

  return {
    gameState, startGame, pauseGame, resetGame, resumeGame,
    selectDefender,
    placeDefender: (x: number, y: number) => {
      placeDefender(x, y);
      // We only know the type if we look at gameState.selectedDefender
      if (gameState.selectedDefender) {
        trackEvent('place_defender', { type: gameState.selectedDefender });
        saveUsedDefender(gameState.selectedDefender);
      }
    },
    upgradeDefender,
    finishLoading, attackAnimations: attackAnimationsRef.current,
    getDefenderCount, speedMultiplier, toggleSpeed,
    dismissAchievement: () => setGameState(p => ({ ...p, lastUnlockedAchievement: null })),
    dismissNotification, clearScreenFlash, restoreCheckpoint,
    triggerMeteor, triggerBlizzard,
    continueEndless: () => {
      setGameState(p => ({
        ...p,
        gameWon: false,
        isEndless: true,
        isPlaying: true, // Auto-resume
      }));
      // Reset spawn timers for next wave
      enemiesSpawnedRef.current = 0;
      enemySpawnTimerRef.current = 0;
    },
  };
};
