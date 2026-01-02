import { DefenderConfig, Position, DefenderType, EnemyType } from '@/types/game';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 7;
export const CELL_SIZE = 64;
export const MAX_WAVE = 25;
export const MAX_PER_TYPE = 10;
export const MAX_LEVEL = 20;

export const ENEMY_PATH: Position[] = [
  { x: 0, y: 5 },
  { x: 1, y: 5 },
  { x: 2, y: 5 },
  { x: 3, y: 5 },
  { x: 4, y: 5 },
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 8, y: 5 },
  { x: 8, y: 4 },
  { x: 8, y: 3 },
  { x: 8, y: 2 },
  { x: 8, y: 1 },
  { x: 7, y: 1 },
  { x: 6, y: 1 },
  { x: 6, y: 2 },
  { x: 6, y: 3 },
  { x: 5, y: 3 },
  { x: 4, y: 3 },
  { x: 4, y: 2 },
  { x: 4, y: 1 },
  { x: 3, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
  { x: 1, y: 3 },
  { x: 0, y: 3 },
];

export const generateFlyingPath = (): Position[] => {
  const yPositions = [0, 2, 4, 6];
  const randomY = yPositions[Math.floor(Math.random() * yPositions.length)];

  return [
    ...Array.from({ length: 9 }, (_, i) => ({ x: i, y: randomY })), // 0,y -> 8,y
    { x: 9, y: randomY },
    { x: 9, y: randomY + 1 },
    ...Array.from({ length: 10 }, (_, i) => ({ x: 9 - i, y: randomY + 1 })), // 9,y+1 -> 0,y+1 (Exit)
  ];
};

export const DEFENDER_CONFIGS: Record<DefenderType, DefenderConfig> = {
  warrior: {
    type: 'warrior',
    name: 'Warrior',
    cost: 50,
    damage: 20,
    range: 1.5,
    attackSpeed: 800,
    emoji: '⚔️',
    upgradeCost: 30,
  },
  archer: {
    type: 'archer',
    name: 'Archer',
    cost: 90,
    damage: 12,
    range: 2.5,
    attackSpeed: 800,
    emoji: '🏹',
    upgradeCost: 40,
  },
  miner: {
    type: 'miner',
    name: 'Miner',
    cost: 100,
    damage: 0,
    range: 0,
    attackSpeed: 5000,
    emoji: '⛏️',
    upgradeCost: 50,
  },
  stone: {
    type: 'stone',
    name: 'Stone Cannon',
    cost: 300,
    damage: 50,
    range: 2.0,
    attackSpeed: 2000,
    emoji: '🗿',
    upgradeCost: 150,
  },
};

// Enemy type configurations
export interface EnemyConfig {
  emoji: string;
  hpMultiplier: number;
  speedMultiplier: number;
  rewardMultiplier: number;
  isFlying?: boolean;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  normal: { emoji: '👾', hpMultiplier: 1, speedMultiplier: 1, rewardMultiplier: 1 },
  fast: { emoji: '🏃', hpMultiplier: 0.5, speedMultiplier: 2.2, rewardMultiplier: 1.5 },
  tank: { emoji: '🛡️', hpMultiplier: 12, speedMultiplier: 0.5, rewardMultiplier: 2 },
  flying: { emoji: '🦅', hpMultiplier: 0.8, speedMultiplier: 1.2, rewardMultiplier: 1.8, isFlying: true },
  boss: { emoji: '👹', hpMultiplier: 25, speedMultiplier: 0.8, rewardMultiplier: 20 },
  boss_warrior: { emoji: '🤖', hpMultiplier: 25, speedMultiplier: 1.0, rewardMultiplier: 20 },
  boss_archer: { emoji: '👻', hpMultiplier: 25, speedMultiplier: 1.8, rewardMultiplier: 20 },
  thief: { emoji: '🦹', hpMultiplier: 1, speedMultiplier: 7.0, rewardMultiplier: 3.0 }, // Fast, Steals Gold
  healer: { emoji: '🧚', hpMultiplier: 2.5, speedMultiplier: 1.0, rewardMultiplier: 2.0 }, // Heals allies
  stunner: { emoji: '🦇', hpMultiplier: 1.5, speedMultiplier: 1.5, rewardMultiplier: 2.5, isFlying: true }, // Stuns towers
  boss_golem: { emoji: '🦍', hpMultiplier: 50, speedMultiplier: 0.5, rewardMultiplier: 50 }, // Wave 15
  boss_assassin: { emoji: '🥷', hpMultiplier: 30, speedMultiplier: 3.0, rewardMultiplier: 40 }, // Wave 20
  boss_demon: { emoji: '👿', hpMultiplier: 100, speedMultiplier: 1.0, rewardMultiplier: 100 }, // Wave 25
};

export const isPathCell = (x: number, y: number): boolean => {
  return ENEMY_PATH.some(pos => pos.x === x && pos.y === y);
};

export const getPathCellIndex = (x: number, y: number): number => {
  return ENEMY_PATH.findIndex(pos => pos.x === x && pos.y === y);
};

// Boss immunity phases based on HP percentage
export const getBossImmunity = (hpPercentage: number): DefenderType | undefined => {
  if (hpPercentage > 66) return 'warrior';
  if (hpPercentage > 33) return 'archer';
  return 'warrior';
};
