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
}
