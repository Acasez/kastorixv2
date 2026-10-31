import type { Advantage } from "../types/Feats";
import rawAdvantages from "../JSON/advantages.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";
import { parseUnlocks } from "../utils/parseUnlocks";

export const advantages: Advantage[] = rawAdvantages.map((raw) => {
  return {
    ...raw,
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
    unlockedFeats: parseUnlocks(raw.unlockedFeats),
  };
});

export default advantages;
