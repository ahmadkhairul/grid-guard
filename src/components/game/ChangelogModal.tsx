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
            
            {/* version 1.2.0 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">v1.2.0 - The "Hardcore" Update</h3>
                <Badge variant="default" className="bg-primary text-primary-foreground">NEW</Badge>
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
