// data/spells.ts
import type { Spell, Aspect, SpellTrait, SpellRank } from "../types/Spells";
import rawSpells from "../JSON/spells.json";

export const spells: Spell[] = rawSpells.map((raw) => ({
  ...raw,
  aspects: raw.aspects as unknown as Aspect[],
  traits: raw.traits as unknown as SpellTrait[],
  rank: raw.rank as SpellRank,
}));

export default spells;
