import { memo, useState } from 'react';
import { ShoppingBag, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';
import { DefenderType, Defender } from '@/types/game';

interface MobileBottomBarProps {
  coins: number;
  selectedDefender: DefenderType | null;
  onSelectDefender: (type: DefenderType | null) => void;
  onDragStart: (type: DefenderType) => void;
  onDragEnd: () => void;
  defenders: Defender[];
  onUpgrade: (id: string) => void;
  onSell: (id: string) => void;
}

type PanelType = 'shop' | 'defender' | null;

export const MobileBottomBar = memo(({
  coins,
  selectedDefender,
  onSelectDefender,
  onDragStart,
  onDragEnd,
  defenders,
  onUpgrade,
  onSell,
}: MobileBottomBarProps) => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  return (
    <>
      {/* Backdrop removed for Tab Pane behavior */}

      {/* Slide-up Panel */}
      <div 
        className={cn(
          "fixed bottom-16 left-0 right-0 bg-card border-t border-border z-30 lg:hidden transition-transform duration-300 ease-out shadow-xl",
          activePanel ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: '35vh' }}
      >
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h3 className="font-game text-sm text-primary">
            {activePanel === 'shop' ? 'SHOP' : 'DEFENDERS'}
          </h3>
          <button
            onClick={() => setActivePanel(null)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto p-3 h-[calc(35vh-48px)]">
          {activePanel === 'shop' && (
            <ShopPanel
              coins={coins}
              selectedDefender={selectedDefender}
              onSelectDefender={onSelectDefender}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              defenders={defenders}
            />
          )}
          {activePanel === 'defender' && (
            <DefendersList
              defenders={defenders}
              coins={coins}
              onUpgrade={onUpgrade}
              onSell={onSell}
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:hidden">
        <div className="flex">
          <button
            onClick={() => togglePanel('shop')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
              activePanel === 'shop' 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold text-sm">Shop</span>
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => togglePanel('defender')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
              activePanel === 'defender' 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-sm">Defenders</span>
          </button>
        </div>
      </div>
    </>
  );
});

MobileBottomBar.displayName = 'MobileBottomBar';
