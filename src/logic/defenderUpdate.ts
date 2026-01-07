import { Defender, Enemy, Achievement, DefenderType, ACHIEVEMENTS, Position, DEFENDER_TYPES, ENEMY_TYPES } from '@/types/game';
import { ENEMY_CONFIGS, getDamageMultiplier } from '@/config/gameConfig';

interface DefenderUpdateResult {
    updatedDefenders: Defender[];
    updatedEnemies: Enemy[];
    newCoins: number;
    newUnlockedIds: string[];
    achievementUnlocked: Achievement | null;
}

export const updateDefenders = (
    defenders: Defender[],
    enemies: Enemy[],
    path: Position[],
    now: number,
    speedMultiplier: number,
    prevCoins: number,
    prevUnlockedIds: string[],
    prevTotalMined: number, // Need to track this for Miner achievement
    attackAnimationsRef: React.MutableRefObject<Set<string>>,
    addText: (x: number, y: number, t: string, c: string) => void,
    onAttack?: (type: DefenderType) => void
): DefenderUpdateResult => {
    let newCoins = prevCoins;
    let newEnemies = [...enemies]; // Local copy to mutate HP
    const newUnlockedIds = [...prevUnlockedIds];
    let achievementUnlocked: Achievement | null = null;
    let totalMined = prevTotalMined;

    const updatedDefenders = defenders.map(d => {
        // STUN LOGIC: Skip attack if stunned
        if (d.stunnedUntil) {
            if (now >= d.stunnedUntil) {
                return { ...d, stunnedUntil: undefined };
            }
            return d;
        }

        if (now - d.lastAttack < d.attackSpeed / speedMultiplier) return d;

        if (d.type === DEFENDER_TYPES.MINER) {
            onAttack?.(d.type);
            const gain = 15 + (d.level - 1) * 10;
            newCoins += gain;
            totalMined += gain;
            addText(d.position.x, d.position.y, `+${gain}`, 'text-yellow-400');
            return { ...d, lastAttack: now };
        }

        // Find all enemies in range
        const enemiesInRange = newEnemies.filter(e => {
            if (e.immuneTo === d.type) return false;

            // Phantom: Can't target if invisible
            if (e.type === ENEMY_TYPES.PHANTOM && e.isInvisible) return false;

            const dist = Math.sqrt(Math.pow(e.position.x - d.position.x, 2) + Math.pow(e.position.y - d.position.y, 2));
            return dist <= d.range;
        });

        // Target the enemy closest to exit (highest pathIndex)
        const target = enemiesInRange.reduce((closest, current) => {
            if (!closest) return current;
            return current.pathIndex > closest.pathIndex ? current : closest;
        }, null as Enemy | null);

        if (target) {
            attackAnimationsRef.current.add(d.id);
            setTimeout(() => attackAnimationsRef.current.delete(d.id), 300);
            onAttack?.(d.type);

            // Calculate damage with special modifiers
            let finalDamage = d.damage;

            // GENERIC RESISTANCE: Apply resistance from config
            const multiplier = getDamageMultiplier(target.type, d.type);
            finalDamage *= multiplier;

            // DRAGON: AOE damage reduction (reduce damage from all defenders in 4x4 grid)
            if (target.type === ENEMY_TYPES.DRAGON) {
                const defendersNearby = defenders.filter(defender => {
                    const dist = Math.sqrt(
                        Math.pow(defender.position.x - target.position.x, 2) +
                        Math.pow(defender.position.y - target.position.y, 2)
                    );
                    return dist <= 4;
                });
                const reductionFactor = Math.max(0.3, 1 - (defendersNearby.length * 0.1)); // Max 70% reduction
                finalDamage *= reductionFactor;
            }


            // ICE MAGE: Apply slow effect (3 seconds)
            if (d.type === DEFENDER_TYPES.ICE) {
                newEnemies = newEnemies.map(e => {
                    if (e.id === target.id) {
                        // Only apply slow if not already slowed
                        if (!e.slowedUntil || now >= e.slowedUntil) {
                            addText(target.position.x, target.position.y, 'SLOWED', 'text-cyan-400');
                            return { ...e, slowedUntil: now + 3000 };
                        }
                    }
                    return e;
                });
            }

            // LIGHTNING TOWER: Chain to nearby enemies
            if (d.type === DEFENDER_TYPES.LIGHTNING) {
                const chainTargets = newEnemies.filter(e => {
                    if (e.id === target.id) return false;
                    const dist = Math.sqrt(
                        Math.pow(e.position.x - target.position.x, 2) +
                        Math.pow(e.position.y - target.position.y, 2)
                    );
                    return dist <= 2; // Chain within 2 tiles
                }).slice(0, 2); // Max 2 additional targets

                chainTargets.forEach(chainTarget => {
                    newEnemies = newEnemies.map(e =>
                        e.id === chainTarget.id ? { ...e, hp: e.hp - (finalDamage * 0.5), isHit: true } : e
                    );
                });
            }

            // Stone Cannon Pushback Logic (IRON GOLEM immune to knockback)
            if (d.type === DEFENDER_TYPES.STONE && target.type !== ENEMY_TYPES.IRON_GOLEM) {
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

                    return { ...e, hp: e.hp - finalDamage, isHit: true, pathIndex: pushedIndex, position: newPos };
                });
            } else {
                newEnemies = newEnemies.map(e => e.id === target.id ? { ...e, hp: e.hp - finalDamage, isHit: true } : e);
            }

            setTimeout(() => { }, 200);
            return { ...d, lastAttack: now };
        }
        return d;
    });

    return { updatedDefenders, updatedEnemies: newEnemies, newCoins, newUnlockedIds, achievementUnlocked };
};
