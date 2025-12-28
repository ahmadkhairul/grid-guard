import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Enemy, Defender, DefenderType } from '@/types/game';
import { ENEMY_PATH, DEFENDER_CONFIGS, isPathCell, MAX_WAVE, MAX_DEFENDERS_PER_TYPE, getBossImmunity } from '@/config/gameConfig';

const generateEnemyId = () => `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateDefenderId = () => `defender-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useGameLoop = (onAttack?: (defenderType: DefenderType) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    coins: 100,
    wave: 1,
    enemies: [],
    defenders: [],
    lives: 10,
    isPlaying: false,
    selectedDefender: null,
    isLoading: true,
    gameWon: false,
  });

  const lastUpdateRef = useRef<number>(Date.now());
  const enemySpawnTimerRef = useRef<number>(0);
  const enemiesSpawnedRef = useRef<number>(0);
  const attackAnimationsRef = useRef<Set<string>>(new Set());

  const finishLoading = useCallback(() => {
    setGameState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
    enemiesSpawnedRef.current = 0;
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      coins: 100,
      wave: 1,
      enemies: [],
      defenders: [],
      lives: 10,
      isPlaying: false,
      selectedDefender: null,
      isLoading: false,
      gameWon: false,
    });
    enemiesSpawnedRef.current = 0;
  }, []);

  const selectDefender = useCallback((type: DefenderType | null) => {
    setGameState(prev => ({ ...prev, selectedDefender: type }));
  }, []);

  const getDefenderCount = useCallback((type: DefenderType, defenders: Defender[]) => {
    return defenders.filter(d => d.type === type).length;
  }, []);

  const placeDefender = useCallback((x: number, y: number) => {
    setGameState(prev => {
      if (!prev.selectedDefender) return prev;
      if (isPathCell(x, y)) return prev;
      
      const config = DEFENDER_CONFIGS[prev.selectedDefender];
      if (prev.coins < config.cost) return prev;
      
      // Check max defenders per type
      const currentCount = getDefenderCount(prev.selectedDefender, prev.defenders);
      if (currentCount >= MAX_DEFENDERS_PER_TYPE) return prev;
      
      // Check if cell already has a defender
      const hasDefender = prev.defenders.some(
        d => d.position.x === x && d.position.y === y
      );
      if (hasDefender) return prev;

      const newDefender: Defender = {
        id: generateDefenderId(),
        position: { x, y },
        damage: config.damage,
        range: config.range,
        attackSpeed: config.attackSpeed,
        lastAttack: 0,
        level: 1,
        type: prev.selectedDefender,
      };

      return {
        ...prev,
        coins: prev.coins - config.cost,
        defenders: [...prev.defenders, newDefender],
        selectedDefender: null,
      };
    });
  }, [getDefenderCount]);

  const upgradeDefender = useCallback((defenderId: string) => {
    setGameState(prev => {
      const defender = prev.defenders.find(d => d.id === defenderId);
      if (!defender) return prev;
      
      const config = DEFENDER_CONFIGS[defender.type];
      const upgradeCost = config.upgradeCost * defender.level;
      
      if (prev.coins < upgradeCost) return prev;

      return {
        ...prev,
        coins: prev.coins - upgradeCost,
        defenders: prev.defenders.map(d =>
          d.id === defenderId
            ? {
                ...d,
                level: d.level + 1,
                damage: d.damage + config.damage * 0.5,
                range: d.range + 0.2,
              }
            : d
        ),
      };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setGameState(prev => {
        let newEnemies = [...prev.enemies];
        let newCoins = prev.coins;
        let newLives = prev.lives;

        // Spawn enemies
        const isBossWave = prev.wave === MAX_WAVE;
        const enemiesPerWave = isBossWave ? 1 : 5 + prev.wave * 2;
        enemySpawnTimerRef.current += deltaTime;
        
        if (enemySpawnTimerRef.current >= 2000 && enemiesSpawnedRef.current < enemiesPerWave) {
          enemySpawnTimerRef.current = 0;
          enemiesSpawnedRef.current++;
          
          const isBoss = isBossWave && enemiesSpawnedRef.current === 1;
          const baseHp = isBoss ? 500 + prev.wave * 50 : 50 + prev.wave * 20;
          
          const newEnemy: Enemy = {
            id: generateEnemyId(),
            position: { ...ENEMY_PATH[0] },
            hp: baseHp,
            maxHp: baseHp,
            pathIndex: 0,
            speed: isBoss ? 0.3 : 0.5 + prev.wave * 0.1,
            reward: isBoss ? 200 : 10 + prev.wave * 2,
            type: isBoss ? 'boss' : 'normal',
            immuneTo: isBoss ? getBossImmunity(100) : undefined,
          };
          newEnemies.push(newEnemy);
        }

        // Move enemies along path and update boss immunity
        newEnemies = newEnemies.map(enemy => {
          const nextPathIndex = enemy.pathIndex + enemy.speed * (deltaTime / 1000);
          
          if (nextPathIndex >= ENEMY_PATH.length - 1) {
            // Enemy reached the end
            newLives -= enemy.type === 'boss' ? 5 : 1;
            return null;
          }

          const currentIndex = Math.floor(nextPathIndex);
          const progress = nextPathIndex - currentIndex;
          
          const currentPos = ENEMY_PATH[currentIndex];
          const nextPos = ENEMY_PATH[Math.min(currentIndex + 1, ENEMY_PATH.length - 1)];
          
          // Update boss immunity based on HP
          const immuneTo = enemy.type === 'boss' 
            ? getBossImmunity((enemy.hp / enemy.maxHp) * 100) 
            : undefined;
          
          const updatedEnemy: Enemy = {
            ...enemy,
            pathIndex: nextPathIndex,
            position: {
              x: currentPos.x + (nextPos.x - currentPos.x) * progress,
              y: currentPos.y + (nextPos.y - currentPos.y) * progress,
            },
            immuneTo,
          };
        }).filter((e): e is Enemy => e !== null);

        // Defenders attack
        const updatedDefenders = prev.defenders.map(defender => {
          if (now - defender.lastAttack < defender.attackSpeed) return defender;

          // Find enemies in range (excluding immune ones for boss)
          const enemyInRange = newEnemies.find(enemy => {
            // Check if boss is immune to this defender type
            if (enemy.immuneTo === defender.type) return false;
            
            const dx = enemy.position.x - defender.position.x;
            const dy = enemy.position.y - defender.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= defender.range;
          });

          if (enemyInRange) {
            attackAnimationsRef.current.add(defender.id);
            setTimeout(() => attackAnimationsRef.current.delete(defender.id), 300);
            
            // Trigger attack sound
            if (onAttack) {
              onAttack(defender.type);
            }
            
            // Deal damage
            newEnemies = newEnemies.map(e =>
              e.id === enemyInRange.id
                ? { ...e, hp: e.hp - defender.damage }
                : e
            );

            return { ...defender, lastAttack: now };
          }

          return defender;
        });

        // Remove dead enemies and give coins
        const deadEnemies = newEnemies.filter(e => e.hp <= 0);
        newCoins += deadEnemies.reduce((sum, e) => sum + e.reward, 0);
        newEnemies = newEnemies.filter(e => e.hp > 0);

        // Check for wave completion
        let newWave = prev.wave;
        let gameWon = prev.gameWon;
        
        if (newEnemies.length === 0 && enemiesSpawnedRef.current >= enemiesPerWave) {
          if (prev.wave >= MAX_WAVE) {
            // Player won!
            gameWon = true;
            return {
              ...prev,
              enemies: [],
              coins: newCoins,
              isPlaying: false,
              gameWon: true,
            };
          }
          newWave++;
          enemiesSpawnedRef.current = 0;
          newCoins += 25 * prev.wave; // Wave completion bonus
        }

        // Check game over
        if (newLives <= 0) {
          return {
            ...prev,
            enemies: [],
            lives: 0,
            isPlaying: false,
          };
        }

        return {
          ...prev,
          enemies: newEnemies,
          defenders: updatedDefenders,
          coins: newCoins,
          lives: newLives,
          wave: newWave,
          gameWon,
        };
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, onAttack]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    selectDefender,
    placeDefender,
    upgradeDefender,
    finishLoading,
    attackAnimations: attackAnimationsRef.current,
    getDefenderCount,
  };
};
