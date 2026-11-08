import { useCharacter } from "../../../hooks/useCharacter";
import { TECHNIQUE_RANKS } from "../../../constants/TechniqueRanks";
import TechniqueRanksSection from "./TechniqueRankSection";
import { techniques } from "../../../data/actions";
import { useTechniqueModal } from "../../../hooks/useModalActions";

export default function TechniqueSection() {
  const { character, updateCharacter } = useCharacter();
  const { openTechniqueModal } = useTechniqueModal();

  const removeTechnique = (techniqueName: string) => {
    updateCharacter({
      unlockedActions: character.unlockedActions.filter(
        (name) => name !== techniqueName,
      ),
    });
  };

  return (
    <div className="p-4 text-white">
      <div className="flex flex-col gap-3">
        {TECHNIQUE_RANKS.map((rank) => (
          <TechniqueRanksSection
            key={rank.name}
            rankName={rank.name}
            unlockedAtLevel={rank.unlockedAtLevel}
            selectedTechniques={techniques.filter(
              (technique) =>
                technique.techniqueRank === `(${rank.rank}) ${rank.name}` &&
                character.unlockedActions.includes(technique.name),
            )}
            onAddTechnique={(rankName) => openTechniqueModal(rankName)}
            onReplaceTechnique={(rankName, replaceTechnique) =>
              openTechniqueModal(rankName, replaceTechnique)
            }
            onRemoveTechnique={removeTechnique}
          />
        ))}
      </div>
    </div>
  );
}
