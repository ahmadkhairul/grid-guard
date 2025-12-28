import { memo, DragEvent } from 'react';
import { DefenderType, Defender } from '@/types/game';
import { DEFENDER_CONFIGS, MAX_DEFENDERS_PER_TYPE } from '@/config/gameConfig';
import { cn } from '@/lib/utils';
import { Coins, GripVertical } from 'lucide-react';

interface ShopPanelProps {
  coins: number;
  selectedDefender: DefenderType | null;
  onSelectDefender: (type: DefenderType | null) => void;
  onDragStart: (type: DefenderType) => void;
  onDragEnd: () => void;
  defenders: Defender[];
}

export const ShopPanel = memo(({ 
  coins, 
  selectedDefender, 
  onSelectDefender,
  onDragStart,
  onDragEnd,
  defenders,
}: ShopPanelProps) => {
  
  const getDefenderCount = (type: DefenderType) => {
    return defenders.filter(d => d.type === type).length;
  };

  const handleDragStart = (e: DragEvent<HTMLButtonElement>, type: DefenderType) => {
    e.dataTransfer.setData('defenderType', type);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(type);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h2 className="font-game text-sm text-primary mb-4">SHOP</h2>
      
      <div className="space-y-3">
        {Object.values(DEFENDER_CONFIGS).map(config => {
          const canAfford = coins >= config.cost;
          const isSelected = selectedDefender === config.type;
          const currentCount = getDefenderCount(config.type);
          const atMaxCapacity = currentCount >= MAX_DEFENDERS_PER_TYPE;
          const isDisabled = !canAfford || atMaxCapacity;
          
          return (
            <button
              key={config.type}
              onClick={() => onSelectDefender(isSelected ? null : config.type)}
              draggable={!isDisabled}
              onDragStart={(e) => handleDragStart(e, config.type)}
              onDragEnd={handleDragEnd}
              disabled={isDisabled}
              className={cn(
                'w-full p-3 rounded-lg border-2 transition-all duration-200',
                'flex items-center gap-3 text-left',
                isSelected 
                  ? 'border-primary bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                  : !isDisabled 
                    ? 'border-border hover:border-primary/50 hover:bg-muted cursor-grab active:cursor-grabbing'
                    : 'border-border/50 opacity-50 cursor-not-allowed'
              )}
            >
              {!isDisabled && (
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                {config.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{config.name}</p>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    atMaxCapacity ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                  )}>
                    {currentCount}/{MAX_DEFENDERS_PER_TYPE}
                  </span>
                </div>
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
