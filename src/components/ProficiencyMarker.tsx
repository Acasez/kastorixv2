// ProficiencyMarker.tsx
import { useCharacter } from "../contexts/CharacterContext";
import {
  PROFICIENCY_LEVELS,
  getProficiency,
  type ProficiencyTierName,
} from "../constants/Proficiency";

type ProficiencyMarkerProps = {
  skillName: string;
  category?: "skills" | "saves";
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
  category = "skills",
}: ProficiencyMarkerProps) {
  const { character, updateCharacter } = useCharacter();

  const proficiencies =
    category === "saves"
      ? character.saveProficiencies
      : character.skillProficiencies;

  const currentTierName: ProficiencyTierName =
    proficiencies[skillName] ?? "Untrained";
  const currentTier = getProficiency(currentTierName);

  const update = (direction: 1 | -1) => {
    updateCharacter({
      [category === "skills" ? "skillProficiencies" : "saveProficiencies"]: {
        ...proficiencies,
        [skillName]: cycle(currentTierName, direction),
      },
    });
  };

  const retreat = (e: React.MouseEvent) => {
    e.preventDefault(); // stops the browser context menu from opening
    update(-1);
  };

  return (
    <button
      type="button"
      onClick={(e) => (e.shiftKey ? retreat(e) : update(1))}
      onContextMenu={retreat}
      title={`${skillName}: ${currentTier.fullName} (right-click or Shift+click to decrease)`}
      aria-label={`${skillName} proficiency: ${currentTier.fullName}`}
      className="inline-flex h-5.5 w-5.5 cursor-pointer select-none items-center justify-center rounded border border-gray-500 text-[12px] font-bold text-gray-900"
      style={{ backgroundColor: currentTier.color }}
    >
      {currentTier.name}
    </button>
  );
}
