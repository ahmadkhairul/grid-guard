import { memo } from 'react';
import { DefenderType } from '@/types/game';
import { DEFENDER_CONFIGS } from '@/config/gameConfig';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface ShopPanelProps {
  coins: number;
  selectedDefender: DefenderType | null;
  onSelectDefender: (type: DefenderType | null) => void;
}

export const ShopPanel = memo(({ coins, selectedDefender, onSelectDefender }: ShopPanelProps) => {
  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h2 className="font-game text-sm text-primary mb-4">SHOP</h2>
      
      <div className="space-y-3">
        {Object.values(DEFENDER_CONFIGS).map(config => {
          const canAfford = coins >= config.cost;
          const isSelected = selectedDefender === config.type;
          
          return (
            <button
              key={config.type}
              onClick={() => onSelectDefender(isSelected ? null : config.type)}
              disabled={!canAfford}
              className={cn(
                'w-full p-3 rounded-lg border-2 transition-all duration-200',
                'flex items-center gap-3 text-left',
                isSelected 
                  ? 'border-primary bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                  : canAfford 
                    ? 'border-border hover:border-primary/50 hover:bg-muted'
                    : 'border-border/50 opacity-50 cursor-not-allowed'
              )}
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                {config.emoji}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{config.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>DMG: {config.damage}</span>
                  <span className="mx-1">•</span>
                  <span>RNG: {config.range}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent font-bold">
                <Coins className="w-4 h-4" />
                {config.cost}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedDefender && (
        <p className="mt-4 text-sm text-primary text-center animate-pulse">
          Click on a cell to place
        </p>
      )}
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';
