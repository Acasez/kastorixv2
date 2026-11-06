import advantages from "../JSON/advantages.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import arcaneFeats from "../JSON/arcane_feats.json";
import generalFeats from "../JSON/general_feats.json";
import species from "../JSON/species.json";
import type { Character } from "../stores/useCharacterStore";
import { evaluateCharacterExpression } from "./evaluateCharacterExpression";

type SpellGrantSource = {
  name: string;
  spellsLearned?: string;
  metamagicsLearned?: string;
  gadgets?: string;
};

const spellGrantSources: SpellGrantSource[] = [
  ...advantages,
  ...ancestryFeats,
  ...arcaneFeats,
  ...generalFeats,
  ...species,
];

type GrantField = "spellsLearned" | "metamagicsLearned" | "gadgets";

type ParsedGrant = {
  name: string; // "Apprentice", "Metamagic", ...
  amountExpression: string; // "2 + INT", "Level", ...
};

// name -> field -> parsed entries
const grantIndex = new Map<
  string,
  Partial<Record<GrantField, ParsedGrant[]>>
>();

for (const source of spellGrantSources) {
  const parsed: Partial<Record<GrantField, ParsedGrant[]>> = {};
  for (const field of [
    "spellsLearned",
    "metamagicsLearned",
    "gadgets",
  ] as GrantField[]) {
    const raw = source[field];
    if (!raw) continue;
    parsed[field] = raw
      .split(/[\n,]/) // multi-entry support, same as your parser
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const match = entry.match(/^\((.+)\)\s*(.+)$/);
        if (!match)
          throw new Error(`Malformed ${field} on "${source.name}": "${entry}"`);
        return { amountExpression: match[1], name: match[2] };
      });
  }
  grantIndex.set(source.name, parsed);
}

function getCharacterGrant(
  character: Character,
  grantField: GrantField,
  grantName: string,
): number {
  const normalizedGrantName = grantName.replace(/\s+/g, "").toLowerCase();
  const variables = { ...character.baseStats, Level: character.level };
  const selectedNames = [
    ...Object.values(character.selections).flat(), // <-- note .flat()
    ...(character.species ? [character.species] : []),
  ];

  return selectedNames.reduce((total, selectedName) => {
    const entries = grantIndex.get(selectedName)?.[grantField];
    if (!entries) return total;
    const match = entries.find(
      (e) => e.name.replace(/\s+/g, "").toLowerCase() === normalizedGrantName,
    );
    return match
      ? total + evaluateCharacterExpression(match.amountExpression, variables)
      : total;
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

export function getCharacterGadgetGrant(character: Character): number {
  return getCharacterGrant(character, "gadgets", "Gadget");
}
