import { memo, useState, useEffect, useRef } from 'react';
import { GameCell } from './GameCell';
import { EnemyUnit } from './EnemyUnit';
import { GRID_WIDTH, GRID_HEIGHT, isPathCell } from '@/config/gameConfig';
import { Defender, Enemy, DefenderType, FloatingText, Position } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  defenders: Defender[];
  enemies: Enemy[];
  selectedDefender: DefenderType | null;
  onCellClick: (x: number, y: number) => void;
  onDrop: (x: number, y: number, type: DefenderType) => void;
  attackAnimations: Set<string>;
  draggedDefender: DefenderType | null;
  floatingTexts: FloatingText[];
  interactionMode?: 'normal' | 'upgrade';
  selectedUnitId?: string | null;
  path: Position[];
  meteorAnimating?: boolean;
  blizzardAnimating?: boolean;
  screenFlash?: 'heal' | 'damage' | null;
}

export const GameBoard = memo(({
  defenders,
  enemies,
  selectedDefender,
  onCellClick,
  onDrop,
  attackAnimations,
  draggedDefender,
  floatingTexts,
  interactionMode = 'normal',
  selectedUnitId,
  path,
  meteorAnimating = false,
  blizzardAnimating = false,
  screenFlash = null,
}: GameBoardProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [draggedOverCell, setDraggedOverCell] = useState<{ x: number; y: number } | null>(null);
  const [cellSize, setCellSize] = useState(64); // Default to 64px
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate cell size based on container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCellSize = () => {
      const containerWidth = container.clientWidth;
      const padding = 32; // p-4 = 16px * 2
      const gap = 4; // gap-1 = 4px
      const totalGaps = (GRID_WIDTH - 1) * gap;
      const availableWidth = containerWidth - padding - totalGaps;
      const newCellSize = Math.floor(availableWidth / GRID_WIDTH);
      setCellSize(Math.max(24, Math.min(newCellSize, 80))); // Min 24px, max 80px
    };

    updateCellSize();

    const resizeObserver = new ResizeObserver(updateCellSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const grid = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const defender = defenders.find(d => d.position.x === x && d.position.y === y);
      const isHovered = (hoveredCell?.x === x && hoveredCell?.y === y);
      const isDraggedOver = (draggedOverCell?.x === x && draggedOverCell?.y === y);
      const isActiveData = isHovered || isDraggedOver;

      grid.push(
        <div
          key={`${x}-${y}`}
          onMouseEnter={() => setHoveredCell({ x, y })}
          onMouseLeave={() => setHoveredCell(null)}
          className="relative"
          style={{ zIndex: isActiveData ? 50 : 'auto' }}
        >
          <GameCell
            x={x}
            y={y}
            defender={defender}
            selectedDefender={selectedDefender}
            onCellClick={onCellClick}
            onDrop={onDrop}
            isAttacking={defender ? attackAnimations.has(defender.id) : false}
            draggedDefender={draggedDefender}
            showAoePreview={isActiveData && (!!selectedDefender || !!draggedDefender)}
            onDragEnter={() => setDraggedOverCell({ x, y })}
            onDragLeave={() => setDraggedOverCell(null)}
            cellSize={cellSize}
            defenderIndex={defender ? defenders.findIndex(d => d.id === defender.id) : undefined}
            interactionMode={interactionMode}
            selectedUnitId={selectedUnitId}
            isPath={isPathCell(x, y, path)}
          />
        </div>
      );
    }
  }

  return (
    <div ref={containerRef} className="relative bg-card rounded-xl p-4 shadow-2xl border border-border overflow-hidden">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${cellSize}px)`,
        }}
      >
        {grid}
      </div>

      {/* Goal Zone effect at the end of the path */}
      {path.length > 0 && (
        <div
          className={cn(
            "absolute pointer-events-none z-40 transition-all duration-300 flex items-center justify-center",
            "animate-vortex opacity-60",
            screenFlash === 'damage' && "scale-125 opacity-100"
          )}
          style={{
            left: path[path.length - 1].x * cellSize + 16, // +16 for grid padding
            top: path[path.length - 1].y * cellSize + 16,
            width: cellSize,
            height: cellSize,
          }}
        >
          <div className={cn(
            "w-4/5 h-4/5 rounded-full bg-destructive/30 border-4 border-destructive blur-sm animate-pulse",
            screenFlash === 'damage' && "bg-destructive/60 border-destructive shadow-[0_0_30px_rgba(255,0,0,0.8)]"
          )} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-spin-slow">🌑</div>
          {screenFlash === 'damage' && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-ping-slow">💥</div>
          )}
        </div>
      )}

      {/* Enemies layer - z-50 to stay above grid cells */}
      <div className="absolute inset-4 pointer-events-none z-45">
        {enemies.map(enemy => (
          <EnemyUnit key={enemy.id} enemy={enemy} cellSize={cellSize} />
        ))}

        {/* Floating Text Layer */}
        {floatingTexts.map(ft => (
          <div
            key={ft.id}
            className={`absolute font-game font-bold text-shadow-sm pointer-events-none z-50 transition-opacity duration-100 ${ft.color}`}
            style={{
              left: ft.x * cellSize + cellSize / 2, // Centered on cell? x is grid coord
              top: ft.y * cellSize,
              transform: 'translate(-50%, -50%)',
              opacity: ft.life,
              fontSize: cellSize * 0.4,
            }}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Skill Animation Overlays */}
      {meteorAnimating && (
        <div className="absolute inset-0 pointer-events-none z-50 animate-meteor-glow flex items-center justify-center">
          <div className="text-9xl animate-pulse">☄️</div>
        </div>
      )}
      {blizzardAnimating && (
        <div className="absolute inset-0 pointer-events-none z-50 animate-blizzard-glow flex items-center justify-center">
          <div className="text-9xl animate-pulse">❄️</div>
        </div>
      )}
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
