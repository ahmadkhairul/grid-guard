import { memo } from 'react';
import { isPathCell } from '@/config/gameConfig';
import { Defender, DefenderType } from '@/types/game';
import { DEFENDER_CONFIGS } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface GameCellProps {
  x: number;
  y: number;
  defender: Defender | undefined;
  selectedDefender: DefenderType | null;
  onCellClick: (x: number, y: number) => void;
  isAttacking: boolean;
}

export const GameCell = memo(({ 
  x, 
  y, 
  defender, 
  selectedDefender, 
  onCellClick,
  isAttacking 
}: GameCellProps) => {
  const isPath = isPathCell(x, y);
  const canPlace = selectedDefender && !isPath && !defender;

  return (
    <div
      className={cn(
        'game-cell w-16 h-16',
        isPath && 'game-cell-path',
        canPlace && 'game-cell-placeable',
      )}
      onClick={() => canPlace && onCellClick(x, y)}
    >
      {defender && (
        <div 
          className={cn(
            'defender-unit w-12 h-12 text-2xl',
            isAttacking && 'animate-attack'
          )}
        >
          {DEFENDER_CONFIGS[defender.type].emoji}
          {defender.level > 1 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {defender.level}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

GameCell.displayName = 'GameCell';
