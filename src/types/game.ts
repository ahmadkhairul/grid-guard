export interface Position {
  x: number;
  y: number;
}



export const MAP_TYPES = {
  GOLEM_LAIR: 'golem_lair',
  FREEZE_LAND: 'freeze_land',
  DRAGON_CAVE: 'dragon_cave',
}

export const ENEMY_TYPES = {
  NORMAL: 'normal',
  FAST: 'fast',
  TANK: 'tank',
  FLYING: 'flying',
  THIEF: 'thief',
  HEALER: 'healer',
  STUNNER: 'stunner',

  IRON_GOLEM: 'iron_golem',
  BOSS_GOLEM: 'boss_golem',

  DRAGON: 'dragon',
  BOSS_DRAGON: 'boss_dragon',

  PHANTOM: 'phantom',
  BOSS_PHANTOM: 'boss_phantom',

  BOSS_DEMON: 'boss_demon',
  BOSS_DEMON_LORD: 'boss_demon_lord',

  BOSS_WARRIOR: 'boss_warrior',
  BOSS_ARCHER: 'boss_archer',
  BOSS_ASSASSIN: 'boss_assassin',
} as const;

export type EnemyType = typeof ENEMY_TYPES[keyof typeof ENEMY_TYPES];

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
  path?: Position[];
  healGlow?: boolean;
  teleportCooldown?: number;
  isInvisible?: boolean;
  slowedUntil?: number;
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
  stunnedUntil?: number;
}

export const DEFENDER_TYPES = {
  WARRIOR: 'warrior',
  ARCHER: 'archer',
  MINER: 'miner',
  STONE: 'stone',
  ICE: 'ice',
  LIGHTNING: 'lightning',
} as const;

export type DefenderType = typeof DEFENDER_TYPES[keyof typeof DEFENDER_TYPES];

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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'duo_leveling', title: 'DUO LEVELING', description: 'Win with exactly 1 Warrior and 1 Archer', icon: '🗡️' },
  { id: 'rich_man', title: 'RICH MAN', description: 'Mine 1000000 gold in a single game', icon: '💰' },
  { id: 'man_of_steel', title: 'MAN OF STEEL', description: 'Win with full health (10 Lives)', icon: '🛡️' },
];

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export interface GameNotification {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

export interface ActiveSkills {
  meteorReadyAt: number;
  blizzardReadyAt: number;
  blizzardActiveUntil: number;
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
  totalMined: number;
  unlockedAchievements: string[];
  lastUnlockedAchievement: Achievement | null;
  floatingTexts: FloatingText[];
  notification: GameNotification | null;
  unlockedDefenders: DefenderType[];
  screenFlash: 'heal' | 'damage' | null;
  lastCheckpoint: number;
  checkpointCoins: number;
  checkpointDefenders: Defender[];
  mapId: string;
  activeSkills: ActiveSkills;
}
