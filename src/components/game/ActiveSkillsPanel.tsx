import { memo } from 'react';
import { ActiveSkillButton } from './ActiveSkillButton';
import { getAllSkills } from '@/config/activeSkills';
import { SKILL_CONFIGS } from '@/config/gameConfig';

interface ActiveSkillsPanelProps {
  coins: number;
  meteorReadyAt: number;
  blizzardReadyAt: number;
  meteorLevel: number;
  blizzardLevel: number;
  meteorAnimating: boolean;
  blizzardAnimating: boolean;
  onMeteor: () => void;
  onBlizzard: () => void;
  onUpgrade: (skill: 'meteor' | 'blizzard') => void;
}

export const ActiveSkillsPanel = memo(({
  coins,
  meteorReadyAt,
  blizzardReadyAt,
  meteorLevel = 1,
  blizzardLevel = 1,
  meteorAnimating,
  blizzardAnimating,
  onMeteor,
  onBlizzard,
  onUpgrade
}: ActiveSkillsPanelProps) => {
  const skills = getAllSkills();

  // Map skill IDs to their state
  const skillStates: Record<string, {
    readyAt: number;
    isAnimating: boolean;
    onTrigger: () => void;
    level: number;
  }> = {
    meteor: { readyAt: meteorReadyAt, isAnimating: meteorAnimating, onTrigger: onMeteor, level: meteorLevel },
    blizzard: { readyAt: blizzardReadyAt, isAnimating: blizzardAnimating, onTrigger: onBlizzard, level: blizzardLevel },
  };

  return (
    <div className="bg-card rounded-lg p-3 border border-border/50">
      <h2 className="font-game text-xs text-primary mb-3 tracking-wide hidden lg:block">
        ACTIVE SKILLS
      </h2>

      <div className="space-y-2">
        {skills.map(skill => {
          const state = skillStates[skill.id];
          if (!state) return null;

          // Get Dynamic Config
          const skillType = skill.id as 'meteor' | 'blizzard';
          const config = SKILL_CONFIGS[skillType];
          const levelConfig = config.levels[state.level - 1]; // 0-indexed
          const nextLevelConfig = config.levels[state.level]; // Next level (if exists)

          // Format Stats
          const description = skill.id === 'meteor'
            ? `${(levelConfig as any).damagePercent * 100}% HP`
            : `${(levelConfig as any).duration / 1000}s`;

          return (
            <ActiveSkillButton
              key={skill.id}
              skill={skill}
              coins={coins}
              readyAt={state.readyAt}
              isAnimating={state.isAnimating}
              onTrigger={state.onTrigger}
              level={state.level}
              upgradeCost={nextLevelConfig?.upgradeCost} // Use upgradeCost from config
              triggerCost={config.baseCost} // Pass baseCost as triggerCost
              onUpgrade={() => onUpgrade(skillType)}
              currentStats={{
                cooldown: levelConfig.cooldown,
                effectValue: 0,
                description
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

ActiveSkillsPanel.displayName = 'ActiveSkillsPanel';
