import advantages from "../JSON/advantages.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import arcaneFeats from "../JSON/arcane_feats.json";
import generalFeats from "../JSON/general_feats.json";
import type { Character } from "../contexts/CharacterContext";
import { evaluateCharacterExpression } from "./evaluateCharacterExpression";

type ResourceSource = {
  name: string;
  health?: string;
  mana?: string;
};

const resourceSources: ResourceSource[] = [
  ...advantages,
  ...ancestryFeats,
  ...arcaneFeats,
  ...generalFeats,
];

export function getCharacterResourceBonuses(character: Character) {
  const variables = { ...character.baseStats, Level: character.level };
  const bonuses = { health: 0, mana: 0 };

  Object.values(character.selections).forEach((selectedName) => {
    const source = resourceSources.find((item) => item.name === selectedName);
    if (!source) return;
    if (source.health) {
      bonuses.health += evaluateCharacterExpression(source.health, variables);
    }
    if (source.mana) {
      bonuses.mana += evaluateCharacterExpression(source.mana, variables);
    }
  });

  return bonuses;
}
