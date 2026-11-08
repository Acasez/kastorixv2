import advantages from "../JSON/advantages.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import arcaneFeats from "../JSON/arcane_feats.json";
import generalFeats from "../JSON/general_feats.json";
import species from "../JSON/species.json";
import type { Character } from "../stores/useCharacterStore";
import { evaluateCharacterExpression } from "./evaluateCharacterExpression";
import { SPELL_RANKS } from "../constants/SpellRanks";

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
  name: string; // "Apprentice", "Next", "Metamagic", ...
  amountExpression: string; // "2 + INT", "Level", ...
};

// name -> field -> parsed entries
const grantIndex = new Map<
  string,
  Partial<Record<GrantField, ParsedGrant[]>>
>();

function unlockedRankNamesAtLevel(playerLevel: number): string[] {
  return SPELL_RANKS.filter((r) => r.unlockedAtLevel <= playerLevel).map(
    (r) => r.name,
  );
}

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
      .split(/[\n,]/)
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

// The rank that follows the character's highest normally-castable rank at `level`.
// undefined when there is no next rank (already Archmage at that level).
function nextRankNameAtLevel(level: number): string | undefined {
  let highestIdx = 0;
  for (let i = 0; i < SPELL_RANKS.length; i++) {
    if (SPELL_RANKS[i].unlockedAtLevel <= level) highestIdx = i;
    else break;
  }
  return SPELL_RANKS[highestIdx + 1]?.name;
}

type SelectedSource = { name: string; level: number };

function getSelectedSources(character: Character): SelectedSource[] {
  const sources: SelectedSource[] = [];
  for (const [key, name] of Object.entries(character.selections)) {
    sources.push({ name, level: character.selectionLevels?.[key] ?? 0 });
  }
  if (character.species) sources.push({ name: character.species, level: 0 });
  return sources;
}

function resolveEntryNames(
  entry: ParsedGrant,
  character: Character,
  source: SelectedSource,
): string[] {
  if (entry.name === "Next") {
    const rank = nextRankNameAtLevel(source.level); // feat's selection level
    return rank ? [rank] : [];
  }
  if (entry.name === "Unlocked") {
    return unlockedRankNamesAtLevel(character.level); // player's current level
  }
  return [entry.name];
}

function getCharacterGrant(
  character: Character,
  grantField: GrantField,
  grantName: string,
): number {
  const normalizedGrantName = grantName.replace(/\s+/g, "").toLowerCase();
  const variables = { ...character.baseStats, Level: character.level };

  return getSelectedSources(character).reduce((total, source) => {
    const entries = grantIndex.get(source.name)?.[grantField];
    if (!entries) return total;
    return entries.reduce((sum, entry) => {
      const names = resolveEntryNames(entry, character, source);
      const matches = names.some(
        (n) => n.replace(/\s+/g, "").toLowerCase() === normalizedGrantName,
      );
      return matches
        ? sum + evaluateCharacterExpression(entry.amountExpression, variables)
        : sum;
    }, total);
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
