// data/spellTraits.ts
import type { SpellTrait } from "../types/Spells";
import rawSpellTraits from "../JSON/spell_traits.json";
import { lookup } from "../utils/lookupTypes";

export const spellTraits: SpellTrait[] = rawSpellTraits;
export const spellTraitsByName: Record<string, SpellTrait> = Object.fromEntries(
  spellTraits.map((t) => [t.name, t]),
);
export default spellTraits;

export const lookupSpellTraits = (raw?: string | string[] | null) =>
  lookup(spellTraitsByName, raw);
