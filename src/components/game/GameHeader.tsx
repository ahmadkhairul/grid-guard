import { memo } from 'react';
import { Coins, Heart, Waves, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  coins: number;
  lives: number;
  wave: number;
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const GameHeader = memo(({ 
  coins, 
  lives, 
  wave, 
  isPlaying, 
  onStart, 
  onPause, 
  onReset 
}: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center gap-6">
        {/* Coins */}
        <div className="flex items-center gap-2">
          <div className="coin-display w-8 h-8 rounded-full flex items-center justify-center">
            <Coins className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-game text-lg text-accent">{coins}</span>
        </div>
        
        {/* Lives */}
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-destructive fill-destructive" />
          <span className="font-game text-lg text-destructive">{lives}</span>
        </div>
        
        {/* Wave */}
        <div className="flex items-center gap-2">
          <Waves className="w-6 h-6 text-primary" />
          <span className="font-game text-lg text-primary">Wave {wave}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onPause}
            className="border-primary/50 text-primary hover:bg-primary/20"
          >
            <Pause className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={onStart}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
          >
            <Play className="w-5 h-5 mr-2" />
            {lives <= 0 ? 'Game Over' : 'Start'}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="border-muted-foreground/50 text-muted-foreground hover:bg-muted"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';
