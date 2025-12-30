import { memo, useState } from 'react';
import { GameCell } from './GameCell';
import { EnemyUnit } from './EnemyUnit';
import { GRID_WIDTH, GRID_HEIGHT } from '@/config/gameConfig';
import { Defender, Enemy, DefenderType } from '@/types/game';

interface GameBoardProps {
  defenders: Defender[];
  enemies: Enemy[];
  selectedDefender: DefenderType | null;
  onCellClick: (x: number, y: number) => void;
  onDrop: (x: number, y: number, type: DefenderType) => void;
  attackAnimations: Set<string>;
  draggedDefender: DefenderType | null;
}

export const GameBoard = memo(({ 
  defenders, 
  enemies, 
  selectedDefender, 
  onCellClick,
  onDrop,
  attackAnimations,
  draggedDefender,
}: GameBoardProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [draggedOverCell, setDraggedOverCell] = useState<{ x: number; y: number } | null>(null);
  
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
          />
        </div>
      );
    }
  }

  return (
    <div className="relative bg-card rounded-xl p-4 shadow-2xl border border-border overflow-hidden">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 64px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 64px)`,
        }}
      >
        {grid}
      </div>
      
      {/* Enemies layer - z-50 to stay above grid cells */}
      <div className="absolute inset-4 pointer-events-none z-45">
        {enemies.map(enemy => (
          <EnemyUnit key={enemy.id} enemy={enemy} />
        ))}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
