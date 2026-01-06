import { useState, useCallback, useEffect } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useAudio } from '@/hooks/useAudio';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from './LoadingScreen';
import { MobileBottomBar } from './MobileBottomBar';
import { NotificationToast } from './NotificationToast'; // New Component
import { DefenderType } from '@/types/game';
import { MAX_WAVE, DEFENDER_CONFIGS, MAX_LEVEL, MAPS } from '@/config/gameConfig';
import { Volume2, VolumeX, Pause, Home, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ActiveSkillsPanel } from './ActiveSkillsPanel';
import { trackEvent } from '@/lib/analytics';
import { saveMapClear } from '@/lib/storage'; // Assuming I add it to imports

export const Game = ({ mapId = 'default' }: { mapId?: string }) => {
  const { playAttackSound, playBgMusic, stopBgMusic, toggleMute, isMuted, playMeteorSound, playBlizzardSound } = useAudio();
  const navigate = useNavigate();

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
    speedMultiplier,
    toggleSpeed,
    resumeGame,
    dismissNotification,
    clearScreenFlash,
    restoreCheckpoint,
    triggerMeteor,
    triggerBlizzard,
    continueEndless,
  } = useGameLoop(mapId, playAttackSound);

  const handleContinueEndless = useCallback(() => {
    continueEndless();
  }, [continueEndless]);

  const [draggedDefender, setDraggedDefender] = useState<DefenderType | null>(null);

  // Mobile Interaction States
  const [interactionMode, setInteractionMode] = useState<'normal' | 'upgrade'>('normal');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const onToggleMode = useCallback(() => {
    setInteractionMode(prev => prev === 'normal' ? 'upgrade' : 'normal');
    setSelectedUnitId(null); // Clear selection on mode switch
  }, []);

  // Animation states for skills
  const [meteorAnimating, setMeteorAnimating] = useState(false);
  const [blizzardAnimating, setBlizzardAnimating] = useState(false);

  const handleMeteor = useCallback(() => {
    triggerMeteor();
    playMeteorSound();
    setMeteorAnimating(true);
    setTimeout(() => setMeteorAnimating(false), 600);
  }, [triggerMeteor, playMeteorSound]);

  const handleBlizzard = useCallback(() => {
    triggerBlizzard();
    playBlizzardSound();
    setBlizzardAnimating(true);
    setTimeout(() => setBlizzardAnimating(false), 1000);
  }, [triggerBlizzard, playBlizzardSound]);

  const handleCellClick = useCallback((x: number, y: number) => {
    // PRIORITY: If buying a unit (selected from shop), allow placement REGARDLESS of mode
    if (gameState.selectedDefender) {
      placeDefender(x, y);
      return;
    }

    const clickedDefender = gameState.defenders.find(d => d.position.x === x && d.position.y === y);

    if (interactionMode === 'upgrade') {
      if (clickedDefender) {
        const config = DEFENDER_CONFIGS[clickedDefender.type];
        const cost = config.upgradeCost * clickedDefender.level;

        if (clickedDefender.level >= MAX_LEVEL) {
          // Maybe show "MAX LEVEL" feedback?
        } else if (gameState.coins >= cost) {
          upgradeDefender(clickedDefender.id);
          // Feedback handled by state update visually (level badge)
        } else {
          // Not enough coins logic (maybe shake effect or sound?)
        }
      }
      // If empty cell, do nothing in upgrade mode
    } else {
      // Normal Mode (Placement or Selection)
      if (clickedDefender) {
        // Select unit to show range
        setSelectedUnitId(clickedDefender.id);
      } else {
        // Empty cell - attempt placement
        placeDefender(x, y);
        setSelectedUnitId(null); // Deselect if clicking empty ground
      }
    }
  }, [interactionMode, gameState.defenders, gameState.coins, upgradeDefender, placeDefender, gameState.selectedDefender]);
  useEffect(() => {
    if (gameState.isPlaying && !isMuted) {
      playBgMusic();
    } else {
      stopBgMusic();
    }
  }, [gameState.isPlaying, isMuted, playBgMusic, stopBgMusic]);

  // Handle Screen Flash
  useEffect(() => {
    if (gameState.screenFlash) {
      const timer = setTimeout(clearScreenFlash, 500); // Clear after 0.5s
      return () => clearTimeout(timer);
    }
  }, [gameState.screenFlash, clearScreenFlash]);

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

  const currentMap = MAPS.find(m => m.id === gameState.mapId) || MAPS[0];


  // ...

  // Track Victory
  useEffect(() => {
    if (gameState.gameWon) {
      trackEvent('game_won', { map: mapId, lives: gameState.lives });
      saveMapClear(mapId);
    }
  }, [gameState.gameWon, gameState.lives, mapId]);

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden relative">
      {/* Screen Flash Overlay */}
      {gameState.screenFlash && (
        <div className={cn(
          "fixed inset-0 pointer-events-none z-[60] transition-opacity duration-500",
          gameState.screenFlash === 'heal' ? 'bg-green-500/20' : 'bg-red-500/20'
        )} />
      )}

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
                  <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={() => navigate('/')}>
                    <Home className="h-4 w-4" />
                  </Button>
                  <h1 className="font-game text-xs md:text-base text-primary tracking-wider">
                    GRID DEFENDER <span className="text-muted-foreground ml-2 text-[10px] hidden sm:inline-block">({currentMap.name})</span>
                  </h1>
                  <span className="text-[10px] text-muted-foreground">
                    Wave {gameState.wave}/{MAX_WAVE}
                    {gameState.wave === MAX_WAVE && <span className="text-destructive ml-1 font-bold">BOSS</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
              </div>

              {/* Stats Header - Same width as board */}
              <GameHeader
                coins={gameState.coins}
                lives={gameState.lives}
                wave={gameState.wave}
                isPlaying={gameState.isPlaying}
                speedMultiplier={speedMultiplier} // Changed from isSpeedUp
                onStart={startGame}
                onPause={pauseGame}
                onToggleSpeed={toggleSpeed}
                interactionMode={interactionMode}
                onToggleMode={onToggleMode}
              />
            </div>

            {/* Game Board */}
            <div className="mt-2 w-full max-w-[min(calc(100vw-1.5rem),calc((100dvh-10rem)*1.25))] lg:max-w-[min(calc(100vw-22rem),calc((100vh-6rem)*1.25))]">
              <GameBoard
                defenders={gameState.defenders}
                enemies={gameState.enemies}
                selectedDefender={gameState.selectedDefender}
                onCellClick={handleCellClick}
                onDrop={handleDrop}
                attackAnimations={attackAnimations}
                draggedDefender={draggedDefender}
                floatingTexts={gameState.floatingTexts || []}
                interactionMode={interactionMode}
                selectedUnitId={selectedUnitId}
                path={currentMap.path}
                meteorAnimating={meteorAnimating}
                blizzardAnimating={blizzardAnimating}
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
            unlockedDefenders={gameState.unlockedDefenders}
          />

          <ActiveSkillsPanel
            coins={gameState.coins}
            meteorReadyAt={gameState.activeSkills.meteorReadyAt}
            blizzardReadyAt={gameState.activeSkills.blizzardReadyAt}
            meteorAnimating={meteorAnimating}
            blizzardAnimating={blizzardAnimating}
            onMeteor={handleMeteor}
            onBlizzard={handleBlizzard}
          />

          <DefendersList
            defenders={gameState.defenders}
            coins={gameState.coins}
            onUpgrade={upgradeDefender}
          />
        </aside>
      </div>

      <MobileBottomBar
        coins={gameState.coins}
        selectedDefender={gameState.selectedDefender}
        onSelectDefender={selectDefender}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        defenders={gameState.defenders}
        onUpgrade={upgradeDefender}
        unlockedDefenders={gameState.unlockedDefenders}
        onMeteor={handleMeteor}
        onBlizzard={handleBlizzard}
        meteorReadyAt={gameState.activeSkills.meteorReadyAt}
        blizzardReadyAt={gameState.activeSkills.blizzardReadyAt}
        meteorAnimating={meteorAnimating}
        blizzardAnimating={blizzardAnimating}
      />

      {
        gameState.isPaused && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4 shadow-lg">
              <Pause className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="font-game text-2xl text-primary mb-4">PAUSED</h2>
              <p className="text-muted-foreground mb-6">Click Resume to continue</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={resumeGame}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Resume
                </button>
                <Button variant="outline" onClick={() => navigate('/')}>Exit to Menu</Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    resetGame();
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart Map
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Game Over Overlay */}
      {
        gameState.lives <= 0 && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md mx-4">
              <h2 className="font-game text-2xl text-destructive mb-4">GAME OVER</h2>
              <p className="text-muted-foreground mb-2">You reached</p>
              <p className="font-game text-3xl text-primary mb-6">Wave {gameState.wave}</p>

              <div className="flex flex-col gap-3">
                {gameState.lastCheckpoint > 0 && (
                  <button
                    onClick={restoreCheckpoint}
                    className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>💾</span>
                    <span>Continue from Wave {gameState.lastCheckpoint}</span>
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Restart from Wave 1
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Victory Overlay */}
      {
        gameState.gameWon && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-xl shadow-2xl border-2 border-primary text-center max-w-sm w-full animate-in zoom-in-50 duration-300">
              <h2 className="text-4xl font-game text-primary mb-2">VICTORY!</h2>
              <p className="text-muted-foreground mb-6">The grid is safe... for now.</p>

              {gameState.unlockedAchievements.length > 0 && (
                <div className="mb-6 bg-secondary/20 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-secondary-foreground mb-2 uppercase tracking-wide">Achievements Unlocked</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {gameState.unlockedAchievements.map(id => {
                      return (
                        <span key={id} className="badge bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-1 rounded text-xs">
                          {id.replace('_', ' ').toUpperCase()}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full">
                <Button size="lg" onClick={handleContinueEndless} className="w-full font-bold text-lg bg-pink-600 hover:bg-pink-700">
                  CONTINUE ENDLESS
                </Button>
                <Button variant="outline" size="lg" onClick={resetGame} className="w-full font-bold text-lg">
                  PLAY AGAIN
                </Button>
              </div>
            </div>
          </div>
        )
      }

      <NotificationToast
        notification={gameState.notification}
        onClose={dismissNotification}
      />
    </div >
  );
};
