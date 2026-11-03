// data/metamagics.ts
import type { Metamagic } from "../types/Spells";
import rawMetamagics from "../JSON/metamagics.json";
import { lookupAspects } from "./aspects";
import { lookupTraits } from "./traits";

export const metamagics: Metamagic[] = rawMetamagics.map((raw) => {
  return {
    ...raw,
    aspects: lookupAspects(raw.aspect),
    traits: lookupTraits(raw.trait),
    dc: Number(raw.dc),
    level: Number(raw.level),
  };
});

export default metamagics;
