import { DefenderConfig, Position, DefenderType, EnemyType } from '@/types/game';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 7;
export const CELL_SIZE = 64;
export const MAX_WAVE = 10;
export const MAX_DEFENDERS_PER_TYPE = 3;

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

export const DEFENDER_CONFIGS: Record<DefenderType, DefenderConfig> = {
  warrior: {
    type: 'warrior',
    name: 'Warrior',
    cost: 50,
    damage: 15,
    range: 1.5,
    attackSpeed: 1000,
    emoji: '🧔',
    upgradeCost: 30,
    sellValue: 25,
  },
  archer: {
    type: 'archer',
    name: 'Archer',
    cost: 75,
    damage: 10,
    range: 3,
    attackSpeed: 800,
    emoji: '🧝',
    upgradeCost: 40,
    sellValue: 40,
  },
  mage: {
    type: 'mage',
    name: 'Mage',
    cost: 100,
    damage: 25,
    range: 2.5,
    attackSpeed: 1500,
    emoji: '🧙',
    upgradeCost: 50,
    sellValue: 50,
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
  fast: { emoji: '🏃', hpMultiplier: 0.5, speedMultiplier: 2, rewardMultiplier: 1.5 },
  tank: { emoji: '🛡️', hpMultiplier: 3, speedMultiplier: 0.5, rewardMultiplier: 2 },
  flying: { emoji: '🦅', hpMultiplier: 0.8, speedMultiplier: 1.2, rewardMultiplier: 1.8, isFlying: true },
  boss: { emoji: '👹', hpMultiplier: 10, speedMultiplier: 0.3, rewardMultiplier: 20 },
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
  return 'mage';
};

// Get random enemy type based on wave (higher waves = more variety)
export const getRandomEnemyType = (wave: number): EnemyType => {
  const rand = Math.random();
  if (wave >= 3 && rand < 0.15) return 'fast';
  if (wave >= 5 && rand < 0.25) return 'tank';
  if (wave >= 7 && rand < 0.35) return 'flying';
  return 'normal';
};
