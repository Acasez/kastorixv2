// data/spells.ts
import type { Spell, Aspect, SpellTrait, SpellRank } from "../types/Spells";
import rawSpells from "../JSON/spells.json";
import { aspectsByName } from "./aspects";
import { spellTraitsByName } from "./spellTraits"; // You need this too
import { createDamageInstances } from "./damageTypes";
import type { Saves } from "../types/StatKey";

export const spells: Spell[] = rawSpells.map((raw) => ({
  ...raw,
  aspects: (Array.isArray(raw.aspects) ? raw.aspects : [raw.aspects])
    .filter(Boolean)
    .map((name: string) => aspectsByName[name])
    .filter(Boolean) as Aspect[],
  traits: (Array.isArray(raw.traits) ? raw.traits : [raw.traits])
    .filter(Boolean)
    .map((name: string) => spellTraitsByName[name])
    .filter(Boolean) as SpellTrait[],
  rank: raw.rank as SpellRank,
  dice: createDamageInstances(raw.dice, raw.damageType, `spell ${raw.name}`),
  save: raw.rank as Saves,
}));

export default spells;
