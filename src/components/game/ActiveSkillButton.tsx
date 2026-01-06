import { memo, useState, useEffect } from 'react';
import { ActiveSkillConfig } from '@/config/activeSkills';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface ActiveSkillButtonProps {
    skill: ActiveSkillConfig;
    coins: number;
    readyAt: number;
    isAnimating: boolean;
    onTrigger: () => void;
}

export const ActiveSkillButton = memo(({
    skill,
    coins,
    readyAt,
    isAnimating,
    onTrigger,
}: ActiveSkillButtonProps) => {
    const [, setTick] = useState(0);

    // Force re-render every 100ms to update cooldown display
    useEffect(() => {
        if (Date.now() < readyAt) {
            const interval = setInterval(() => {
                setTick(t => t + 1);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [readyAt]);

    const isOnCooldown = Date.now() < readyAt;
    const isDisabled = coins < skill.cost || isOnCooldown;
    const cooldownSeconds = isOnCooldown ? Math.ceil((readyAt - Date.now()) / 1000) : 0;

    return (
        <div className={cn(isAnimating && skill.animationClass)}>
            <button
                onClick={onTrigger}
                disabled={isDisabled}
                className={cn(
                    'relative w-full p-2 rounded-md border transition-all duration-150',
                    'flex items-center gap-2 text-left',
                    !isDisabled
                        ? 'border-border/50 hover:border-primary/40 hover:bg-muted/50 cursor-pointer'
                        : 'border-border/30 opacity-40 cursor-not-allowed'
                )}
            >
                {/* Icon */}
                <div className="w-9 h-9 rounded-md bg-muted/80 flex items-center justify-center text-lg flex-shrink-0 border border-border/30">
                    {skill.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-semibold text-xs text-foreground">{skill.name}</span>
                        {isOnCooldown && (
                            <span className="text-[10px] px-1 py-0.5 rounded font-medium bg-destructive/20 text-destructive">
                                {cooldownSeconds}s
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>CD: <span className="text-foreground">{skill.cooldown / 1000}s</span></span>
                            <span>EFF: <span className="text-primary font-medium">{skill.description}</span></span>
                        </div>
                        <div className="flex items-center gap-0.5 text-accent font-bold text-xs">
                            <Coins className="w-3 h-3" />
                            {skill.cost}
                        </div>
                    </div>
                </div>

                {/* Cooldown Overlay */}
                {isOnCooldown && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                        <span className="font-bold text-white text-base">
                            {cooldownSeconds}s
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
});

ActiveSkillButton.displayName = 'ActiveSkillButton';
