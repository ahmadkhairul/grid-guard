import { DefenderConfig, Position, DefenderType, EnemyType, DEFENDER_TYPES, ENEMY_TYPES, MAP_TYPES } from '@/types/game';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 7;
export const CELL_SIZE = 64;
export const MAX_WAVE = 25;
export const MAX_PER_TYPE = 10;
export const MAX_LEVEL = 20;

export interface MapConfig {
  id: string;
  name: string;
  description: string;
  path: Position[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const GOLEM_LAIR_PATH: Position[] = [
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

const FREEZE_LAND_PATH: Position[] = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
  { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 },
  { x: 8, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 }, { x: 0, y: 6 },
  { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 },
  { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
  { x: 7, y: 3 }, { x: 7, y: 4 },
  { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 4 }, { x: 2, y: 4 },
];

const DRAGON_LAIR_PATH: Position[] = [
  { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 },
  { x: 2, y: 5 }, { x: 2, y: 4 },
  { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
  { x: 5, y: 3 }, { x: 5, y: 2 },
  { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
  { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 },
  { x: 9, y: 5 }, { x: 9, y: 6 },
];

export const MAPS: MapConfig[] = [
  {
    id: MAP_TYPES.GOLEM_LAIR,
    name: 'Golem Lair',
    description: 'A winding path ideal for beginners using standard strategies.',
    path: GOLEM_LAIR_PATH,
    difficulty: 'Easy',
  },
  {
    id: MAP_TYPES.FREEZE_LAND,
    name: 'Freeze Land',
    description: 'A long spiral path maximizing tower exposure time. Home of the Phantom.',
    path: FREEZE_LAND_PATH,
    difficulty: 'Medium',
  },
  {
    id: MAP_TYPES.DRAGON_CAVE,
    name: 'Dragon Cave',
    description: 'A winding path through the Dragon\'s domain.',
    path: DRAGON_LAIR_PATH,
    difficulty: 'Hard',
  },
];

// Kept for legacy reference but ideally should be replaced by dynamic calls
export const ENEMY_PATH = GOLEM_LAIR_PATH;

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
    type: DEFENDER_TYPES.WARRIOR,
    name: 'Warrior',
    cost: 50,
    damage: 20,
    range: 1.5,
    attackSpeed: 800,
    emoji: '⚔️',
    upgradeCost: 30,
  },
  archer: {
    type: DEFENDER_TYPES.ARCHER,
    name: 'Archer',
    cost: 90,
    damage: 12,
    range: 2.5,
    attackSpeed: 800,
    emoji: '🏹',
    upgradeCost: 40,
  },
  miner: {
    type: DEFENDER_TYPES.MINER,
    name: 'Miner',
    cost: 100,
    damage: 0,
    range: 0,
    attackSpeed: 5000,
    emoji: '⛏️',
    upgradeCost: 50,
  },
  stone: {
    type: DEFENDER_TYPES.STONE,
    name: 'Stone Cannon',
    cost: 300,
    damage: 40,
    range: 2.0,
    attackSpeed: 2000,
    emoji: '🗿',
    upgradeCost: 150,
  },
  ice: {
    type: DEFENDER_TYPES.ICE,
    emoji: '🧊',
    name: 'Ice Cube',
    cost: 300,
    damage: 25,
    range: 3.0,
    attackSpeed: 1250,
    upgradeCost: 150
  },
  lightning: {
    type: DEFENDER_TYPES.LIGHTNING,
    emoji: '⚡',
    name: 'Lightning Rod',
    cost: 300,
    damage: 30,
    range: 2.5,
    attackSpeed: 1000,
    upgradeCost: 150
  },
};

export interface EnemyConfig {
  emoji: string;
  hpMultiplier: number;
  speedMultiplier: number;
  rewardMultiplier: number;
  isFlying?: boolean;
  color?: string; // CSS class (bg-...)
  labelColor?: string; // CSS class (text-...)
  label?: string; // Display Name
  resistances?: Partial<Record<DefenderType, number>>; // Damage multiplier (0.5 = 50% damage)
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  normal: {
    emoji: '👾', hpMultiplier: 1, speedMultiplier: 1, rewardMultiplier: 1,
    color: 'bg-destructive', label: 'NORMAL'
  },
  fast: {
    emoji: '🏃', hpMultiplier: 0.5, speedMultiplier: 2.2, rewardMultiplier: 1.5,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500', label: 'FAST', labelColor: 'text-yellow-500'
  },
  tank: {
    emoji: '🛡️', hpMultiplier: 12, speedMultiplier: 0.5, rewardMultiplier: 2,
    color: 'bg-gradient-to-r from-blue-500 to-blue-700', label: 'TANK', labelColor: 'text-blue-500'
  },
  flying: {
    emoji: '🦅', hpMultiplier: 0.8, speedMultiplier: 1.2, rewardMultiplier: 1.8, isFlying: true,
    color: 'bg-gradient-to-r from-purple-400 to-pink-500', label: 'FLY', labelColor: 'text-purple-500'
  },
  thief: {
    emoji: '🦹', hpMultiplier: 1, speedMultiplier: 7.0, rewardMultiplier: 3.0,
    color: 'bg-yellow-600', label: 'THIEF', labelColor: 'text-yellow-600'
  },
  healer: {
    emoji: '🧚', hpMultiplier: 2.5, speedMultiplier: 1.0, rewardMultiplier: 2.0,
    color: 'bg-green-500', label: 'HEALER', labelColor: 'text-green-500'
  },
  stunner: {
    emoji: '🦇', hpMultiplier: 1.5, speedMultiplier: 1.5, rewardMultiplier: 2.5, isFlying: true,
    color: 'bg-indigo-500', label: 'STUNNER', labelColor: 'text-indigo-500'
  },

  iron_golem: {
    emoji: '🤖', hpMultiplier: 35, speedMultiplier: 0.4, rewardMultiplier: 30,
    color: 'bg-stone-600', label: 'GOLEM', labelColor: 'text-stone-500',
    resistances: { [DEFENDER_TYPES.ARCHER]: 0.5 } // 50% from Arrows
  },
  boss_golem: {
    emoji: '🦍', hpMultiplier: 50, speedMultiplier: 0.5, rewardMultiplier: 25,
    color: 'bg-stone-800', label: 'BOSS GOLEM', labelColor: 'text-stone-800'
  },

  dragon: {
    emoji: '🐉', hpMultiplier: 5, speedMultiplier: 0.5, rewardMultiplier: 4, isFlying: true,
    color: 'bg-red-700', label: 'DRAGON', labelColor: 'text-red-700'
  },
  boss_dragon: {
    emoji: '🐲', hpMultiplier: 30, speedMultiplier: 1, rewardMultiplier: 25,
    color: 'bg-red-900', label: 'BOSS DRAGON', labelColor: 'text-red-900'
  },

  phantom: {
    emoji: '🥶', hpMultiplier: 5, speedMultiplier: 1.5, rewardMultiplier: 15,
    color: 'bg-cyan-500', label: 'PHANTOM', labelColor: 'text-cyan-500'
  },
  boss_phantom: {
    emoji: '🎭', hpMultiplier: 15, speedMultiplier: 3.0, rewardMultiplier: 25,
    color: 'bg-cyan-800', label: 'BOSS PHANTOM', labelColor: 'text-cyan-800'
  },

  boss_demon: {
    emoji: '👹', hpMultiplier: 25, speedMultiplier: 0.8, rewardMultiplier: 20,
    color: 'bg-red-600', label: 'DEMON', labelColor: 'text-red-600'
  },
  boss_warrior: {
    emoji: '🤖', hpMultiplier: 25, speedMultiplier: 1.0, rewardMultiplier: 20,
    color: 'bg-slate-700', label: 'WARLORD', labelColor: 'text-slate-700'
  },
  boss_archer: {
    emoji: '👻', hpMultiplier: 25, speedMultiplier: 1.8, rewardMultiplier: 20,
    color: 'bg-gray-400', label: 'RANGER', labelColor: 'text-gray-400'
  },
  boss_assassin: {
    emoji: '🥷', hpMultiplier: 30, speedMultiplier: 3.0, rewardMultiplier: 40,
    color: 'bg-black', label: 'ASSASSIN', labelColor: 'text-black'
  },
  boss_demon_lord: {
    emoji: '👿', hpMultiplier: 100, speedMultiplier: 1.0, rewardMultiplier: 100,
    color: 'bg-gradient-to-r from-red-900 via-black to-red-900', label: 'DEMON LORD', labelColor: 'text-red-900'
  },
};

export const isPathCell = (x: number, y: number, path: Position[] = GOLEM_LAIR_PATH): boolean => {
  return path.some(pos => pos.x === x && pos.y === y);
};

export const getPathCellIndex = (x: number, y: number, path: Position[] = GOLEM_LAIR_PATH): number => {
  return path.findIndex(pos => pos.x === x && pos.y === y);
};

// 1. IMMUNITY (Untargetable)
export const getEnemyImmunity = (type: string, hpPercentage: number): DefenderType | undefined => {
  if (type === ENEMY_TYPES.BOSS_ASSASSIN && hpPercentage < 50) return DEFENDER_TYPES.ARCHER;
  if (type === ENEMY_TYPES.BOSS_ASSASSIN && hpPercentage > 50) return DEFENDER_TYPES.WARRIOR;

  if (type === ENEMY_TYPES.BOSS_DEMON_LORD || type === ENEMY_TYPES.BOSS_DEMON) {
    if (hpPercentage > 66) return DEFENDER_TYPES.WARRIOR;
    if (hpPercentage > 33) return DEFENDER_TYPES.ARCHER;
    return DEFENDER_TYPES.WARRIOR;
  }

  return undefined;
};

// 2. RESISTANCE (Damage Reduction)
export const getDamageMultiplier = (enemyType: EnemyType, defenderType: DefenderType): number => {
  const config = ENEMY_CONFIGS[enemyType];
  if (config.resistances && config.resistances[defenderType]) {
    return config.resistances[defenderType]!;
  }
  return 1;
};
