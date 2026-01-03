import { memo } from 'react';
import { Defender } from '@/types/game';
import { DEFENDER_CONFIGS } from '@/config/gameConfig';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DefendersListProps {
  defenders: Defender[];
  coins: number;
  onUpgrade: (defenderId: string) => void;
}

export const DefendersList = memo(({ defenders, coins, onUpgrade }: DefendersListProps) => {
  if (defenders.length === 0) {
    return (
      <div className="bg-card rounded-lg p-3 border border-border/50">
        <h2 className="md:block hidden font-game text-xs text-primary mb-3 tracking-wide">DEFENDERS</h2>
        <p className="text-muted-foreground text-xs text-center py-3">
          No defenders placed yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-3 border border-border/50 flex-1 min-h-0">
      <h2 className="md:block hidden font-game text-xs text-primary mb-3 tracking-wide">DEFENDERS</h2>

      <div className="space-y-1.5 max-h-48 lg:max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {defenders.map((defender, index) => {
          const config = DEFENDER_CONFIGS[defender.type];
          const upgradeCost = config.upgradeCost * defender.level;
          const canUpgrade = coins >= upgradeCost;

          return (
            <div
              key={defender.id}
              className="p-2 rounded-md border border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                {/* Defender Icon */}
                <div className="w-8 h-8 rounded-md bg-muted/60 flex items-center justify-center text-base flex-shrink-0 relative border border-border/30">
                  {config.emoji}
                  {defender.level > 1 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                      {defender.level}
                    </span>
                  )}
                </div>

                {/* Defender Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                      #{index + 1} {config.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground flex-shrink-0">
                      ({defender.position.x},{defender.position.y})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                    {defender.type === 'miner' ? (
                      <span>Gen: <span className="text-yellow-400">+{15 + (defender.level - 1) * 10}g</span>/5s</span>
                    ) : (
                      <>
                        <span>DMG: <span className="text-foreground">{Math.round(defender.damage)}</span></span>
                        <span>RNG: <span className="text-foreground">{defender.range.toFixed(1)}</span></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!canUpgrade}
                    onClick={() => onUpgrade(defender.id)}
                    className="h-8 px-2 lg:h-6 lg:px-2 hover:bg-primary/20 hover:text-primary disabled:opacity-40 flex gap-1 w-auto"
                    title={`Upgrade for ${upgradeCost} coins`}
                  >
                    <ArrowUp className="w-4 h-4 lg:w-3 lg:h-3" />
                    <span className="text-[10px] font-bold">{upgradeCost}g</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DefendersList.displayName = 'DefendersList';