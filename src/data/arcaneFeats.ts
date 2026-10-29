import type { ArcaneFeat } from "../types/Feats";
import rawArcaneFeats from "../JSON/arcane_feats.json";
import { lookupActions } from "../utils/lookupTypes";

export const arcaneFeats: ArcaneFeat[] = rawArcaneFeats.map((raw) => {
  return {
    ...raw,
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    repeatable: Boolean(raw.repeatable),
  };
});

export default arcaneFeats;
