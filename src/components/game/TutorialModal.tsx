import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sword, Target, Coins, Heart, GripVertical, ChevronRight, ChevronLeft, Zap, Skull, Shield, ArrowUpCircle } from 'lucide-react';
import { DEFENDER_CONFIGS, MAX_WAVE } from '@/config/gameConfig';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TutorialModal = ({ open, onOpenChange }: TutorialModalProps) => {
  const [page, setPage] = useState(0);

  const totalPages = 4;

  const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));
  const handlePrev = () => setPage(p => Math.max(0, p - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-game text-xl text-primary text-center uppercase tracking-wider">
             GRID DEFENDER GUIDE ({page + 1}/{totalPages})
          </DialogTitle>
          <DialogDescription className="text-center">
            {page === 0 && "Game Basics & Controls"}
            {page === 1 && "Tower Index & Strategy"}
            {page === 2 && "Enemy Intelligence"}
            {page === 3 && "Boss Mechanics & Tips"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 min-h-[300px]">
          {/* PAGE 1: BASICS */}
          {page === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TutorialCard icon={<GripVertical className="text-primary"/>} title="Placement">
                  Drag & Drop defenders from the shop, or tap a defender then tap the grid.
                </TutorialCard>
                <TutorialCard icon={<ArrowUpCircle className="text-amber-500"/>} title="Upgrades">
                  Tap "Target Scan" to toggle <b>Upgrade Mode</b>. Tap any unit to upgrade it instantly!
                </TutorialCard>
                <TutorialCard icon={<Zap className="text-yellow-400"/>} title="Game Speed">
                  Tap the speed button (1x) to cycle through 2x and 3x speed for faster gameplay.
                </TutorialCard>
                <TutorialCard icon={<Heart className="text-destructive"/>} title="Survival">
                  Don't let enemies reach the end! You lose lives if they escape. Game Over at 0 lives.
                </TutorialCard>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-sm mt-4">
                 <h4 className="font-bold text-primary mb-1">💡 PRO TIP:</h4>
                 Use the <b>CHECKPOINT</b> system! Save your progress at waves 5, 10, 15, and 20.
              </div>
            </div>
          )}

          {/* PAGE 2: TOWERS */}
          {page === 1 && (
            <div className="space-y-3">
              <UnitRow emoji="⚔️" name="Warrior" desc="Short range, high damage. Good for choke points." stats="High DPS / Low Range" />
              <UnitRow emoji="🏹" name="Archer" desc="Long range, medium damage. Max level Archer cover all area." stats="Med DPS / High Range" />
              <UnitRow emoji="⛏️" name="Miner" desc="Generates gold over time! Attack enemies to mine gold." stats="Economy Unit" />
              <UnitRow emoji="🗿" name="Stone Cannon" desc="Heavy damage & Pushback! Unlocks at Wave 16. Save some sweet spot for them later" stats="Crowd Control" />
              
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm mt-4">
                 <h4 className="font-bold text-amber-500 mb-1">💰 ECONOMY TIP:</h4>
                 Place Miners early! They generate gold when every 2 seconds. More miners = More Gold!
              </div>
            </div>
          )}

          {/* PAGE 3: ENEMIES */}
          {page === 2 && (
            <div className="space-y-3">
              <UnitRow emoji="👾" name="Goblin" desc="Weak but numerous. Easy to kill." />
              <UnitRow emoji="🛡️" name="Orc Tank" desc="High HP, slow movement. Needs focused fire." />
              <UnitRow emoji="🦇" name="Stunner (Flying)" desc="Flying unit. EXPLODES on death, stunning nearby towers!" />
              <UnitRow emoji="🧚" name="Healer" desc="Heals ALL enemies for 500 HP when spawned. Kill fast!" />
              <UnitRow emoji="🦹" name="Thief" desc="ULTRA FAST (7x)! Steals 5000 Gold if escapes (no life loss)." />
            </div>
          )}

          {/* PAGE 4: BOSSES */}
          {page === 3 && (
            <div className="space-y-4">
               <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-center">
                  <h3 className="font-game text-destructive text-lg mb-2">IMMUNITY WARNING</h3>
                  <p className="text-sm text-muted-foreground">Bosses have special resistances depending on their HP!</p>
               </div>

               <div className="space-y-3">
                  <UnitRow emoji="👹" name="Mini Boss (Wave 7)" desc="High HP Ogre. A test of your early game damage!" />
                  <UnitRow emoji="🤖👻" name="Twin Bosses (Wave 10)" desc="Robot & Ghost duo! They require mixed damage types." />
                  <UnitRow emoji="🦍" name="Iron Golem (Wave 15)" desc="Massive HP. Immune to Arrows below 50% HP!" />
                  <UnitRow emoji="🥷" name="Assassin Boss (Wave 20)" desc="Fast and deadly. Immune to Warriors above 50% HP!" />
                  <UnitRow emoji="👿" name="Demon Lord (Wave 25)" desc="The final challenge. Rotates immunities!" />
               </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={handlePrev} disabled={page === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          
          {page < totalPages - 1 ? (
             <Button onClick={handleNext} className="ml-auto">
               Next <ChevronRight className="w-4 h-4 ml-1" />
             </Button>
          ) : (
             <Button onClick={() => onOpenChange(false)} className="bg-primary text-primary-foreground ml-auto">
               Close Guide
             </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TutorialCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/30 flex items-start gap-3">
    <div className="p-2 bg-background rounded-md shadow-sm">{icon}</div>
    <div>
      <h4 className="font-bold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  </div>
);

const UnitRow = ({ emoji, name, desc, stats }: { emoji: string, name: string, desc: string, stats?: string }) => (
  <div className="flex items-center gap-4 bg-card/50 p-3 rounded-lg border border-border/50">
    <div className="text-3xl w-10 text-center">{emoji}</div>
    <div className="flex-1">
       <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-foreground">{name}</h4>
          {stats && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{stats}</span>}
       </div>
       <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);
