import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Enemy, Defender, DefenderType, EnemyType } from '@/types/game';
import { ENEMY_PATH, DEFENDER_CONFIGS, isPathCell, MAX_WAVE, MAX_MINERS, getBossImmunity, ENEMY_CONFIGS, getRandomEnemyType, GRID_WIDTH } from '@/config/gameConfig';

const generateEnemyId = () => `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateDefenderId = () => `defender-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Flying path - straight line across the top
const FLYING_PATH = Array.from({ length: GRID_WIDTH + 1 }, (_, i) => ({ x: i, y: 0 }));

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
    isPaused: false,
  });

  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const speedMultiplier = isSpeedUp ? 2 : 1;

  const lastUpdateRef = useRef<number>(Date.now());
  const enemySpawnTimerRef = useRef<number>(0);
  const enemiesSpawnedRef = useRef<number>(0);
  const attackAnimationsRef = useRef<Set<string>>(new Set());

  const toggleSpeed = useCallback(() => {
    setIsSpeedUp(prev => !prev);
  }, []);

  const finishLoading = useCallback(() => {
    setGameState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    enemiesSpawnedRef.current = 0;
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    // Reset lastUpdateRef to prevent huge deltaTime after pause
    lastUpdateRef.current = Date.now();
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
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
      isPaused: false,
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


      // Check limits: Miners capped, others unlimited
      if (prev.selectedDefender === 'miner') {
        const currentCount = getDefenderCount('miner', prev.defenders);
        if (currentCount >= MAX_MINERS) return prev;
      }

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

  const sellDefender = useCallback((defenderId: string) => {
    setGameState(prev => {
      const defender = prev.defenders.find(d => d.id === defenderId);
      if (!defender) return prev;

      const config = DEFENDER_CONFIGS[defender.type];
      const sellValue = Math.floor(config.sellValue * defender.level);

      return {
        ...prev,
        coins: prev.coins + sellValue,
        defenders: prev.defenders.filter(d => d.id !== defenderId),
      };
    });
  }, []);

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
              range: d.type === 'archer' ? d.range + 0.5 : d.range,
              attackSpeed: d.type === 'miner' ? d.attackSpeed : d.attackSpeed * 0.9,
            }
            : d
        ),
      };
    });
  }, []);

  // Create enemy based on type
  const createEnemy = (type: EnemyType, wave: number): Enemy => {
    const config = ENEMY_CONFIGS[type];
    const baseHp = 60 + wave * 35;
    const baseSpeed = 0.5 + wave * 0.1;
    const baseReward = 8 + wave * 1;

    const startPath = config.isFlying ? FLYING_PATH[0] : ENEMY_PATH[0];

    return {
      id: generateEnemyId(),
      position: { ...startPath },
      hp: Math.floor(baseHp * config.hpMultiplier),
      maxHp: Math.floor(baseHp * config.hpMultiplier),
      pathIndex: 0,
      speed: baseSpeed * config.speedMultiplier,
      reward: Math.floor(baseReward * config.rewardMultiplier),
      type,
      immuneTo: type === 'boss' ? getBossImmunity(100) :
        type === 'boss_warrior' ? 'warrior' :
          type === 'boss_archer' ? 'archer' : undefined,
      isFlying: config.isFlying,
    };
  };

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
        const isMiniBossWave = prev.wave === 7;
        // Twin Bosses (W10): 2, Mini-Boss (W7): 1, Others: Normal scaling
        const enemiesPerWave = isBossWave ? 2 : isMiniBossWave ? 1 : 5 + prev.wave * 2;
        enemySpawnTimerRef.current += deltaTime;

        // Dynamic spawn rate: faster spawns in later waves (min 500ms)
        const spawnInterval = Math.max(500, 2000 - (prev.wave * 150));

        if (enemySpawnTimerRef.current >= spawnInterval && enemiesSpawnedRef.current < enemiesPerWave) {
          enemySpawnTimerRef.current = 0;
          enemiesSpawnedRef.current++;

          let enemyType: EnemyType;
          if (isBossWave) {
            // Twin Boss Logic: Spawn Warrior-Immune first, then Archer-Immune
            enemyType = enemiesSpawnedRef.current === 1 ? 'boss_warrior' : 'boss_archer';
          } else {
            enemyType = getRandomEnemyType(prev.wave);
          }

          const newEnemy = createEnemy(enemyType, prev.wave);
          newEnemies.push(newEnemy);
        }

        // Move enemies along path
        newEnemies = newEnemies.map(enemy => {
          const path = enemy.isFlying ? FLYING_PATH : ENEMY_PATH;
          const nextPathIndex = enemy.pathIndex + enemy.speed * speedMultiplier * (deltaTime / 1000);

          if (nextPathIndex >= path.length - 1) {
            newLives -= enemy.type === 'boss' ? 5 : 1;
            return null;
          }

          const currentIndex = Math.floor(nextPathIndex);
          const progress = nextPathIndex - currentIndex;

          const currentPos = path[currentIndex];
          const nextPos = path[Math.min(currentIndex + 1, path.length - 1)];

          const immuneTo = enemy.type === 'boss'
            ? getBossImmunity((enemy.hp / enemy.maxHp) * 100)
            : undefined;

          return {
            ...enemy,
            pathIndex: nextPathIndex,
            position: {
              x: currentPos.x + (nextPos.x - currentPos.x) * progress,
              y: currentPos.y + (nextPos.y - currentPos.y) * progress,
            },
            immuneTo,
          } as Enemy;
        }).filter((e): e is Enemy => e !== null);

        // Defenders attack
        const updatedDefenders = prev.defenders.map(defender => {
          if (now - defender.lastAttack < defender.attackSpeed / speedMultiplier) return defender;

          if (defender.type === 'miner') {
            onAttack?.(defender.type);

            newCoins += 15 + (defender.level - 1) * 10;

            return { ...defender, lastAttack: now };
          }

          const enemyInRange = newEnemies.find(enemy => {
            if (enemy.immuneTo === defender.type) return false;

            const dx = enemy.position.x - defender.position.x;
            const dy = enemy.position.y - defender.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= defender.range;
          });

          if (enemyInRange) {
            attackAnimationsRef.current.add(defender.id);
            setTimeout(() => attackAnimationsRef.current.delete(defender.id), 300);

            if (onAttack) {
              onAttack(defender.type);
            }

            newEnemies = newEnemies.map(e =>
              e.id === enemyInRange.id
                ? { ...e, hp: e.hp - defender.damage, isHit: true }
                : e
            );

            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                enemies: prev.enemies.map(e =>
                  e.id === enemyInRange.id ? { ...e, isHit: false } : e
                ),
              }));
            }, 200);

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
          newCoins += 25 * prev.wave;
        }

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
  }, [gameState.isPlaying, onAttack, speedMultiplier]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    resumeGame,
    selectDefender,
    placeDefender,
    upgradeDefender,
    sellDefender,
    finishLoading,
    attackAnimations: attackAnimationsRef.current,
    getDefenderCount,
    isSpeedUp,
    toggleSpeed,
  };
};
