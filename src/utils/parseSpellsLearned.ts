import type { SpellGrantRank, SpellUnlock } from "../types/Spells";

const RANKS: SpellGrantRank[] = [
  "Apprentice",
  "Adept",
  "Magus",
  "Grand Magus",
  "Archmage",
  "Next",
  "Unlocked",
];

export function parseSpellsLearned(input: string): SpellUnlock[] {
  return input
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry): SpellUnlock => {
      const match = entry.match(/^\(\s*([0-9]+)?\s*(\+?\s*INT)?\s*\)\s+(.+)$/i);
      if (!match || (!match[1] && !match[2])) {
        throw new Error(`Malformed spellsLearned entry: "${entry}"`);
      }
      const rank = match[3].trim() as SpellGrantRank;
      if (!RANKS.includes(rank)) {
        throw new Error(`Unknown spell rank: "${rank}" in "${entry}"`);
      }
      return {
        rank,
        amount: Number(match[1] ?? 0),
        addInt: Boolean(match[2]),
      };
    });
}
