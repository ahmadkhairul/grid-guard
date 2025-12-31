import { memo, useEffect } from 'react';
import { Achievement } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast = memo(({ achievement, onClose }: AchievementToastProps) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
      <div className="bg-card border-2 border-primary/50 rounded-lg p-4 shadow-[0_0_20px_hsl(var(--primary)/0.3)] flex items-center gap-4 min-w-[300px]">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl border border-primary/30 animate-bounce">
          {achievement.icon}
        </div>
        <div>
          <h4 className="font-game text-primary text-sm tracking-wider mb-1 flex items-center gap-2">
            ACHIEVEMENT UNLOCKED!
            <Trophy className="w-3 h-3 text-yellow-500" />
          </h4>
          <p className="font-bold text-foreground">{achievement.title}</p>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
      {/* Sparkles effect css would go here, omitting for simplicity */}
    </div>
  );
});

AchievementToast.displayName = 'AchievementToast';
