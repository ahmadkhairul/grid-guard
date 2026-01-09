import { GameState } from '@/types/game';

const STORAGE_PREFIX = 'grid_defender_save_v2_';
const OLD_STORAGE_PREFIX = 'grid_defender_save_v1_';

const getStorageKey = (mapId: string) => `${STORAGE_PREFIX}${mapId}`;

// Clean up old v1 saves on first load
export const migrateOldSaves = () => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(OLD_STORAGE_PREFIX)) {
                localStorage.removeItem(key);
                console.log('Cleaned up old save:', key);
            }
        });
    } catch (e) {
        console.error('Failed to migrate old saves', e);
    }
};

export const migrateLightningToFire = () => {
    try {
        const keys = Object.keys(localStorage);

        // 1. Migrate saved games
        keys.forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                const b64 = localStorage.getItem(key);
                if (b64) {
                    try {
                        const json = atob(b64);
                        if (json.includes('"lightning"')) {
                            const migrated = json.replace(/"lightning"/g, '"fire"');
                            localStorage.setItem(key, btoa(migrated));
                            console.log('Migrated tower type in save:', key);
                        }
                    } catch (e) {
                        console.error('Failed to parse save during migration:', key);
                    }
                }
            }
        });

        // 2. Migrate used defenders history
        const usedJson = localStorage.getItem(USED_DEFENDERS_KEY);
        if (usedJson && usedJson.includes('"lightning"')) {
            localStorage.setItem(USED_DEFENDERS_KEY, usedJson.replace(/"lightning"/g, '"fire"'));
            console.log('Migrated used defenders history');
        }

    } catch (e) {
        console.error('Failed to run lightning-to-fire migration', e);
    }
};

export const saveGame = (state: GameState) => {
    try {
        const key = getStorageKey(state.mapId || 'default');
        // simple obfuscation
        const json = JSON.stringify(state);
        const b64 = btoa(json);
        localStorage.setItem(key, b64);
    } catch (e) {
        console.error('Failed to save game', e);
    }
};

export const loadGame = (mapId: string): GameState | null => {
    try {
        const key = getStorageKey(mapId);
        const b64 = localStorage.getItem(key);
        if (!b64) return null;
        const json = atob(b64);
        return JSON.parse(json) as GameState;
    } catch (e) {
        console.error('Failed to load game', e);
        return null;
    }
};

export const hasSave = (mapId: string): boolean => {
    try {
        const key = getStorageKey(mapId);
        return !!localStorage.getItem(key);
    } catch (e) {
        return false;
    }
};

export const clearSave = (mapId: string) => {
    try {
        const key = getStorageKey(mapId);
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Failed to clear save', e);
    }
};

const CLEARED_MAPS_KEY = 'grid_defender_cleared_maps';

export const saveMapClear = (mapId: string) => {
    try {
        const cleared = getClearedMaps();
        if (!cleared.includes(mapId)) {
            const newCleared = [...cleared, mapId];
            localStorage.setItem(CLEARED_MAPS_KEY, JSON.stringify(newCleared));
        }
    } catch (e) {
        console.error('Failed to save clear status', e);
    }
};

export const getClearedMaps = (): string[] => {
    try {
        const json = localStorage.getItem(CLEARED_MAPS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
};

export const hasMapClear = (mapId: string): boolean => {
    return getClearedMaps().includes(mapId);
};

const ACHIEVEMENTS_KEY = 'grid_defender_global_achievements';

export const getUnlockedAchievements = (): string[] => {
    try {
        const json = localStorage.getItem(ACHIEVEMENTS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
};

export const saveAchievement = (id: string) => {
    try {
        const unlocked = getUnlockedAchievements();
        if (!unlocked.includes(id)) {
            const newUnlocked = [...unlocked, id];
            localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(newUnlocked));
        }
    } catch (e) {
        console.error('Failed to save achievement', e);
    }
};

const USED_DEFENDERS_KEY = 'grid_defender_used_defenders';

export const getUsedDefenders = (): string[] => {
    try {
        const json = localStorage.getItem(USED_DEFENDERS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
};

export const saveUsedDefender = (type: string) => {
    try {
        const used = getUsedDefenders();
        if (!used.includes(type)) {
            const newUsed = [...used, type];
            localStorage.setItem(USED_DEFENDERS_KEY, JSON.stringify(newUsed));
        }
    } catch (e) {
        console.error('Failed to save used defender', e);
    }
};
