import { memo } from 'react';
import { ActiveSkillButton } from './ActiveSkillButton';
import { getAllSkills } from '@/config/activeSkills';

interface ActiveSkillsPanelProps {
  coins: number;
  meteorReadyAt: number;
  blizzardReadyAt: number;
  meteorAnimating: boolean;
  blizzardAnimating: boolean;
  onMeteor: () => void;
  onBlizzard: () => void;
}

export const ActiveSkillsPanel = memo(({
  coins,
  meteorReadyAt,
  blizzardReadyAt,
  meteorAnimating,
  blizzardAnimating,
  onMeteor,
  onBlizzard,
}: ActiveSkillsPanelProps) => {
  const skills = getAllSkills();

  // Map skill IDs to their state
  const skillStates: Record<string, { readyAt: number; isAnimating: boolean; onTrigger: () => void }> = {
    meteor: { readyAt: meteorReadyAt, isAnimating: meteorAnimating, onTrigger: onMeteor },
    blizzard: { readyAt: blizzardReadyAt, isAnimating: blizzardAnimating, onTrigger: onBlizzard },
  };

  return (
    <div className="bg-card rounded-lg p-3 border border-border/50">
      <h2 className="font-game text-xs text-primary mb-3 tracking-wide hidden lg:block">
        SKILLS
      </h2>

      <div className="space-y-2">
        {skills.map(skill => {
          const state = skillStates[skill.id];
          if (!state) return null;

          return (
            <ActiveSkillButton
              key={skill.id}
              skill={skill}
              coins={coins}
              readyAt={state.readyAt}
              isAnimating={state.isAnimating}
              onTrigger={state.onTrigger}
            />
          );
        })}
      </div>
    </div>
  );
});

ActiveSkillsPanel.displayName = 'ActiveSkillsPanel';
