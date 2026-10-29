// data/metamagics.ts
import type { Metamagic } from "../types/Spells";
import rawMetamagics from "../JSON/metamagics.json";
import { lookupAspects } from "./aspects";
import { lookupSpellTraits } from "./spellTraits";

export const metamagics: Metamagic[] = rawMetamagics.map((raw) => {
  return {
    ...raw,
    aspects: lookupAspects(raw.aspect),
    traits: lookupSpellTraits(raw.trait),
    dc: Number(raw.dc),
    level: Number(raw.level),
  };
});

export default metamagics;
