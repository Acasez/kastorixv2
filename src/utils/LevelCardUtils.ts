const PROGRESSION_RULES = [
  {
    key: "statIncrease",
    label: "Increase One Stat",
    condition: (level: number) => level % 3 === 0 && level !== 0,
  },
  {
    key: "arcaneFeat",
    label: "Select Arcane Feat",
    condition: (level: number) => level !== 0,
  },
  {
    key: "generalFeat",
    label: "Select General Feat",
    condition: (level: number) => level !== 0,
  },
  {
    key: "advantage",
    label: "Select Advantage",
    condition: (level: number) => level % 4 === 0 && level !== 0,
  },
  {
    key: "ancestryFeat",
    label: "Select Ancestry Feat",
    condition: (level: number) => level % 5 === 0 && level !== 0,
  },
  {
    key: "background",
    label: "Select Background",
    condition: (level: number) => level === 0,
  },
];

// Special case for Level 0: Include all unique actions
const LEVEL_ZERO_ACTIONS = [
  "Select Background",
  "Select Advantage",
  "Select Ancestry Feat",
  "Select Arcane Feat",
];

// Helper to get actions for a level
export function getLevelActions(level: number): string[] {
  if (level === 0) {
    return LEVEL_ZERO_ACTIONS;
  }

  const actions = PROGRESSION_RULES.filter((rule) => rule.condition(level)).map(
    (rule) => rule.label,
  );

  return actions;
}
