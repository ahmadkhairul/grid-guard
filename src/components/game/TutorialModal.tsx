import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sword, Target, Coins, Heart, GripVertical, ChevronRight, ChevronLeft, Zap, Skull, Shield, ArrowUpCircle, Trophy, History as HistoryIcon } from 'lucide-react';
import { DEFENDER_CONFIGS, MAX_WAVE } from '@/config/gameConfig';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TutorialModal = ({ open, onOpenChange }: TutorialModalProps) => {
  const [page, setPage] = useState(0);

  const totalPages = 6;

  const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));
  const handlePrev = () => setPage(p => Math.max(0, p - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-game text-xl text-primary text-center uppercase tracking-wider">
            GRID DEFENDER GUIDE ({page + 1}/{totalPages})
          </DialogTitle>
          <DialogDescription className="text-center font-bold text-foreground/80">
            {page === 0 && "Basic Controls & Active Skills"}
            {page === 1 && "Basic Towers (Standard)"}
            {page === 2 && "Special Towers (Advanced)"}
            {page === 3 && "Enemy Intelligence"}
            {page === 4 && "Achievements & Certificates"}
            {page === 5 && "Bosses & Endless Mode"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 min-h-[350px]">
          {/* PAGE 1: BASICS & SKILLS */}
          {page === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TutorialCard icon={<GripVertical className="text-primary" />} title="Placement">
                  Drag defenders from the shop or tap then place on the grid.
                </TutorialCard>
                <TutorialCard icon={<ArrowUpCircle className="text-amber-500" />} title="Upgrades">
                  Tap "Target Scan" to toggle <b>Upgrade Mode</b> for instant leveling.
                </TutorialCard>
                <TutorialCard icon={<Zap className="text-orange-500" />} title="Meteor Strike">
                  A high-damage fire spell that hits <b>EVERY</b> enemy on the map. Cost: 1 Gold.
                </TutorialCard>
                <TutorialCard icon={<Zap className="text-blue-400" />} title="Blizzard">
                  Freeze all enemies in place for 5 seconds. Perfect for emergencies! Cost: 1 Gold.
                </TutorialCard>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-sm mt-4">
                <h4 className="font-bold text-primary mb-1">💡 COMMAND CENTER:</h4>
                Use Skills wisely! They have long cooldowns but can save a "Close Call" run.
              </div>
            </div>
          )}

          {/* PAGE 2: BASIC TOWERS */}
          {page === 1 && (
            <div className="space-y-3">
              <UnitRow emoji="⚔️" name="Warrior" desc="Short range, high damage. Best for choke points." stats="High DPS" />
              <UnitRow emoji="🏹" name="Archer" desc="Long range, medium damage. Covers the whole map at max level." stats="Global Reach" />
              <UnitRow emoji="⛏️" name="Miner" desc="Generates gold over time! Essential for high-level upgrades." stats="Economy" />

              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm mt-4 text-center">
                <h4 className="font-bold text-amber-500 mb-1">💰 STRATEGY:</h4>
                More Miners = More Gold. Place them early to dominate the late game!
              </div>
            </div>
          )}

          {/* PAGE 3: SPECIAL TOWERS */}
          {page === 2 && (
            <div className="space-y-3">
              <UnitRow emoji="🗿" name="Stone Cannon" desc="Massive damage & Pushback! Heavy crowd control." stats="Stun/Push" />
              <UnitRow emoji="🧊" name="Ice Cube" desc="Slows enemies on hit. Essential for fast phantoms." stats="Debuff" />
              <UnitRow emoji="⚡" name="Lightning Rod" desc="Fast attack speed. Efficient for cleaning up low-HP swarms." stats="Turbo" />

              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-sm mt-4">
                <h4 className="font-bold text-blue-400 mb-1">🌈 ELEMENTALIST:</h4>
                Each special defender tied with their stage and cannot be used outside of that stage.
              </div>
            </div>
          )}

          {/* PAGE 4: ENEMIES */}
          {page === 3 && (
            <div className="space-y-3">
              <UnitRow emoji="🛡️" name="Orc Tank" desc="High HP. Needs Stone Cannons or Warrior focus." />
              <UnitRow emoji="🦅" name="Flying Units" desc="Ignores paths. Only Archers and Lightning can hit them!" />
              <UnitRow emoji="🧚" name="Healer" desc="Restores huge HP to all enemies. Primary target!" />
              <UnitRow emoji="🦹" name="Thief" desc="Doesn't take lives, but steals your hard-earned gold if he escapes." />
              <UnitRow emoji="🎭" name="Phantoms" desc="Moves fast and has high HP. Use Ice to slow them down." />
            </div>
          )}

          {/* PAGE 5: ACHIEVEMENTS */}
          {page === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TutorialCard icon={<Trophy className="text-yellow-500" />} title="Global Progress">
                  Achievements are stored globally! Track your bravery across all maps.
                </TutorialCard>
                <TutorialCard icon={<Shield className="text-primary" />} title="Hidden Tasks">
                  Some challenges are secret. Unlock them to reveal their requirements!
                </TutorialCard>
              </div>

              <div className="flex items-center gap-4 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20">
                <div className="text-4xl">📜</div>
                <div className="text-sm">
                  <h4 className="font-bold text-yellow-600 mb-1">CERTIFICATE OF VALOR</h4>
                  Enter your name in the Achievement Modal to generate a personalized shareable certificate of your progress!
                </div>
              </div>
            </div>
          )}

          {/* PAGE 6: BOSSES & ENDLESS */}
          {page === 5 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-center">
                <h3 className="font-game text-destructive text-lg mb-2">INFINITY CHALLENGE</h3>
                <p className="text-sm text-muted-foreground">The game doesn't end at Wave 25 anymore!</p>
              </div>

              <div className="space-y-2 text-sm mt-2">
                <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <Skull className="w-5 h-5 text-destructive shrink-0" />
                  <p><b>Wave 25:</b> Defeat the Demon Lord to unlock <b>Endless Mode</b>.</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <HistoryIcon className="w-5 h-5 text-primary shrink-0" />
                  <p>How long can you survive?</p>
                </div>
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
            <Button onClick={() => onOpenChange(false)} className="bg-primary text-primary-foreground ml-auto font-bold">
              READY TO DEFEND
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
