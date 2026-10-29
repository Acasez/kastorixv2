// data/spells.ts
import type { Spell, SpellRank } from "../types/Spells";
import rawSpells from "../JSON/spells.json";
import { createDamageInstances } from "./damageTypes";
import type { Saves } from "../types/StatKey";
import { lookupSpellTraits } from "./spellTraits";
import { lookupAspects } from "./aspects";

export const spells: Spell[] = rawSpells.map((raw) => {
  return {
    ...raw,
    aspects: lookupAspects(raw.aspects),
    traits: lookupSpellTraits(raw.traits),
    rank: raw.rank as SpellRank,
    dice: createDamageInstances(raw.dice, raw.damageType, `spell ${raw.name}`),
    save: raw.rank as Saves,
  };
});

export default spells;
