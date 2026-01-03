import { Enemy, EnemyType } from '@/types/game';
import { ENEMY_CONFIGS, ENEMY_PATH, generateFlyingPath, getBossImmunity } from '@/config/gameConfig';

const generateEnemyId = () => `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const getEnemiesPerWave = (wave: number): number => {
    if (wave === 25) return 35; // Demon + Mix
    if (wave === 20) return 25; // Assassins + Thieves
    if (wave === 15) return 20; // Golem + Healers
    if (wave === 10) return 17; // Twin Bosses
    if (wave === 7) return 11;  // Mini Boss
    // Scaling: 8, 11, 14, 17, 20...
    return 8 + wave * 3;
};

export const getNextEnemyType = (wave: number, enemiesSpawned: number): EnemyType => {
    // Wave 25: Demon Lord
    if (wave === 25) {
        if (enemiesSpawned === 1) return 'boss_demon';
        if (enemiesSpawned <= 3) return 'boss_golem'; // 2 Golems
        if (enemiesSpawned <= 5) return 'boss_assassin'; // 2 Assassins
        const remainder = enemiesSpawned % 3;
        return remainder === 0 ? 'stunner' : remainder === 1 ? 'healer' : 'tank';
    }

    // Wave 20: Assassins
    if (wave === 20) {
        if (enemiesSpawned <= 2) return 'boss_assassin'; // 2 Assassins
        if (enemiesSpawned <= 12) return 'thief'; // 10 Thieves
        return 'fast'; // Rest Fast
    }

    // Wave 15: Iron Golem
    if (wave === 15) {
        if (enemiesSpawned === 1) return 'boss_golem';
        if (enemiesSpawned <= 6) return 'healer'; // 5 Healers
        return 'tank'; // Rest Tanks
    }

    // Wave 10: Twin Bosses (Warrior/Archer)
    if (wave === 10) {
        if (enemiesSpawned === 1) return 'boss_warrior';
        if (enemiesSpawned === 2) return 'boss_archer';
        return 'tank';
    }

    // Wave 7: Mini Boss
    if (wave === 7) {
        if (enemiesSpawned === 1) return 'boss';
        if (enemiesSpawned <= 5) return 'tank';
        if (enemiesSpawned <= 9) return 'fast';
        return 'flying';
    }


    const rand = Math.random();

    if (wave > 20) {
        if (rand < 0.20) return 'healer';      // 20% healers (constant healing)
        if (rand < 0.55) return 'tank';        // 35% tanks (high HP)
        if (rand < 0.70) return 'thief';       // 15% thieves (steal gold)
        if (rand < 0.90) return 'stunner';     // 20% stunners (disable towers + flying)
        return 'fast';                         // 10% fast (speed demons)
    }

    if (wave > 15) {
        if (rand < 0.15) return 'healer';
        if (rand < 0.30) return 'stunner';
        if (rand < 0.45) return 'thief';
        if (rand < 0.65) return 'tank';
        if (rand < 0.85) return 'flying';
        return 'fast';
    }

    if (wave > 10) {
        if (rand < 0.15) return 'healer';
        if (rand < 0.50) return 'tank';
        if (rand < 0.75) return 'flying';
        return 'fast';
    }

    if (wave > 7) {
        if (rand < 0.50) return 'tank';
        if (rand < 0.75) return 'flying';
        return 'fast';
    }

    if (wave >= 3) {
        if (rand < 0.2) return 'tank';
        if (rand < 0.4) return 'fast';
        return 'normal';
    }

    return 'normal';
};

export const createEnemy = (type: EnemyType, wave: number): Enemy => {
    const config = ENEMY_CONFIGS[type];
    const baseHp = 60 + wave * 35;
    const baseSpeed = 0.5 + wave * 0.1;
    const baseReward = 8 + wave * 1;

    // Generate unique path for flying enemies
    const flyingPath = config.isFlying ? generateFlyingPath() : undefined;
    const startPath = flyingPath ? flyingPath[0] : ENEMY_PATH[0];

    return {
        id: generateEnemyId(),
        position: { ...startPath },
        hp: Math.floor(baseHp * config.hpMultiplier),
        maxHp: Math.floor(baseHp * config.hpMultiplier),
        pathIndex: 0,
        speed: baseSpeed * config.speedMultiplier,
        reward: Math.floor(baseReward * config.rewardMultiplier),
        type,
        immuneTo: type === 'boss' ? getBossImmunity(type, 100) :
            type === 'boss_warrior' ? 'warrior' :
                type === 'boss_archer' ? 'archer' : undefined,
        isFlying: config.isFlying,
        path: flyingPath, // Store the unique path
    };
};
