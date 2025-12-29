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
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {defenders.map(defender => {
          const config = DEFENDER_CONFIGS[defender.type];
          const upgradeCost = config.upgradeCost * defender.level;
          const canUpgrade = coins >= upgradeCost;
          const sellValue = Math.floor(config.sellValue * defender.level);
          
          return (
            <div 
              key={defender.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
            >
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                {config.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {config.name} Lv.{defender.level}
                </p>
                <p className="text-xs text-muted-foreground">
                  DMG: {Math.round(defender.damage)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!canUpgrade}
                  onClick={() => onUpgrade(defender.id)}
                  className="h-7 px-2 text-xs hover:bg-primary/20 hover:text-primary disabled:opacity-50"
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
                  className="h-7 px-2 text-xs hover:bg-destructive/20 hover:text-destructive"
                  title={`Sell for ${sellValue} coins`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <Coins className="w-3 h-3 mr-0.5" />
                  {sellValue}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DefendersList.displayName = 'DefendersList';
