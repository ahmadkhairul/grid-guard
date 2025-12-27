export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  position: Position;
  hp: number;
  maxHp: number;
  pathIndex: number;
  speed: number;
  reward: number;
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

export type DefenderType = 'warrior' | 'archer' | 'mage';

export interface DefenderConfig {
  type: DefenderType;
  name: string;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number;
  emoji: string;
  upgradeCost: number;
}

export interface GameState {
  coins: number;
  wave: number;
  enemies: Enemy[];
  defenders: Defender[];
  lives: number;
  isPlaying: boolean;
  selectedDefender: DefenderType | null;
}
