import { memo } from 'react';
import { GameCell } from './GameCell';
import { EnemyUnit } from './EnemyUnit';
import { GRID_WIDTH, GRID_HEIGHT } from '@/config/gameConfig';
import { Defender, Enemy, DefenderType } from '@/types/game';

interface GameBoardProps {
  defenders: Defender[];
  enemies: Enemy[];
  selectedDefender: DefenderType | null;
  onCellClick: (x: number, y: number) => void;
  attackAnimations: Set<string>;
}

export const GameBoard = memo(({ 
  defenders, 
  enemies, 
  selectedDefender, 
  onCellClick,
  attackAnimations 
}: GameBoardProps) => {
  const grid = [];
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const defender = defenders.find(d => d.position.x === x && d.position.y === y);
      grid.push(
        <GameCell
          key={`${x}-${y}`}
          x={x}
          y={y}
          defender={defender}
          selectedDefender={selectedDefender}
          onCellClick={onCellClick}
          isAttacking={defender ? attackAnimations.has(defender.id) : false}
        />
      );
    }
  }

  return (
    <div className="relative bg-card rounded-xl p-4 shadow-2xl border border-border">
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
