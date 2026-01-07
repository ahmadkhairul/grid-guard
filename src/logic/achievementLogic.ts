import { GameState, Defender, Achievement, ACHIEVEMENTS, DEFENDER_TYPES } from '@/types/game';
import { MAX_WAVE } from '@/config/gameConfig';
import { getUnlockedAchievements, saveAchievement, getClearedMaps, hasMapClear, getUsedDefenders } from '@/lib/storage';

const MAP_COUNT = 3;

export const checkAchievements = (
    state: GameState,
    event: 'wave_end' | 'game_won' | 'tick' | 'boss_kill',
    extraData?: any
): Achievement | null => {
    const unlocked = getUnlockedAchievements();
    const newUnlock = (id: string) => {
        if (!unlocked.includes(id)) {
            saveAchievement(id);
            return ACHIEVEMENTS.find(a => a.id === id) || null;
        }
        return null;
    }

    // 1. Economist
    if (event === 'wave_end' && state.coins >= 5000) {
        const res = newUnlock('economist');
        if (res) return res;
    }

    // 2. Close Call
    if (event === 'wave_end' && state.lives === 1) {
        const res = newUnlock('close_call');
        if (res) return res;
    }

    // 3. Midas Touch
    if (state.totalMined >= 1000000) {
        const res = newUnlock('midas_touch');
        if (res) return res;
    }

    // 4. Elementalist (Global Check)
    if (event === 'tick') {
        const used = getUsedDefenders();
        const allTypes = ['warrior', 'archer', 'stone', 'ice', 'lightning', 'miner'];
        const hasAll = allTypes.every(t => used.includes(t));

        if (hasAll) {
            const res = newUnlock('elementalist');
            if (res) return res;
        }
    }

    // 5. Grid Avenger
    if (state.wave >= 50 && event === 'wave_end') {
        const res = newUnlock('grid_avenger');
        if (res) return res;
    }

    // 6. Boss Slayer (Passed via extraData: { bossType: string, timeToKill: number })
    if (event === 'boss_kill' && extraData?.bossType === 'boss_demon_lord' && extraData?.timeToKill <= 10000) {
        const res = newUnlock('boss_slayer');
        if (res) return res;
    }


    // VICTORY CHECKS (Wave 25)
    if (event === 'game_won') {
        // 7. Untouchable
        if (state.lives >= 10) {
            const res = newUnlock('untouchable');
            if (res) return res;
        }

        // 8. Duo of Legends
        // Filter out non-DPS (Miner, maybe Stone/Ice if user considers them support? 
        // Description says "Warrior and Archer as DPS". 
        // Strict interpretation: ONLY Warrior and Archer towers exist? Or only those deal damage?
        // Let's assume: ONLY Warrior and Archer types exist (plus Miners).
        // Limit filter to only Warrior/Archers. 
        // We allow 'miner', 'stone', 'ice', 'lightning' as non-combat/support or elemental.
        // The condition "Win Wave 25 with exactly 1 Warrior and 1 Archer" implies those are the specific DPS units.
        // The user complained about Ice towers causing fail.
        // So we strictly check if Warrior count == 1 AND Archer count == 1, and ignore others.
        const warriors = state.defenders.filter(d => d.type === 'warrior');
        const archers = state.defenders.filter(d => d.type === 'archer');

        // Check if we have ANY other "Standard" physical towers? No, just ensure we have the duo.
        // If they have 50 Ice Towers, so be it. The achievement is about the Duo of Legends (Warrior+Archer).
        if (warriors.length === 1 && archers.length === 1) {
            const res = newUnlock('duo_legends');
            if (res) return res;
        }

        // 9. Ironman Run
        // We now track 'hasUsedCheckpoint' in state.
        if (!state.hasUsedCheckpoint) {
            const res = newUnlock('ironman_run');
            if (res) return res;
        }

        // 10. Minimalist
        if (state.defenders.length < 10) {
            const res = newUnlock('minimalist');
            if (res) return res;
        }

        // 11. Guardian of the Grid
        // Need to check if all 3 maps are cleared. 
        // Since we JUST saved the current map clear in Game.tsx, we can check storage.
        const cleared = getClearedMaps(); // This should include current map if saved before this check
        // Check if mapId matches known maps
        // Hardcoded check for the 3 main maps
        const allMaps = ['golem_lair', 'freeze_land', 'dragon_cave'];
        const allCleared = allMaps.every(id => cleared.includes(id) || (state.mapId === id)); // Check current too just in case
        if (allCleared) {
            const res = newUnlock('grid_guardian');
            if (res) return res;
        }
    }

    return null;
};
