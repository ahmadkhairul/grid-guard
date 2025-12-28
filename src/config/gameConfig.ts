import { DefenderConfig, Position, DefenderType } from '@/types/game';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 7;
export const CELL_SIZE = 64;
export const MAX_WAVE = 10;
export const MAX_DEFENDERS_PER_TYPE = 3;

// Path that enemies follow (loops around the grid)
export const ENEMY_PATH: Position[] = [
  { x: 0, y: 3 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 2, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 5, y: 2 },
  { x: 5, y: 3 },
  { x: 5, y: 4 },
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 7, y: 4 },
  { x: 7, y: 3 },
  { x: 7, y: 2 },
  { x: 8, y: 2 },
  { x: 9, y: 2 },
];

export const DEFENDER_CONFIGS: Record<DefenderType, DefenderConfig> = {
  warrior: {
    type: 'warrior',
    name: 'Warrior',
    cost: 50,
    damage: 15,
    range: 1.5,
    attackSpeed: 1000,
    emoji: '⚔️',
    upgradeCost: 30,
  },
  archer: {
    type: 'archer',
    name: 'Archer',
    cost: 75,
    damage: 10,
    range: 3,
    attackSpeed: 800,
    emoji: '🏹',
    upgradeCost: 40,
  },
  mage: {
    type: 'mage',
    name: 'Mage',
    cost: 100,
    damage: 25,
    range: 2.5,
    attackSpeed: 1500,
    emoji: '🔮',
    upgradeCost: 50,
  },
};

export const isPathCell = (x: number, y: number): boolean => {
  return ENEMY_PATH.some(pos => pos.x === x && pos.y === y);
};

export const getPathCellIndex = (x: number, y: number): number => {
  return ENEMY_PATH.findIndex(pos => pos.x === x && pos.y === y);
};

// Boss immunity phases based on HP percentage
export const getBossImmunity = (hpPercentage: number): DefenderType | undefined => {
  if (hpPercentage > 66) return 'warrior';      // First 33% immune to warrior
  if (hpPercentage > 33) return 'archer';       // Second 33% immune to archer
  return 'mage';                                 // Last 33% immune to mage
};
