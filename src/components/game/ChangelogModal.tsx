import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ChangelogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangelogModal = ({ open, onOpenChange }: ChangelogModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-game text-xl text-primary tracking-wider flex items-center gap-2">
            <span>📜 PATCH NOTES</span>
          </DialogTitle>
          <DialogDescription>
            Latest updates and balance changes.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">

            {/* version 2.0.0 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary">v2.0.0 - The Global Guardian</h3>
                <Badge variant="default" className="bg-primary text-primary-foreground">MAJOR</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                The massive V2 overhaul is here! Global progression, active skills, and multi-map support.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-foreground mb-1">🏆 Achievement System</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground font-sans">
                    <li><span className="text-yellow-500 font-bold">Global Persistence:</span> Achievements now save across all maps and play sessions.</li>
                    <li><span className="text-foreground font-bold">11 Unique Challenges:</span> From "Midas Touch" to the secret "G**d Av****r".</li>
                    <li><span className="text-primary font-bold">Certificate of Valor:</span> Generate a personalized summary of your bravery to share!</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">⚡ Active Skills & Spells</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-orange-500 font-bold">Meteor Strike:</span> Rain fire on all enemies for massive damage.</li>
                    <li><span className="text-blue-400 font-bold">Blizzard:</span> Freeze the entire battlefield for 5 seconds.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">🌍 Worlds & Progression</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-foreground font-bold">Multi-Map Support:</span> Battle on the "Dragon's Lair" with unique paths.</li>
                    <li><span className="text-green-500 font-bold">Endless Mode:</span> Push your defenses to the limit after Wave 25.</li>
                    <li><span className="text-primary font-bold">Map Clear Badges:</span> Visual indicators for cleared stages on Home.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">✨ Polish & UX</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-foreground font-bold">Cinematic Loading:</span> New high-fidelity splash screen with Pro-Tips.</li>
                    <li><span className="text-foreground font-bold">Refined Visuals:</span> Improved defender animations and UI transitions.</li>
                    <li><span className="text-pink-500 font-bold">Kofi Integration:</span> Direct link to support the developer.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* version 1.2.2 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">v1.2.2 - Social Distancing</h3>
                <Badge variant="default" className="bg-primary text-primary-foreground">HOTFIX</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Drastically reduced enemy density to prevent unfair stacking.
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <h4 className="font-bold text-foreground mb-1">⚖️ Balance</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-green-500 font-bold">Significantly Wider Spawns:</span> Base gap increased from 2.5s -&gt; 5.0s!</li>
                    <li>Reduced late-game grouping (especially Tanks).</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* version 1.2.1 */}
            <div className="space-y-3 opacity-75">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">v1.2.1 - Polished & Balanced</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Critical bug fixes and balance adjustments based on your feedback!
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <h4 className="font-bold text-foreground mb-1">⚖️ Balance</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-green-500 font-bold">Wider Spawns:</span> Enemies now have more breathing room (2.5s base gap).</li>
                    <li>Fixed "Instant Spawn" bug where enemies would rush you at the start of a wave.</li>
                    <li>Fixed Spawn Rate inconsistency between 1x and 3x speeds.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">📱 Mobile & UI</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Moved Notifications to <span className="text-primary font-bold">Top</span> on mobile to prevent blocking buttons.</li>
                    <li>Fixed Upgrade Mode preventing unit purchase/placement.</li>
                    <li>Optimized Enemy Size on mobile (scaling with grid).</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* version 1.2.0 */}
            <div className="space-y-3 opacity-75">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">v1.2.0 - The "Hardcore" Update</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We heard you wanted a challenge! This update introduces deeper mechanics and mobile quality-of-life improvements.
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <h4 className="font-bold text-foreground mb-1">🔥 Gameplay & Balance</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-destructive font-bold">New Boss Immunities!</span> Bosses now have specific weaknesses. Check the Tutorial for details.</li>
                    <li>Added <span className="text-foreground font-bold">Mini-Boss</span> at Wave 7 (Ogre). Good luck!</li>
                    <li>Thieves are now faster but only steal gold (no life loss).</li>
                    <li>Added Checkpoint System (Waves 5, 10, 15, 20).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">📱 Mobile Experience</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Added <span className="text-amber-500 font-bold">Upgrade Mode</span>: One-tap upgrades!</li>
                    <li>Added "View Mode": Tap units to see range/stats.</li>
                    <li>Added Upgrade Cost badges in Upgrade Mode.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">⚙️ System</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><span className="text-green-500 font-bold">Auto-Save</span> is now active! Progress is saved automatically.</li>
                    <li>New App Icons & Visual Polish.</li>
                    <li>Overhauled Tutorial with 4-page detailed guide.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* version 1.1.0 */}
            <div className="space-y-3 opacity-75">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">v1.1.0 - The Foundation</h3>
                <span className="text-xs text-muted-foreground">Jan 1, 2026</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                <li>Initial Release.</li>
                <li>3 Tower Types: Warrior, Archer, Miner.</li>
                <li>25 Waves of increasing difficulty.</li>
                <li>Basic Mobile Support.</li>
              </ul>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
