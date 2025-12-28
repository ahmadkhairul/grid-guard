import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sword, Target, Coins, Heart, GripVertical } from 'lucide-react';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TutorialModal = ({ open, onOpenChange }: TutorialModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-game text-xl text-primary text-center">
            HOW TO PLAY
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Defend your base from waves of enemies!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Drag & Drop */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <GripVertical className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Drag & Drop</h3>
              <p className="text-sm text-muted-foreground">
                Drag defenders from the shop and drop them onto empty grid cells. You can also click to select, then click a cell to place.
              </p>
            </div>
          </div>

          {/* Defenders */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sword className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Choose Defenders</h3>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">Warrior</span> (close range), <span className="text-foreground">Archer</span> (medium range), <span className="text-foreground">Mage</span> (long range). Each has unique stats.
              </p>
            </div>
          </div>

          {/* Attacking */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Attack Enemies</h3>
              <p className="text-sm text-muted-foreground">
                Defenders automatically attack enemies within range. Watch for the attack flash animation!
              </p>
            </div>
          </div>

          {/* Coins & Upgrades */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Earn & Upgrade</h3>
              <p className="text-sm text-muted-foreground">
                Defeat enemies to earn coins. Use coins to buy new defenders or upgrade existing ones for more damage and range.
              </p>
            </div>
          </div>

          {/* Lives */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Protect Your Lives</h3>
              <p className="text-sm text-muted-foreground">
                Enemies that reach the end of the path reduce your lives. Game over when lives hit zero!
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onOpenChange(false)} 
          className="w-full bg-primary text-primary-foreground font-semibold"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
