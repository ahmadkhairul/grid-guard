import { useState, useCallback, useEffect } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useAudio } from '@/hooks/useAudio';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';
import { TutorialModal } from './TutorialModal';
import { LoadingScreen } from './LoadingScreen';
import { DefenderType } from '@/types/game';
import { MAX_WAVE } from '@/config/gameConfig';
import { Volume2, VolumeX, Pause } from 'lucide-react';

export const Game = () => {
  const { playAttackSound, playBgMusic, stopBgMusic, toggleMute, isMuted, musicPlaying } = useAudio();
  
  const {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    selectDefender,
    placeDefender,
    upgradeDefender,
    finishLoading,
    attackAnimations,
    isSpeedUp,
    toggleSpeed,
  } = useGameLoop(playAttackSound);

  const [showTutorial, setShowTutorial] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Start/stop background music based on game state
  useEffect(() => {
    if (gameState.isPlaying && !isMuted) {
      playBgMusic();
    } else {
      stopBgMusic();
    }
  }, [gameState.isPlaying, isMuted, playBgMusic, stopBgMusic]);

  const handleDragStart = useCallback((type: DefenderType) => {
    setIsDragging(true);
    selectDefender(type);
  }, [selectDefender]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((x: number, y: number, type: DefenderType) => {
    selectDefender(type);
    placeDefender(x, y);
    setIsDragging(false);
  }, [selectDefender, placeDefender]);

  if (gameState.isLoading) {
    return <LoadingScreen onComplete={finishLoading} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title with mute button */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="font-game text-2xl md:text-3xl text-center text-primary">
            GRID DEFENDER
          </h1>
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
        
        {/* Wave indicator */}
        <p className="text-center text-sm text-muted-foreground mb-2">
          Wave {gameState.wave} / {MAX_WAVE}
          {gameState.wave === MAX_WAVE && <span className="text-destructive ml-2 font-bold">⚠️ BOSS WAVE</span>}
        </p>
        
        {/* Header Stats */}
        <GameHeader
          coins={gameState.coins}
          lives={gameState.lives}
          wave={gameState.wave}
          isPlaying={gameState.isPlaying}
          isSpeedUp={isSpeedUp}
          onStart={startGame}
          onPause={pauseGame}
          onReset={resetGame}
          onOpenTutorial={() => setShowTutorial(true)}
          onToggleSpeed={toggleSpeed}
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
              onDrop={handleDrop}
              attackAnimations={attackAnimations}
              isDragging={isDragging}
            />
          </div>
          
          {/* Side Panel */}
          <div className="lg:w-64 space-y-4">
            <ShopPanel
              coins={gameState.coins}
              selectedDefender={gameState.selectedDefender}
              onSelectDefender={selectDefender}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              defenders={gameState.defenders}
            />
            <DefendersList
              defenders={gameState.defenders}
              coins={gameState.coins}
              onUpgrade={upgradeDefender}
            />
          </div>
        </div>

        {/* Pause Modal */}
        {!gameState.isPlaying && !gameState.isLoading && gameState.lives > 0 && !gameState.gameWon && gameState.defenders.length > 0 && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4 shadow-lg">
              <Pause className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="font-game text-2xl text-foreground mb-2">GAME PAUSED</h2>
              <p className="text-muted-foreground">Click Start to continue playing</p>
            </div>
          </div>
        )}
        
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

        {/* Victory Overlay */}
        {gameState.gameWon && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-primary rounded-2xl p-8 text-center max-w-md mx-4 shadow-[0_0_50px_hsl(var(--primary)/0.5)]">
              <h2 className="font-game text-3xl text-primary mb-4">🎉 VICTORY! 🎉</h2>
              <p className="text-muted-foreground mb-2">You defeated the boss and completed</p>
              <p className="font-game text-4xl text-accent mb-6">All {MAX_WAVE} Waves!</p>
              <button
                onClick={resetGame}
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Tutorial Modal */}
        <TutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
      </div>
    </div>
  );
};
