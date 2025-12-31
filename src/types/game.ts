export interface Position {
  x: number;
  y: number;
}

export type EnemyType = 'normal' | 'boss' | 'fast' | 'tank' | 'flying' | 'boss_warrior' | 'boss_archer';

export interface Enemy {
  id: string;
  position: Position;
  hp: number;
  maxHp: number;
  pathIndex: number;
  speed: number;
  reward: number;
  type: EnemyType;
  immuneTo?: DefenderType;
  isHit?: boolean;
  isFlying?: boolean;
}

export interface Defender {
  id: string;
  position: Position;
  damage: number;
  range: number;
  attackSpeed: number;
  lastAttack: number;
  level: number;
  type: DefenderType;
}

export type DefenderType = 'warrior' | 'archer' | 'miner';

export interface DefenderConfig {
  type: DefenderType;
  name: string;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number;
  emoji: string;
  upgradeCost: number;
  sellValue: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'duo_leveling', title: 'SOLO LEVELING', description: 'Win with exactly 1 Warrior and 1 Archer', icon: '🗡️' },
  { id: 'rich_man', title: 'RICH MAN', description: 'Mine 100000 gold in a single game', icon: '💰' },
  { id: 'man_of_steel', title: 'MAN OF STEEL', description: 'Win with full health (10 Lives)', icon: '🛡️' },
];

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string; // TailWind class like 'text-yellow-400'
  life: number; // 0-1, fades out
}

export interface GameState {
  coins: number;
  wave: number;
  enemies: Enemy[];
  defenders: Defender[];
  lives: number;
  isPlaying: boolean;
  selectedDefender: DefenderType | null;
  isLoading: boolean;
  gameWon: boolean;
  isPaused: boolean;
  // Stats & Achievements
  totalMined: number;
  unlockedAchievements: string[];
  lastUnlockedAchievement: Achievement | null; // For toast
  // Visual Effects
  floatingTexts: FloatingText[];
}
