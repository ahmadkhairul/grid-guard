import { memo } from 'react';
import { Enemy } from '@/types/game';
import { CELL_SIZE, DEFENDER_CONFIGS } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface EnemyUnitProps {
  enemy: Enemy;
}

export const EnemyUnit = memo(({ enemy }: EnemyUnitProps) => {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.type === 'boss';
  const isHit = enemy.isHit;
  
  // Get immunity indicator
  const getImmunityEmoji = () => {
    if (!enemy.immuneTo) return null;
    return DEFENDER_CONFIGS[enemy.immuneTo].emoji;
  };
  
  return (
    <div
      className={cn(
        "enemy-unit animate-spawn",
        isBoss ? "w-14 h-14 text-2xl" : "w-10 h-10 text-lg",
        isHit && "animate-hit"
      )}
      style={{
        left: enemy.position.x * CELL_SIZE + CELL_SIZE / 2 - (isBoss ? 28 : 20),
        top: enemy.position.y * CELL_SIZE + CELL_SIZE / 2 - (isBoss ? 28 : 20),
        transition: 'left 0.05s linear, top 0.05s linear',
      }}
    >
      <span className="z-10">{isBoss ? '👹' : '👾'}</span>
      
      {/* Hit Indicator */}
      {isHit && (
        <div className="absolute -right-1 -top-1 w-5 h-5 flex items-center justify-center text-sm animate-bounce">
          💥
        </div>
      )}
      
      {/* Boss Immunity Indicator */}
      {isBoss && enemy.immuneTo && (
        <div className="absolute -right-2 -top-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-xs animate-pulse border-2 border-background">
          <span className="opacity-50">{getImmunityEmoji()}</span>
          <span className="absolute text-[8px] font-bold">🚫</span>
        </div>
      )}
      
      {/* HP Bar */}
      <div className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 h-2 bg-muted rounded-full overflow-hidden",
        isBoss ? "w-14" : "w-10"
      )}>
        <div 
          className={cn(
            'h-full transition-all duration-150',
            isBoss 
              ? 'bg-gradient-to-r from-destructive via-accent to-primary'
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
