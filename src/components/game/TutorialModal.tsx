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
import { ENEMY_TYPES } from '@/types/game';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatBossName = (name: string) => {
  return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const TutorialModal = ({ open, onOpenChange }: TutorialModalProps) => {
  const [page, setPage] = useState(0);

  const totalPages = 8;

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
            {page === 3 && "Enemy Intelligence: Common"}
            {page === 4 && "Enemy Intelligence: Special Threats"}
            {page === 5 && "Elite Enemies & Bosses"}
            {page === 6 && "Achievements & Certificates"}
            {page === 7 && "High Score & Endless Mode"}
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
              <UnitRow emoji="🔥" name="Fire Tower" desc="Apply Burn status. Reduces enemy speed and increases damage taken." stats="Burn/Debuff" />

              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-sm mt-4">
                <h4 className="font-bold text-blue-400 mb-1">🌈 ELEMENTALIST:</h4>
                Each special defender tied with their stage and cannot be used outside of that stage.
              </div>
            </div>
          )}

          {/* PAGE 4: COMMON ENEMIES */}
          {page === 3 && (
            <div className="space-y-3">
              <UnitRow emoji="👾" name="Normal" desc="Standard infantry" />
              <UnitRow emoji="🏃" name="Fast" desc="Fast variants have lower HP but highly mobile." stats='Fast' />
              <UnitRow emoji="🛡️" name="Tank" desc="High HP. Movement speed is slow but can soak up massive damage." stats='High HP' />
              <UnitRow emoji="🦅" name="Flying" desc="Ignores paths and flies directly! Archers are your best defenders against them." stats='Flying' />

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-sm mt-4">
                <h4 className="font-bold text-primary mb-1">Defense Tip:</h4>
                Watch for the flying unit paths. They don't follow the road!
              </div>
            </div>
          )}

          {/* PAGE 5: SPECIAL THREATS */}
          {page === 4 && (
            <div className="space-y-3">
              <UnitRow emoji="🧚" name="Healer" desc="Primary target! Pulsates healing to all nearby enemies." stats="Healing" />
              <UnitRow emoji="🦹" name="Thief" desc="Doesn't take lives, but steals your hard-earned gold if he reaches the goal." stats="Super Fast/Steal" />
              <UnitRow emoji="🦇" name="Stunner" desc="Flying unit that occasionally disables (stuns) your towers for 3 seconds." stats="Fly/Stun" />
              <UnitRow emoji="🐉" name="Dragon" desc="Released Overheat on death. Reduces nearby towers mining/damage by 50% for 5s." stats="Fly/Overheat" />
              <UnitRow emoji="🪨" name="Iron Golem" desc="Extreme HP. Knockback immunity Heavy armor grants 50% resistance to Archer attacks." stats="Resistant" />
              <UnitRow emoji="🥶" name="Phantoms" desc="Invisible warriors that move extremely fast. Use ice tower to slow it down." stats="Invisibility" />
            </div>
          )}

          {/* PAGE 6: ELITE & BOSSES */}
          {page === 5 && (
            <div className="space-y-3">
              <UnitRow emoji="👹" name={formatBossName(ENEMY_TYPES.BOSS_DEMON)} desc="Initial floor boss. Rotate immunities based of percentage HP" stats="Immunity" />
              <UnitRow emoji="🤖" name={formatBossName(ENEMY_TYPES.BOSS_WARRIOR)} desc="Warrior from future. Immune to warrior attack." stats="Immunity" />
              <UnitRow emoji="👻" name={formatBossName(ENEMY_TYPES.BOSS_ARCHER)} desc="Ghost Archer. An Arrow pass his body. Immune to archer attack." stats="Speedster" />
              <UnitRow emoji="🦍" name={formatBossName(ENEMY_TYPES.BOSS_GOLEM)} desc="Special boss of Golem Lair. Defeat him to unlock stone cannon" />
              <UnitRow emoji="🐲" name={formatBossName(ENEMY_TYPES.BOSS_DRAGON)} desc="The flying terror boss of 15th Dragon Cave. Defeat him to unlock fire tower." />
              <UnitRow emoji="🎭" name={formatBossName(ENEMY_TYPES.BOSS_PHANTOM)} desc="Spectral assassin of 15th Frezee Land. Grid Guard Command build ice tower just for him." />
              <UnitRow emoji="🥷" name={formatBossName(ENEMY_TYPES.BOSS_ASSASSIN)} desc="Ultimate speedster." />
              <UnitRow emoji="👿" name={formatBossName(ENEMY_TYPES.BOSS_DEMON_LORD)} desc="Demon comeback in his strongest form. Rotate Immunities based on percentage HP." stats="Immunity" />

              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-sm mt-2 text-center">
                <h4 className="font-bold text-destructive mb-1">⚠️ ELITE INTEL:</h4>
                Bosses spawn every 5 waves in Endless Mode. Prepare your high-level towers!
              </div>
            </div>
          )}

          {/* PAGE 7: ACHIEVEMENTS */}
          {page === 6 && (
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
                  Enter your name in the Achievement Modal to generate a personalized shareable certificate!
                </div>
              </div>
            </div>
          )}

          {/* PAGE 8: ENDLESS MODE */}
          {page === 7 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-center">
                <h3 className="font-game text-destructive text-lg mb-2">INFINITY CHALLENGE</h3>
                <p className="text-sm text-muted-foreground">The game doesn't end at Wave 25 anymore!</p>
              </div>

              <div className="space-y-2 text-sm mt-2">
                <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <Skull className="w-5 h-5 text-destructive shrink-0" />
                  <p><b>Endless Mode:</b> Enemies scale in HP and Gold rewards infinitely.</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <HistoryIcon className="w-5 h-5 text-primary shrink-0" />
                  <p>Every 25 waves, enemy counts cycle to prevent overswarming, but their power grows.</p>
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
