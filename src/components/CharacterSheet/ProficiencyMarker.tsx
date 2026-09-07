// ProficiencyMarker.tsx
import { useCharacter } from "../../contexts/CharacterContext";
import {
  PROFICIENCY_LEVELS,
  getProficiency,
} from "../../constants/Proficiency";

type ProficiencyMarkerProps = {
  skillName: string;
};

export default function ProficiencyMarker({
  skillName,
}: ProficiencyMarkerProps) {
  const { character, updateCharacter } = useCharacter();

  const currentTierName: string =
    character.skillProficiencies?.[skillName] ?? "Untrained";
  const currentTier = getProficiency(currentTierName);

  const handleClick = () => {
    const currentIndex = PROFICIENCY_LEVELS.findIndex(
      (p) => p.name === currentTier.name,
    );
    const nextIndex = (currentIndex + 1) % PROFICIENCY_LEVELS.length;
    updateCharacter({
      skillProficiencies: {
        ...character.skillProficiencies,
        [skillName]: PROFICIENCY_LEVELS[nextIndex].fullName,
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${skillName}: ${currentTier.fullName}`}
      aria-label={`${skillName} proficiency: ${currentTier.fullName}`}
      className="inline-flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded border border-gray-500 text-[10px] font-bold text-gray-900"
      style={{ backgroundColor: currentTier.color }}
    >
      {currentTier.name}
    </button>
  );
}
