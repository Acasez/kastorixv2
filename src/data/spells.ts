// data/spells.ts
import type { Spell, Aspect, SpellTrait, SpellRank } from "../types/Spells";
import rawSpells from "../JSON/spells.json";
import { aspectsByName } from "./aspects";
import { spellTraitsByName } from "./spellTraits";
import { createDamageInstances } from "./damageTypes";
import type { Saves } from "../types/StatKey";

export const spells: Spell[] = rawSpells.map((raw) => {
  const rawTraits = Array.isArray(raw.traits)
    ? raw.traits
    : typeof raw.traits === "string"
      ? raw.traits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const rawAspects = Array.isArray(raw.aspects)
    ? raw.aspects
    : typeof raw.aspects === "string"
      ? raw.aspects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    ...raw,
    aspects: rawAspects
      .map((name: string) => aspectsByName[name])
      .filter(Boolean) as Aspect[],
    traits: rawTraits
      .map((name: string) => spellTraitsByName[name])
      .filter(Boolean) as SpellTrait[],
    rank: raw.rank as SpellRank,
    dice: createDamageInstances(raw.dice, raw.damageType, `spell ${raw.name}`),
    save: raw.rank as Saves,
  };
});

export default spells;
