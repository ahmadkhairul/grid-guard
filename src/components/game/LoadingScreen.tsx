import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = memo(({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading assets...' },
      { progress: 40, text: 'Preparing battlefield...' },
      { progress: 60, text: 'Summoning enemies...' },
      { progress: 80, text: 'Rallying defenders...' },
      { progress: 100, text: 'Ready!' },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setProgress(loadingSteps[stepIndex].progress);
        setLoadingText(loadingSteps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <h1 className="text-center font-game text-4xl md:text-5xl text-primary mb-8 animate-pulse">
        GRID DEFENDER
      </h1>
      
      <div className="w-64 md:w-80 mb-4">
        <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
          <div 
            className={cn(
              'h-full bg-gradient-to-r from-primary to-accent transition-all duration-300',
              progress === 100 && 'animate-pulse'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="font-game text-sm text-muted-foreground">
        {loadingText}
      </p>
      
      <div className="mt-12 flex gap-4 text-4xl animate-bounce">
        <span>⚔️</span>
        <span>🏹</span>
        <span>⛏️</span>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';
