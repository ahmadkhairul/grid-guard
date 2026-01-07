import { memo, useState, useEffect } from 'react';
import { ActiveSkillConfig } from '@/config/activeSkills';
import { cn } from '@/lib/utils';
import { Coins, ArrowUpCircle } from 'lucide-react';

interface ActiveSkillButtonProps {
    skill: ActiveSkillConfig;
    coins: number;
    readyAt: number;
    isAnimating: boolean;
    onTrigger: () => void;
    level: number;
    upgradeCost?: number;
    onUpgrade?: () => void;
    currentStats: {
        cooldown: number;
        effectValue: number; // damage percent or duration
        description: string;
    };
    triggerCost: number; // New prop
}

export const ActiveSkillButton = memo(({
    skill,
    coins,
    readyAt,
    isAnimating,
    onTrigger,
    level,
    upgradeCost,
    onUpgrade,
    currentStats,
    triggerCost
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
    const isTriggerDisabled = coins < triggerCost || isOnCooldown; // Use triggerCost
    const cooldownSeconds = isOnCooldown ? Math.ceil((readyAt - Date.now()) / 1000) : 0;

    // Upgrade logic
    const canUpgrade = upgradeCost !== undefined && coins >= upgradeCost;
    const isMaxLevel = upgradeCost === undefined;

    return (
        <div className={cn("flex gap-2 items-stretch", isAnimating && skill.animationClass)}>
            {/* Main Trigger Button */}
            <button
                onClick={onTrigger}
                disabled={isTriggerDisabled}
                className={cn(
                    'relative flex-1 p-2 rounded-md border transition-all duration-150',
                    'flex items-center gap-2 text-left',
                    !isTriggerDisabled
                        ? 'border-border/50 hover:border-primary/40 hover:bg-muted/50 cursor-pointer'
                        : 'border-border/30 opacity-40 cursor-not-allowed'
                )}
            >
                {/* Icon & Level */}
                <div className="relative w-10 h-10 rounded-md bg-muted/80 flex items-center justify-center text-xl flex-shrink-0 border border-border/30">
                    {skill.emoji}
                    <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm ring-1 ring-background">
                        {level}
                    </div>
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
                            <span>CD: <span className="text-foreground">{currentStats.cooldown / 1000}s</span></span>
                            <span className="text-primary font-medium">{currentStats.description}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-accent font-bold text-xs">
                            <Coins className="w-3 h-3" />
                            {triggerCost}
                        </div>
                    </div>
                </div>

                {/* Cooldown Overlay */}
                {isOnCooldown && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md pointer-events-none">
                        <span className="font-bold text-white text-base">
                            {cooldownSeconds}s
                        </span>
                    </div>
                )}
            </button>

            {/* Upgrade Button */}
            {!isMaxLevel && onUpgrade && (
                <button
                    onClick={onUpgrade}
                    disabled={!canUpgrade}
                    className={cn(
                        "w-14 flex flex-col items-center justify-center gap-1 rounded-md border px-1",
                        "transition-all duration-150",
                        canUpgrade
                            ? "bg-accent/10 border-accent/50 hover:bg-accent/20 cursor-pointer text-accent"
                            : "bg-muted/20 border-border/20 opacity-50 cursor-not-allowed text-muted-foreground"
                    )}
                    title={`Upgrade ${skill.name} (Cost: ${upgradeCost})`}
                >
                    <ArrowUpCircle className="w-4 h-4" />
                    <div className="flex items-center gap-0.5 text-[9px] font-bold">
                        <Coins className="w-2.5 h-2.5" />
                        {(upgradeCost! / 1000).toFixed(0)}k
                    </div>
                </button>
            )}
        </div>
    );
});

ActiveSkillButton.displayName = 'ActiveSkillButton';
