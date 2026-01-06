import { memo, useState } from 'react';
import { ShoppingBag, Shield, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShopPanel } from './ShopPanel';
import { DefendersList } from './DefendersList';
import { DefenderType, Defender } from '@/types/game';
import { ActiveSkillsPanel } from './ActiveSkillsPanel';

interface MobileBottomBarProps {
  coins: number;
  selectedDefender: DefenderType | null;
  onSelectDefender: (type: DefenderType | null) => void;
  onDragStart: (type: DefenderType) => void;
  onDragEnd: () => void;
  defenders: Defender[];
  onUpgrade: (id: string) => void;
  unlockedDefenders: DefenderType[];
  // Active Skills
  onMeteor?: () => void;
  onBlizzard?: () => void;
  meteorReadyAt?: number;
  blizzardReadyAt?: number;
  meteorAnimating?: boolean;
  blizzardAnimating?: boolean;
}

type PanelType = 'shop' | 'skills' | 'defender' | null;

export const MobileBottomBar = memo(({
  coins,
  selectedDefender,
  onSelectDefender,
  onDragStart,
  onDragEnd,
  defenders,
  onUpgrade,
  unlockedDefenders,
  onMeteor,
  onBlizzard,
  meteorReadyAt = 0,
  blizzardReadyAt = 0,
  meteorAnimating = false,
  blizzardAnimating = false,
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
      >
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h3 className="font-game text-sm text-primary">
            {activePanel === 'shop' ? 'SHOP' : activePanel === 'skills' ? 'SKILLS' : 'DEFENDERS'}
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
              unlockedDefenders={unlockedDefenders}
            />
          )}
          {activePanel === 'skills' && onMeteor && onBlizzard && (
            <ActiveSkillsPanel
              coins={coins}
              meteorReadyAt={meteorReadyAt}
              blizzardReadyAt={blizzardReadyAt}
              meteorAnimating={meteorAnimating}
              blizzardAnimating={blizzardAnimating}
              onMeteor={onMeteor}
              onBlizzard={onBlizzard}
              variant="mobile"
            />
          )}
          {activePanel === 'defender' && (
            <DefendersList
              defenders={defenders}
              coins={coins}
              onUpgrade={onUpgrade}
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
              "h-16 flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
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
            onClick={() => togglePanel('skills')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
              activePanel === 'skills'
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold text-sm">Skills</span>
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
