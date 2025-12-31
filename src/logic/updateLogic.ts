import { GameState, Enemy, Defender, Achievement, DefenderType, ACHIEVEMENTS } from '@/types/game';
import { MAX_WAVE, ENEMY_PATH, FLYING_PATH, getBossImmunity, GRID_WIDTH } from '@/config/gameConfig';
import { getEnemiesPerWave, getNextEnemyType, createEnemy } from '@/logic/waveLogic';

export const updateGameTick = (
    prev: GameState,
    deltaTime: number,
    speedMultiplier: number,
    enemiesSpawnedRef: React.MutableRefObject<number>,
    enemySpawnTimerRef: React.MutableRefObject<number>,
    attackAnimationsRef: React.MutableRefObject<Set<string>>,
    onAttack?: (type: DefenderType) => void
): GameState => {
    let newEnemies = [...prev.enemies];
    let newCoins = prev.coins;
    let newLives = prev.lives;
    let newFloatingTexts = [...prev.floatingTexts];
    const newUnlockedIds = [...(prev.unlockedAchievements || [])];
    let achievementUnlocked: Achievement | null = null;
    const addText = (x: number, y: number, t: string, c: string) => newFloatingTexts.push({ id: `ft-${Date.now()}-${Math.random()}`, x, y, text: t, color: c, life: 1.0 });

    // 1. Spawn Enemies
    const enemiesPerWave = getEnemiesPerWave(prev.wave);
    enemySpawnTimerRef.current += deltaTime;
    const spawnInterval = Math.max(500, 2000 - (prev.wave * 150));

    if (enemySpawnTimerRef.current >= spawnInterval && enemiesSpawnedRef.current < enemiesPerWave) {
        enemySpawnTimerRef.current = 0;
        enemiesSpawnedRef.current++;
        newEnemies.push(createEnemy(getNextEnemyType(prev.wave, enemiesSpawnedRef.current), prev.wave));
    }

    // 2. Move Enemies
    newEnemies = newEnemies.map(enemy => {
        const path = enemy.isFlying ? FLYING_PATH : ENEMY_PATH;
        const nextPathIndex = enemy.pathIndex + enemy.speed * speedMultiplier * (deltaTime / 1000);
        if (nextPathIndex >= path.length - 1) {
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
            immuneTo: enemy.type === 'boss' ? getBossImmunity((enemy.hp / enemy.maxHp) * 100) : undefined,
        } as Enemy;
    }).filter((e): e is Enemy => e !== null);

    // 3. Defenders Attack
    const now = Date.now();
    const updatedDefenders = prev.defenders.map(d => {
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
            newEnemies = newEnemies.map(e => e.id === target.id ? { ...e, hp: e.hp - d.damage, isHit: true } : e);
            setTimeout(() => { /* Reset isHit handled in loop or ignored for simplicity in pure logic? Need callback or state ref */ }, 200);
            return { ...d, lastAttack: now };
        }
        return d;
    });

    // 4. Cleanup & Floating Text
    newEnemies.filter(e => e.hp <= 0).forEach(e => {
        newCoins += e.reward;
        addText(e.position.x, e.position.y, `+${e.reward}`, 'text-yellow-400');
    });
    newEnemies = newEnemies.filter(e => e.hp > 0);
    newFloatingTexts = newFloatingTexts.map(ft => ({ ...ft, y: ft.y - (deltaTime / 1000) * 1.5, life: ft.life - (deltaTime / 1000) * 1.5 })).filter(ft => ft.life > 0);

    // 5. Wave/Win Check
    let newWave = prev.wave;
    let gameWon = prev.gameWon;
    if (newEnemies.length === 0 && enemiesSpawnedRef.current >= enemiesPerWave) {
        if (prev.wave >= MAX_WAVE) {
            gameWon = true;
            if (newLives >= 10 && !newUnlockedIds.includes('man_of_steel')) newUnlockedIds.push('man_of_steel');
            if (prev.defenders.filter(d => d.type === 'warrior').length === 1 && prev.defenders.filter(d => d.type === 'archer').length === 1 && !newUnlockedIds.includes('duo_leveling')) newUnlockedIds.push('duo_leveling');
        } else {
            newWave++;
            enemiesSpawnedRef.current = 0;
            newCoins += 25 * prev.wave;
        }
    }

    if (newLives <= 0) return { ...prev, lives: 0, isPlaying: false, enemies: [] };

    return {
        ...prev, enemies: newEnemies, defenders: updatedDefenders, coins: newCoins, lives: newLives,
        wave: newWave, gameWon, unlockedAchievements: newUnlockedIds, floatingTexts: newFloatingTexts,
        lastUnlockedAchievement: achievementUnlocked || prev.lastUnlockedAchievement,
        totalMined: (prev.totalMined || 0) + (newCoins - prev.coins) // Rough approx or needs exact miner tracking from step 3
    };
};
