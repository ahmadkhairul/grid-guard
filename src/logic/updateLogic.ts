import { GameState, Enemy, Achievement, DefenderType, ACHIEVEMENTS, Position } from '@/types/game';
import { MAX_WAVE, getBossImmunity } from '@/config/gameConfig';
import { getEnemiesPerWave, getNextEnemyType, createEnemy } from '@/logic/waveLogic';

export const updateGameTick = (
    prev: GameState,
    deltaTime: number,
    speedMultiplier: number,
    enemiesSpawnedRef: React.MutableRefObject<number>,
    enemySpawnTimerRef: React.MutableRefObject<number>,
    attackAnimationsRef: React.MutableRefObject<Set<string>>,
    path: Position[],
    onAttack?: (type: DefenderType) => void
): GameState => {
    let newEnemies = [...prev.enemies];
    let newCoins = prev.coins;
    let newLives = prev.lives;
    let newFloatingTexts = [...prev.floatingTexts];
    const newUnlockedIds = [...(prev.unlockedAchievements || [])];
    const newUnlockedDefenders = [...(prev.unlockedDefenders || [])]; // Ensure it exists
    let achievementUnlocked: Achievement | null = null;
    let notification = prev.notification;
    let screenFlash = prev.screenFlash;

    const addText = (x: number, y: number, t: string, c: string) => newFloatingTexts.push({ id: `ft-${Date.now()}-${Math.random()}`, x, y, text: t, color: c, life: 1.0 });

    // 1. Spawn Enemies
    const enemiesPerWave = getEnemiesPerWave(prev.wave);

    if (enemiesSpawnedRef.current < enemiesPerWave) {
        enemySpawnTimerRef.current += deltaTime * speedMultiplier;
    }

    const spawnInterval = Math.max(1500, 5000 - (prev.wave * 200));

    if (enemySpawnTimerRef.current >= spawnInterval && enemiesSpawnedRef.current < enemiesPerWave) {
        enemySpawnTimerRef.current -= spawnInterval;
        enemiesSpawnedRef.current++;
        const newEnemyType = getNextEnemyType(prev.wave, enemiesSpawnedRef.current);
        const newEnemy = createEnemy(newEnemyType, prev.wave);

        // HEALER LOGIC: Global Heal on Spawn
        if (newEnemyType === 'healer') {
            newEnemies.forEach(e => {
                const healAmount = 500;
                if (e.hp < e.maxHp) {
                    e.hp = Math.min(e.maxHp, e.hp + healAmount);
                    e.healGlow = true; // Add glow effect
                    addText(e.position.x, e.position.y, '+500', 'text-green-500');
                }
            });
            notification = { id: `heal-${Date.now()}`, title: 'ENEMY HEALED!', description: 'All enemies recovered 500 HP!', icon: '🧚', color: 'text-green-500' };
        }

        newEnemies.push(newEnemy);
    }

    // 2. Move Enemies
    newEnemies = newEnemies.map(enemy => {
        const enemyPath = enemy.path || path;
        const nextPathIndex = enemy.pathIndex + enemy.speed * speedMultiplier * (deltaTime / 1000);

        if (nextPathIndex >= enemyPath.length - 1) {
            // THIEF LOGIC: Steal Gold (no life reduction)
            if (enemy.type === 'thief') {
                newCoins = Math.max(0, newCoins - 5000);
                addText(enemy.position.x, enemy.position.y, '-5000', 'text-red-600 font-bold');
                notification = { id: `thief-${Date.now()}`, title: 'ROBBERY!', description: 'A Thief stole 5000 Gold!', icon: '🦹', color: 'text-red-500' };
                return null; // Remove thief without reducing lives
            }

            // Other enemies reduce lives
            const isBoss = enemy.type.includes('boss');
            newLives -= isBoss ? 5 : 1;

            return null;
        }

        const idx = Math.floor(nextPathIndex);
        const progress = nextPathIndex - idx;
        const currentPos = path[idx];
        const nextPos = path[Math.min(idx + 1, path.length - 1)];

        return {
            ...enemy, pathIndex: nextPathIndex,
            position: { x: currentPos.x + (nextPos.x - currentPos.x) * progress, y: currentPos.y + (nextPos.y - currentPos.y) * progress },
            immuneTo: getBossImmunity(enemy.type, (enemy.hp / enemy.maxHp) * 100),
            healGlow: false, // Clear glow after movement
        } as Enemy;
    }).filter((e): e is Enemy => e !== null);

    // 3. Defenders Attack
    const now = Date.now();
    let updatedDefenders = prev.defenders.map(d => {
        // STUN LOGIC: Skip attack if stunned
        if (d.stunnedUntil) {
            if (now >= d.stunnedUntil) {
                return { ...d, stunnedUntil: undefined };
            }
            return d;
        }

        if (now - d.lastAttack < d.attackSpeed / speedMultiplier) return d;

        if (d.type === 'miner') {
            onAttack?.(d.type);
            const gain = 15 + (d.level - 1) * 10;
            newCoins += gain;
            const totalMined = (prev.totalMined || 0) + gain;
            if (totalMined >= 100000 && !newUnlockedIds.includes('rich_man')) {
                newUnlockedIds.push('rich_man');
                achievementUnlocked = ACHIEVEMENTS.find(a => a.id === 'rich_man') || null;
            }
            addText(d.position.x, d.position.y, `+${gain}`, 'text-yellow-400');
            return { ...d, lastAttack: now };
        }

        const target = newEnemies.find(e => {
            if (e.immuneTo === d.type) return false;
            const dist = Math.sqrt(Math.pow(e.position.x - d.position.x, 2) + Math.pow(e.position.y - d.position.y, 2));
            return dist <= d.range;
        });

        if (target) {
            attackAnimationsRef.current.add(d.id);
            setTimeout(() => attackAnimationsRef.current.delete(d.id), 300);
            onAttack?.(d.type);

            // Stone Cannon Pushback Logic
            if (d.type === 'stone') {
                // Push Back 2 tiles (approx)
                newEnemies = newEnemies.map(e => {
                    if (e.id !== target.id) return e;
                    const enemyPath = e.path || path;
                    const pushedIndex = Math.max(0, e.pathIndex - 2.0);
                    // Re-calc Position immediately for visual snap
                    const idx = Math.floor(pushedIndex);
                    const progress = pushedIndex - idx;
                    const currentPos = enemyPath[idx];
                    const nextPos = enemyPath[Math.min(idx + 1, enemyPath.length - 1)];
                    const newPos = { x: currentPos.x + (nextPos.x - currentPos.x) * progress, y: currentPos.y + (nextPos.y - currentPos.y) * progress };

                    return { ...e, hp: e.hp - d.damage, isHit: true, pathIndex: pushedIndex, position: newPos };
                });
            } else {
                newEnemies = newEnemies.map(e => e.id === target.id ? { ...e, hp: e.hp - d.damage, isHit: true } : e);
            }

            setTimeout(() => { }, 200);
            return { ...d, lastAttack: now };
        }
        return d;
    });

    // 4. Cleanup & Floating Text & Stun Logic
    newEnemies.filter(e => e.hp <= 0).forEach(e => {
        // STUNNER DEATH LOGIC
        if (e.type === 'stunner') {
            // Stun towers in range 3
            updatedDefenders = updatedDefenders.map(d => {
                const dist = Math.sqrt(Math.pow(e.position.x - d.position.x, 2) + Math.pow(e.position.y - d.position.y, 2));
                if (dist <= 3) {
                    addText(d.position.x, d.position.y, 'STUNNED', 'text-blue-500 font-bold');
                    return { ...d, stunnedUntil: now + 3000 };
                }
                return d;
            });
            addText(e.position.x, e.position.y, 'EXPLOSION!', 'text-blue-500');
        }

        newCoins += e.reward;
        addText(e.position.x, e.position.y, `+${e.reward}`, 'text-yellow-400');
    });
    newEnemies = newEnemies.filter(e => e.hp > 0);
    newFloatingTexts = newFloatingTexts.map(ft => ({ ...ft, y: ft.y - (deltaTime / 1000) * 1.5, life: ft.life - (deltaTime / 1000) * 1.5 })).filter(ft => ft.life > 0);

    // 5. Wave/Win Check
    let newWave = prev.wave;
    let gameWon = prev.gameWon;

    // Wave Notification Helper
    const announceWave = (wave: number) => {
        if (wave === 25) return { id: `w${wave}`, title: 'FINAL WAVE', description: 'The Demon Lord Approaches!', icon: '👿', color: 'text-red-600' };
        if (wave === 20) return { id: `w${wave}`, title: 'WAVE 20', description: 'Assassins Incoming!', icon: '🥷' };
        if (wave === 15) return { id: `w${wave}`, title: 'WAVE 15', description: 'Iron Golem Detected!', icon: '🦍' };
        if (wave === 10) return { id: `w${wave}`, title: 'WAVE 10', description: 'Twin Bosses!', icon: '👹' };
        return { id: `w${wave}`, title: `WAVE ${wave}`, description: 'Prepare yourself!', icon: '⚔️' };
    };

    // Checkpoint return values (default to previous)
    let returnCheckpoint = prev.lastCheckpoint;
    let returnCheckpointCoins = prev.checkpointCoins;
    let returnCheckpointDefenders = prev.checkpointDefenders;

    if (newEnemies.length === 0 && enemiesSpawnedRef.current >= enemiesPerWave) {
        if (prev.wave >= MAX_WAVE) {
            gameWon = true;
            if (newLives >= 10 && !newUnlockedIds.includes('man_of_steel')) newUnlockedIds.push('man_of_steel');
            if (prev.defenders.filter(d => d.type === 'warrior').length === 1 && prev.defenders.filter(d => d.type === 'archer').length === 1 && !newUnlockedIds.includes('duo_leveling')) newUnlockedIds.push('duo_leveling');
        } else {
            newWave++;
            enemiesSpawnedRef.current = 0;
            newCoins += 25 * prev.wave;

            // CHECKPOINT LOGIC: Save checkpoint only on transition
            if ([5, 10, 15, 20].includes(newWave)) {
                returnCheckpoint = newWave;
                returnCheckpointCoins = newCoins;
                // Deep copy defenders to save the state exactly at start of wave
                returnCheckpointDefenders = updatedDefenders.map(d => ({ ...d }));
                notification = { id: `checkpoint-${newWave}`, title: 'CHECKPOINT SAVED!', description: `You can restart from Wave ${newWave}!`, icon: '💾', color: 'text-blue-500' };
            }
            // UNLOCK LOGIC: Beat Wave 15 -> Unlock Stone Cannon (Wave 16 Start)
            else if (newWave === 16 && !newUnlockedDefenders.includes('stone')) {
                newUnlockedDefenders.push('stone');
                notification = { id: `unlock-stone`, title: 'NEW TOWER UNLOCKED!', description: 'Stone Cannon is available in Shop!', icon: '🗿', color: 'text-amber-500' };
            } else {
                notification = announceWave(newWave);
            }
        }
    }

    if (newLives <= 0) return { ...prev, lives: 0, isPlaying: false, enemies: [], lastCheckpoint: prev.lastCheckpoint, checkpointCoins: prev.checkpointCoins, checkpointDefenders: prev.checkpointDefenders };

    return {
        ...prev, enemies: newEnemies, defenders: updatedDefenders, coins: newCoins, lives: newLives,
        wave: newWave, gameWon, unlockedAchievements: newUnlockedIds, floatingTexts: newFloatingTexts,
        lastUnlockedAchievement: achievementUnlocked || prev.lastUnlockedAchievement,
        totalMined: (prev.totalMined || 0) + (newCoins - prev.coins),
        notification,
        unlockedDefenders: newUnlockedDefenders,
        screenFlash,
        lastCheckpoint: returnCheckpoint,
        checkpointCoins: returnCheckpointCoins,
        checkpointDefenders: returnCheckpointDefenders,
    };
};
