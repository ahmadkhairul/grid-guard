import { useState, useCallback, useEffect } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useAudio } from '@/hooks/useAudio';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';
import { TutorialModal } from './TutorialModal';
import { LoadingScreen } from './LoadingScreen';
import { MobileBottomBar } from './MobileBottomBar';
import { DefenderType } from '@/types/game';
import { MAX_WAVE } from '@/config/gameConfig';
import { Volume2, VolumeX, Pause } from 'lucide-react';

export const Game = () => {
  const { playAttackSound, playBgMusic, stopBgMusic, toggleMute, isMuted } = useAudio();
  
  const {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    selectDefender,
    placeDefender,
    upgradeDefender,
    sellDefender,
    finishLoading,
    attackAnimations,
    isSpeedUp,
    toggleSpeed,
    resumeGame,
  } = useGameLoop(playAttackSound);

  const [showTutorial, setShowTutorial] = useState(false);
  const [draggedDefender, setDraggedDefender] = useState<DefenderType | null>(null);

  // Start/stop background music based on game state
  useEffect(() => {
    if (gameState.isPlaying && !isMuted) {
      playBgMusic();
    } else {
      stopBgMusic();
    }
  }, [gameState.isPlaying, isMuted, playBgMusic, stopBgMusic]);

  const handleDragStart = useCallback((type: DefenderType) => {
    setDraggedDefender(type);
    selectDefender(type);
  }, [selectDefender]);

  const handleDragEnd = useCallback(() => {
    setDraggedDefender(null);
  }, []);

  const handleDrop = useCallback((x: number, y: number, type: DefenderType) => {
    selectDefender(type);
    placeDefender(x, y);
    setDraggedDefender(null);
  }, [selectDefender, placeDefender]);

  if (gameState.isLoading) {
    return <LoadingScreen onComplete={finishLoading} />;
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Section - Game Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Game Container - Centers header + board together */}
          <div className="flex-1 flex flex-col items-center md:justify-center px-3 py-2 md:px-6 md:py-4 min-h-0 pb-20 lg:pb-4">
            {/* Header Container - Same width as game board */}
            <div className="w-full max-w-[min(calc(100vw-1.5rem),calc((100dvh-10rem)*1.25))] lg:max-w-[min(calc(100vw-22rem),calc((100vh-6rem)*1.25))]">
              {/* Title Bar */}
              <div className="flex items-center justify-between mb-1.5 px-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-game text-xs md:text-base text-primary tracking-wider">
                    GRID DEFENDER
                  </h1>
                  <span className="text-[10px] text-muted-foreground">
                    Wave {gameState.wave}/{MAX_WAVE}
                    {gameState.wave === MAX_WAVE && <span className="text-destructive ml-1 font-bold">BOSS</span>}
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-md bg-primary/20 hover:bg-primary/30 transition-colors border border-primary/30"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              </div>
              
              {/* Stats Header - Same width as board */}
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
            </div>
            
            {/* Game Board */}
            <div className="mt-2 w-full max-w-[min(calc(100vw-1.5rem),calc((100dvh-10rem)*1.25))] lg:max-w-[min(calc(100vw-22rem),calc((100vh-6rem)*1.25))]">
              <GameBoard
                defenders={gameState.defenders}
                enemies={gameState.enemies}
                selectedDefender={gameState.selectedDefender}
                onCellClick={placeDefender}
                onDrop={handleDrop}
                attackAnimations={attackAnimations}
                draggedDefender={draggedDefender}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Shop & Defenders (Desktop only) */}
        <aside className="hidden lg:flex w-72 xl:w-80 border-l border-border/50 bg-card/30 p-4 flex-col gap-3">
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
            onSell={sellDefender}
          />
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar
        coins={gameState.coins}
        selectedDefender={gameState.selectedDefender}
        onSelectDefender={selectDefender}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        defenders={gameState.defenders}
        onUpgrade={upgradeDefender}
        onSell={sellDefender}
      />

      {/* Pause Modal */}
      {gameState.isPaused && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4 shadow-lg">
            <Pause className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="font-game text-2xl text-primary mb-4">PAUSED</h2>
            <p className="text-muted-foreground mb-6">Click Resume to continue</p>
            <button
              onClick={resumeGame}
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Resume
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over Overlay */}
      {gameState.lives <= 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4">
            <h2 className="font-game text-2xl text-destructive mb-4">GAME OVER</h2>
            <p className="text-muted-foreground mb-2">You reached</p>
            <p className="font-game text-3xl text-primary mb-6">Wave {gameState.wave}</p>
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
            <h2 className="font-game text-2xl text-primary mb-4">🎉 VICTORY!</h2>
            <p className="text-muted-foreground mb-2">You completed</p>
            <p className="font-game text-3xl text-accent mb-6">All {MAX_WAVE} Waves!</p>
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
  );
};
