import type { Advantage } from "../types/Feats";
import rawAdvantages from "../JSON/advantages.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions } from "./actions";
import { parseUnlocks } from "../utils/parseUnlocks";
import { lookupTraits } from "./traits";
import { parseSpellsLearned } from "../utils/parseSpellsLearned";

export const advantages: Advantage[] = rawAdvantages.map((raw) => {
  return {
    ...raw,
    traits: lookupTraits(raw.traits),
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
    unlockedFeats: parseUnlocks(raw.unlockedFeats),
    spellsLearned: parseSpellsLearned(raw.spellsLearned),
  };
});

export default advantages;
