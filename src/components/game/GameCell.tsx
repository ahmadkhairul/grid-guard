import { memo, DragEvent } from 'react';
import { DEFENDER_CONFIGS } from '@/config/gameConfig';
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
  interactionMode: 'normal' | 'upgrade';
  selectedUnitId: string | null;
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
  interactionMode,
  selectedUnitId,
  isPath,
}: GameCellProps & { isPath: boolean }) => {
  const canPlace = (selectedDefender || draggedDefender) && !isPath && !defender;
  // Allow click if we can place OR if there is a defender (to upgrade/select)
  const isInteractive = canPlace || !!defender;

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
      onClick={() => isInteractive && onCellClick(x, y)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {(showAoePreview) && canPlace && (selectedDefender || draggedDefender) && aoeRange > 0 && (
        <div
          className="absolute pointer-events-none z-10 rounded-full border-2 border-primary/60 bg-primary/10 animate-pulse"
          style={{
            width: aoeSize,
            height: aoeSize,
            left: `calc(50% - ${aoeSize / 2}px)`,
            top: `calc(50% - ${aoeSize / 2}px)`,
          }}
        />
      )}

      {/* Selected Unit Range Display */}
      {defender && selectedUnitId === defender.id && (
        <div
          className="absolute pointer-events-none z-10 rounded-full border-2 border-accent/60 bg-accent/10"
          style={{
            width: defender.range * cellSize * 2,
            height: defender.range * cellSize * 2,
            left: `calc(50% - ${(defender.range * cellSize * 2) / 2}px)`,
            top: `calc(50% - ${(defender.range * cellSize * 2) / 2}px)`,
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
            'defender-unit text-2xl relative',
            isAttacking && 'animate-defender-attack',
            defender.stunnedUntil && 'opacity-70 grayscale'
          )}
          style={{ width: cellSize * 0.75, height: cellSize * 0.75 }}
        >
          {DEFENDER_CONFIGS[defender.type].emoji}

          {defender.stunnedUntil && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce z-20">
              <span className="text-xl drop-shadow-md">⚡</span>
            </div>
          )}

          {defender.level > 1 && (
            <span className="opacity-75 absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold z-10">
              {defender.level}
            </span>
          )}
          {interactionMode === 'normal' && defenderIndex !== undefined && (
            <span className="absolute h-4 flex items-center m-0 -bottom-1 -left-1 bg-primary text-primary-foreground text-[9px] rounded-md px-1 font-bold z-10 border border-background">
              #{defenderIndex + 1}
            </span>
          )}

          {/* Upgrade Cost Badge */}
          {interactionMode === 'upgrade' && (
            <div className="absolute h-4 flex bg-amber-500 items-center m-0 -bottom-1 -left-1 text-primary-foreground text-[9px] rounded-md px-1 font-bold z-10 border border-background">
              ${DEFENDER_CONFIGS[defender.type].upgradeCost * defender.level}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

GameCell.displayName = 'GameCell';
