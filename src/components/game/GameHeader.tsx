import { memo } from 'react';
import { Coins, Heart, Waves, Play, Pause, RotateCcw, HelpCircle, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  coins: number;
  lives: number;
  wave: number;
  isPlaying: boolean;
  isSpeedUp: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenTutorial: () => void;
  onToggleSpeed: () => void;
}

export const GameHeader = memo(({ 
  coins, 
  lives, 
  wave, 
  isPlaying,
  isSpeedUp,
  onStart, 
  onPause, 
  onReset,
  onOpenTutorial,
  onToggleSpeed,
}: GameHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-card/80 rounded-lg p-3 border border-border/50">
      {/* Stats Row */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Coins */}
        <div className="flex items-center gap-1.5">
          <div className="coin-display w-6 h-6 rounded-full flex items-center justify-center">
            <Coins className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
          <span className="font-game text-sm text-accent">{coins}</span>
        </div>
        
        {/* Lives */}
        <div className="flex items-center gap-1.5">
          <Heart className="w-5 h-5 text-destructive fill-destructive" />
          <span className="font-game text-sm text-destructive">{lives}</span>
        </div>
        
        {/* Wave */}
        <div className="flex items-center gap-1.5">
          <Waves className="w-5 h-5 text-primary" />
          <span className="font-game text-xs text-primary">Wave {wave}</span>
        </div>
      </div>
      
      {/* Controls Row */}
      <div className="flex items-center gap-1.5">
        {isPlaying ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="h-8 px-3 border-primary/50 text-primary hover:bg-primary/20"
          >
            <Pause className="w-4 h-4 mr-1" />
            Pause
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onStart}
            className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSpeed}
          className={`h-8 w-8 ${isSpeedUp ? "border-accent bg-accent/20 text-accent hover:bg-accent/30" : "border-muted-foreground/50 text-muted-foreground hover:bg-muted"}`}
          title={isSpeedUp ? "Normal Speed" : "Fast Forward (2x)"}
        >
          <FastForward className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenTutorial}
          className="h-8 w-8 border-muted-foreground/50 text-muted-foreground hover:bg-muted"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-8 w-8 border-muted-foreground/50 text-muted-foreground hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';