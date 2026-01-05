import { memo } from 'react';
import { Coins, Heart, Waves, Play, Pause, RotateCcw, ArrowUpCircle, ScanEye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  coins: number;
  lives: number;
  wave: number;
  isPlaying: boolean;
  speedMultiplier: number;
  onStart: () => void;
  onPause: () => void;
  onToggleSpeed: () => void;
  interactionMode?: 'normal' | 'upgrade';
  onToggleMode?: () => void;
}

export const GameHeader = memo(({
  coins,
  lives,
  wave,
  isPlaying,
  speedMultiplier,
  onStart,
  onPause,
  onToggleSpeed,
  interactionMode = 'normal',
  onToggleMode,
}: GameHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-card/80 rounded-xl p-2 border border-border/50 shadow-sm backdrop-blur-sm">
      {/* Stats Group - Unified container for visual consistency */}
      <div className="flex items-center gap-1 bg-background/50 rounded-lg p-1 border border-border/30">
        <div className="h-10 px-3 flex items-center gap-2 bg-secondary/10 rounded-md border border-secondary/10">
          <div className="coin-display w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            <Coins className="w-3 h-3 text-accent-foreground" />
          </div>
          <span className="font-game text-sm text-accent tracking-wide">{coins}</span>
        </div>

        <div className="h-10 w-px bg-border/50 mx-0.5" />

        <div className="h-10 px-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-destructive fill-destructive/20" />
          <span className="font-game text-sm text-destructive tracking-wide">{lives}</span>
        </div>

        <div className="h-10 w-px bg-border/50 mx-0.5" />

        <div className="h-10 px-3 flex items-center gap-2">
          <Waves className="w-4 h-4 text-primary" />
          <span className="font-game text-xs text-primary tracking-wide">WAVE {wave}</span>
        </div>
      </div>

      {/* Controls Group */}
      <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
        {onToggleMode && (
          <Button
            variant={interactionMode === 'upgrade' ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleMode}
            className={`h-10 px-4 gap-2 border-2 transition-all duration-200 ${interactionMode === 'upgrade'
              ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'border-muted-foreground/30 hover:border-primary/50 text-muted-foreground hover:text-primary'
              }`}
          >
            {interactionMode === 'upgrade' ? (
              <>
                <ArrowUpCircle className="w-4 h-4 animate-pulse" />
                <span className="font-bold">UPGRADE</span>
              </>
            ) : (
              <>
                <ScanEye className="w-4 h-4" />
                <span className="font-medium">VIEW</span>
              </>
            )}
          </Button>
        )}

        <div className="h-8 w-px bg-border/50 mx-1 hidden md:block" />

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSpeed}
          className={`h-10 px-3 min-w-[3rem] border-2 transition-all duration-200 ${speedMultiplier > 1
            ? "border-accent bg-accent/10 text-accent hover:bg-accent/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
            : "border-border hover:border-primary/50 hover:bg-muted"
            }`}
          title={`Speed: ${speedMultiplier}x`}
        >
          <div className="flex flex-col items-center leading-none gap-0.5">
            <span className="text-[10px] uppercase opacity-70">Speed</span>
            <span className="font-bold font-game text-xs">{speedMultiplier}x</span>
          </div>
        </Button>

        {isPlaying ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="h-10 px-6 border-2 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all font-semibold tracking-wide"
          >
            <Pause className="w-4 h-4 fill-current mr-2" />
            PAUSE
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onStart}
            className="h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider border-2 border-primary shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all"
          >
            <Play className="w-4 h-4 fill-current mr-2" />
            START
          </Button>
        )}
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';