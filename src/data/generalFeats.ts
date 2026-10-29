// data/feats.ts
import rawGeneralFeats from "../JSON/general_feats.json";
import type { GeneralFeat } from "../types/Feats";
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
