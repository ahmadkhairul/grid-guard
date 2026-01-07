import { GameState, Achievement, DefenderType, Position } from '@/types/game';
import { MAX_WAVE, MAPS, MAP_DEFENDERS, DEFENDER_CONFIGS } from '@/config/gameConfig';
import { getEnemiesPerWave } from '@/logic/waveLogic';
import { spawnEnemies, updateEnemies } from '@/logic/enemyUpdate';
import { updateDefenders } from '@/logic/defenderUpdate';
import { checkAchievements } from '@/logic/achievementLogic';

export const updateGameTick = (
    prev: GameState,
    deltaTime: number,
    speedMultiplier: number,
    enemiesSpawnedRef: React.MutableRefObject<number>,
    enemySpawnTimerRef: React.MutableRefObject<number>,
    attackAnimationsRef: React.MutableRefObject<Set<string>>,
    path: Position[],
    onAttack?: (type: DefenderType) => void
): GameState => {
    let newEnemies = [...prev.enemies];
    let newCoins = prev.coins;
    let newLives = prev.lives;
    let newFloatingTexts = [...prev.floatingTexts];
    const newUnlockedIds = [...(prev.unlockedAchievements || [])];
    const newUnlockedDefenders = [...(prev.unlockedDefenders || [])]; // Ensure it exists
    let achievementUnlocked: Achievement | null = null;
    let notification = prev.notification;
    let screenFlash = prev.screenFlash;

    const addText = (x: number, y: number, t: string, c: string) => newFloatingTexts.push({ id: `ft-${Date.now()}-${Math.random()}`, x, y, text: t, color: c, life: 1.0 });

    // 1. SPAWN LOGIC
    const spawnResult = spawnEnemies(prev, deltaTime, speedMultiplier, enemiesSpawnedRef, enemySpawnTimerRef, addText);
    newEnemies = spawnResult.newEnemies;
    if (spawnResult.notification) notification = spawnResult.notification;

    // 2. ENEMY MOVEMENT & LOGIC
    const isBlizzardActive = !!(prev.activeSkills?.blizzardActiveUntil && Date.now() < prev.activeSkills.blizzardActiveUntil);
    const enemyUpdateResult = updateEnemies(
        newEnemies,
        path,
        deltaTime,
        speedMultiplier,
        isBlizzardActive,
        newCoins,
        newLives,
        addText
    );

    newEnemies = enemyUpdateResult.newEnemies;
    newCoins = enemyUpdateResult.newCoins;
    newLives = enemyUpdateResult.newLives;
    if (enemyUpdateResult.notification) notification = enemyUpdateResult.notification;

    // 3. DEFENDER COMBAT LOGIC
    const defenderUpdateResult = updateDefenders(
        prev.defenders,
        newEnemies,
        path,
        Date.now(),
        speedMultiplier,
        newCoins,
        newUnlockedIds,
        prev.totalMined || 0,
        attackAnimationsRef,
        addText,
        onAttack
    );

    const updatedDefenders = defenderUpdateResult.updatedDefenders;
    newEnemies = defenderUpdateResult.updatedEnemies;
    newCoins = defenderUpdateResult.newCoins;
    const updatedUnlockedIds = defenderUpdateResult.newUnlockedIds;
    if (defenderUpdateResult.achievementUnlocked) achievementUnlocked = defenderUpdateResult.achievementUnlocked;

    // Check Tick Achievements (Real-time: Midas, Elementalist)
    if (!achievementUnlocked) { // Only check if we haven't already unlocked one this tick
        const tickAch = checkAchievements({ ...prev, defenders: updatedDefenders, coins: newCoins, totalMined: (prev.totalMined || 0) + (newCoins - prev.coins) }, 'tick');
        if (tickAch) achievementUnlocked = tickAch;
    }


    // 4. CLEANUP & WIN CONDITIONS
    newEnemies.filter(e => e.hp <= 0).forEach(e => {
        // STUNNER DEATH LOGIC
        if (e.type === 'stunner') {
            const now = Date.now();
            updatedDefenders.forEach((d, idx) => {
                const dist = Math.sqrt(Math.pow(e.position.x - d.position.x, 2) + Math.pow(e.position.y - d.position.y, 2));
                if (dist <= 3) {
                    addText(d.position.x, d.position.y, 'STUNNED', 'text-blue-500 font-bold');
                    updatedDefenders[idx] = { ...d, stunnedUntil: now + 3000 };
                }
            });
            addText(e.position.x, e.position.y, 'EXPLOSION!', 'text-blue-500');
        }

        newCoins += e.reward;
        addText(e.position.x, e.position.y, `+${e.reward}`, 'text-yellow-400');
    });
    newEnemies = newEnemies.filter(e => e.hp > 0);
    newFloatingTexts = newFloatingTexts.map(ft => ({ ...ft, y: ft.y - (deltaTime / 1000) * 1.5, life: ft.life - (deltaTime / 1000) * 1.5 })).filter(ft => ft.life > 0);

    // 5. CHECKPOINTS & WAVES
    let newWave = prev.wave;
    let gameWon = prev.gameWon;
    let returnCheckpoint = prev.lastCheckpoint;
    let returnCheckpointCoins = prev.checkpointCoins;
    let returnCheckpointDefenders = prev.checkpointDefenders;

    // Wave Notification Helper
    const announceWave = (wave: number) => {
        if (wave === 25) return { id: `w${wave}`, title: 'FINAL WAVE', description: 'The Demon Lord Approaches!', icon: '👿', color: 'text-red-600' };
        if (wave === 20) return { id: `w${wave}`, title: 'WAVE 20', description: 'Assassins Incoming!', icon: '🥷' };
        if (wave === 15) return { id: `w${wave}`, title: 'WAVE 15', description: 'Iron Golem Detected!', icon: '🦍' };
        if (wave === 10) return { id: `w${wave}`, title: 'WAVE 10', description: 'Twin Bosses!', icon: '👹' };
        return { id: `w${wave}`, title: `WAVE ${wave}`, description: 'Prepare yourself!', icon: '⚔️' };
    };

    const enemiesPerWave = getEnemiesPerWave(prev.wave);

    if (newEnemies.length === 0 && enemiesSpawnedRef.current >= enemiesPerWave) {
        if (prev.wave >= MAX_WAVE && !prev.isEndless) {
            gameWon = true;

            // Check Victory Achievements
            const victoryAch = checkAchievements({ ...prev, isPlaying: false, gameWon: true, lives: newLives, defenders: updatedDefenders }, 'game_won');
            if (victoryAch) achievementUnlocked = victoryAch;

        } else {
            newWave++;
            enemiesSpawnedRef.current = 0;

            // Check Wave End Achievements
            const waveAch = checkAchievements({ ...prev, wave: prev.wave, coins: newCoins, lives: newLives }, 'wave_end'); // Use PREV wave since we just finished it? Or new? "End of wave".
            if (waveAch) achievementUnlocked = waveAch;

            // Endless Scaling: more coins
            const waveBonus = prev.isEndless ? 50 * prev.wave : 25 * prev.wave;
            newCoins += waveBonus;

            const currentMap = MAPS.find(m => m.id === prev.mapId) || MAPS[0];
            const mapDefender = MAP_DEFENDERS[currentMap.id];

            if ([5, 10, 15, 20].includes(newWave)) {
                returnCheckpoint = newWave;
                returnCheckpointCoins = newCoins;
                returnCheckpointDefenders = updatedDefenders.map(d => ({ ...d }));
                notification = { id: `checkpoint-${newWave}`, title: 'CHECKPOINT SAVED!', description: `You can restart from Wave ${newWave}!`, icon: '💾', color: 'text-blue-500' };
            } else if (newWave === 16 && mapDefender && !newUnlockedDefenders.includes(mapDefender)) {
                newUnlockedDefenders.push(mapDefender);
                const defConfig = DEFENDER_CONFIGS[mapDefender];
                notification = {
                    id: `unlock-${mapDefender}`,
                    title: 'NEW TOWER UNLOCKED!',
                    description: `${defConfig.name} is available in Shop!`,
                    icon: defConfig.emoji,
                    color: 'text-amber-500'
                };
            } else {
                notification = announceWave(newWave);
            }
        }
    }

    if (newLives <= 0) return { ...prev, lives: 0, isPlaying: false, enemies: [], lastCheckpoint: prev.lastCheckpoint, checkpointCoins: prev.checkpointCoins, checkpointDefenders: prev.checkpointDefenders };

    return {
        ...prev, enemies: newEnemies, defenders: updatedDefenders, coins: newCoins, lives: newLives,
        wave: newWave, gameWon, unlockedAchievements: updatedUnlockedIds, floatingTexts: newFloatingTexts,
        lastUnlockedAchievement: achievementUnlocked || prev.lastUnlockedAchievement,
        totalMined: (prev.totalMined || 0) + (newCoins - prev.coins),
        notification,
        unlockedDefenders: newUnlockedDefenders,
        screenFlash,
        lastCheckpoint: returnCheckpoint,
        checkpointCoins: returnCheckpointCoins,
        checkpointDefenders: returnCheckpointDefenders,
    };
};
