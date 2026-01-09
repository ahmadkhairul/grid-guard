import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACHIEVEMENTS } from '@/types/game';
import { Trophy, Award, Copy, Share2, Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { toBlob } from 'html-to-image';

interface CertificateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unlockedCount: number;
    totalCount: number;
    unlockedIds: string[];
}

export const CertificateModal = ({ open, onOpenChange, unlockedCount, totalCount, unlockedIds }: CertificateModalProps) => {
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [playerName, setPlayerName] = useState('GRID DEFENDER');
    const certificateRef = useRef<HTMLDivElement>(null);

    const getShareText = () => {
        return `🏆 GRID DEFENDER DEFENDER REPORT 🏆\n\n${playerName} has unlocked ${unlockedCount}/${totalCount} achievements in GRID DEFENDER!\n\nCan you beat this score? #GridDefender`;
    };

    const handleShare = async () => {
        if (!certificateRef.current) return;

        try {
            setIsGenerating(true);

            // Hide the buttons during capture
            const actionButtons = certificateRef.current.querySelector('.action-buttons-container') as HTMLElement;
            if (actionButtons) actionButtons.style.display = 'none';

            const blob = await toBlob(certificateRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
            });

            if (actionButtons) actionButtons.style.display = 'flex';
            setIsGenerating(false);

            if (!blob) return;

            const file = new File([blob], 'certificate.png', { type: 'image/png' });
            const shareData = {
                title: 'GRID DEFENDER - Achievement Certificate',
                text: getShareText(),
                files: [file],
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: Download if sharing files is not supported
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${playerName.replace(/\s+/g, '_')}_Certificate.png`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Error sharing certificate:', err);
            setIsGenerating(false);
            handleCopy();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getShareText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[750px] w-full bg-white text-black border-8 border-double border-yellow-600 p-0 overflow-hidden">
                <div
                    ref={certificateRef}
                    className="relative p-6 md:p-8 flex flex-col items-center text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-white"
                >

                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-yellow-600 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-yellow-600 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-yellow-600 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-yellow-600 rounded-br-lg" />

                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-yellow-700 shadow-xl mb-3">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-yellow-800 tracking-wider mb-1 uppercase">
                            Certificate of Valor
                        </h1>
                        <p className="font-serif italic text-base text-yellow-900/80">
                            This certificate is given to
                        </p>
                    </div>

                    <div className="mb-6 w-full max-w-sm">
                        <Input
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                            className="text-2xl font-bold font-mono text-center bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-dashed border-yellow-800/30 rounded-none h-auto py-1"
                            placeholder="YOUR NAME"
                            maxLength={20}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="font-serif text-lg text-yellow-900 mb-3">
                            Has proven their strategic genius by unlocking
                        </p>
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-yellow-100/50 border border-yellow-600/30 rounded-full">
                            <span className="text-3xl font-bold text-yellow-800">
                                {unlockedCount}
                            </span>
                            <span className="text-base text-yellow-800/80">
                                out of
                            </span>
                            <span className="text-3xl font-bold text-yellow-800">
                                {totalCount}
                            </span>
                            <span className="text-sm text-yellow-800/80 uppercase tracking-widest ml-1">
                                Achievements
                            </span>
                        </div>
                    </div>

                    {/* Achievement Icons Preview (Top 8) */}
                    <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
                        {unlockedIds.slice(0, 8).map(id => {
                            const ach = ACHIEVEMENTS.find(a => a.id === id);
                            return (
                                <div key={id} className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center text-base shadow-sm" title={ach?.title}>
                                    {ach?.icon}
                                </div>
                            );
                        })}
                        {unlockedIds.length > 8 && (
                            <div className="w-9 h-9 rounded-full bg-yellow-50/50 border border-yellow-200/50 flex items-center justify-center text-[10px] font-bold text-yellow-800">
                                +{unlockedIds.length - 8}
                            </div>
                        )}
                    </div>

                    <div className="w-full flex justify-between items-end mt-4 pt-4 border-t border-yellow-800/10">
                        <div className="text-left">
                            <div className="font-serif text-[10px] text-yellow-900/60 mb-0.5 tracking-tighter uppercase">Date of Issuance</div>
                            <div className="font-mono font-bold text-yellow-900 text-sm">{new Date().toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Award className="w-10 h-10 text-yellow-700 mb-1 opacity-80" />
                            <div className="font-serif font-bold text-yellow-900 text-[10px] tracking-widest uppercase">GRID DEFENDER Command</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-2 w-full max-w-xs no-print action-buttons-container">
                        <Button
                            className="w-full gap-2 font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg"
                            onClick={handleShare}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    SHARE CERTIFICATE (IMAGE)
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-800/60 hover:text-yellow-800 hover:bg-yellow-50 text-[10px]"
                            onClick={handleCopy}
                            disabled={isGenerating}
                        >
                            {copied ? 'COPIED TO CLIPBOARD!' : 'COPY AS TEXT'}
                            <Copy className="w-3 h-3 ml-2" />
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};
