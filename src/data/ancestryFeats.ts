import type { AncestryFeat, AncestryFeatType } from "../types/Feats";
import rawAncestryFeats from "../JSON/ancestry_feats.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions, lookupSpecies } from "../utils/lookupTypes";

export const ancestryFeats: AncestryFeat[] = rawAncestryFeats.map((raw) => {
  return {
    ...raw,

    unlockedActions: lookupActions(raw.unlockedAction),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    type: raw.type as AncestryFeatType,
    species: lookupSpecies(raw.species),
  };
});

export default ancestryFeats;
