import type { AncestryFeat, AncestryFeatType } from "../types/Feats";
import rawAncestryFeats from "../JSON/ancestry_feats.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";
import { lookupSpecies } from "./species";
import { parseUnlocks } from "../utils/parseUnlocks";

export const ancestryFeats: AncestryFeat[] = rawAncestryFeats.map((raw) => {
  return {
    ...raw,

    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    type: raw.type as AncestryFeatType,
    species: lookupSpecies(raw.species),
    unlockedFeats: parseUnlocks(raw.unlockedFeats),
  };
});

export default ancestryFeats;
