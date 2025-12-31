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
  cellSize: number;
  defenderIndex?: number;
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
  cellSize,
  defenderIndex,
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
  const aoeSize = aoeRange * cellSize * 2;

  return (
    <div
      className={cn(
        'game-cell relative',
        isPath && 'game-cell-path',
        canPlace && 'game-cell-placeable',
        showAoePreview && 'game-cell-dragover',
      )}
      style={{ width: cellSize, height: cellSize }}
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
            'defender-unit text-2xl',
            isAttacking && 'animate-defender-attack'
          )}
          style={{ width: cellSize * 0.75, height: cellSize * 0.75 }}
        >
          {DEFENDER_CONFIGS[defender.type].emoji}
          {defender.level > 1 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold z-10">
              {defender.level}
            </span>
          )}
          {defenderIndex !== undefined && (
             <span className="absolute h-4 flex items-center m-0 -bottom-1 -left-1 bg-primary text-primary-foreground text-[9px] rounded-md px-1 font-bold z-10 border border-background">
               #{defenderIndex + 1}
             </span>
          )}
        </div>
      )}
    </div>
  );
});

GameCell.displayName = 'GameCell';
