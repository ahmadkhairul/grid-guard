import { memo, DragEvent } from 'react';
import { DEFENDER_CONFIGS, MAX_LEVEL } from '@/config/gameConfig';
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
  const isOverheated = defender?.overheatedUntil && Date.now() < defender.overheatedUntil;

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
            defender.stunnedUntil && 'opacity-70 grayscale',
            isOverheated && "shadow-[0_0_12px_rgba(220,38,38,0.6)]",
            // Visual Progression Effects
            defender.level >= 5 && "shadow-[0_0_10px_rgba(var(--primary),0.3)]",
            defender.level >= 10 && "shadow-[0_0_15px_rgba(var(--primary),0.5)] border-2 border-primary/50",
            defender.level >= 15 && "after:content-[''] after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-primary/20",
            defender.level >= 20 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background"
          )}
          style={{ width: cellSize * 0.75, height: cellSize * 0.75 }}
        >
          {DEFENDER_CONFIGS[defender.type].emoji}

          {/* Level 20 Crown Effect */}
          {defender.level >= 20 && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] animate-bounce z-20">
              👑
            </div>
          )}

          {defender.stunnedUntil && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce z-20">
              <span className="text-xl drop-shadow-md">⚡</span>
            </div>
          )}

          {isOverheated && (
            <div className="absolute -top-3 -right-2 z-20 animate-pulse">
              <span className="text-xl filter drop-shadow-md grayscale hue-rotate-15 saturate-200">🔻</span>
              {/* Down Arrow for debuff? Or Fire? User wanted 'burning'. */}
              {/* Let's use a small fire overlay but distinct from enemy burn. */}
            </div>
          )}

          {defender.level > 1 && (
            <span className={cn(
              "opacity-75 absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold z-10",
              defender.level >= 10 && "bg-primary text-primary-foreground",
              defender.level >= 20 && "bg-yellow-500 text-yellow-950"
            )}>
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
            <div className={cn(
              "absolute h-4 flex bg-amber-500 items-center m-0 -bottom-1 -left-1 text-primary-foreground text-[9px] rounded-md px-1 font-bold z-10 border border-background",
              defender.level >= MAX_LEVEL && "bg-slate-500"
            )}>
              {defender.level >= MAX_LEVEL ? 'MAX' : `$${DEFENDER_CONFIGS[defender.type].upgradeCost * defender.level}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

GameCell.displayName = 'GameCell';
