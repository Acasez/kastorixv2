// ProficiencyMarker.tsx
import { useCharacter } from "../../contexts/CharacterContext";
import {
  PROFICIENCY_LEVELS,
  getProficiency,
  type ProficiencyTierName,
} from "../../constants/Proficiency";

type ProficiencyMarkerProps = {
  skillName: string;
};

function cycle(
  tierName: ProficiencyTierName,
  direction: 1 | -1,
): ProficiencyTierName {
  const currentIndex = PROFICIENCY_LEVELS.findIndex(
    (p) => p.fullName === tierName,
  );
  const nextIndex =
    (currentIndex + direction + PROFICIENCY_LEVELS.length) %
    PROFICIENCY_LEVELS.length;
  return PROFICIENCY_LEVELS[nextIndex].fullName;
}

export default function ProficiencyMarker({
  skillName,
}: ProficiencyMarkerProps) {
  const { character, updateCharacter } = useCharacter();

  const currentTierName: ProficiencyTierName =
    character.skillProficiencies[skillName] ?? "Untrained";
  const currentTier = getProficiency(currentTierName);

  const advance = () => {
    updateCharacter({
      skillProficiencies: {
        ...character.skillProficiencies,
        [skillName]: cycle(currentTierName, 1),
      },
    });
  };

  const retreat = (e: React.MouseEvent) => {
    e.preventDefault(); // stops the browser context menu from opening
    updateCharacter({
      skillProficiencies: {
        ...character.skillProficiencies,
        [skillName]: cycle(currentTierName, -1),
      },
    });
  };

  return (
    <button
      type="button"
      onClick={(e) => (e.shiftKey ? retreat(e) : advance())}
      onContextMenu={retreat}
      title={`${skillName}: ${currentTier.fullName} (right-click or Shift+click to decrease)`}
      aria-label={`${skillName} proficiency: ${currentTier.fullName}`}
      className="inline-flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded border border-gray-500 text-[10px] font-bold text-gray-900"
      style={{ backgroundColor: currentTier.color }}
    >
      {currentTier.name}
    </button>
  );
}
