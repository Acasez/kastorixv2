import { useEffect } from "react";
import species from "../../../JSON/species.json";
import {
  useCharacter,
  type Character,
} from "../../../contexts/CharacterContext";
import { getCharacterResourceBonuses } from "../../../utils/characterResourceBonuses";
import HealthManaAuraBars from "../../Buttons/HealthManaAuraBars";

export default function CharacterHealthManaAuraBars() {
  const { character, updateCharacter } = useCharacter();
  const selectedSpecies = species.find(
    (speciesItem) => speciesItem.name === character.species,
  );
  const speciesHealth = Number(selectedSpecies?.health);
  const baseHealth =
    Number.isFinite(speciesHealth) && speciesHealth > 0 ? speciesHealth : 6;
  const resourceBonuses = getCharacterResourceBonuses(character);
  const maxHealth =
    baseHealth + character.baseStats.PHY + resourceBonuses.health;

  const speciesMana = Number(selectedSpecies?.mana);
  const baseMana =
    Number.isFinite(speciesMana) && speciesMana > 0 ? speciesMana : 6;
  const maxPool =
    baseMana +
    (3 + character.baseStats.WIL) * character.level +
    resourceBonuses.mana;

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
    <HealthManaAuraBars
      tracks={{
        health: character.health,
        aura: character.aura,
        mana: character.mana,
      }}
      maxValues={{ health: maxHealth, aura: maxPool, mana: maxPool }}
      onTrackChange={(key, track) => updateCharacter({ [key]: track })}
    />
  );
}
