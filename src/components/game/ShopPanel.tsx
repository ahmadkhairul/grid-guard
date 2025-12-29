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
    
    // Create custom drag image with only the emoji icon
    const config = DEFENDER_CONFIGS[type];
    const dragImage = document.createElement('div');
    dragImage.style.width = '64px';
    dragImage.style.height = '64px';
    dragImage.style.fontSize = '48px';
    dragImage.style.display = 'flex';
    dragImage.style.alignItems = 'center';
    dragImage.style.justifyContent = 'center';
    dragImage.style.background = 'rgba(0, 0, 0, 0.8)';
    dragImage.style.borderRadius = '12px';
    dragImage.style.border = '2px solid hsl(var(--primary))';
    dragImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    dragImage.textContent = config.emoji;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 32, 32);
    
    // Clean up drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    onDragStart(type);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h2 className="font-game text-sm text-primary mb-4">SHOP</h2>
      
      <div className="space-y-2">
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
                'w-full p-2.5 rounded-lg border-2 transition-all duration-200',
                'flex items-center gap-2.5 text-left',
                isSelected 
                  ? 'border-primary bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                  : !isDisabled 
                    ? 'border-border hover:border-primary/50 hover:bg-muted cursor-grab active:cursor-grabbing'
                    : 'border-border/50 opacity-50 cursor-not-allowed'
              )}
            >
              {!isDisabled && (
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
                {config.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-semibold text-sm text-foreground truncate">{config.name}</p>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium",
                    atMaxCapacity ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                  )}>
                    {currentCount}/{MAX_DEFENDERS_PER_TYPE}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">DMG: <span className="text-foreground">{config.damage}</span></span>
                    <span className="text-border">•</span>
                    <span className="font-medium">RNG: <span className="text-foreground">{config.range}</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-accent font-bold text-sm flex-shrink-0">
                    <Coins className="w-3.5 h-3.5" />
                    {config.cost}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedDefender && (
        <p className="mt-3 text-xs text-primary text-center animate-pulse">
          Click on a cell to place
        </p>
      )}
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';
