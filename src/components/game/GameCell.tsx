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
  draggedDefender: DefenderType | null;
  showAoePreview: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

export const GameCell = memo(({ 
  x, 
  y, 
  defender, 
  selectedDefender, 
  onCellClick,
  onDrop,
  isAttacking,
  draggedDefender,
  showAoePreview,
  onDragEnter,
  onDragLeave,
}: GameCellProps) => {
  const isPath = isPathCell(x, y);
  const canPlace = (selectedDefender || draggedDefender) && !isPath && !defender;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!canPlace) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragEnter();
  };

  const handleDragLeave = () => {
    onDragLeave();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragLeave();
    const type = e.dataTransfer.getData('defenderType') as DefenderType;
    if (type && canPlace) {
      onDrop(x, y, type);
    }
  };

  const getAoeRange = () => {
    if (!showAoePreview) return 0;
    const defenderType = draggedDefender || selectedDefender;
    if (!defenderType) return 0;
    return DEFENDER_CONFIGS[defenderType].range;
  };

  const aoeRange = getAoeRange();
  const aoeSize = aoeRange * CELL_SIZE * 2;

  return (
    <div
      className={cn(
        'game-cell w-16 h-16 relative',
        isPath && 'game-cell-path',
        canPlace && 'game-cell-placeable',
        showAoePreview && 'game-cell-dragover',
      )}
      onClick={() => canPlace && onCellClick(x, y)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {(showAoePreview) && canPlace && (selectedDefender || draggedDefender) && aoeRange > 0 && (
        <div 
          className="absolute pointer-events-none z-10 rounded-sm border-2 border-primary/60 bg-primary/10 animate-pulse"
          style={{
            width: aoeSize,
            height: aoeSize,
            left: `calc(50% - ${aoeSize / 2}px)`,
            top: `calc(50% - ${aoeSize / 2}px)`,
          }}
        />
      )}

      {/* Ghost Defender Preview */}
      {(showAoePreview) && canPlace && (selectedDefender || draggedDefender) && (
        <div className="absolute inset-0 flex items-center justify-center opacity-50 text-2xl z-20 pointer-events-none">
          {DEFENDER_CONFIGS[draggedDefender || selectedDefender!].emoji}
        </div>
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
