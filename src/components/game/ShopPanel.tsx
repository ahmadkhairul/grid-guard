import { memo, DragEvent } from 'react';
import { DefenderType, Defender } from '@/types/game';
import { DEFENDER_CONFIGS, MAX_PER_TYPE } from '@/config/gameConfig';
import { cn } from '@/lib/utils';
import { Coins, GripVertical } from 'lucide-react';

interface ShopPanelProps {
  coins: number;
  selectedDefender: DefenderType | null;
  onSelectDefender: (type: DefenderType | null) => void;
  onDragStart: (type: DefenderType) => void;
  onDragEnd: () => void;
  defenders: Defender[];
  unlockedDefenders: DefenderType[];
}

export const ShopPanel = memo(({ 
  coins, 
  selectedDefender, 
  onSelectDefender,
  onDragStart,
  onDragEnd,
  defenders,
  unlockedDefenders,
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
    dragImage.style.width = '48px';
    dragImage.style.height = '48px';
    dragImage.style.fontSize = '32px';
    dragImage.style.display = 'flex';
    dragImage.style.alignItems = 'center';
    dragImage.style.justifyContent = 'center';
    dragImage.style.background = 'rgba(0, 0, 0, 0.9)';
    dragImage.style.borderRadius = '8px';
    dragImage.style.border = '2px solid hsl(var(--primary))';
    dragImage.textContent = config.emoji;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 24, 24);
    
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
    <div className="bg-card rounded-lg p-3 border border-border/50">
      <h2 className="font-game text-xs text-primary mb-3 tracking-wide hidden lg:block">SHOP</h2>
      
      <div className="space-y-2">
        {Object.values(DEFENDER_CONFIGS)
          .filter(config => unlockedDefenders.includes(config.type))
          .map(config => {
          const canAfford = coins >= config.cost;
          const isSelected = selectedDefender === config.type;
          const currentCount = getDefenderCount(config.type);
          const atMaxCapacity = currentCount >= MAX_PER_TYPE;
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
                'w-full p-2 rounded-md border transition-all duration-150',
                'flex items-center gap-2 text-left',
                isSelected 
                  ? 'border-primary bg-primary/15 shadow-[0_0_12px_hsl(var(--primary)/0.25)]'
                  : !isDisabled 
                    ? 'border-border/50 hover:border-primary/40 hover:bg-muted/50 cursor-grab active:cursor-grabbing'
                    : 'border-border/30 opacity-40 cursor-not-allowed'
              )}
            >
              {/* Drag Handle */}
              {!isDisabled && (
                <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
              )}
              
              {/* Icon */}
              <div className="w-9 h-9 rounded-md bg-muted/80 flex items-center justify-center text-lg flex-shrink-0 border border-border/30">
                {config.emoji}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-semibold text-xs text-foreground">{config.name}</span>
                  <span className={cn(
                    "text-[10px] px-1 py-0.5 rounded font-medium",
                    atMaxCapacity ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                  )}>
                    {currentCount}/{MAX_PER_TYPE}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>DMG: <span className="text-primary font-medium">{config.damage}</span></span>
                    <span>RNG: <span className="text-foreground">{config.range}</span></span>
                  </div>
                  <div className="flex items-center gap-0.5 text-accent font-bold text-xs">
                    <Coins className="w-3 h-3" />
                    {config.cost}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedDefender && (
        <p className="mt-2 text-[10px] text-primary text-center animate-pulse">
          Click on grid to place
        </p>
      )}
    </div>
  );
});

ShopPanel.displayName = 'ShopPanel';