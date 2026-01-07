export type SkillEffectType = 'damage' | 'freeze' | 'buff' | 'debuff';

export interface SkillEffect {
    type: SkillEffectType;
    value: number; // Damage amount, freeze duration in seconds, etc.
}

export interface ActiveSkillConfig {
    id: string;
    name: string;
    emoji: string;
    cost: number;
    cooldown: number; // in milliseconds
    effect: SkillEffect;
    description: string; // Short description for UI
    gradientFrom: string; // Tailwind color class
    gradientTo: string; // Tailwind color class
    borderColor: string; // Tailwind color class
    shadowColor: string; // RGBA for box-shadow
    animationClass: string; // CSS animation class
}

export const ACTIVE_SKILLS: Record<string, ActiveSkillConfig> = {
    meteor: {
        id: 'meteor',
        name: 'Meteor',
        emoji: '☄️',
        cost: 5000,
        cooldown: 15000, // 15 seconds
        effect: {
            type: 'damage',
            value: 500,
        },
        description: '500 DMG',
        gradientFrom: 'from-orange-600',
        gradientTo: 'to-red-600',
        borderColor: 'border-orange-400',
        shadowColor: 'rgba(251, 146, 60, 0.4)',
        animationClass: 'animate-meteor-glow',
    },
    blizzard: {
        id: 'blizzard',
        name: 'Blizzard',
        emoji: '❄️',
        cost: 2500,
        cooldown: 20000, // 20 seconds
        effect: {
            type: 'freeze',
            value: 5, // 5 seconds freeze
        },
        description: 'Freeze 5s',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-cyan-600',
        borderColor: 'border-blue-400',
        shadowColor: 'rgba(59, 130, 246, 0.4)',
        animationClass: 'animate-blizzard-glow',
    },
};

// Helper to get skill by ID
export const getSkillConfig = (skillId: string): ActiveSkillConfig | undefined => {
    return ACTIVE_SKILLS[skillId];
};

// Get all skills as array
export const getAllSkills = (): ActiveSkillConfig[] => {
    return Object.values(ACTIVE_SKILLS);
};
