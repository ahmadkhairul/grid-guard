import { useState, useCallback, useRef } from 'react';
import { GameState } from '@/types/game';
import { DEFENDER_CONFIGS, isPathCell, MAX_PER_TYPE, MAX_LEVEL } from '@/config/gameConfig';

const generateDefenderId = () => `defender-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        coins: 100, wave: 1, enemies: [], defenders: [], lives: 10,
        isPlaying: false, selectedDefender: null, isLoading: true,
        gameWon: false, isPaused: false, totalMined: 0,
        unlockedAchievements: [], lastUnlockedAchievement: null, floatingTexts: [],
        notification: null, unlockedDefenders: ['warrior', 'archer', 'miner'], screenFlash: null,
        lastCheckpoint: 0, checkpointCoins: 100,
    });

    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const enemiesSpawnedRef = useRef<number>(0);

    const toggleSpeed = useCallback(() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 3 : 1)), []);

    const resetGame = useCallback(() => {
        setGameState({
            coins: 100, wave: 1, enemies: [], defenders: [], lives: 10,
            isPlaying: false, selectedDefender: null, isLoading: false,
            gameWon: false, isPaused: false, totalMined: 0,
            unlockedAchievements: [], lastUnlockedAchievement: null, floatingTexts: [],
            notification: null, unlockedDefenders: ['warrior', 'archer', 'miner'], screenFlash: null,
            lastCheckpoint: 0, checkpointCoins: 100,
        });
        enemiesSpawnedRef.current = 0;
    }, []);

    const placeDefender = useCallback((x: number, y: number) => {
        setGameState(prev => {
            if (!prev.selectedDefender || isPathCell(x, y)) return prev;
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
        setGameState(prev => ({
            coins: prev.checkpointCoins,
            wave: prev.lastCheckpoint,
            enemies: [],
            defenders: [],
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
            unlockedDefenders: prev.lastCheckpoint >= 15 ? ['warrior', 'archer', 'miner', 'stone'] : ['warrior', 'archer', 'miner'],
            screenFlash: null,
            lastCheckpoint: prev.lastCheckpoint,
            checkpointCoins: prev.checkpointCoins,
        }));
        enemiesSpawnedRef.current = 0;
    }, []);

    return {
        gameState, setGameState, speedMultiplier, toggleSpeed,
        enemiesSpawnedRef, resetGame, placeDefender, upgradeDefender,
        dismissNotification,
        clearScreenFlash,
        restoreCheckpoint,
    };
};
