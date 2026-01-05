import { GameState } from '@/types/game';

const STORAGE_PREFIX = 'grid_guard_save_v2_';
const OLD_STORAGE_PREFIX = 'grid_guard_save_v1_';

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
