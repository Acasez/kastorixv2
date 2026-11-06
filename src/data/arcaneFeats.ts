import type { ArcaneFeat } from "../types/Feats";
import rawArcaneFeats from "../JSON/arcane_feats.json";
import { lookupActions } from "./actions";
import { parseUnlocks } from "../utils/parseUnlocks";
import { lookupTraits } from "./traits";
import { parseSpellsLearned } from "../utils/parseSpellsLearned";

export const arcaneFeats: ArcaneFeat[] = rawArcaneFeats.map((raw) => {
  return {
    ...raw,
    traits: lookupTraits(raw.traits),
    unlockedActions: lookupActions(raw.unlockedActions),
    level: Number(raw.level),
    repeatable: Boolean(raw.repeatable),
    unlockedFeats: parseUnlocks(raw.unlockedFeats),
    spellsLearned: parseSpellsLearned(raw.spellsLearned),
  };
});

export default arcaneFeats;
