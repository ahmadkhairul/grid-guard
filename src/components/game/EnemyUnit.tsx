import { memo } from 'react';
import { Enemy } from '@/types/game';
import { CELL_SIZE } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface EnemyUnitProps {
  enemy: Enemy;
}

export const EnemyUnit = memo(({ enemy }: EnemyUnitProps) => {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;
  
  return (
    <div
      className="enemy-unit w-10 h-10 text-lg animate-spawn"
      style={{
        left: enemy.position.x * CELL_SIZE + CELL_SIZE / 2 - 20,
        top: enemy.position.y * CELL_SIZE + CELL_SIZE / 2 - 20,
        transition: 'left 0.05s linear, top 0.05s linear',
      }}
    >
      <span className="z-10">👾</span>
      
      {/* HP Bar */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full transition-all duration-150',
            hpPercentage > 50 ? 'bg-success' : hpPercentage > 25 ? 'bg-accent' : 'bg-destructive'
          )}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
      
      {/* HP Number */}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground font-game">
        {Math.ceil(enemy.hp)}
      </span>
    </div>
  );
});

EnemyUnit.displayName = 'EnemyUnit';
