import { useGameLoop } from '@/hooks/useGameLoop';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';

export const Game = () => {
  const {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    selectDefender,
    placeDefender,
    upgradeDefender,
    attackAnimations,
  } = useGameLoop();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="font-game text-2xl md:text-3xl text-center mb-6 text-primary">
          GRID DEFENDER
        </h1>
        
        {/* Header Stats */}
        <GameHeader
          coins={gameState.coins}
          lives={gameState.lives}
          wave={gameState.wave}
          isPlaying={gameState.isPlaying}
          onStart={startGame}
          onPause={pauseGame}
          onReset={resetGame}
        />
        
        {/* Game Area */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Game Board */}
          <div className="flex-1 flex justify-center overflow-x-auto">
            <GameBoard
              defenders={gameState.defenders}
              enemies={gameState.enemies}
              selectedDefender={gameState.selectedDefender}
              onCellClick={placeDefender}
              attackAnimations={attackAnimations}
            />
          </div>
          
          {/* Side Panel */}
          <div className="lg:w-64 space-y-4">
            <ShopPanel
              coins={gameState.coins}
              selectedDefender={gameState.selectedDefender}
              onSelectDefender={selectDefender}
            />
            <DefendersList
              defenders={gameState.defenders}
              coins={gameState.coins}
              onUpgrade={upgradeDefender}
            />
          </div>
        </div>
        
        {/* Game Over Overlay */}
        {gameState.lives <= 0 && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4">
              <h2 className="font-game text-3xl text-destructive mb-4">GAME OVER</h2>
              <p className="text-muted-foreground mb-2">You reached</p>
              <p className="font-game text-4xl text-primary mb-6">Wave {gameState.wave}</p>
              <button
                onClick={resetGame}
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
