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
  createdAt: number;
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
  hidden?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'midas_touch', title: 'MIDAS TOUCH', description: 'Mine 1,000,000 gold before completing Wave 25', icon: '💰' },
  { id: 'grid_guardian', title: 'GUARDIAN OF THE GRID', description: 'Achieve Victory on all 3 maps', icon: '🌍' },
  { id: 'economist', title: 'ECONOMIST', description: 'Have 5,000 unspent gold at the end of a wave', icon: '💎' },
  { id: 'minimalist', title: 'MINIMALIST', description: 'Win Wave 25 with fewer than 10 towers placed', icon: '🏗️' },
  { id: 'elementalist', title: 'ELEMENTALIST', description: 'Build every tower type at least once across all games', icon: '🌈' },
  { id: 'close_call', title: 'CLOSE CALL', description: 'Win a wave with exactly 1 Life remaining', icon: '❤️' },
  { id: 'duo_legends', title: 'DUO OF LEGENDS', description: 'Win Wave 25 with exactly 1 Warrior and 1 Archer (Miners & Special Towers allowed)', icon: '🏹', hidden: true },
  { id: 'untouchable', title: 'UNTOUCHABLE', description: 'Win Wave 25 with 100% Health (10 Lives)', icon: '🛡️', hidden: true },
  { id: 'ironman_run', title: 'IRONMAN RUN', description: 'Win Wave 25 without using continue or loading checkpoint', icon: '🦾', hidden: true },
  { id: 'grid_avenger', title: 'GRID AVENGER', description: 'Survive until Wave 50', icon: '🦸', hidden: true },
  { id: 'boss_slayer', title: 'BOSS SLAYER', description: 'Defeat the Demon Lord (W25) in under 10 seconds', icon: '⚔️', hidden: true },
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
  meteorLevel: number;    // 1-5
  blizzardLevel: number;  // 1-5
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

  // Endless Mode
  isEndless?: boolean;
  mapId: string;
  activeSkills: ActiveSkills;
  hasUsedCheckpoint?: boolean;
}
