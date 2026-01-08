import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Swords, Coins, Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PRO_TIPS = [
  { icon: <Coins className="w-4 h-4 text-yellow-500" />, text: "Miners generate more gold as they level up." },
  { icon: <Shield className="w-4 h-4 text-blue-500" />, text: "Stone towers can stun multiple enemies at once." },
  { icon: <Zap className="w-4 h-4 text-orange-500" />, text: "Fire towers apply a Burn effect that slows enemies and increases damage taken." },
  { icon: <Swords className="w-4 h-4 text-red-500" />, text: "Upgrading a tower's Level significantly boosts its damage." },
  { icon: <Coins className="w-4 h-4 text-yellow-500" />, text: "Defeating Bosses grants massive gold rewards!" },
];

export const LoadingScreen = memo(({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Initializing Systems...');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Cycle tips every 2 seconds
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % PRO_TIPS.length);
    }, 2000);

    const loadingSteps = [
      { progress: 15, text: 'Fetching Map Data...' },
      { progress: 35, text: 'Calibrating Defenses...' },
      { progress: 55, text: 'Simulating Wave Dynamics...' },
      { progress: 75, text: 'Equipping Defenders...' },
      { progress: 90, text: 'Finalizing Deployment...' },
      { progress: 100, text: 'Mission Start!' },
    ];

    let currentStep = 0;
    const loadInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setStepText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(loadInterval);
        clearInterval(tipInterval);
        setTimeout(onComplete, 800);
      }
    }, 500);

    return () => {
      clearInterval(loadInterval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Cinematic Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      {/* Floating Particles/Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        {/* Logo Section */}
        <div className="mb-12 text-center space-y-2 animate-in fade-in zoom-in duration-1000">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary/60 font-game mb-1">Grid Guard Command</h2>
          <h1 className="text-5xl md:text-6xl font-game text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            LOADING
          </h1>
          <div className="h-[2px] w-12 bg-primary mx-auto" />
        </div>

        {/* Progress Section */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end text-xs font-mono">
            <span className="text-primary/70 animate-pulse">{stepText}</span>
            <span className="text-white border-b border-primary/50 pb-0.5">{progress}%</span>
          </div>

          <div className="relative h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-primary to-accent transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_1s_linear_infinite]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-50" />
            </div>
          </div>
        </div>

        {/* Pro Tip Section */}
        <div className="mt-16 w-full p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest text-primary/60 font-bold">
            <Zap className="w-3 h-3" />
            Pro Tip
          </div>
          <div className="flex items-start gap-4 min-h-[40px]">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
              {PRO_TIPS[tipIndex].icon}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans italic">
              "{PRO_TIPS[tipIndex].text}"
            </p>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="absolute bottom-12 text-[10px] text-white/20 uppercase tracking-[0.2em] animate-pulse">
          Initializing Grid V2.42
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';
