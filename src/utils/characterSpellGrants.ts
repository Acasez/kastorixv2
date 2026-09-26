import advantages from "../JSON/advantages.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import arcaneFeats from "../JSON/arcane_feats.json";
import generalFeats from "../JSON/general_feats.json";
import species from "../JSON/species.json";
import type { Character } from "../contexts/CharacterContext";
import { evaluateCharacterExpression } from "./evaluateCharacterExpression";

type SpellGrantSource = {
  name: string;
  spellsLearned?: string;
  metamagicsLearned?: string;
};

const spellGrantSources: SpellGrantSource[] = [
  ...advantages,
  ...ancestryFeats,
  ...arcaneFeats,
  ...generalFeats,
  ...species,
];

function getCharacterGrant(
  character: Character,
  grantField: "spellsLearned" | "metamagicsLearned",
  grantName: string,
): number {
  const variables = { ...character.baseStats, Level: character.level };
  const normalizedGrantName = grantName.replace(/\s+/g, "").toLowerCase();
  const selectedNames = [
    ...Object.values(character.selections),
    ...(character.species ? [character.species] : []),
  ];

  return selectedNames.reduce((total, selectedName) => {
    const source = spellGrantSources.find((item) => item.name === selectedName);
    const match = source?.[grantField]?.match(/^\((.+)\)\s*(.+)$/);
    if (
      !match ||
      match[2].replace(/\s+/g, "").toLowerCase() !== normalizedGrantName
    ) {
      return total;
    }

    return total + evaluateCharacterExpression(match[1], variables);
  }, 0);
}

export function getCharacterSpellGrant(
  character: Character,
  rankName: string,
): number {
  return getCharacterGrant(character, "spellsLearned", rankName);
}

export function getCharacterMetamagicGrant(character: Character): number {
  return getCharacterGrant(character, "metamagicsLearned", "Metamagic");
}
