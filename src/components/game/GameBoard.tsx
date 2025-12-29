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
  isDragging: boolean;
}

export const GameBoard = memo(({ 
  defenders, 
  enemies, 
  selectedDefender, 
  onCellClick,
  onDrop,
  attackAnimations,
  isDragging,
}: GameBoardProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  const grid = [];
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const defender = defenders.find(d => d.position.x === x && d.position.y === y);
      const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
      
      grid.push(
        <div
          key={`${x}-${y}`}
          onMouseEnter={() => setHoveredCell({ x, y })}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <GameCell
            x={x}
            y={y}
            defender={defender}
            selectedDefender={selectedDefender}
            onCellClick={onCellClick}
            onDrop={onDrop}
            isAttacking={defender ? attackAnimations.has(defender.id) : false}
            isDragging={isDragging}
            showAoePreview={isHovered && (!!selectedDefender || isDragging)}
          />
        </div>
      );
    }
  }

  return (
    <div className="relative bg-card rounded-xl p-4 shadow-2xl border border-border overflow-visible">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 64px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 64px)`,
        }}
      >
        {grid}
      </div>
      
      {/* Enemies layer */}
      <div className="absolute inset-4 pointer-events-none">
        {enemies.map(enemy => (
          <EnemyUnit key={enemy.id} enemy={enemy} />
        ))}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
