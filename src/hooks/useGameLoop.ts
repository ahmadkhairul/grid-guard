import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Enemy, Defender, DefenderType, EnemyType, ACHIEVEMENTS, Achievement } from '@/types/game';
import { ENEMY_PATH, FLYING_PATH, DEFENDER_CONFIGS, isPathCell, MAX_WAVE, MAX_PER_TYPE, MAX_LEVEL, getBossImmunity, ENEMY_CONFIGS, getRandomEnemyType, GRID_WIDTH } from '@/config/gameConfig';

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
    isPaused: false,
    totalMined: 0,
    unlockedAchievements: [],
    lastUnlockedAchievement: null,
    floatingTexts: [],
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
      totalMined: 0,
      unlockedAchievements: [], // Persist? No, resets on new game for now (User request imply "in one session"?) "Mine 100k gold through the game" - ambiguous. Let's reset for now or keep separate persistent storage. User said "100k gold through the game" - assume per run? Or total? "Single game" implies run.
      lastUnlockedAchievement: null,
      floatingTexts: [],
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


      // Check limits: Max 5 per type
      const currentCount = getDefenderCount(prev.selectedDefender, prev.defenders);
      if (currentCount >= MAX_PER_TYPE) return prev;

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
      if (defender.level >= MAX_LEVEL) return prev; // Max Level Check

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

        let totalMinedThisTick = 0;
        let achievementUnlocked: Achievement | null = null;
        let newUnlockedIds = [...(prev.unlockedAchievements || [])];
        let newFloatingTexts = [...prev.floatingTexts];

        // Helper to add floating text
        const addFloatingText = (x: number, y: number, text: string, color: string) => {
          newFloatingTexts.push({
            id: `ft-${Date.now()}-${Math.random()}`,
            x,
            y,
            text,
            color,
            life: 1.0,
          });
        };

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
            // Bosses deal 5 damage, others 1
            const isBoss = enemy.type === 'boss' || enemy.type === 'boss_warrior' || enemy.type === 'boss_archer';
            newLives -= isBoss ? 5 : 1;
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

            const goldGain = 15 + (defender.level - 1) * 10;
            newCoins += goldGain;

            // Rich Man Achievement Check
            const newTotalMined = (prev.totalMined || 0) + goldGain;
            let newUnlocked = [...(prev.unlockedAchievements || [])];
            let newAchievement: Achievement | null = prev.lastUnlockedAchievement;

            if (newTotalMined >= 1000 && !newUnlocked.includes('rich_man')) {
              newUnlocked.push('rich_man');
              newAchievement = ACHIEVEMENTS.find(a => a.id === 'rich_man') || null;
            }

            // Spawn floating text for miner
            addFloatingText(defender.position.x, defender.position.y, `+${goldGain}`, 'text-yellow-400');

            return { ...defender, lastAttack: now, _tempMined: newTotalMined, _tempUnlocked: newUnlocked, _tempAch: newAchievement };
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

        // Update Total Mined & Rich Man Check
        const newTotalMined = (prev.totalMined || 0) + totalMinedThisTick;
        if (newTotalMined >= 1000 && !newUnlockedIds.includes('rich_man')) {
          newUnlockedIds.push('rich_man');
          achievementUnlocked = ACHIEVEMENTS.find(a => a.id === 'rich_man') || null;
        }

        // Remove dead enemies and give coins
        const deadEnemies = newEnemies.filter(e => e.hp <= 0);
        deadEnemies.forEach(e => {
          newCoins += e.reward;
          // Spawn floating text for kills
          addFloatingText(e.position.x, e.position.y, `+${e.reward}`, 'text-yellow-400');
        });

        newEnemies = newEnemies.filter(e => e.hp > 0);

        // Update Floating Texts (Float up and fade)
        newFloatingTexts = newFloatingTexts
          .map(ft => ({
            ...ft,
            y: ft.y - (deltaTime / 1000) * 1.5, // Float up speed
            life: ft.life - (deltaTime / 1000) * 1.5, // Fade speed
          }))
          .filter(ft => ft.life > 0);

        // Check for wave completion
        let newWave = prev.wave;
        let gameWon = prev.gameWon;

        if (newEnemies.length === 0 && enemiesSpawnedRef.current >= enemiesPerWave) {
          if (prev.wave >= MAX_WAVE) {
            gameWon = true;

            // Check Win Achievements
            // 1. Man of Steel: Full Lives (10)
            if (newLives >= 10 && !newUnlockedIds.includes('man_of_steel')) {
              newUnlockedIds.push('man_of_steel');
              // Prioritize showing this if multiple unlocked, or queue? For now just overwrite
              achievementUnlocked = ACHIEVEMENTS.find(a => a.id === 'man_of_steel') || achievementUnlocked;
            }

            // 2. Solo Leveling: 1 Warrior + 1 Archer ONLY (Miners don't count?) Description: "Win with exactly 1 Warrior and 1 Archer"
            const warriorCount = prev.defenders.filter(d => d.type === 'warrior').length;
            const archerCount = prev.defenders.filter(d => d.type === 'archer').length;
            // What about miners? Assuming ignoring miners or strictly ONLY 2 units total?
            // "Win with exactly 1 Warrior and 1 Archer" usually implies army composition.
            // Let's assume ignoring miners for identifying the "SOLO" feel, or strict total count?
            // "1 Warrior and 1 Archer" -> Total combat units = 2.
            const combatUnitCount = prev.defenders.filter(d => d.type === 'warrior' || d.type === 'archer').length;

            if (warriorCount === 1 && archerCount === 1 && combatUnitCount === 2 && !newUnlockedIds.includes('solo_leveling')) {
              newUnlockedIds.push('solo_leveling');
              achievementUnlocked = ACHIEVEMENTS.find(a => a.id === 'solo_leveling') || achievementUnlocked;
            }

            return {
              ...prev,
              enemies: [],
              coins: newCoins,
              isPlaying: false,
              gameWon: true,
              unlockedAchievements: newUnlockedIds,
              lastUnlockedAchievement: achievementUnlocked || prev.lastUnlockedAchievement
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
          totalMined: newTotalMined,
          unlockedAchievements: newUnlockedIds,
          lastUnlockedAchievement: achievementUnlocked || prev.lastUnlockedAchievement,
          floatingTexts: newFloatingTexts,
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
    dismissAchievement: () => setGameState(prev => ({ ...prev, lastUnlockedAchievement: null })),
  };
};
