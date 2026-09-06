import ActionButton from "./ActionButton";

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
function getLevelActions(level: number): string[] {
  if (level === 0) {
    return LEVEL_ZERO_ACTIONS;
  }

  const actions = PROGRESSION_RULES.filter((rule) => rule.condition(level)).map(
    (rule) => rule.label,
  );

  return actions;
}

interface LevelCardProps {
  level: number;
}

export default function LevelCard({ level }: LevelCardProps) {
  const actions = getLevelActions(level);

  return (
    <div className="bg-blue-200 rounded-lg p-2 mb-3 shadow-sm border border-blue-300">
      <h3 className="text-xl font-bold text-gray-800 -mt-1.5 mb-1 text-center">
        Level {level}
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const isHighlighted = action === "Increase One Stat";
          return (
            <ActionButton
              key={index}
              label={action}
              isHighlighted={isHighlighted}
            />
          );
        })}
      </div>
    </div>
  );
}
