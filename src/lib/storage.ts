import { GameState } from '@/types/game';

const STORAGE_KEY = 'grid_guard_save_v1';

export const saveGame = (state: GameState) => {
    try {
        // simple obfuscation
        const json = JSON.stringify(state);
        const b64 = btoa(json);
        localStorage.setItem(STORAGE_KEY, b64);
    } catch (e) {
        console.error('Failed to save game', e);
    }
};

export const loadGame = (): GameState | null => {
    try {
        const b64 = localStorage.getItem(STORAGE_KEY);
        if (!b64) return null;
        const json = atob(b64);
        return JSON.parse(json) as GameState;
    } catch (e) {
        console.error('Failed to load game', e);
        return null;
    }
};

export const clearSave = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear save', e);
    }
};
