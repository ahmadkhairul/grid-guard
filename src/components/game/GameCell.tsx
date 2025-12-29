import { memo, DragEvent, useState } from 'react';
import { isPathCell, DEFENDER_CONFIGS, CELL_SIZE } from '@/config/gameConfig';
import { Defender, DefenderType } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCellProps {
  x: number;
  y: number;
  defender: Defender | undefined;
  selectedDefender: DefenderType | null;
  onCellClick: (x: number, y: number) => void;
  onDrop: (x: number, y: number, type: DefenderType) => void;
  isAttacking: boolean;
  isDragging: boolean;
  showAoePreview: boolean;
}

export const GameCell = memo(({ 
  x, 
  y, 
  defender, 
  selectedDefender, 
  onCellClick,
  onDrop,
  isAttacking,
  isDragging,
  showAoePreview,
}: GameCellProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const isPath = isPathCell(x, y);
  const canPlace = (selectedDefender || isDragging) && !isPath && !defender;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!canPlace) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData('defenderType') as DefenderType;
    if (type && canPlace) {
      onDrop(x, y, type);
    }
  };

  // Get AOE range for preview
  const getAoeRange = () => {
    if (!showAoePreview || !selectedDefender) return 0;
    return DEFENDER_CONFIGS[selectedDefender].range;
  };

  const aoeRange = getAoeRange();
  const aoeSize = aoeRange * CELL_SIZE * 2;

  return (
    <div
      className={cn(
        'game-cell w-16 h-16 relative',
        isPath && 'game-cell-path',
        canPlace && 'game-cell-placeable',
        isDragOver && 'game-cell-dragover',
      )}
      onClick={() => canPlace && onCellClick(x, y)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* AOE Preview Circle */}
      {showAoePreview && canPlace && aoeRange > 0 && (
        <div 
          className="absolute pointer-events-none z-20 rounded-full border-2 border-primary/60 bg-primary/10 animate-pulse"
          style={{
            width: aoeSize,
            height: aoeSize,
            left: `calc(50% - ${aoeSize / 2}px)`,
            top: `calc(50% - ${aoeSize / 2}px)`,
          }}
        />
      )}

      {defender && (
        <div 
          className={cn(
            'defender-unit w-12 h-12 text-2xl',
            isAttacking && 'animate-defender-attack'
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
