// HealthManaAuraBars.tsx
import { useEffect } from "react";
import species from "../../../JSON/species.json";
import {
  useCharacter,
  type Character,
} from "../../../contexts/CharacterContext";
import TrackBar from "../../TrackBar";

export default function HealthManaAuraBars() {
  const { character, updateCharacter } = useCharacter();
  const selectedSpecies = species.find(
    (speciesItem) => speciesItem.name === character.species,
  );
  const speciesHealth = Number(selectedSpecies?.health);
  const baseHealth =
    Number.isFinite(speciesHealth) && speciesHealth > 0 ? speciesHealth : 6;
  const maxHealth = baseHealth + character.baseStats.PHY;

  const speciesMana = Number(selectedSpecies?.mana);
  const baseMana =
    Number.isFinite(speciesMana) && speciesMana > 0 ? speciesMana : 6;
  const maxPool = baseMana + (3 + character.baseStats.WIL) * character.level;

  useEffect(() => {
    const patch: Partial<Character> = {};

    if (character.health.max !== maxHealth) {
      patch.health = {
        current: Math.min(character.health.current, maxHealth),
        max: maxHealth,
      };
    }
    if (character.aura.max !== maxPool) {
      patch.aura = {
        current: Math.min(character.aura.current, maxPool),
        max: maxPool,
      };
    }
    if (character.mana.max !== maxPool) {
      patch.mana = {
        current: Math.min(character.mana.current, maxPool),
        max: maxPool,
      };
    }

    if (Object.keys(patch).length > 0) {
      updateCharacter(patch);
    }
  }, [
    character.aura,
    character.health,
    character.mana,
    maxHealth,
    maxPool,
    updateCharacter,
  ]);

  return (
    <div className="flex items-end justify-center gap-3 ">
      <TrackBar
        label="Health"
        color="#ef4444"
        track={character.health}
        max={maxHealth}
        onChange={(health) => updateCharacter({ health })}
      />
      <TrackBar
        label="Aura"
        color="#38bdf8"
        track={character.aura}
        max={maxPool}
        onChange={(aura) => updateCharacter({ aura })}
      />
      <TrackBar
        label="Mana"
        color="#a855f7"
        track={character.mana}
        max={maxPool}
        onChange={(mana) => updateCharacter({ mana })}
      />
    </div>
  );
}
