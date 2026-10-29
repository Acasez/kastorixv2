// data/feats.ts
import rawGeneralFeats from "../JSON/general_feats.json";
import type { GeneralFeat } from "../types/Feats";
import { lookup, lookupOne } from "../utils/lookupTypes";
import { parseResistances, parseSpeeds } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";

export const generalFeats: GeneralFeat[] = rawGeneralFeats.map((raw) => {
  return {
    ...raw,
    unlockedActions: lookupActions(raw.unlockedActions),
    techniques: lookupActions(raw.techniques),
    level: Number(raw.level),
    repeatable: Boolean(raw.repeatable),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
    techniquesLearned: Number(raw.techniquesLearned),
    quickAccessSlots: Number(raw.quickAccessSlots),
    focusPoints: Number(raw.focusPoints),
  };
});

export default generalFeats;

export const generalFeatsByName: Record<string, GeneralFeat> =
  Object.fromEntries(generalFeats.map((a) => [a.name, a]));

export const lookupGeneralFeats = (raw?: string | string[] | null) =>
  lookup(generalFeatsByName, raw);

export const lookupGeneralFeat = (name?: string | null) =>
  lookupOne(generalFeatsByName, name);
