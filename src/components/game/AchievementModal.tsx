import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Lock, Share2 } from 'lucide-react';
import { ACHIEVEMENTS } from '@/types/game';
import { getUnlockedAchievements } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { CertificateModal } from './CertificateModal';

interface AchievementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AchievementModal = ({ open, onOpenChange }: AchievementModalProps) => {
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        if (open) {
            setUnlocked(getUnlockedAchievements());
        }
    }, [open]);

    const progress = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md md:max-w-lg bg-card/95 backdrop-blur-xl border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-xl font-game tracking-wider">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                ACHIEVEMENTS
                            </div>
                            <span className="text-sm font-sans font-normal text-muted-foreground">
                                {unlocked.length} / {ACHIEVEMENTS.length}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-yellow-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <ScrollArea className="h-[60vh] md:h-[500px] pr-4">
                        <div className="space-y-3">
                            {ACHIEVEMENTS.map((ach) => {
                                const isUnlocked = unlocked.includes(ach.id);
                                const isHidden = ach.hidden && !isUnlocked;

                                return (
                                    <div
                                        key={ach.id}
                                        className={cn(
                                            "relative p-4 rounded-lg border transition-all duration-300",
                                            isUnlocked
                                                ? "bg-gradient-to-br from-card to-primary/5 border-primary/30 shadow-[0_0_15px_-5px_rgba(var(--primary),0.2)]"
                                                : "bg-secondary/30 border-border opacity-60 grayscale"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 shrink-0",
                                                isUnlocked ? "bg-background border-yellow-500/50" : "bg-muted border-muted-foreground/30"
                                            )}>
                                                {isUnlocked ? ach.icon : isHidden ? '❓' : <Lock className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className={cn(
                                                    "font-bold tracking-tight",
                                                    isUnlocked ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {isHidden ? "HIDDEN ACHIEVEMENT" : ach.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {isHidden ? "Complete the secret challenge to reveal this achievement." : ach.description}
                                                </p>
                                            </div>
                                            {isUnlocked && (
                                                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                                                    UNLOCKED
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="mt-4 flex justify-end">
                        <Button
                            className="w-full gap-2 font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg"
                            onClick={() => setShowCertificate(true)}
                        >
                            <Share2 className="w-4 h-4" />
                            VIEW CERTIFICATE
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <CertificateModal
                open={showCertificate}
                onOpenChange={setShowCertificate}
                unlockedCount={unlocked.length}
                totalCount={ACHIEVEMENTS.length}
                unlockedIds={unlocked}
            />
        </>
    );
};
