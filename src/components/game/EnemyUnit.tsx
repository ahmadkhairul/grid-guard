import { memo } from 'react';
import { Enemy } from '@/types/game';
import { DEFENDER_CONFIGS, ENEMY_CONFIGS } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface EnemyUnitProps {
  enemy: Enemy;
  cellSize: number;
}

export const EnemyUnit = memo(({ enemy, cellSize }: EnemyUnitProps) => {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.type.startsWith('boss');
  const isHit = enemy.isHit;
  const config = ENEMY_CONFIGS[enemy.type];

  const getImmunityEmoji = () => {
    if (!enemy.immuneTo) return null;
    return DEFENDER_CONFIGS[enemy.immuneTo].emoji;
  };

  const unitSize = isBoss ? cellSize * 0.9 : enemy.type === 'tank' ? cellSize * 0.8 : cellSize * 0.65;
  const GAP_SIZE = 4;

  return (
    <div
      className={cn(
        "enemy-unit animate-spawn",
        isBoss ? "text-2xl" : enemy.type === 'tank' ? "text-xl" : "text-lg",
        isHit && "animate-hit",
        enemy.isFlying && "animate-float",
        enemy.healGlow && "animate-pulse"
      )}
      style={{
        width: unitSize,
        height: unitSize,
        left: enemy.position.x * (cellSize + GAP_SIZE) + cellSize / 2 - (unitSize / 2),
        top: enemy.position.y * (cellSize + GAP_SIZE) + cellSize / 2 - (unitSize / 2),
        transition: 'left 0.05s linear, top 0.05s linear',
        filter: enemy.healGlow
          ? 'drop-shadow(0 0 12px rgb(34 197 94))'
          : (enemy.burningUntil && Date.now() < enemy.burningUntil)
            ? 'drop-shadow(0 0 8px rgb(249 115 22)) sepia(0.5) hue-rotate(-30deg)'
            : (enemy.slowedUntil && Date.now() < enemy.slowedUntil)
              ? 'drop-shadow(0 0 8px rgb(34 211 238))'
              : undefined,
      }}
    >
      <span className="z-10">{config.emoji}</span>

      {isHit && (
        <div className="absolute -right-1 -top-1 w-5 h-5 flex items-center justify-center text-sm animate-bounce">
          💥
        </div>
      )}

      {enemy.burningUntil && Date.now() < enemy.burningUntil && (
        <div className="absolute -left-1 -bottom-1 w-4 h-4 flex items-center justify-center text-xs animate-pulse text-orange-600 font-bold z-20">
          🔥
        </div>
      )}

      {enemy.slowedUntil && Date.now() < enemy.slowedUntil && (
        <div className="absolute -left-1 -top-1 w-5 h-5 flex items-center justify-center text-sm animate-pulse">
          ❄️
        </div>
      )}

      {isBoss && enemy.immuneTo && (
        <div className="absolute -right-2 -top-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-xs animate-pulse border-2 border-background">
          <span className="opacity-50">{getImmunityEmoji()}</span>
          <span className="absolute text-[8px] font-bold">🚫</span>
        </div>
      )}

      {/* HP Bar */}
      <div className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 h-2 bg-muted rounded-full overflow-hidden",
        isBoss ? "w-14" : enemy.type === 'tank' ? "w-12" : "w-10"
      )}>
        <div
          className={cn(
            'h-full transition-all duration-150',
            config.color || (hpPercentage > 50 ? 'bg-success' : hpPercentage > 25 ? 'bg-accent' : 'bg-destructive')
          )}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>

      {/* HP Number */}
      <span className={cn(
        "absolute -bottom-4 left-1/2 -translate-x-1/2 font-bold text-foreground font-game",
        isBoss ? "text-sm" : "text-xs"
      )}>
        {Math.ceil(enemy.hp)}
      </span>

      {/* Type Label */}
      {config.label && (
        <span className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-game uppercase tracking-wider whitespace-nowrap",
          config.labelColor || "text-muted-foreground",
          isBoss && "text-[10px] text-destructive font-bold"
        )}>
          {config.label}
        </span>
      )}
    </div>
  );
});

EnemyUnit.displayName = 'EnemyUnit';
