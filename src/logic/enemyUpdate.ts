import { Enemy, GameState, Position, FloatingText, GameNotification, ENEMY_TYPES } from '@/types/game';
import { getEnemiesPerWave, getNextEnemyType, createEnemy } from '@/logic/waveLogic';
import { getEnemyImmunity } from '@/config/gameConfig';

interface EnemyUpdateResult {
    newEnemies: Enemy[];
    newCoins: number;
    newLives: number;
    floatingTexts: FloatingText[];
    notification: GameNotification | null;
}

export const spawnEnemies = (
    prev: GameState,
    deltaTime: number,
    speedMultiplier: number,
    enemiesSpawnedRef: React.MutableRefObject<number>,
    enemySpawnTimerRef: React.MutableRefObject<number>,
    addText: (x: number, y: number, t: string, c: string) => void
): { newEnemies: Enemy[], notification: GameNotification | null } => {
    const newEnemies = [...prev.enemies];
    let notification: GameNotification | null = null;

    const enemiesPerWave = getEnemiesPerWave(prev.wave);

    // Don't spawn enemies during Blizzard to prevent immediate freeze
    const isBlizzardActive = prev.activeSkills?.blizzardActiveUntil && Date.now() < prev.activeSkills.blizzardActiveUntil;

    if (!isBlizzardActive && enemiesSpawnedRef.current < enemiesPerWave) {
        enemySpawnTimerRef.current += deltaTime * speedMultiplier;
    }

    const spawnInterval = Math.max(1500, 5000 - (prev.wave * 200));

    if (!isBlizzardActive && enemySpawnTimerRef.current >= spawnInterval && enemiesSpawnedRef.current < enemiesPerWave) {
        enemySpawnTimerRef.current -= spawnInterval;
        enemiesSpawnedRef.current++;
        const newEnemyType = getNextEnemyType(prev.wave, enemiesSpawnedRef.current, prev.mapId);
        const newEnemy = createEnemy(newEnemyType, prev.wave);

        // HEALER LOGIC: Global Heal on Spawn
        if (newEnemyType === ENEMY_TYPES.HEALER) {
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

    return { newEnemies, notification };
};

export const updateEnemies = (
    enemies: Enemy[],
    path: Position[],
    deltaTime: number,
    speedMultiplier: number,
    isBlizzardActive: boolean,
    prevCoins: number,
    prevLives: number,
    addText: (x: number, y: number, t: string, c: string) => void
): EnemyUpdateResult => {
    let newCoins = prevCoins;
    let newLives = prevLives;
    let notification: GameNotification | null = null;
    const floatingTexts: FloatingText[] = []; // Local accumulator if needed, but we use the callback

    const updatedEnemies = enemies.map(enemy => {
        const enemyPath = enemy.path || path;

        // Ice Mage slow effect
        const isSlowed = enemy.slowedUntil && Date.now() < enemy.slowedUntil;
        const slowMultiplier = isSlowed ? 0.3 : 1;

        // Blizzard freeze + slow combined
        const effectiveSpeed = isBlizzardActive ? 0 : enemy.speed * slowMultiplier;
        const nextPathIndex = enemy.pathIndex + effectiveSpeed * speedMultiplier * (deltaTime / 1000);

        // PHANTOM: Toggle invisibility every 2 seconds
        if (enemy.type === ENEMY_TYPES.PHANTOM) {
            const shouldToggle = Math.random() < (deltaTime / 2000); // ~50% visible over time
            if (shouldToggle) {
                enemy.isInvisible = !enemy.isInvisible;
            }
        }

        if (nextPathIndex >= enemyPath.length - 1) {
            // THIEF LOGIC: Steal Gold (no life reduction)
            if (enemy.type === ENEMY_TYPES.THIEF) {
                newCoins = Math.max(0, newCoins - 5000);
                addText(enemy.position.x, enemy.position.y, '-5000', 'text-red-600 font-bold');
                notification = { id: `thief-${Date.now()}`, title: 'ROBBERY!', description: 'A Thief stole 5000 Gold!', icon: '🦹', color: 'text-red-500' };
                return null; // Remove thief without reducing lives
            }

            // Other enemies reduce lives
            const isBoss = enemy.type.startsWith('boss');
            newLives -= isBoss ? 5 : 1;

            return null;
        }

        const idx = Math.floor(nextPathIndex);
        const progress = nextPathIndex - idx;
        const currentPos = enemyPath[idx];
        const nextPos = enemyPath[Math.min(idx + 1, enemyPath.length - 1)];

        return {
            ...enemy,
            pathIndex: nextPathIndex,
            position: { x: currentPos.x + (nextPos.x - currentPos.x) * progress, y: currentPos.y + (nextPos.y - currentPos.y) * progress },
            immuneTo: getEnemyImmunity(enemy.type, (enemy.hp / enemy.maxHp) * 100),
            healGlow: false, // Clear glow after movement
        } as Enemy;
    }).filter((e): e is Enemy => e !== null);

    return {
        newEnemies: updatedEnemies,
        newCoins,
        newLives,
        floatingTexts,
        notification
    };
};
