import { DEFENDER_TYPES, Enemy, EnemyType, MAP_TYPES } from '@/types/game';
import { ENEMY_CONFIGS, ENEMY_PATH, generateFlyingPath, getEnemyImmunity } from '@/config/gameConfig';
import { ENEMY_TYPES } from '@/types/game';

const generateEnemyId = () => `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const getEnemiesPerWave = (wave: number): number => {
    // ENDLESS SCALING: Reset count every 25 waves (Cycle 1: 1-25, Cycle 2: 26-50...)
    const effectiveWave = (wave - 1) % 25 + 1;

    if (effectiveWave === 25) return 35;
    if (effectiveWave === 20) return 25;
    if (effectiveWave === 15) return 20;
    if (effectiveWave === 10) return 17;
    if (effectiveWave === 7) return 11;

    return 8 + effectiveWave * 3;
};

export const getNextEnemyType = (wave: number, enemiesSpawned: number, mapId: string): EnemyType => {
    let bossByMap: EnemyType = ENEMY_TYPES.BOSS_GOLEM;
    if (mapId === MAP_TYPES.FREEZE_LAND) bossByMap = ENEMY_TYPES.BOSS_PHANTOM;
    else if (mapId === MAP_TYPES.DRAGON_CAVE) bossByMap = ENEMY_TYPES.BOSS_DRAGON;

    if (wave === 50) {
        if (enemiesSpawned <= 6) return ENEMY_TYPES.BOSS_DEMON_LORD;
        return ENEMY_TYPES.STUNNER;
    }

    if (wave === 40) {
        // Boss Rush: Spawn all unique bosses
        if (enemiesSpawned === 1) return ENEMY_TYPES.BOSS_GOLEM;
        if (enemiesSpawned === 2) return ENEMY_TYPES.BOSS_PHANTOM;
        if (enemiesSpawned === 3) return ENEMY_TYPES.BOSS_DRAGON;
        if (enemiesSpawned === 4) return ENEMY_TYPES.BOSS_WARRIOR;
        if (enemiesSpawned === 5) return ENEMY_TYPES.BOSS_ARCHER;
        if (enemiesSpawned === 6) return ENEMY_TYPES.BOSS_ASSASSIN;
        if (enemiesSpawned === 7) return ENEMY_TYPES.BOSS_DEMON;
        if (enemiesSpawned === 8) return ENEMY_TYPES.BOSS_DEMON_LORD;
        return ENEMY_TYPES.STUNNER;
    }

    if (wave === 25) {
        if (enemiesSpawned === 1) return ENEMY_TYPES.BOSS_DEMON_LORD;
        if (enemiesSpawned <= 3) return bossByMap;
        if (enemiesSpawned <= 5) return ENEMY_TYPES.BOSS_ASSASSIN;
        const remainder = enemiesSpawned % 3;
        return remainder === 0 ? ENEMY_TYPES.STUNNER : remainder === 1 ? ENEMY_TYPES.HEALER : ENEMY_TYPES.TANK;
    }

    if (wave === 20) {
        if (enemiesSpawned <= 2) return ENEMY_TYPES.BOSS_ASSASSIN;
        if (enemiesSpawned <= 12) return ENEMY_TYPES.THIEF;
        return ENEMY_TYPES.FAST;
    }

    if (wave === 15) {
        if (enemiesSpawned === 1) return bossByMap;
        if (enemiesSpawned <= 6) return ENEMY_TYPES.HEALER;
        return ENEMY_TYPES.TANK;
    }

    if (wave === 10) {
        if (enemiesSpawned === 1) return ENEMY_TYPES.BOSS_WARRIOR;
        if (enemiesSpawned === 2) return ENEMY_TYPES.BOSS_ARCHER;
        if (enemiesSpawned <= 6) return ENEMY_TYPES.HEALER;
        return ENEMY_TYPES.TANK;
    }

    if (wave === 7) {
        if (enemiesSpawned === 1) return ENEMY_TYPES.BOSS_DEMON;
        if (enemiesSpawned <= 5) return ENEMY_TYPES.TANK;
        if (enemiesSpawned <= 9) return ENEMY_TYPES.FAST;
        return ENEMY_TYPES.FLYING;
    }


    const rand = Math.random();
    let enemiesByMap: EnemyType = ENEMY_TYPES.IRON_GOLEM;
    if (mapId === MAP_TYPES.FREEZE_LAND) enemiesByMap = ENEMY_TYPES.PHANTOM;
    else if (mapId === MAP_TYPES.DRAGON_CAVE) enemiesByMap = ENEMY_TYPES.DRAGON;

    if (wave > 40) {
        if (rand < 0.40) return enemiesByMap;
        if (rand < 0.55) return bossByMap;
        if (rand < 0.60) return ENEMY_TYPES.BOSS_ASSASSIN;
        if (rand < 0.70) return ENEMY_TYPES.BOSS_WARRIOR;
        if (rand < 0.80) return ENEMY_TYPES.BOSS_ARCHER;
        return ENEMY_TYPES.STUNNER;
    }

    if (wave > 30) {
        if (rand < 0.40) return enemiesByMap;
        if (rand < 0.55) return ENEMY_TYPES.TANK;
        if (rand < 0.60) return ENEMY_TYPES.THIEF;
        if (rand < 0.90) return ENEMY_TYPES.STUNNER;
        return ENEMY_TYPES.FAST;
    }

    if (wave > 20) {
        if (rand < 0.20) return ENEMY_TYPES.HEALER;
        if (rand < 0.40) return enemiesByMap;
        if (rand < 0.55) return ENEMY_TYPES.TANK;
        if (rand < 0.70) return ENEMY_TYPES.THIEF;
        if (rand < 0.90) return ENEMY_TYPES.STUNNER;
        return ENEMY_TYPES.FAST;
    }

    if (wave > 15) {
        if (rand < 0.15) return ENEMY_TYPES.HEALER;
        if (rand < 0.30) return ENEMY_TYPES.STUNNER;
        if (rand < 0.40) return enemiesByMap;
        if (rand < 0.45) return ENEMY_TYPES.THIEF;
        if (rand < 0.65) return ENEMY_TYPES.TANK;
        if (rand < 0.85) return ENEMY_TYPES.FLYING;
        return ENEMY_TYPES.FAST;
    }

    if (wave > 10) {
        if (rand < 0.15) return ENEMY_TYPES.HEALER;
        if (rand < 0.50) return ENEMY_TYPES.TANK;
        if (rand < 0.75) return ENEMY_TYPES.FLYING;
        return ENEMY_TYPES.FAST;
    }

    if (wave > 7) {
        if (rand < 0.50) return ENEMY_TYPES.TANK;
        if (rand < 0.75) return ENEMY_TYPES.FLYING;
        return ENEMY_TYPES.FAST;
    }

    if (wave >= 3) {
        if (rand < 0.2) return ENEMY_TYPES.TANK;
        if (rand < 0.4) return ENEMY_TYPES.FAST;
        return ENEMY_TYPES.NORMAL;
    }
    return ENEMY_TYPES.NORMAL;
};


export const createEnemy = (type: EnemyType, wave: number): Enemy => {
    const config = ENEMY_CONFIGS[type];
    const effectiveWave = Math.min(wave, 25);
    const baseHp = 60 + effectiveWave * 35;
    const baseSpeed = 0.5 + effectiveWave * 0.1;
    const baseReward = 8 + effectiveWave * 1;

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
        immuneTo: type === ENEMY_TYPES.BOSS_DEMON || type === ENEMY_TYPES.BOSS_GOLEM ? getEnemyImmunity(type, 100) :
            type === ENEMY_TYPES.BOSS_ASSASSIN ? DEFENDER_TYPES.WARRIOR :
                type === ENEMY_TYPES.BOSS_ARCHER ? DEFENDER_TYPES.ARCHER : undefined,
        isFlying: config.isFlying,
        path: flyingPath,
        createdAt: Date.now(),
    };
};
