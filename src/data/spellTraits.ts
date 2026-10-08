// data/spellTraits.ts
import type { SpellTrait } from "../types/Spells";
import rawSpellTraits from "../JSON/spell_traits.json";

export const spellTraits: SpellTrait[] = rawSpellTraits;
export const spellTraitsByName: Record<string, SpellTrait> = Object.fromEntries(
  spellTraits.map((t) => [t.name, t]),
);
export default spellTraits;
