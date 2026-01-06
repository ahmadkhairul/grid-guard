import { useState, useCallback } from 'react';
import { MAPS } from '@/config/gameConfig';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, Swords, Map as MapIcon, HelpCircle, History } from 'lucide-react';
import { TutorialModal } from '@/components/game/TutorialModal';
import { ChangelogModal } from '@/components/game/ChangelogModal';
import { MapPreview } from '@/components/game/MapPreview';
import { hasSave } from '@/lib/storage';

const Home = () => {
    const navigate = useNavigate();
    const [showTutorial, setShowTutorial] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);

    const handleStart = (mapId: string) => {
        navigate(`/play/${mapId}`);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            <div className="z-10 w-full max-w-5xl flex flex-col gap-6 md:gap-8">

                {/* Header Section */}
                <div className="space-y-2 animate-in fade-in slide-in-from-top-10 duration-700">
                    <h1 className="text-xs md:text-base flex items-center font-game text-primary tracking-widest drop-shadow-lg">
                        GRID DEFENDER
                        <span className="text-xs md:text-base ml-4 text-muted-foreground align-top">
                            <Swords className="w-6 h-6 text-primary animate-pulse" />
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm">
                        Defend the grid against the endless waves. Choose your battlefield.
                    </p>
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)} className="gap-2 h-8 text-xs">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Tutorial</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowChangelog(true)} className="gap-2 h-8 text-xs">
                            <History className="w-3.5 h-3.5" />
                            <span>Patch Notes</span>
                        </Button>
                    </div>
                </div>

                {/* Map Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                    {MAPS.map((map) => {
                        const hasProgress = hasSave(map.id);
                        return (
                            <div
                                key={map.id}
                                className="group relative bg-card/60 backdrop-blur-md border border-border rounded-xl p-4 md:p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.2)] flex flex-col gap-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Left: Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-secondary/50 ring-1 ring-border/50">
                                                <MapIcon className="w-5 h-5 text-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-game text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                                                        {map.name}
                                                    </h3>
                                                    <Badge variant={map.difficulty === 'Hard' ? 'destructive' : map.difficulty === 'Medium' ? 'secondary' : 'outline'} className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
                                                        {map.difficulty}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                                            {map.description}
                                        </p>
                                    </div>

                                    {/* Right: Preview */}
                                    <div className="w-full sm:w-32 md:w-36 shrink-0 aspect-[4/3] sm:aspect-square md:aspect-[4/3]">
                                        <MapPreview path={map.path} className="w-full h-full bg-black/40" />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-2 mt-auto flex gap-2">
                                    {hasProgress ? (
                                        <Button
                                            className="flex-1 font-bold gap-2 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleStart(map.id)}
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            CONTINUE
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex-1 font-bold gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                                            onClick={() => handleStart(map.id)}
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            START
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer info */}
                <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Global Leaderboards Coming Soon</span>
                    </div>

                    <a
                        href="https://ko-fi.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 transition-colors cursor-pointer group"
                    >
                        <span className="group-hover:scale-110 transition-transform">❤️</span>
                        <span className="font-bold">Support Developer</span>
                    </a>
                </div>

            </div>

            <TutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
            <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
        </div>
    );
};

export default Home;
