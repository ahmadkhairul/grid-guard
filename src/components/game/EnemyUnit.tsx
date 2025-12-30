import { memo } from 'react';
import { Enemy } from '@/types/game';
import { CELL_SIZE, DEFENDER_CONFIGS, ENEMY_CONFIGS } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface EnemyUnitProps {
  enemy: Enemy;
}

export const EnemyUnit = memo(({ enemy }: EnemyUnitProps) => {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.type === 'boss';
  const isHit = enemy.isHit;
  const config = ENEMY_CONFIGS[enemy.type];
  
  const getImmunityEmoji = () => {
    if (!enemy.immuneTo) return null;
    return DEFENDER_CONFIGS[enemy.immuneTo].emoji;
  };

  const getTypeLabel = () => {
    switch (enemy.type) {
      case 'fast': return 'FAST';
      case 'tank': return 'TANK';
      case 'flying': return 'FLY';
      default: return null;
    }
  };

  const typeLabel = getTypeLabel();
  const size = isBoss ? 14 : enemy.type === 'tank' ? 12 : 10;
  
  const GAP_SIZE = 4; // gap-1 is 4px
  
  return (
    <div
      className={cn(
        "enemy-unit animate-spawn",
        isBoss ? "w-14 h-14 text-2xl" : enemy.type === 'tank' ? "w-12 h-12 text-xl" : "w-10 h-10 text-lg",
        isHit && "animate-hit",
        enemy.isFlying && "animate-float"
      )}
      style={{
        left: enemy.position.x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2 - (size * 2),
        top: enemy.position.y * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2 - (size * 2),
        transition: 'left 0.05s linear, top 0.05s linear',
      }}
    >
      <span className="z-10">{config.emoji}</span>
      
      {isHit && (
        <div className="absolute -right-1 -top-1 w-5 h-5 flex items-center justify-center text-sm animate-bounce">
          💥
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
            isBoss 
              ? 'bg-gradient-to-r from-destructive via-accent to-primary'
              : enemy.type === 'tank'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                : enemy.type === 'fast'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  : enemy.type === 'flying'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                    : hpPercentage > 50 ? 'bg-success' : hpPercentage > 25 ? 'bg-accent' : 'bg-destructive'
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
      {typeLabel && (
        <span className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-game uppercase tracking-wider",
          enemy.type === 'fast' && "text-yellow-500",
          enemy.type === 'tank' && "text-blue-500",
          enemy.type === 'flying' && "text-purple-500"
        )}>
          {typeLabel}
        </span>
      )}
      
      {/* Boss Label */}
      {isBoss && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-game text-destructive uppercase tracking-wider">
          BOSS
        </span>
      )}
    </div>
  );
});

EnemyUnit.displayName = 'EnemyUnit';
