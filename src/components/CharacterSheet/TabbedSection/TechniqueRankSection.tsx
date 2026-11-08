import { useCharacter } from "../../../hooks/useCharacter";
import TechniqueComponent from "../../CommonCreatureComponents/TechniqueComponent";
import SectionLimitText from "./SectionLimitText";
import AddButton from "./AddButton";
import type { Action } from "../../../types/Action";
import { getCharacterTechniqueGrant } from "../../../utils/characterSpellGrants";

interface TechniqueRanksSectionProps {
  rankName: string;
  unlockedAtLevel: number;
  onAddTechnique: (rankName: string) => void;
  onReplaceTechnique: (rankName: string, techniqueName: string) => void;
  onRemoveTechnique: (techniqueName: string) => void;
  selectedTechniques: Action[];
}

export default function TechniqueRanksSection({
  rankName,
  unlockedAtLevel,
  onAddTechnique: onAddTechnique,
  onReplaceTechnique: onReplaceTechnique,
  onRemoveTechnique: onRemoveTechnique,
  selectedTechniques: selectedTechniques,
}: TechniqueRanksSectionProps) {
  const { character } = useCharacter();
  const maxKnownTechniques = Math.max(
    (character.level >= unlockedAtLevel ? character.baseStats.INT : 0) +
      getCharacterTechniqueGrant(character, rankName),
    0,
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">{rankName} Techniques</span>
        <div className="flex flex-row gap-2">
          <SectionLimitText
            text="Selected Techniques"
            current={selectedTechniques.length}
            max={maxKnownTechniques}
          />

          <AddButton
            onClick={() => onAddTechnique(rankName)}
            variable={rankName}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedTechniques.map((technique) => (
          <TechniqueComponent
            key={technique.name}
            technique={technique}
            onRemoveTechnique={onRemoveTechnique}
            onReplaceTechnique={onReplaceTechnique}
            rankName={rankName}
          />
        ))}
      </div>
    </div>
  );
}
