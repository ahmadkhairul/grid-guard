import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, DefenderType } from '@/types/game';
import { DEFENDER_CONFIGS, isPathCell, MAX_PER_TYPE, MAX_LEVEL, MAPS, MAP_DEFENDERS, SKILL_CONFIGS } from '@/config/gameConfig';
import { saveGame, loadGame, clearSave } from '@/lib/storage';

const generateDefenderId = () => `defender-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useGameState = (mapId: string) => {
    const [gameState, setGameState] = useState<GameState>({
        coins: 100, wave: 1, enemies: [], defenders: [], lives: 10,
        isPlaying: false, selectedDefender: null, isLoading: true,
        gameWon: false, isPaused: false, totalMined: 0,
        unlockedAchievements: [], lastUnlockedAchievement: null, floatingTexts: [],
        notification: null, unlockedDefenders: ['warrior', 'archer', 'miner'], screenFlash: null,
        lastCheckpoint: 0, checkpointCoins: 100, checkpointDefenders: [],
        mapId: mapId,
        activeSkills: { meteorReadyAt: 0, blizzardReadyAt: 0, blizzardActiveUntil: 0, meteorLevel: 1, blizzardLevel: 1 },
    });

    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const enemiesSpawnedRef = useRef<number>(0);

    // AUTO-SAVE: Load game on mount
    useEffect(() => {
        const saved = loadGame(mapId);
        if (saved && saved.mapId === mapId) {
            setGameState({ ...saved, isLoading: false });
        } else {
            // Ensure fresh start for this map
            setGameState(prev => ({
                ...prev,
                mapId,
                isLoading: false,
                coins: 100,
                wave: 1,
                enemies: [],
                defenders: [],
                lives: 10,
                isPlaying: false,
                gameWon: false,
                isPaused: false,
                lastCheckpoint: 0,
                checkpointCoins: 100,
                checkpointDefenders: [],
                unlockedDefenders: ['warrior', 'archer', 'miner'],
                activeSkills: { meteorReadyAt: 0, blizzardReadyAt: 0, blizzardActiveUntil: 0, meteorLevel: 1, blizzardLevel: 1 }
            }));
        }
    }, [mapId]);

    // AUTO-SAVE: Save game on wave or coin change (Only when NOT playing to ensure Start of Wave state)
    useEffect(() => {
        if (!gameState.isPlaying && !gameState.isLoading) {
            saveGame(gameState);
        }
    }, [gameState.wave, gameState.coins, gameState.defenders, gameState.lives, gameState.unlockedDefenders, gameState.unlockedAchievements, gameState.isPlaying, gameState.isLoading, gameState.mapId]);

    const toggleSpeed = useCallback(() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 3 : 1)), []);

    const resetGame = useCallback(() => {
        clearSave(mapId); // Clear local storage on reset
        setGameState({
            coins: 100, wave: 1, enemies: [], defenders: [], lives: 10,
            isPlaying: false, selectedDefender: null, isLoading: false,
            gameWon: false, isPaused: false, totalMined: 0,
            unlockedAchievements: [], lastUnlockedAchievement: null, floatingTexts: [],
            notification: null, unlockedDefenders: ['warrior', 'archer', 'miner'], screenFlash: null,
            lastCheckpoint: 0, checkpointCoins: 100, checkpointDefenders: [],
            mapId: mapId,
            activeSkills: { meteorReadyAt: 0, blizzardReadyAt: 0, blizzardActiveUntil: 0, meteorLevel: 1, blizzardLevel: 1 },
        });
        enemiesSpawnedRef.current = 0;
    }, [mapId]);

    const placeDefender = useCallback((x: number, y: number) => {
        setGameState(prev => {
            const currentMap = MAPS.find(m => m.id === prev.mapId) || MAPS[0];
            if (!prev.selectedDefender || isPathCell(x, y, currentMap.path)) return prev;
            const config = DEFENDER_CONFIGS[prev.selectedDefender];
            if (prev.coins < config.cost) return prev;

            const count = prev.defenders.filter(d => d.type === prev.selectedDefender).length;
            if (count >= MAX_PER_TYPE) return prev;

            return {
                ...prev,
                coins: prev.coins - config.cost,
                defenders: [...prev.defenders, {
                    id: generateDefenderId(), position: { x, y },
                    damage: config.damage, range: config.range, attackSpeed: config.attackSpeed,
                    lastAttack: 0, level: 1, type: prev.selectedDefender,
                }],
                selectedDefender: null,
            };
        });
    }, []);

    const upgradeDefender = useCallback((id: string) => {
        setGameState(prev => {
            const defender = prev.defenders.find(d => d.id === id);
            if (!defender) return prev;
            const config = DEFENDER_CONFIGS[defender.type];
            const cost = config.upgradeCost * defender.level;

            if (prev.coins < cost || defender.level >= MAX_LEVEL) return prev;

            return {
                ...prev,
                coins: prev.coins - cost,
                defenders: prev.defenders.map(d => d.id === id ? {
                    ...d, level: d.level + 1,
                    damage: d.damage + config.damage * 0.5,
                    range: d.type === 'archer' ? d.range + 0.5 : d.range,
                    attackSpeed: d.type === 'miner' ? d.attackSpeed : d.attackSpeed * 0.9,
                } : d),
            };
        });
    }, []);

    const dismissNotification = useCallback(() => setGameState(prev => ({ ...prev, notification: null })), []);
    const clearScreenFlash = useCallback(() => setGameState(prev => ({ ...prev, screenFlash: null })), []);

    const restoreCheckpoint = useCallback(() => {
        setGameState(prev => {
            const mapDefender = MAP_DEFENDERS[prev.mapId];
            const shouldUnlockSpecial = prev.lastCheckpoint >= 16 && mapDefender;
            const updatedUnlocked: DefenderType[] = ['warrior', 'archer', 'miner'];
            if (shouldUnlockSpecial) updatedUnlocked.push(mapDefender);

            return {
                coins: prev.checkpointCoins,
                wave: prev.lastCheckpoint,
                enemies: [],
                defenders: prev.checkpointDefenders.map(d => ({ ...d })), // Deep copy defenders
                lives: 10,
                isPlaying: false,
                selectedDefender: null,
                isLoading: false,
                gameWon: false,
                isPaused: false,
                totalMined: 0,
                unlockedAchievements: prev.unlockedAchievements,
                lastUnlockedAchievement: null,
                floatingTexts: [],
                notification: null,
                unlockedDefenders: updatedUnlocked,
                screenFlash: null,
                lastCheckpoint: prev.lastCheckpoint,
                checkpointCoins: prev.checkpointCoins,
                checkpointDefenders: prev.checkpointDefenders,
                mapId: prev.mapId,
                activeSkills: prev.activeSkills || { meteorReadyAt: 0, blizzardReadyAt: 0, blizzardActiveUntil: 0, meteorLevel: 1, blizzardLevel: 1 },
            };
        });
        enemiesSpawnedRef.current = 0;
    }, []);

    const triggerMeteor = useCallback(() => {
        const now = Date.now();
        setGameState(prev => {
            const meteorLevel = prev.activeSkills.meteorLevel || 1;
            const config = SKILL_CONFIGS.meteor.levels[meteorLevel - 1];
            const cost = SKILL_CONFIGS.meteor.baseCost;

            if (prev.coins < cost) return prev;

            // Calculate damage as percentage of max HP
            const newEnemies = prev.enemies.map(e => ({
                ...e,
                hp: e.hp - (e.maxHp * config.damagePercent),
                isHit: true
            }));

            const damagePercent = Math.round(config.damagePercent * 100);

            return {
                ...prev,
                coins: prev.coins - cost,
                enemies: newEnemies,
                activeSkills: { ...prev.activeSkills, meteorReadyAt: now + config.cooldown },
                notification: { id: `meteor-${now}`, title: 'METEOR STRIKE!', description: `Dealt ${damagePercent}% damage to all enemies!`, icon: '☄️', color: 'text-orange-500' },
            };
        });
    }, []);

    const triggerBlizzard = useCallback(() => {
        const now = Date.now();
        setGameState(prev => {
            const blizzardLevel = prev.activeSkills.blizzardLevel || 1;
            const config = SKILL_CONFIGS.blizzard.levels[blizzardLevel - 1];
            const cost = SKILL_CONFIGS.blizzard.baseCost;
            const durationSec = config.duration / 1000;

            if (prev.coins < cost) return prev;

            return {
                ...prev,
                coins: prev.coins - cost,
                activeSkills: { ...prev.activeSkills, blizzardReadyAt: now + config.cooldown, blizzardActiveUntil: now + config.duration },
                notification: { id: `blizzard-${now}`, title: 'BLIZZARD!', description: `All enemies frozen for ${durationSec} seconds!`, icon: '❄️', color: 'text-blue-500' },
            };
        });
    }, []);

    const upgradeSkill = useCallback((skillType: 'meteor' | 'blizzard') => {
        setGameState(prev => {
            const currentLevel = skillType === 'meteor'
                ? (prev.activeSkills.meteorLevel || 1)
                : (prev.activeSkills.blizzardLevel || 1);

            if (currentLevel >= 5) return prev; // Max level

            const cost = SKILL_CONFIGS[skillType].levels[currentLevel].upgradeCost;
            if (prev.coins < cost) return prev;

            const newLevel = currentLevel + 1;
            const skillName = skillType === 'meteor' ? 'Meteor' : 'Blizzard';

            return {
                ...prev,
                coins: prev.coins - cost,
                activeSkills: {
                    ...prev.activeSkills,
                    [skillType === 'meteor' ? 'meteorLevel' : 'blizzardLevel']: newLevel
                },
                notification: {
                    id: `skill-upgrade-${Date.now()}`,
                    title: `${skillName} Upgraded!`,
                    description: `${skillName} is now Level ${newLevel}!`,
                    icon: skillType === 'meteor' ? '☄️' : '❄️',
                    color: skillType === 'meteor' ? 'text-orange-500' : 'text-blue-500'
                }
            };
        });
    }, []);

    return {
        gameState, setGameState, speedMultiplier, toggleSpeed,
        enemiesSpawnedRef, resetGame, placeDefender, upgradeDefender,
        dismissNotification,
        clearScreenFlash,
        restoreCheckpoint,
        triggerMeteor,
        triggerBlizzard,
        upgradeSkill,
    };
};
