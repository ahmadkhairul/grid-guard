import { Enemy, EnemyType } from '@/types/game';
import { MAX_WAVE, ENEMY_CONFIGS, ENEMY_PATH, FLYING_PATH, getBossImmunity, getRandomEnemyType } from '@/config/gameConfig';

const generateEnemyId = () => `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const getEnemiesPerWave = (wave: number): number => {
    const isBossWave = wave === MAX_WAVE;
    const isMiniBossWave = wave === 7;

    if (isBossWave) {
        return 2 + 15; // 2 Bosses + 15 Tanks
    } else if (isMiniBossWave) {
        return 1 + 10; // 1 Boss + 4 Tank + 4 Fast + 2 Flying = 11
    } else {
        return 8 + wave * 3;
    }
};

export const getNextEnemyType = (wave: number, enemiesSpawned: number): EnemyType => {
    const isBossWave = wave === MAX_WAVE;
    const isMiniBossWave = wave === 7;

    if (isBossWave) {
        if (enemiesSpawned === 1) return 'boss_warrior';
        if (enemiesSpawned === 2) return 'boss_archer';
        return 'tank'; // The 15 minions
    }

    if (isMiniBossWave) {
        // 1 Boss -> 4 Tank -> 4 Fast -> 2 Flying
        if (enemiesSpawned === 1) return 'boss';
        if (enemiesSpawned <= 5) return 'tank';
        if (enemiesSpawned <= 9) return 'fast';
        return 'flying';
    }

    return getRandomEnemyType(wave);
};

export const createEnemy = (type: EnemyType, wave: number): Enemy => {
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
