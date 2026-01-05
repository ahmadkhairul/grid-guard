import { useState } from 'react';
import { MAPS } from '@/config/gameConfig';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, Swords, Map as MapIcon, HelpCircle, History } from 'lucide-react';
import { TutorialModal } from '@/components/game/TutorialModal';
import { ChangelogModal } from '@/components/game/ChangelogModal';

const Home = () => {
    const navigate = useNavigate();
    const [showTutorial, setShowTutorial] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="z-10 w-full max-w-4xl flex flex-col gap-4">

                {/* Title Section */}
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
                    {/* Top Bar Actions */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)} className="gap-2">
                            <HelpCircle className="w-4 h-4" />
                            <span className="inline">Tutorial</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowChangelog(true)} className="gap-2">
                            <History className="w-4 h-4" />
                            <span className="inline">Patch Notes</span>
                        </Button>
                    </div>
                </div>

                {/* Map Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                    {MAPS.map((map) => (
                        <div
                            key={map.id}
                            className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] flex flex-col gap-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-secondary/30">
                                        <MapIcon className="w-6 h-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-game text-2xl text-foreground group-hover:text-primary transition-colors">
                                            {map.name}
                                        </h3>
                                        <Badge variant={map.difficulty === 'Hard' ? 'destructive' : map.difficulty === 'Medium' ? 'secondary' : 'default'} className="mt-1">
                                            {map.difficulty}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed flex-1">
                                {map.description}
                            </p>

                            <div className="pt-4 mt-auto border-t border-border/50">
                                <Button
                                    className="w-full font-bold text-lg h-12 gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                                    onClick={() => navigate(`/play/${map.id}`)}
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    DEPLOY
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer info */}
                <div className="mt-8 flex gap-4 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Global Leaderboards Coming Soon</span>
                    </div>
                </div>

            </div>

            <TutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
            <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
        </div>
    );
};

export default Home;
