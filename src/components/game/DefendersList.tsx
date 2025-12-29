import { memo } from 'react';
import { Defender } from '@/types/game';
import { DEFENDER_CONFIGS } from '@/config/gameConfig';
import { ArrowUp, Coins, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DefendersListProps {
  defenders: Defender[];
  coins: number;
  onUpgrade: (defenderId: string) => void;
  onSell: (defenderId: string) => void;
}

export const DefendersList = memo(({ defenders, coins, onUpgrade, onSell }: DefendersListProps) => {
  if (defenders.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border">
        <h2 className="font-game text-sm text-primary mb-4">DEFENDERS</h2>
        <p className="text-muted-foreground text-sm text-center py-4">
          No defenders placed yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h2 className="font-game text-sm text-primary mb-4">DEFENDERS</h2>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {defenders.map(defender => {
          const config = DEFENDER_CONFIGS[defender.type];
          const upgradeCost = config.upgradeCost * defender.level;
          const canUpgrade = coins >= upgradeCost;
          const sellValue = Math.floor(config.sellValue * defender.level);
          
          return (
            <div 
              key={defender.id}
              className="p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {/* Defender Icon */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0 relative">
                  {config.emoji}
                  {defender.level > 1 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {defender.level}
                    </span>
                  )}
                </div>

                {/* Defender Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {config.name}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({defender.position.x}, {defender.position.y})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium">DMG: <span className="text-foreground">{Math.round(defender.damage)}</span></span>
                    <span className="text-border">•</span>
                    <span className="font-medium">RNG: <span className="text-foreground">{defender.range.toFixed(1)}</span></span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!canUpgrade}
                      onClick={() => onUpgrade(defender.id)}
                      className="h-6 px-2 text-xs hover:bg-primary/20 hover:text-primary disabled:opacity-50 flex-1"
                      title={`Upgrade for ${upgradeCost} coins`}
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <Coins className="w-3 h-3 mr-0.5" />
                      {upgradeCost}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSell(defender.id)}
                      className="h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive flex-1"
                      title={`Sell for ${sellValue} coins`}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      <Coins className="w-3 h-3 mr-0.5" />
                      {sellValue}
                    </Button>
                  </div>
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
